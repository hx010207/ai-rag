import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, ShieldAlert, Volume2, Database, Zap, Sparkles } from 'lucide-react';
import LatencyHUD from './LatencyHUD';
import PalmLeafDecoration from './decorative/PalmLeafDecoration';

export default function ResponseDetailPanel({ selectedMessage }) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsStatusMsg, setTtsStatusMsg] = useState('');

  if (!selectedMessage || !selectedMessage.response) {
    return (
      <aside className="w-full h-full glass-panel border-l border-cyan-500/20 flex flex-col items-center justify-center p-6 text-center text-gray-400 relative">
        <PalmLeafDecoration position="bottom-left" />
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3">
          <Layers className="w-6 h-6 text-cyan-400 opacity-60" />
        </div>
        <h3 className="text-sm font-extrabold text-white">Response Transparency &amp; Latency HUD</h3>
        <p className="text-xs text-cyan-200/60 mt-1.5 max-w-xs leading-relaxed">
          Select any question in the chat history to inspect its groundedness score, stage latencies, retrieved chunks, and TTS audio readback.
        </p>
      </aside>
    );
  }

  const { response } = selectedMessage;
  const {
    query,
    language_detected,
    answer,
    status_badge,
    confidence_score,
    groundedness_score,
    retrieved_chunks = [],
    latency,
    model_used
  } = response;

  const isDeclined = status_badge === 'DECLINED_IDK';
  const isLowConf = status_badge === 'LOW_CONFIDENCE';
  const isGrounded = status_badge === 'GROUNDED';

  // Sarvam Bulbul TTS Playback Handler with Non-blocking Fallback
  const handlePlayTTS = async () => {
    setIsPlayingTTS(true);
    setTtsStatusMsg('Synthesizing Sarvam Bulbul TTS Audio...');

    try {
      const res = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: answer,
          language_code: language_detected || 'hi',
          speaker: 'meera'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
          audio.onended = () => {
            setIsPlayingTTS(false);
            setTtsStatusMsg('');
          };
          audio.onerror = () => fallbackBrowserTTS();
          await audio.play();
          setTtsStatusMsg('Playing Sarvam Bulbul TTS Audio...');
          return;
        }
      }
      fallbackBrowserTTS();
    } catch (err) {
      fallbackBrowserTTS();
    }
  };

  const fallbackBrowserTTS = () => {
    setTtsStatusMsg('Using Web Speech Readback...');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.rate = 1.0;
      utterance.onend = () => {
        setIsPlayingTTS(false);
        setTtsStatusMsg('');
      };
      utterance.onerror = () => {
        setIsPlayingTTS(false);
        setTtsStatusMsg('');
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsPlayingTTS(false);
        setTtsStatusMsg('');
      }, 2000);
    }
  };

  return (
    <aside className="w-full h-full glass-panel border-l border-cyan-500/20 flex flex-col p-4 overflow-y-auto relative">
      <PalmLeafDecoration position="bottom-left" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-extrabold text-white tracking-wide">Response Detail Panel</h2>
        </div>
        <div>
          {isGrounded && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-extrabold shadow-sm">
              Grounded
            </span>
          )}
          {isLowConf && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-extrabold shadow-sm">
              Low Conf
            </span>
          )}
          {isDeclined && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-extrabold shadow-sm">
              Declined
            </span>
          )}
        </div>
      </div>

      {/* Selected Query & Answer Summary */}
      <div className="p-3.5 rounded-2xl tropical-card mb-4 text-xs relative z-10">
        <span className="text-[10px] font-extrabold text-cyan-400 uppercase block mb-1">
          Active Query ({language_detected})
        </span>
        <h3 className="font-bold text-white mb-2">{query}</h3>
        <p className={`leading-relaxed text-xs p-3 rounded-xl border ${
          isDeclined ? 'bg-rose-950/40 text-rose-200 border-rose-500/40 italic' : 'bg-ocean-950 text-gray-200 border-cyan-500/10'
        }`}>
          {answer}
        </p>

        {/* TTS Audio Readback Button */}
        {!isDeclined && (
          <div className="mt-3 flex flex-col items-start gap-1">
            <button
              onClick={handlePlayTTS}
              disabled={isPlayingTTS}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                isPlayingTTS
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white border-amber-400/50 shadow-rose-500/20'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-bounce text-emerald-400' : 'text-white'}`} />
              <span>{isPlayingTTS ? 'Playing Audio...' : 'Read Aloud (Sarvam Bulbul TTS)'}</span>
            </button>
            {ttsStatusMsg && <span className="text-[10px] text-cyan-300/70 italic mt-1">{ttsStatusMsg}</span>}
          </div>
        )}
      </div>

      {/* Groundedness & NLI Scores */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono relative z-10">
        <div className="p-3 rounded-2xl bg-ocean-900/80 border border-cyan-500/20">
          <span className="text-[10px] text-cyan-300/70 block mb-1 font-sans">Retrieval Confidence</span>
          <strong className={confidence_score >= 0.5 ? "text-amber-400 text-sm font-bold" : "text-amber-500 text-sm font-bold"}>
            {(confidence_score * 100).toFixed(0)}%
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-ocean-900/80 border border-cyan-500/20">
          <span className="text-[10px] text-cyan-300/70 block mb-1 font-sans">NLI Groundedness</span>
          <strong className={groundedness_score >= 0.5 ? "text-emerald-400 text-sm font-bold" : "text-rose-400 text-sm font-bold"}>
            {(groundedness_score * 100).toFixed(0)}%
          </strong>
        </div>
      </div>

      {/* Live Stage Latency HUD */}
      <div className="mb-4 relative z-10">
        <LatencyHUD latency={latency} />
      </div>

      {/* Retrieved Passages & Multi-Strategy Chunk Inspector */}
      <div className="flex-1 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
            Retrieved Chunks ({retrieved_chunks.length})
          </span>
          <Database className="w-3.5 h-3.5 text-cyan-400" />
        </div>

        <div className="space-y-2 text-xs">
          {retrieved_chunks.map((chunk, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-ocean-900/80 border border-cyan-500/20 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[10px] pb-1 border-b border-cyan-500/10">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">
                  #{idx + 1} {chunk.chunking_strategy || 'native_passage'}
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  RRF: {chunk.rrf_score ? chunk.rrf_score.toFixed(4) : '0.0333'}
                </span>
              </div>
              <p className="text-gray-200 text-[11px] leading-relaxed font-sans">
                "{chunk.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
