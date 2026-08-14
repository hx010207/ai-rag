import React, { useState } from 'react';
import { Layers, ShieldCheck, AlertTriangle, ShieldAlert, Volume2, Database, Zap } from 'lucide-react';
import LatencyHUD from './LatencyHUD';

export default function ResponseDetailPanel({ selectedMessage }) {
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [ttsStatusMsg, setTtsStatusMsg] = useState('');

  if (!selectedMessage || !selectedMessage.response) {
    return (
      <aside className="w-full h-full glass-panel border-l border-slate-800 flex flex-col items-center justify-center p-6 text-center text-gray-400">
        <div className="w-12 h-12 rounded-2xl bg-goa-teal text-white flex items-center justify-center mb-3">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-extrabold text-white">Response Detail &amp; Transparency</h3>
        <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
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

  // Sarvam Bulbul TTS Playback Handler with Diagnostic Logging & Non-blocking Fallback
  const handlePlayTTS = async () => {
    console.log('[TTS] Read Aloud clicked for message:', selectedMessage.id, 'Query:', query);
    setIsPlayingTTS(true);
    setTtsStatusMsg('Synthesizing Sarvam Bulbul TTS Audio...');

    try {
      const res = await fetch('http://localhost:8000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: answer,
          language_code: language_detected || 'hi',
          speaker: 'anushka'
        })
      });

      console.log('[TTS] Response status code:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('[TTS] Response payload status:', data.status);

        if (data.status === 'success' && data.audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio_base64}`);
          audio.onended = () => {
            console.log('[TTS] Audio playback finished naturally.');
            setIsPlayingTTS(false);
            setTtsStatusMsg('');
          };
          audio.onerror = (e) => {
            console.error('[TTS Audio Object Error]', e);
            fallbackBrowserTTS();
          };

          audio.play().catch((playErr) => {
            console.error('[TTS Audio .play() Promise Error]:', playErr);
            fallbackBrowserTTS();
          });

          setTtsStatusMsg('Playing Sarvam Bulbul TTS Audio...');
          return;
        }
      }
      fallbackBrowserTTS();
    } catch (err) {
      console.error('[TTS Network / Endpoint Error]:', err);
      fallbackBrowserTTS();
    }
  };

  const fallbackBrowserTTS = () => {
    console.log('[TTS] Executing Web Speech API Fallback...');
    setTtsStatusMsg('Using Web Speech Readback...');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(answer);
      utterance.rate = 1.0;
      utterance.onend = () => {
        setIsPlayingTTS(false);
        setTtsStatusMsg('');
      };
      utterance.onerror = (e) => {
        console.error('[TTS Web Speech Error]', e);
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
    <aside className="w-full h-full glass-panel border-l border-slate-800 flex flex-col p-4 overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-goa-teal" />
          <h2 className="text-sm font-extrabold text-white tracking-wide">Response Detail Panel</h2>
        </div>
        <div>
          {isGrounded && (
            <span className="px-2.5 py-0.5 rounded-full badge-grounded text-[10px]">
              Grounded
            </span>
          )}
          {isLowConf && (
            <span className="px-2.5 py-0.5 rounded-full badge-amber text-[10px]">
              Low Conf
            </span>
          )}
          {isDeclined && (
            <span className="px-2.5 py-0.5 rounded-full badge-declined text-[10px]">
              Declined
            </span>
          )}
        </div>
      </div>

      {/* Selected Query & Answer Summary */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-xs">
        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
          Active Query ({language_detected})
        </span>
        <h3 className="font-bold text-white mb-2">{query}</h3>
        <p className={`leading-relaxed text-xs p-3 rounded-xl border ${
          isDeclined ? 'badge-declined italic' : 'bg-slate-950 text-gray-200 border-slate-800'
        }`}>
          {answer}
        </p>

        {/* Read Aloud Button (Click Triggered — Coral #993C1D) */}
        {!isDeclined && (
          <div className="mt-3 flex flex-col items-start gap-1">
            <button
              onClick={handlePlayTTS}
              disabled={isPlayingTTS}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer shadow-md ${
                isPlayingTTS
                  ? 'bg-goa-teal text-white border-goa-teal'
                  : 'bg-goa-coral hover:opacity-90 text-white border-goa-coral'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-bounce text-white' : 'text-white'}`} />
              <span>{isPlayingTTS ? 'Playing Audio...' : 'Read Aloud (Sarvam Bulbul TTS)'}</span>
            </button>
            {ttsStatusMsg && <span className="text-[10px] text-gray-400 italic mt-1">{ttsStatusMsg}</span>}
          </div>
        )}
      </div>

      {/* Groundedness & NLI Scores */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-1 font-sans">Retrieval Confidence</span>
          <strong className="text-goa-amber text-sm font-bold">
            {(confidence_score * 100).toFixed(0)}%
          </strong>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-1 font-sans">NLI Groundedness</span>
          <strong className={groundedness_score >= 0.5 ? "text-goa-teal text-sm font-bold" : "text-goa-coral text-sm font-bold"}>
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
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-goa-amber">
            Retrieved Chunks ({retrieved_chunks.length})
          </span>
          <Database className="w-3.5 h-3.5 text-goa-teal" />
        </div>

        <div className="space-y-2 text-xs">
          {retrieved_chunks.map((chunk, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-800">
                <span className="px-2 py-0.5 rounded badge-grounded font-mono text-[9px]">
                  #{idx + 1} {chunk.chunking_strategy || 'native_passage'}
                </span>
                <span className="text-goa-amber font-mono font-bold">
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
