import React, { useState } from 'react';
import { Mic, MicOff, Send, MessageSquare, ShieldCheck, AlertTriangle, ShieldAlert, Flame, Sparkles } from 'lucide-react';
import LiveTranscriptStream from './LiveTranscriptStream';

export default function ChatPanel({
  messages,
  selectedMessageId,
  onSelectMessage,
  onSendQuery,
  onStartVoice,
  onStopVoice,
  isRecording,
  micStatus,
  partialTranscript,
  sttMs,
  isLoading
}) {
  const [textQuery, setTextQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (textQuery.trim() && !isLoading) {
      onSendQuery(textQuery.trim());
      setTextQuery('');
    }
  };

  return (
    <main className="w-full h-full flex flex-col glass-panel border-r border-cyan-500/20 p-4 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-extrabold text-white tracking-wide">Interactive Voice &amp; Chat Loop</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-cyan-300/80">
            Messages: <strong className="text-amber-400 font-mono">{messages.length}</strong>
          </span>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-rose-500 to-amber-400 p-[1.5px] mb-3 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-ocean-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1">
              Voice-Native Grounded QA System
            </h3>
            <p className="text-xs text-cyan-200/70 max-w-sm leading-relaxed">
              Press the mic button to speak in Hindi, Bengali, Tamil, Telugu or any of 14 Indic languages.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelected = selectedMessageId === msg.id;
            const isDeclined = msg.response?.status_badge === 'DECLINED_IDK';
            const isLowConf = msg.response?.status_badge === 'LOW_CONFIDENCE';
            const isGrounded = msg.response?.status_badge === 'GROUNDED';

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/40 via-ocean-900 to-rose-950/30 border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/40 scale-[1.01]'
                    : 'bg-ocean-900/60 border-cyan-500/10 hover:border-cyan-500/30'
                }`}
              >
                {/* Question */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-gray-100">{msg.query}</h3>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-ocean-950 text-cyan-300 rounded-md border border-cyan-500/30">
                    {msg.response?.language_detected || 'hi'}
                  </span>
                </div>

                {/* Answer Summary */}
                <p className={`text-xs leading-relaxed font-medium mb-3 ${
                  isDeclined ? 'text-rose-300 italic' : 'text-gray-200'
                }`}>
                  {msg.response?.answer}
                </p>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-cyan-500/10">
                  <div className="flex items-center gap-2">
                    {isGrounded && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Grounded
                      </span>
                    )}
                    {isLowConf && (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Low Conf
                      </span>
                    )}
                    {isDeclined && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Declined
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-300/70">
                    <span>P50 Total: <strong className="text-white font-bold">{msg.response?.latency?.total_ms?.toFixed(1)}ms</strong></span>
                    {isSelected && <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[9px] uppercase">Selected</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live Partial Transcript Stream Box */}
        {partialTranscript && (
          <LiveTranscriptStream
            partialTranscript={partialTranscript}
            sttMs={sttMs}
          />
        )}
      </div>

      {/* Mic Recording Status Banner */}
      {isRecording && (
        <div className="flex items-center justify-between p-3 mb-3 bg-rose-950/60 rounded-2xl border border-rose-500/50 animate-pulse text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-200 font-bold">
              {micStatus === 'reconnecting' ? 'Reconnecting to Sarvam STT WebSocket...' : 'Listening via Sarvam Saaras v3...'}
            </span>
          </div>
          <button
            onClick={onStopVoice}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-extrabold cursor-pointer shadow-md"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={isRecording ? onStopVoice : onStartVoice}
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all cursor-pointer shadow-xl ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-rose-600/40'
              : 'bg-gradient-to-tr from-cyan-500 via-rose-500 to-amber-400 text-white shadow-rose-500/30 hover:scale-105'
          }`}
          title={isRecording ? 'Stop Mic' : 'Start Mic Recording (Sarvam Saaras v3)'}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <input
          type="text"
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          placeholder={isRecording ? "Listening via Sarvam AI STT..." : "Ask a question in Hindi, Bengali, Tamil, Telugu..."}
          disabled={isRecording || isLoading}
          className="flex-1 bg-ocean-950 text-gray-100 placeholder-cyan-300/40 text-xs rounded-2xl px-4 py-3.5 border border-cyan-500/20 focus:outline-none focus:border-cyan-400 transition-all"
        />

        <button
          type="submit"
          disabled={!textQuery.trim() || isLoading || isRecording}
          className="flex items-center gap-1.5 px-5 py-3.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 hover:from-cyan-400 hover:to-rose-400 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-cyan-500/20 disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </main>
  );
}
