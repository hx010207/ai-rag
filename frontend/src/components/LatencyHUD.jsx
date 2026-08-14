import React from 'react';
import { Clock } from 'lucide-react';

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

  const totalSafe = total_ms > 0 ? total_ms : 1;
  const sttPct = Math.max(5, (stt_ms / totalSafe) * 100);
  const retPct = Math.max(5, (retrieval_ms / totalSafe) * 100);
  const genPct = Math.max(5, (generation_ms / totalSafe) * 100);
  const grdPct = Math.max(5, (guardrail_total / totalSafe) * 100);

  return (
    <div className="w-full rounded-2xl p-3 border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-goa-teal" />
          <span className="text-xs font-bold text-white">Live Stage Latency HUD</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-gray-200">
            Total: <strong className={isSub200 ? "text-goa-teal font-extrabold" : "text-goa-amber font-extrabold"}>{total_ms.toFixed(1)} ms</strong>
          </span>
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${isSub200 ? 'badge-grounded' : 'badge-amber'}`}>
            {isSub200 ? 'SUB-200MS READY' : 'ABOVE TARGET'}
          </span>
        </div>
      </div>

      {/* Stacked Timing Bar (Flat Palette Fills Only) */}
      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex mb-2.5 p-0.5 gap-0.5 border border-slate-800">
        <div style={{ width: `${sttPct}%` }} className="h-full bg-goa-coral rounded-sm" title={`STT (Sarvam): ${stt_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${retPct}%` }} className="h-full bg-goa-teal rounded-sm" title={`Retrieval (Qdrant+BM25): ${retrieval_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${genPct}%` }} className="h-full bg-goa-amber rounded-sm" title={`Generation (LLM): ${generation_ms.toFixed(1)}ms`}></div>
        <div style={{ width: `${grdPct}%` }} className="h-full bg-slate-700 rounded-sm" title={`Guardrails (NLI): ${guardrail_total.toFixed(1)}ms`}></div>
      </div>

      {/* Stage Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-goa-coral"></span>
          <span className="text-gray-400">STT:</span>
          <strong className="text-white">{stt_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-goa-teal"></span>
          <span className="text-gray-400">Retrieval:</span>
          <strong className="text-white">{retrieval_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-goa-amber"></span>
          <span className="text-gray-400">Generate:</span>
          <strong className="text-white">{generation_ms.toFixed(1)}ms</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-slate-700"></span>
          <span className="text-gray-400">Guardrail:</span>
          <strong className="text-white">{guardrail_total.toFixed(1)}ms</strong>
        </div>
      </div>
    </div>
  );
}
