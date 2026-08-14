import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, ShieldAlert, Volume2, Database, Zap, Cpu } from 'lucide-react';
import LatencyHUD from './LatencyHUD';

export default function ResponseDetailPanel({ selectedMessage }) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsStatusMsg, setTtsStatusMsg] = useState('');

  if (!selectedMessage || !selectedMessage.response) {
    return (
      <aside className="w-full h-full glass-panel border-l border-gray-800 flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <Layers className="w-8 h-8 text-indigo-400 opacity-50 mb-2" />
        <h3 className="text-sm font-bold text-gray-200">Response Transparency &amp; Latency HUD</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
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
    <aside className="w-full h-full glass-panel border-l border-gray-800 flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Response Detail Panel</h2>
        </div>
        <div>
          {isGrounded && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
              Grounded
            </span>
          )}
          {isLowConf && (
            <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-bold">
              Low Conf
            </span>
          )}
          {isDeclined && (
            <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-bold">
              Declined
            </span>
          )}
        </div>
      </div>

      {/* Selected Query & Answer Summary */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-gray-800 mb-4 text-xs">
        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
          Active Query ({language_detected})
        </span>
        <h3 className="font-semibold text-white mb-2">{query}</h3>
        <p className={`leading-relaxed text-xs p-2.5 rounded-lg border ${
          isDeclined ? 'bg-rose-950/30 text-rose-300 border-rose-500/30 italic' : 'bg-slate-950 text-gray-200 border-gray-800'
        }`}>
          {answer}
        </p>

        {/* TTS Audio Readback Button */}
        {!isDeclined && (
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handlePlayTTS}
              disabled={isPlayingTTS}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isPlayingTTS
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingTTS ? 'animate-bounce text-emerald-400' : 'text-white'}`} />
              <span>{isPlayingTTS ? 'Playing Audio...' : 'Read Aloud (Sarvam Bulbul TTS)'}</span>
            </button>
            {ttsStatusMsg && <span className="text-[10px] text-gray-400 italic">{ttsStatusMsg}</span>}
          </div>
        )}
      </div>

      {/* Groundedness & NLI Scores */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-1">Retrieval Confidence</span>
          <strong className={confidence_score >= 0.5 ? "text-emerald-400 text-sm" : "text-amber-400 text-sm"}>
            {(confidence_score * 100).toFixed(0)}%
          </strong>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-gray-800">
          <span className="text-[10px] text-gray-400 block mb-1">NLI Groundedness</span>
          <strong className={groundedness_score >= 0.5 ? "text-emerald-400 text-sm" : "text-rose-400 text-sm"}>
            {(groundedness_score * 100).toFixed(0)}%
          </strong>
        </div>
      </div>

      {/* Live Stage Latency HUD */}
      <div className="mb-4">
        <LatencyHUD latency={latency} />
      </div>

      {/* Retrieved Passages & Multi-Strategy Chunk Inspector */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Retrieved Chunks ({retrieved_chunks.length})
          </span>
          <Database className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        <div className="space-y-2 text-xs">
          {retrieved_chunks.map((chunk, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] pb-1 border-b border-gray-800">
                <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono font-bold">
                  #{idx + 1} {chunk.chunking_strategy || 'native_passage'}
                </span>
                <span className="text-emerald-400 font-mono">
                  RRF: {chunk.rrf_score ? chunk.rrf_score.toFixed(4) : '0.0333'}
                </span>
              </div>
              <p className="text-gray-300 text-[11px] leading-relaxed">
                "{chunk.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
