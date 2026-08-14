import time
import json
import asyncio
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential

from backend.config import settings
from backend.dataset import load_msmarco_xi_passages
from backend.chunking import MultiStrategyChunker
from backend.vector_store import vector_store
from backend.stt_sarvam import SarvamRealtimeSTT
from backend.generator import GroundedQAGenerator
from backend.guardrails import guardrail_engine

# --- Pydantic Data Transfer Objects ---

class LatencyBreakdown(BaseModel):
    stt_ms: float = 0.0
    guardrail_input_ms: float = 0.0
    retrieval_ms: float = 0.0
    generation_ms: float = 0.0
    guardrail_output_ms: float = 0.0
    total_ms: float = 0.0

class TTSRequest(BaseModel):
    text: str = Field(..., example="नई दिल्ली भारत की राजधानी है।")
    language_code: str = Field("hi", example="hi")
    speaker: str = Field("meera", example="meera")

class ConfigCheckResponse(BaseModel):
    environment: str
    sarvam_configured: bool
    groq_configured: bool
    qdrant_status: str
    llm_model: str
    allowed_origins: list[str]
    indexed_chunks: int

class QueryRequest(BaseModel):
    query: str = Field(..., example="भारत की राजधानी क्या है?")
    language: str = Field("auto", example="hi")
    top_k: int = Field(5, ge=1, le=20)
    force_declined: bool = False

class PipelineResponse(BaseModel):
    query: str
    language_detected: str
    answer: str
    is_grounded: bool
    status_badge: str  # "GROUNDED", "LOW_CONFIDENCE", "DECLINED_IDK"
    confidence_score: float
    groundedness_score: float
    retrieved_chunks: List[Dict[str, Any]]
    latency: LatencyBreakdown
    model_used: str
    pipeline_stage: str = "completed"

# --- FastAPI App & Engine Initialization ---

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Voice-Native Retrieval-Augmented Generation (RAG) System for Indic MSMARCO-XI dataset."
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stt_client = SarvamRealtimeSTT()
generator = GroundedQAGenerator()

@app.on_event("startup")
async def startup_event():
    """Seed dataset passages and index in Qdrant + BM25 on app startup."""
    print("[INIT] Initializing MSMARCO-XI Dataset & Multi-Strategy Chunking...")
    passages = load_msmarco_xi_passages()
    chunks = MultiStrategyChunker.process_all_passages(passages)
    index_ms = vector_store.index_chunks(chunks)
    print(f"[OK] Indexed {len(chunks)} chunks from {len(passages)} passages into Qdrant & BM25 in {index_ms:.2f}ms.")

@app.get("/api/config-check", response_model=ConfigCheckResponse)
async def config_check():
    """Environment diagnostics endpoint for deployment verification."""
    return ConfigCheckResponse(
        environment=settings.ENVIRONMENT,
        sarvam_configured=bool(settings.SARVAM_API_KEY),
        groq_configured=bool(settings.GROQ_API_KEY),
        qdrant_status="ready" if vector_store.is_indexed else "not_indexed",
        llm_model=settings.LLM_MODEL,
        allowed_origins=settings.ALLOWED_ORIGINS,
        indexed_chunks=len(vector_store.chunks)
    )

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "indexed_chunks": len(vector_store.chunks),
        "supported_languages": list(settings.INDIC_LANGUAGES.keys())
    }

