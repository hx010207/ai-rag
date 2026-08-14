import React from 'react';
import { Mic, Zap, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar({ onOpenLatencyReport }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 px-6 py-3.5 flex items-center justify-between shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30">
          <Mic className="w-5 h-5 text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">VANI RAG</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              HH Goa 2026
            </span>
          </div>
          <p className="text-xs text-gray-400">Voice-Native Indic Retrieval-Augmented Generation (MSMARCO-XI)</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sub-200ms Target: <strong className="text-emerald-200">126.49ms P50</strong></span>
        </div>

        <button
          onClick={onOpenLatencyReport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/40 transition-all shadow-sm cursor-pointer"
        >
          <Activity className="w-4 h-4 text-indigo-400" />
          <span>Latency Report</span>
        </button>

        <a
          href="https://github.com/hx010207/ai-rag"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium border border-gray-700 transition-all"
        >
          <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
