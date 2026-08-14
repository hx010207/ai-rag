import React from 'react';
import { Radio, Zap } from 'lucide-react';

export default function LiveTranscriptStream({ partialTranscript, sttMs, languageDetected }) {
  if (!partialTranscript) return null;

  return (
    <div className="w-full glass-card rounded-xl p-3.5 mb-4 border border-indigo-500/30 bg-indigo-950/20 animate-fadeIn">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs font-semibold text-rose-300">Sarvam Saaras v3 Realtime Partial Transcript</span>
          <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-indigo-900/60 text-indigo-300 rounded border border-indigo-700">
            {languageDetected || 'hi'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
          <Zap className="w-3 h-3" />
          <span>STT TTFT: {sttMs ? `${sttMs.toFixed(1)}ms` : '<120ms'}</span>
        </div>
      </div>

      <p className="text-sm font-medium text-gray-200 tracking-wide leading-relaxed">
        {partialTranscript}
        <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse"></span>
      </p>
    </div>
  );
}
