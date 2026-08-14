import React from 'react';
import { Database, Tag, FileText, Award } from 'lucide-react';

export default function ChunkInspectorDrawer({ chunks }) {
  if (!chunks || chunks.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-gray-800 text-xs text-gray-400 italic">
        No passages were retrieved for this query.
      </div>
    );
  }

  const getStrategyColor = (strategy) => {
    switch (strategy) {
      case 'native_passage':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      case 'sentence_window':
        return 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40';
      case 'sliding_window':
        return 'bg-violet-950/60 text-violet-300 border-violet-500/40';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-800 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-gray-200">Retrieval & Multi-Strategy Chunking Transparency Inspector</h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">
          Top-{chunks.length} Chunks Retrieved (Qdrant Dense + BM25 RRF)
        </span>
      </div>

      <div className="space-y-3">
        {chunks.map((chunk, idx) => (
          <div
            key={chunk.chunk_id || idx}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-gray-800 hover:border-gray-700 transition-all text-xs"
          >
            {/* Chunk Metadata Tag Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-900">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-900/60 border border-indigo-700 flex items-center justify-center font-mono font-bold text-[10px] text-indigo-300">
                  #{idx + 1}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold uppercase ${getStrategyColor(chunk.chunking_strategy)}`}>
                  Strategy: {chunk.chunking_strategy || 'native_passage'}
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 font-mono text-[10px]">
                  Lang: {chunk.language || 'hi'}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-gray-400">RRF Score:</span>
                <strong className="text-emerald-400">{chunk.rrf_score ? chunk.rrf_score.toFixed(4) : '0.0333'}</strong>
              </div>
            </div>

            {/* Chunk Text */}
            <p className="text-gray-200 leading-relaxed font-sans text-xs bg-slate-900/50 p-2.5 rounded-lg border border-gray-850">
              "{chunk.text}"
            </p>

            {/* Parent Context Link if sentence/sliding chunk */}
            {chunk.parent_text && chunk.parent_text !== chunk.text && (
              <div className="mt-2 text-[11px] text-gray-400 bg-indigo-950/20 p-2 rounded border border-indigo-900/40">
                <strong className="text-indigo-300">Parent Passage Context:</strong> "{chunk.parent_text}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
