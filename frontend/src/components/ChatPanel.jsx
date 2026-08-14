import React, { useState } from 'react';
import { Mic, MicOff, Send, Radio, Sparkles, MessageSquare, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
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
    <main className="w-full h-full flex flex-col glass-panel border-r border-gray-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">Interactive Chat &amp; Voice Session</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400">
            Messages: <strong className="text-indigo-300 font-mono">{messages.length}</strong>
          </span>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Voice-Native Indic Q&amp;A Loop</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              Press the mic button to speak in Hindi, Bengali, Tamil, Telugu or any Indic language, or pick a sample query below.
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
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                {/* Question */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-gray-100">{msg.query}</h3>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-slate-950 text-indigo-300 rounded border border-gray-800">
                    {msg.response?.language_detected || 'hi'}
                  </span>
                </div>

                {/* Answer Summary */}
                <p className={`text-xs leading-relaxed font-medium mb-3 ${
                  isDeclined ? 'text-rose-300 italic' : 'text-gray-300'
                }`}>
                  {msg.response?.answer}
                </p>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-800/80">
                  <div className="flex items-center gap-2">
                    {isGrounded && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Grounded
                      </span>
                    )}
                    {isLowConf && (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Low Conf
                      </span>
                    )}
                    {isDeclined && (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Declined
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
                    <span>P50 Total: <strong className="text-gray-200">{msg.response?.latency?.total_ms?.toFixed(1)}ms</strong></span>
                    {isSelected && <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-bold">Selected</span>}
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
        <div className="flex items-center justify-between p-2.5 mb-3 bg-rose-950/40 rounded-xl border border-rose-500/40 animate-pulse text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-200 font-semibold">
              {micStatus === 'reconnecting' ? 'Reconnecting to Sarvam STT WebSocket...' : 'Listening via Sarvam Saaras v3...'}
            </span>
          </div>
          <button
            onClick={onStopVoice}
            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer"
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
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all cursor-pointer ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
          }`}
          title={isRecording ? 'Stop Mic' : 'Start Mic Recording (Sarvam Saaras v3)'}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          placeholder={isRecording ? "Listening..." : "Ask a question in Hindi, Bengali, Tamil, Telugu..."}
          disabled={isRecording || isLoading}
          className="flex-1 bg-slate-950 text-gray-100 placeholder-gray-500 text-xs rounded-xl px-3.5 py-3 border border-gray-800 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!textQuery.trim() || isLoading || isRecording}
          className="flex items-center gap-1.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </main>
  );
}
