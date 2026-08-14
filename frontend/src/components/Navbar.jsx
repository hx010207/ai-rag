import React from 'react';
import { Mic, Zap, Activity } from 'lucide-react';

export default function Navbar({ onOpenLatencyReport }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-3 shadow-xl relative">
      <div className="flex items-center justify-between">
        {/* Brand & Logo Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-hh-emerald text-slate-950 font-black shadow-md">
            <Mic className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-hh-coral rounded-full border-2 border-slate-950"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">VANI RAG</h1>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full badge-gold uppercase tracking-wider">
                HH GOA 2026
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Voice-Native Indic RAG • MSMARCO-XI Dataset</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full badge-grounded text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-hh-emerald-dark" />
            <span>Target: <strong>126.49ms P50</strong></span>
          </div>

          <button
            onClick={onOpenLatencyReport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-hh-coral text-white text-xs font-extrabold hover:opacity-90 transition-all cursor-pointer shadow-md"
          >
            <Activity className="w-4 h-4" />
            <span>Latency Report</span>
          </button>

          <a
            href="https://github.com/hx010207/ai-rag"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold border border-slate-700 transition-all"
          >
            <svg className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Coastline Wave Line Divider (Flat HH Emerald Stroke #00E676, No Fill) */}
      <div className="absolute bottom-0 left-0 right-0 h-[6px] overflow-hidden leading-none pointer-events-none opacity-80">
        <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,30" fill="none" stroke="#00E676" strokeWidth="3" />
        </svg>
      </div>
    </header>
  );
}
