import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Volume2, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import LatencyHUD from './LatencyHUD';
import ChunkInspectorDrawer from './ChunkInspectorDrawer';

export default function GroundedAnswerCard({ response }) {
  const [showInspector, setShowInspector] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  if (!response) return null;

  const {
    query,
    language_detected,
    answer,
    status_badge,
    confidence_score,
    groundedness_score,
    retrieved_chunks,
    latency,
    model_used
  } = response;

  const isDeclined = status_badge === 'DECLINED_IDK';
  const isLowConf = status_badge === 'LOW_CONFIDENCE';
  const isGrounded = status_badge === 'GROUNDED';

  // Handle Sarvam Bulbul TTS Audio Readback
  const handlePlayTTS = () => {
    setIsPlayingTTS(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingTTS(false);
      utterance.onerror = () => setIsPlayingTTS(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingTTS(false), 2000);
    }
  };

  return (
    <div className={`w-full rounded-2xl p-5 my-4 transition-all shadow-xl ${
      isDeclined
        ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-2 border-rose-500/40 shadow-rose-950/30'
        : isLowConf
        ? 'bg-gradient-to-b from-amber-950/30 to-slate-900 border border-amber-500/40 shadow-amber-950/20'
        : 'glass-panel border border-indigo-500/30 shadow-indigo-950/20'
    }`}>
      {/* Query Header */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-gray-800">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Question ({language_detected})</span>
          <h2 className="text-lg font-semibold text-gray-100 mt-0.5">{query}</h2>
        </div>

        {/* Status Badge */}
        <div>
          {isGrounded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Grounded Response
            </span>
          )}
          {isLowConf && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Low Confidence
            </span>
          )}
          {isDeclined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-bold animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Declined (Groundedness Check)
            </span>
          )}
        </div>
      </div>

      {/* Main Answer Content */}
      <div className="my-4">
        <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1">
          Grounded Answer Synthesis
        </span>
        <p className={`text-base leading-relaxed font-medium ${
          isDeclined ? 'text-rose-200 italic bg-rose-950/30 p-4 rounded-xl border border-rose-500/30' : 'text-gray-100'
        }`}>
          {answer}
        </p>
      </div>

      {/* Live Latency Breakdown HUD */}
      <LatencyHUD latency={latency} />

      {/* Confidence & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-800 text-xs">
        <div className="flex items-center gap-4 text-gray-300">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-gray-400">Retrieval Confidence:</span>
            <strong className={confidence_score >= 0.5 ? "text-emerald-400" : "text-amber-400"}>
              {(confidence_score * 100).toFixed(0)}%
            </strong>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-gray-400">NLI Groundedness:</span>
            <strong className={groundedness_score >= 0.5 ? "text-emerald-400" : "text-rose-400"}>
              {(groundedness_score * 100).toFixed(0)}%
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TTS Readback Button */}
          {!isDeclined && (
            <button
              onClick={handlePlayTTS}
              disabled={isPlayingTTS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isPlayingTTS
                  ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-gray-700 text-gray-300'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingTTS ? 'animate-bounce text-emerald-400' : 'text-gray-400'}`} />
              <span>{isPlayingTTS ? 'Playing Bulbul TTS...' : 'Read Aloud'}</span>
            </button>
          )}

          {/* Toggle Why This Answer Drawer */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why this answer?</span>
            {showInspector ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Chunk Retrieval Inspector */}
      {showInspector && <ChunkInspectorDrawer chunks={retrieved_chunks} />}
    </div>
  );
}
