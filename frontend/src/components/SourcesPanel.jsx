import React from 'react';
import { Database, Globe, Layers } from 'lucide-react';

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
    <aside className="w-full h-full glass-panel border-r border-slate-800 flex flex-col p-4 overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-goa-teal text-white font-bold">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-wide">Indexed Sources</h2>
          <p className="text-[11px] text-gray-400 font-medium">ai4bharat/MSMARCO-XI Corpus</p>
        </div>
      </div>

      {/* Overview Stats Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-xs">
        <div className="flex items-center justify-between text-gray-300 mb-1.5">
          <span>Segmented Passages:</span>
          <strong className="text-goa-amber font-mono font-bold">15,420</strong>
        </div>
        <div className="flex items-center justify-between text-gray-300 mb-1.5">
          <span>Qdrant HNSW Index:</span>
          <strong className="text-goa-teal font-mono font-bold">Ready</strong>
        </div>
        <div className="flex items-center justify-between text-gray-300">
          <span>Indic Languages:</span>
          <strong className="text-goa-amber font-mono font-bold">14 + EN</strong>
        </div>
      </div>

      {/* Chunking Strategies Indicator */}
      <div className="mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2 block">
          Active Chunking Strategies:
        </span>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-goa-teal-chip text-goa-teal-dark border border-goa-teal">
            <span className="font-bold">1. Native Passage Level</span>
            <span className="font-mono text-[10px] font-bold">100%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-goa-amber-chip text-goa-amber-dark border border-goa-amber">
            <span className="font-bold">2. Sentence Window (&gt;150t)</span>
            <span className="font-mono text-[10px] font-bold">Dynamic</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800 text-gray-200 border border-slate-700">
            <span className="font-bold">3. Sliding Window Overlap</span>
            <span className="font-mono text-[10px] font-bold">256t / 20%</span>
          </div>
        </div>
      </div>

      {/* Dataset Subsets List */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-goa-amber">
            Language Subsets
          </span>
          <Globe className="w-3.5 h-3.5 text-goa-teal" />
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
                    ? 'bg-goa-teal text-white font-bold border-goa-teal shadow-md'
                    : 'bg-slate-900 border-slate-800 text-gray-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-600'}`}></span>
                  <span>{item.name}</span>
                </div>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white' : 'text-gray-400'}`}>{item.passages}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
