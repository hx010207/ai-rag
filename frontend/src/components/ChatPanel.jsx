import React, { useState } from 'react';
import { Mic, MicOff, Send, MessageSquare, ShieldCheck, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
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
    <main className="w-full h-full flex flex-col glass-panel border-r border-slate-800 p-4 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-hh-emerald" />
          <h2 className="text-sm font-extrabold text-white tracking-wide">Interactive Voice &amp; Chat Session</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400">
            Messages: <strong className="text-hh-gold font-mono">{messages.length}</strong>
          </span>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-hh-emerald text-slate-950 flex items-center justify-center mb-3 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1">
              Voice-Native Grounded QA System
            </h3>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
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
                    ? 'bg-slate-900 border-hh-emerald shadow-lg ring-1 ring-hh-emerald'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* 1. Question Bubble */}
                <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold badge-gold rounded">
                      Question ({msg.response?.language_detected || 'hi'})
                    </span>
                    <h3 className="text-sm font-bold text-white">{msg.query}</h3>
                  </div>
                </div>

                {/* 2. Assistant Reply (Bound strictly under question by msg.id) */}
                <div className="my-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Grounded Answer Synthesis
                  </span>
                  <p className={`text-xs leading-relaxed font-medium p-3 rounded-xl border ${
                    isDeclined
                      ? 'badge-declined italic'
                      : 'bg-slate-950 text-gray-100 border-slate-800'
                  }`}>
                    {msg.response?.answer || "Synthesizing answer..."}
                  </p>
                </div>

                {/* 3. Footer Badges & Latency Summary */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    {isGrounded && (
                      <span className="px-2.5 py-0.5 rounded-full badge-grounded text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-hh-emerald-dark" /> Grounded
                      </span>
                    )}
                    {isLowConf && (
                      <span className="px-2.5 py-0.5 rounded-full badge-gold text-[10px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-hh-gold-dark" /> Low Conf
                      </span>
                    )}
                    {isDeclined && (
                      <span className="px-2.5 py-0.5 rounded-full badge-declined text-[10px] flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-hh-coral-dark" /> Declined (NLI Guardrail)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
                    <span>Total: <strong className="text-white font-bold">{msg.response?.latency?.total_ms?.toFixed(1)}ms</strong></span>
                    {isSelected && <span className="px-2 py-0.5 rounded bg-hh-emerald text-slate-950 font-bold text-[9px] uppercase">Selected</span>}
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
        <div className="flex items-center justify-between p-3 mb-3 badge-declined rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-hh-coral animate-ping"></span>
            <span className="text-hh-coral-dark font-extrabold">
              {micStatus === 'reconnecting' ? 'Reconnecting to Sarvam STT WebSocket...' : 'Listening via Sarvam Saaras v3...'}
            </span>
          </div>
          <button
            onClick={onStopVoice}
            className="px-3 py-1 rounded-xl bg-hh-coral text-white text-[11px] font-extrabold cursor-pointer"
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
          className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all cursor-pointer shadow-md ${
            isRecording
              ? 'bg-hh-coral text-white animate-pulse'
              : 'bg-hh-coral text-white hover:opacity-90'
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
          className="flex-1 bg-slate-950 text-gray-100 placeholder-gray-500 text-xs rounded-2xl px-4 py-3.5 border border-slate-800 focus:outline-none focus:border-hh-emerald transition-all"
        />

        <button
          type="submit"
          disabled={!textQuery.trim() || isLoading || isRecording}
          className="flex items-center gap-1.5 px-5 py-3.5 bg-hh-coral hover:opacity-90 text-white text-xs font-extrabold rounded-2xl shadow-md disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </main>
  );
}
