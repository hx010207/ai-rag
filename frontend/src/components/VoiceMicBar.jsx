import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Globe, Sparkles, Volume2 } from 'lucide-react';

const INDIC_LANGUAGES = [
  { code: 'auto', name: 'Auto-Detect Language' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)' },
  { code: 'en', name: 'English' }
];

export default function VoiceMicBar({
  onSendQuery,
  onStartVoice,
  onStopVoice,
  isRecording,
  selectedLanguage,
  setSelectedLanguage,
  isLoading
}) {
  const [textQuery, setTextQuery] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  // Audio level visualizer loop
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 80 + 20);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textQuery.trim() && !isLoading) {
      onSendQuery(textQuery, selectedLanguage);
      setTextQuery('');
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-4 shadow-2xl border border-indigo-500/20">
      {/* Top Bar: Language Selector & Audio Spectrum */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <span className="text-xs text-gray-400 font-medium">Dataset Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-900 text-gray-200 text-xs rounded-lg px-2.5 py-1 border border-gray-700 focus:outline-none focus:border-indigo-500"
          >
            {INDIC_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Live Audio Spectrum Bars when recording */}
        {isRecording && (
          <div className="flex items-center gap-1 px-3 py-1 bg-rose-950/40 rounded-full border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs text-rose-300 font-medium mr-2">Sarvam Realtime Voice Active</span>
            <div className="flex items-center gap-0.5 h-4">
              {[40, 70, 30, 90, 50, 80, 40].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-rose-400 rounded-full animate-wave"
                  style={{
                    height: `${(audioLevel * (height / 100))}%`,
                    animationDelay: `${i * 0.15}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Voice Recording Mic Button */}
        <button
          type="button"
          onClick={isRecording ? onStopVoice : onStartVoice}
          className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all shadow-lg cursor-pointer ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40 scale-105'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Voice Input (Sarvam AI Saaras v3)'}
        >
          {isRecording ? <MicOff className="w-6 h-6 animate-pulse" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Text Field */}
        <div className="relative flex-1">
          <input
            type="text"
            value={textQuery}
            onChange={(e) => setTextQuery(e.target.value)}
            placeholder={
              isRecording
                ? "Listening via Sarvam AI Realtime STT..."
                : "Ask a question in Hindi, Bengali, Tamil, Telugu or any of 14 Indic languages..."
            }
            disabled={isRecording || isLoading}
            className="w-full bg-slate-950/80 text-gray-100 placeholder-gray-500 text-sm rounded-xl px-4 py-3.5 border border-gray-800 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!textQuery.trim() || isLoading || isRecording}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
