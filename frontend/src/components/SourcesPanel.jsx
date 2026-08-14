import React from 'react';
import { Database, Globe, CheckCircle2, Flame, Layers } from 'lucide-react';
import PalmLeafDecoration from './decorative/PalmLeafDecoration';

const INDIC_DATASET_SUBSETS = [
  { code: 'hi', name: 'Hindi (हिंदी)', passages: '1,240' },
  { code: 'bn', name: 'Bengali (বাংলা)', passages: '1,150' },
  { code: 'ta', name: 'Tamil (தமிழ்)', passages: '1,080' },
  { code: 'te', name: 'Telugu (తెలుగు)', passages: '1,020' },
  { code: 'mr', name: 'Marathi (मराठी)', passages: '980' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)', passages: '940' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', passages: '910' },
  { code: 'ml', name: 'Malayalam (മലയാളം)', passages: '890' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', passages: '850' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)', passages: '820' },
  { code: 'ur', name: 'Urdu (اردو)', passages: '790' },
  { code: 'as', name: 'Assamese (অসমীয়া)', passages: '760' },
  { code: 'ne', name: 'Nepali (नेपाली)', passages: '730' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)', passages: '700' },
  { code: 'en', name: 'English Original', passages: '2,500' },
];

export default function SourcesPanel({ selectedLanguage, setSelectedLanguage }) {
  return (
    <aside className="w-full h-full glass-panel border-r border-cyan-500/20 flex flex-col p-4 overflow-y-auto relative">
      <PalmLeafDecoration position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/20 relative z-10">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/30">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
            <span>Indexed Sources</span>
          </h2>
          <p className="text-[11px] text-cyan-300/70 font-medium">ai4bharat/MSMARCO-XI Corpus</p>
        </div>
      </div>

      {/* Overview Stats Card */}
      <div className="p-3.5 rounded-2xl tropical-card mb-4 text-xs relative z-10">
        <div className="flex items-center justify-between text-gray-300 mb-1.5">
          <span className="text-cyan-200">Segmented Passages:</span>
          <strong className="text-amber-400 font-mono font-bold">15,420</strong>
        </div>
        <div className="flex items-center justify-between text-gray-300 mb-1.5">
          <span className="text-cyan-200">Qdrant HNSW Index:</span>
          <strong className="text-emerald-400 font-mono font-bold">Ready</strong>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <span className="text-cyan-200">Indic Languages:</span>
          <strong className="text-rose-400 font-mono font-bold">14 + EN</strong>
        </div>
      </div>

      {/* Chunking Strategies Indicator */}
      <div className="mb-4 relative z-10">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 mb-2 block">
          Active Chunking Strategies:
        </span>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
            <span className="font-semibold">1. Native Passage Level</span>
            <span className="font-mono text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded">100%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
            <span className="font-semibold">2. Sentence Window (&gt;150t)</span>
            <span className="font-mono text-[10px] bg-indigo-900/60 px-1.5 py-0.5 rounded">Dynamic</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
            <span className="font-semibold">3. Sliding Window Overlap</span>
            <span className="font-mono text-[10px] bg-purple-900/60 px-1.5 py-0.5 rounded">256t / 20%</span>
          </div>
        </div>
      </div>

      {/* Dataset Subsets List */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
            Language Subsets
          </span>
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
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
                    ? 'bg-gradient-to-r from-cyan-950/80 to-rose-950/80 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-950/40'
                    : 'bg-ocean-900/50 border-cyan-500/10 text-gray-300 hover:bg-ocean-800/80 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-gray-600'}`}></span>
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300/60">{item.passages}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
