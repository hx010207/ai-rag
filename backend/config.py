import os
from pathlib import Path
from pydantic import BaseModel, Field

# Load local .env file if present
env_file = Path(__file__).resolve().parent.parent / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ[key.strip()] = val.strip()

class Settings(BaseModel):
    # App Information
    PROJECT_NAME: str = "Voice-Native Indic RAG System (HH Goa 2026)"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Host & Port
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Sarvam AI STT & TTS
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    SARVAM_STT_WS_URL: str = os.getenv("SARVAM_STT_WS_URL", "wss://api.sarvam.ai/v1/speech-to-text/realtime")
    SARVAM_STT_MODEL: str = "saaras:v3"
    SARVAM_TTS_API_URL: str = "https://api.sarvam.ai/text-to-speech"
    SARVAM_TTS_VOICE: str = "meera"

    # Qdrant Vector Store
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", ":memory:")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_COLLECTION_NAME: str = "msmarco_xi_indic"
    EMBEDDING_DIM: int = 384  # Fast Embedding / EmbeddingGemma-300M default dim

    # Retrieval & RRF
    TOP_K_RETRIEVAL: int = 5
    RRF_K: int = 60
    BM25_WEIGHT: float = 0.5
    DENSE_WEIGHT: float = 0.5

    # LLM Answer Generation
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "auto") # auto, local, groq, gemini, openai, mock
    LOCAL_LLM_URL: str = os.getenv("LOCAL_LLM_URL", "http://localhost:8080/v1")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Guardrail Thresholds
    CONFIDENCE_THRESHOLD: float = 0.45
    ENTAILMENT_THRESHOLD: float = 0.50
    INPUT_SAFETY_THRESHOLD: float = 0.35

    # Supported Indic Languages in MSMARCO-XI
    INDIC_LANGUAGES: dict[str, str] = {
        "hi": "Hindi",
        "bn": "Bengali",
        "ta": "Tamil",
        "te": "Telugu",
        "mr": "Marathi",
        "gu": "Gujarati",
        "kn": "Kannada",
        "ml": "Malayalam",
        "pa": "Punjabi",
        "or": "Odia",
        "ur": "Urdu",
        "as": "Assamese",
        "ne": "Nepali",
        "sa": "Sanskrit",
        "en": "English"
    }

settings = Settings()
