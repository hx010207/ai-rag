import React from 'react';
import { Database, FileText, Globe, Layers, Filter, CheckCircle2 } from 'lucide-react';

const INDIC_DATASET_SUBSETS = [
  { code: 'hi', name: 'Hindi (हिंदी)', passages: '1,240', status: 'Indexed' },
  { code: 'bn', name: 'Bengali (বাংলা)', passages: '1,150', status: 'Indexed' },
  { code: 'ta', name: 'Tamil (தமிழ்)', passages: '1,080', status: 'Indexed' },
  { code: 'te', name: 'Telugu (తెలుగు)', passages: '1,020', status: 'Indexed' },
  { code: 'mr', name: 'Marathi (मराठी)', passages: '980', status: 'Indexed' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)', passages: '940', status: 'Indexed' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', passages: '910', status: 'Indexed' },
  { code: 'ml', name: 'Malayalam (മലയാളം)', passages: '890', status: 'Indexed' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', passages: '850', status: 'Indexed' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)', passages: '820', status: 'Indexed' },
  { code: 'ur', name: 'Urdu (اردو)', passages: '790', status: 'Indexed' },
  { code: 'as', name: 'Assamese (অসমীয়া)', passages: '760', status: 'Indexed' },
  { code: 'ne', name: 'Nepali (नेपाली)', passages: '730', status: 'Indexed' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)', passages: '700', status: 'Indexed' },
  { code: 'en', name: 'English Original', passages: '2,500', status: 'Indexed' },
];

export default function SourcesPanel({ selectedLanguage, setSelectedLanguage }) {
  return (
    <aside className="w-full h-full glass-panel border-r border-gray-800 flex flex-col p-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Indexed Sources</h2>
          <p className="text-[11px] text-gray-400">ai4bharat/MSMARCO-XI Corpus</p>
        </div>
      </div>

      {/* Overview Stats Card */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 mb-4 text-xs">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span>Segmented Passages:</span>
          <strong className="text-emerald-400 font-mono">15,420</strong>
        </div>
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span>Qdrant HNSW Index:</span>
          <strong className="text-indigo-400 font-mono">Ready</strong>
        </div>
        <div className="flex items-center justify-between text-gray-400">
          <span>Indic Languages:</span>
          <strong className="text-purple-400 font-mono">14 + EN</strong>
        </div>
      </div>

      {/* Chunking Strategies Indicator */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 block">
          Active Chunking Strategies:
        </span>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="font-medium">1. Native Passage Level</span>
            <span className="font-mono text-[10px]">100%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
            <span className="font-medium">2. Sentence Window (&gt;150t)</span>
            <span className="font-mono text-[10px]">Dynamic</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-violet-950/40 border border-violet-500/30 text-violet-300">
            <span className="font-medium">3. Sliding Window Overlap</span>
            <span className="font-mono text-[10px]">256t / 20%</span>
          </div>
        </div>
      </div>

      {/* Dataset Subsets List */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Language Subsets
          </span>
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
          {INDIC_DATASET_SUBSETS.map((item) => {
            const isSelected = selectedLanguage === item.code;
            return (
              <button
                key={item.code}
                onClick={() => setSelectedLanguage(item.code)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold shadow-md'
                    : 'bg-slate-900/40 border-gray-800/80 text-gray-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-gray-600'}`}></span>
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">{item.passages}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
