import React from 'react';
import { Clock, Cpu, Database, Shield, Zap } from 'lucide-react';

export default function LatencyHUD({ latency }) {
  if (!latency) return null;

  const {
    stt_ms = 0,
    retrieval_ms = 0,
    generation_ms = 0,
    guardrail_input_ms = 0,
    guardrail_output_ms = 0,
    total_ms = 0
  } = latency;

  const guardrail_total = guardrail_input_ms + guardrail_output_ms;
  const isSub200 = total_ms <= 200;

  // Calculate percentage widths for horizontal timing breakdown bar
  const totalSafe = total_ms > 0 ? total_ms : 1;
  const sttPct = Math.max(5, (stt_ms / totalSafe) * 100);
  const retPct = Math.max(5, (retrieval_ms / totalSafe) * 100);
  const genPct = Math.max(5, (generation_ms / totalSafe) * 100);
  const grdPct = Math.max(5, (guardrail_total / totalSafe) * 100);

  return (
    <div className="w-full glass-card rounded-xl p-3 my-3 border border-gray-800 bg-slate-950/60">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-gray-300">Live Stage Latency Breakdown HUD</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-gray-200">
            Total: <strong className={isSub200 ? "text-emerald-400 font-extrabold text-sm" : "text-amber-400 font-extrabold"}>{total_ms.toFixed(1)} ms</strong>
          </span>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isSub200 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300'}`}>
            {isSub200 ? 'SUB-200MS TARGET PASSED' : 'ABOVE TARGET'}
          </span>
        </div>
      </div>

      {/* Stacked Timing Bar */}
      <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden flex mb-2.5 p-0.5 gap-0.5 border border-gray-800">
        <div style={{ width: `${sttPct}%` }} className="h-full bg-rose-500 rounded-sm" title={`STT (Sarvam): ${stt_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${retPct}%` }} className="h-full bg-indigo-500 rounded-sm" title={`Retrieval (Qdrant+BM25): ${retrieval_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${genPct}%` }} className="h-full bg-violet-500 rounded-sm" title={`Generation (LLM): ${generation_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${grdPct}%` }} className="h-full bg-amber-500 rounded-sm" title={`Guardrails (NLI): ${guardrail_total.toFixed(1)}ms`}></div>
      </div>

      {/* Stage Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
          <span className="text-gray-400">STT:</span>
          <strong className="text-gray-200">{stt_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
          <span className="text-gray-400">Retrieval:</span>
          <strong className="text-gray-200">{retrieval_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-violet-500"></span>
          <span className="text-gray-400">Generate:</span>
          <strong className="text-gray-200">{generation_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
          <span className="text-gray-400">Guardrail:</span>
          <strong className="text-gray-200">{guardrail_total.toFixed(1)}ms</strong>
        </div>
      </div>
    </div>
  );
}