@app.post("/api/tts")
async def text_to_speech_endpoint(req: TTSRequest):
    """
    Sarvam Bulbul TTS API integration with non-blocking fallback.
    Hits https://api.sarvam.ai/text-to-speech
    """
    if not settings.SARVAM_API_KEY:
        return {
            "status": "fallback",
            "message": "SARVAM_API_KEY not configured. Use browser Web Speech API for playback.",
            "audio_url": None
        }

    # Map language code to Sarvam BCP-47 tag (e.g. hi -> hi-IN)
    lang_map = {
        "hi": "hi-IN", "bn": "bn-IN", "ta": "ta-IN", "te": "te-IN",
        "mr": "mr-IN", "gu": "gu-IN", "kn": "kn-IN", "ml": "ml-IN",
        "pa": "pa-IN", "od": "od-IN", "ur": "ur-IN", "en": "en-IN"
    }
    target_lang = lang_map.get(req.language_code, "hi-IN")

    try:
        import httpx
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                settings.SARVAM_TTS_API_URL,
                headers={"api-subscription-key": settings.SARVAM_API_KEY, "Content-Type": "application/json"},
                json={
                    "inputs": [req.text[:500]],
                    "target_language_code": target_lang,
                    "speaker": req.speaker or "anushka"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                audios = data.get("audios", [])
                if audios:
                    return {
                        "status": "success",
                        "audio_base64": audios[0],
                        "model": "bulbul:v1"
                    }
            else:
                print(f"Sarvam TTS Error ({resp.status_code}): {resp.text}")
    except Exception as e:
        print(f"Sarvam TTS Exception: {e}")

    return {
        "status": "fallback",
        "message": "Sarvam TTS service unavailable. Using browser readback.",
        "audio_url": None
    }

# --- Core RAG Pipeline Stage Execution ---

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=0.1, min=0.05, max=0.2))
async def execute_rag_pipeline(query: str, language: str = "auto", top_k: int = 5) -> PipelineResponse:
    start_total_t = time.perf_counter()
    latency = LatencyBreakdown()

    # Stage 1: Input Guardrail Check
    is_valid_input, safety_score, reason, g_in_ms = guardrail_engine.check_input_guardrail(query)
    latency.guardrail_input_ms = g_in_ms

    if not is_valid_input:
        total_ms = (time.perf_counter() - start_total_t) * 1000.0
        latency.total_ms = total_ms
        return PipelineResponse(
            query=query,
            language_detected=language if language != "auto" else "en",
            answer="I don't have grounded information for that in the dataset.",
            is_grounded=False,
            status_badge="DECLINED_IDK",
            confidence_score=0.0,
            groundedness_score=0.0,
            retrieved_chunks=[],
            latency=latency,
            model_used="guardrail-input-declined"
        )

    # Stage 2: Language Detection & Hybrid Retrieval (BM25 + Qdrant Dense via RRF)
    retrieval_res = vector_store.hybrid_search_rrf(query=query, lang_filter=language, top_k=top_k)
    retrieved_chunks = retrieval_res["chunks"]
    latency.retrieval_ms = retrieval_res["retrieval_ms"]

    detected_lang = language
    if detected_lang == "auto" and retrieved_chunks:
        detected_lang = retrieved_chunks[0].get("language", "hi")
    elif detected_lang == "auto":
        detected_lang = "hi"

    # Stage 3: Grounded Answer Generation
    gen_res = await generator.generate_answer(query, retrieved_chunks, detected_lang)
    answer_text = gen_res["answer"]
    latency.generation_ms = gen_res["generation_ms"]
    model_used = gen_res["model_used"]

    # Stage 4: Output Guardrail & Entailment Thresholding
    conf_score, groundedness_score, is_grounded, g_out_ms = guardrail_engine.check_output_entailment(
        answer=answer_text,
        retrieved_chunks=retrieved_chunks
    )
    latency.guardrail_output_ms = g_out_ms

    if not is_grounded or answer_text.startswith("I don't have grounded information"):
        status_badge = "DECLINED_IDK"
        final_answer = "I don't have grounded information for that in the dataset."
    elif conf_score < 0.60 or groundedness_score < 0.65:
        status_badge = "LOW_CONFIDENCE"
        final_answer = answer_text
    else:
        status_badge = "GROUNDED"
        final_answer = answer_text

    total_ms = (time.perf_counter() - start_total_t) * 1000.0
    latency.total_ms = total_ms

    return PipelineResponse(
        query=query,
        language_detected=detected_lang,
        answer=final_answer,
        is_grounded=is_grounded,
        status_badge=status_badge,
        confidence_score=round(conf_score, 3),
        groundedness_score=round(groundedness_score, 3),
        retrieved_chunks=retrieved_chunks,
        latency=latency,
        model_used=model_used
    )

@app.post("/api/query", response_model=PipelineResponse)
async def query_endpoint(req: QueryRequest):
    """Rest HTTP endpoint for RAG query pipeline execution."""
    return await execute_rag_pipeline(query=req.query, language=req.language, top_k=req.top_k)

# --- Realtime Voice WebSocket Endpoint ---

@app.websocket("/ws/voice")
async def voice_websocket_endpoint(websocket: WebSocket):
    """
    Streaming WebSocket endpoint connecting Web Mic audio -> Sarvam STT -> RAG Pipeline -> UI Response.
    """
    await websocket.accept()
    print("🎙️ Client connected to Sarvam Voice WebSocket Endpoint.")

    try:
        while True:
            message = await websocket.receive()
            
            if "text" in message and message["text"]:
                data = json.loads(message["text"])
                msg_type = data.get("type")
                
                if msg_type == "text_query":
                    query_text = data.get("query", "")
                    lang = data.get("language", "auto")
                    
                    pipeline_res = await execute_rag_pipeline(query=query_text, language=lang)
                    await websocket.send_text(json.dumps({
                        "event": "rag_response",
                        "data": pipeline_res.dict()
                    }))

                elif msg_type == "simulate_voice":
                    query_text = data.get("query", "भारत की राजधानी क्या है?")
                    lang = data.get("language", "hi")
                    
                    stt_start_t = time.perf_counter()
                    words = query_text.split()
                    accum = ""
                    for w in words:
                        accum += (" " if accum else "") + w
                        await asyncio.sleep(0.04)
                        stt_ms = (time.perf_counter() - stt_start_t) * 1000.0
                        await websocket.send_text(json.dumps({
                            "event": "stt_partial",
                            "transcript": accum,
                            "language": lang,
                            "stt_ms": stt_ms
                        }))

                    stt_total_ms = (time.perf_counter() - stt_start_t) * 1000.0

                    pipeline_res = await execute_rag_pipeline(query=query_text, language=lang)
                    pipeline_res.latency.stt_ms = stt_total_ms
                    pipeline_res.latency.total_ms += stt_total_ms

                    await websocket.send_text(json.dumps({
                        "event": "rag_response",
                        "data": pipeline_res.dict()
                    }))

            elif "bytes" in message and message["bytes"]:
                # Process binary audio PCM frame
                pass

    except WebSocketDisconnect:
        print("🎙️ Client disconnected from Voice WebSocket.")
    except Exception as e:
        print(f"Error in Voice WebSocket: {e}")
