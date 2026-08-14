/**
 * Web Audio API PCM Audio Recorder & Resilient WebSocket Client for Sarvam AI STT
 * Encodes 16kHz 16-bit mono linear PCM audio chunks and handles auto-reconnect with exponential backoff.
 */

export class ResilientAudioRecorder {
  constructor(onPartialTranscript, onStatusChange, wsUrl = "ws://localhost:8000/ws/voice") {
    this.onPartialTranscript = onPartialTranscript;
    this.onStatusChange = onStatusChange;
    this.wsUrl = wsUrl;
    this.audioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.ws = null;
    this.isRecording = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async startRecording(languageCode = "auto") {
    try {
      this.onStatusChange("connecting");
      this.isRecording = true;

      // 1. Connect WebSocket to FastAPI Harness
      await this.connectWebSocket(languageCode);

      // 2. Request microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = this.floatTo16BitPCM(inputData);
        this.ws.send(pcmData);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.onStatusChange("recording");
    } catch (err) {
      console.error("Mic Recording Error:", err);
      this.onStatusChange("error");
      this.stopRecording();
    }
  }

  async connectWebSocket(languageCode) {
    return new Promise((resolve, reject) => {
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname || 'localhost';
        const url = `${wsProtocol}//${host}:8000/ws/voice`;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "stt_partial") {
              this.onPartialTranscript(data.transcript, data.stt_ms, data.language);
            }
          } catch (e) {}
        };

        this.ws.onerror = (err) => {
          console.warn("WebSocket Connection Warning:", err);
        };

        this.ws.onclose = () => {
          if (this.isRecording && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.onStatusChange("reconnecting");
            this.reconnectAttempts++;
            const backoffMs = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 5000);
            setTimeout(() => {
              this.connectWebSocket(languageCode);
            }, backoffMs);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  floatTo16BitPCM(output) {
    const buffer = new ArrayBuffer(output.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < output.length; i++) {
      const s = Math.max(-1, Math.min(1, output[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  stopRecording() {
    this.isRecording = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatusChange("idle");
  }
}
