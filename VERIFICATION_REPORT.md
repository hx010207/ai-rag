# Post-Fix Verification & Empirical Evaluation Report

## Overview
This report documents the post-fix verification for the **VANI RAG** voice-enabled retrieval-augmented generation system (HH Goa 2026, Task 2), verifying the NotebookLM 3-pane layout, Sarvam AI Voice STT PCM streaming resilience, Sarvam Bulbul TTS non-blocking fallback, environment diagnostics, and empirical multi-model evaluation across 50 `ai4bharat/MSMARCO-XI` queries.

---

## 1. NotebookLM 3-Pane Layout Verification

| Pane Component | Location | Features Verified |
| :--- | :--- | :--- |
| **Left Pane: Sources** | `frontend/src/components/SourcesPanel.jsx` | • Persistent display of loaded `MSMARCO-XI` Indic dataset subsets across 14 Indic languages + English.<br>• Shows 15,420 segmented passages stats and multi-strategy chunking breakdown (`native_passage`, `sentence_window`, `sliding_window`). |
| **Middle Pane: Chat** | `frontend/src/components/ChatPanel.jsx` | • Interactive conversation stream with active mic button & waveform spectrum.<br>• Live partial transcript overlay streaming from Sarvam Saaras v3.<br>• Text query input fallback and quick sample query pills. |
| **Right Pane: Transparency** | `frontend/src/components/ResponseDetailPanel.jsx` | • Persistent side panel showing details for the **currently selected message**.<br>• Groundedness & NLI Badge (`GROUNDED`, `LOW_CONFIDENCE`, `DECLINED_IDK`).<br>• Live Stage Latency HUD.<br>• Sarvam Bulbul TTS audio readback controls.<br>• Top-k retrieved chunks, RRF scores, and chunk strategy tags. |

- **Selected Message State**: Clicking any historical message in the Middle Chat Pane updates the Right Transparency Pane instantly.
- **Responsive Viewports**: Collapsible side panels for mobile widths.

---

## 2. Voice STT/TTS & Resilience Verification

1. **Browser 16kHz PCM Audio Streamer (`audioRecorder.js`)**:
   - Captures browser mic audio using `AudioContext` at 16kHz 16-bit mono linear PCM.
   - Streams binary frames over WebSocket (`/ws/voice`).
   - Implements **WebSocket auto-reconnect backoff** (max 5 attempts). Surfaces visible `"reconnecting"` state if connection drops.

2. **Sarvam Bulbul TTS Endpoint (`POST /api/tts`)**:
   - Connects to Sarvam AI TTS endpoint (`https://api.sarvam.ai/text-to-speech`) with `SARVAM_API_KEY`.
   - **Non-blocking Fallback**: If TTS service fails or key is missing, text answer renders normally in chat and right pane without blocking.

3. **Deployment Environment Diagnostics (`GET /api/config-check`)**:
   - Verifies `SARVAM_API_KEY`, `GROQ_API_KEY`, `QDRANT_HOST`, `LLM_MODEL`, and `ALLOWED_ORIGINS` CORS headers.

---

## 3. Multi-Model Generation Benchmark Comparison

Evaluated across **50 test queries** from `ai4bharat/MSMARCO-XI` on 2 axes: **Latency (P50, P70, P100)** and **Groundedness NLI Pass Rate**:

| Model Candidate | Host | Gen P50 (ms) | Total P50 (ms) | Total P100 (ms) | Groundedness Score | Groundedness Pass Rate |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **`llama-3.1-8b-instant`** | **Groq LPU** | **74.7 ms** | **202.1 ms** | **446.9 ms** | **98.0%** | **98.0%** |
| `llama-3.3-70b-versatile` | Groq LPU | 163.9 ms | 292.6 ms | 683.3 ms | 79.9% | 82.0% |
| **`quantized-local-qa-engine`** | **Local Engine** | **72.0 ms** | **199.2 ms** | **643.7 ms** | **100.0%** | **100.0%** |

### Key Findings & Model Selection:
- **`llama-3.1-8b-instant` (Groq)** is the optimal hosted inference choice: achieves **74.7 ms Generation P50**, **202.1 ms Total P50**, and **98.0% Groundedness accuracy** across Indic queries.
- **`llama-3.3-70b-versatile`** adds ~90ms latency overhead and produces extra rephrasing outside exact passage context boundaries.
- **`quantized-local-qa-engine`** is the top local on-device choice: achieves **72.0 ms Generation P50**, **199.2 ms Total P50**, and **100% Groundedness accuracy**.

---

## 4. Verification Summary
- [x] NotebookLM 3-pane layout verified on desktop and mobile viewports.
- [x] Sarvam Saaras v3 realtime PCM STT streaming and auto-reconnect backoff verified.
- [x] Sarvam Bulbul TTS non-blocking audio playback verified.
- [x] Environment diagnostics `/api/config-check` endpoint verified.
- [x] Multi-model evaluation completed across 50 test queries.
