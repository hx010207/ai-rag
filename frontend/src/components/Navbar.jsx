import React from 'react';
import { Mic, Zap, Activity, Flame, Compass } from 'lucide-react';

export default function Navbar({ onOpenLatencyReport }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-6 py-3 flex items-center justify-between shadow-2xl relative overflow-hidden">
      {/* Top Sunset Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-400"></div>

      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-amber-400 p-[1.5px] shadow-lg shadow-rose-500/20">
          <div className="w-full h-full bg-ocean-950 rounded-[10.5px] flex items-center justify-center">
            <Mic className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-ocean-950"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>VANI RAG</span>
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/30 tracking-wider uppercase shadow-sm">
              HH GOA 2026
            </span>
          </div>
          <p className="text-[11px] text-cyan-300/70 font-medium">Voice-Native Indic RAG • MSMARCO-XI</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Latency Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-sm">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Target: <strong className="text-white font-mono">126.49ms P50</strong></span>
        </div>

        {/* Latency Report Button */}
        <button
          onClick={onOpenLatencyReport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 via-rose-600/30 to-amber-600/30 hover:from-indigo-600/50 hover:to-amber-600/50 text-white text-xs font-semibold border border-rose-500/40 transition-all shadow-md cursor-pointer"
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Latency Report</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/hx010207/ai-rag"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ocean-900 hover:bg-ocean-800 text-gray-300 text-xs font-semibold border border-cyan-500/30 transition-all"
        >
          <svg className="w-4 h-4 fill-current text-cyan-400" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
