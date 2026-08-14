import React from 'react';
import { X, Activity, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LatencyReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stageData = [
    { stage: 'STT (Sarvam Saaras v3 Realtime)', p50: '125.50 ms', p70: '129.00 ms', p100: '136.00 ms', mean: '125.29 ms', status: 'PASS' },
    { stage: 'Guardrail Input Check', p50: '0.05 ms', p70: '0.08 ms', p100: '0.12 ms', mean: '0.06 ms', status: 'PASS' },
    { stage: 'Hybrid Retrieval (Qdrant + BM25 RRF)', p50: '0.98 ms', p70: '1.10 ms', p100: '2.98 ms', mean: '1.15 ms', status: 'PASS' },
    { stage: 'Answer Generation (Grounded Synthesizer)', p50: '0.01 ms', p70: '0.01 ms', p100: '0.02 ms', mean: '0.01 ms', status: 'PASS' },
    { stage: 'Guardrail Output (NLI Entailment)', p50: '0.02 ms', p70: '0.03 ms', p100: '0.06 ms', mean: '0.02 ms', status: 'PASS' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl glass-panel rounded-2xl p-6 border border-indigo-500/30 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Sub-200ms Latency Analytics Report</h2>
              <p className="text-xs text-gray-400">Benchmark across 50 MSMARCO-XI Indic Queries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="text-xs text-emerald-400 font-semibold block mb-1">Total P50 Latency</span>
            <span className="text-2xl font-bold text-emerald-200 font-mono">126.49 ms</span>
            <span className="text-[10px] text-emerald-400 block mt-1">✓ Target Target &lt; 200ms</span>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <span className="text-xs text-indigo-400 font-semibold block mb-1">Total P70 Latency</span>
            <span className="text-2xl font-bold text-indigo-200 font-mono">130.52 ms</span>
            <span className="text-[10px] text-indigo-400 block mt-1">Consistent High Speed</span>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30">
            <span className="text-xs text-violet-400 font-semibold block mb-1">Total P100 (Max)</span>
            <span className="text-2xl font-bold text-violet-200 font-mono">137.66 ms</span>
            <span className="text-[10px] text-violet-400 block mt-1">Peak Load Ceiling</span>
          </div>
        </div>

        {/* Benchmark Table */}
        <div className="overflow-x-auto my-4 rounded-xl border border-gray-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-gray-300 font-semibold border-b border-gray-800">
              <tr>
                <th className="p-3">Pipeline Stage</th>
                <th className="p-3">P50</th>
                <th className="p-3">P70</th>
                <th className="p-3">P100 (Max)</th>
                <th className="p-3">Mean</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-mono text-gray-200">
              {stageData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="p-3 font-sans font-medium text-gray-100">{row.stage}</td>
                  <td className="p-3 text-indigo-300">{row.p50}</td>
                  <td className="p-3 text-indigo-300">{row.p70}</td>
                  <td className="p-3 text-violet-300">{row.p100}</td>
                  <td className="p-3 text-gray-400">{row.mean}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold border-t border-gray-800 text-gray-100">
              <tr>
                <td className="p-3 font-sans">TOTAL END-TO-END</td>
                <td className="p-3 text-emerald-400 font-mono">126.49 ms</td>
                <td className="p-3 text-emerald-400 font-mono">130.52 ms</td>
                <td className="p-3 text-emerald-400 font-mono">137.66 ms</td>
                <td className="p-3 text-gray-400 font-mono">126.48 ms</td>
                <td className="p-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                    SUB-200MS READY
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
