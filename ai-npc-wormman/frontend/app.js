// ─── Worm Man NPC — Frontend App ───

const App = {
  ws: null,
  recording: false,
  mediaRecorder: null,
  audioChunks: [],
  audioEl: null,

  init() {
    this.audioEl = document.getElementById('response-audio');
    this.dismissSplash();
    this.connectWS();
    this.bindEvents();
    this.startVHSClock();

    // Initialize the canvas character renderer
    const canvas = document.getElementById('character-canvas');
    CharacterRenderer.init(canvas);
  },

  // ─── Splash ───

  dismissSplash() {
    const splash = document.getElementById('splash');
    const dismiss = () => {
      splash.classList.add('hidden');
      setTimeout(() => splash.remove(), 600);
    };
    splash.addEventListener('click', dismiss);
    document.addEventListener('keydown', dismiss, { once: true });
  },

  // ─── WebSocket ───

  connectWS() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    this.ws = new WebSocket(`${proto}://${location.host}/ws`);

    this.ws.onopen = () => this.setStatus('CONNECTED', '');
    this.ws.onclose = () => {
      this.setStatus('DISCONNECTED', '');
      setTimeout(() => this.connectWS(), 3000);
    };
    this.ws.onmessage = (e) => this.handleMessage(JSON.parse(e.data));
  },

  handleMessage(msg) {
    switch (msg.type) {
      case 'status':
        this.setStatus(msg.status.toUpperCase(), msg.status);
        break;
      case 'transcript':
        this.addChatMsg(msg.text, 'user');
        break;
      case 'response':
        this.showResponse(msg);
        break;
    }
  },

  // ─── Events ───

  bindEvents() {
    const input = document.getElementById('text-input');
    const sendBtn = document.getElementById('btn-send');
    const resetBtn = document.getElementById('btn-reset');
    const micBtn = document.getElementById('btn-mic');

    sendBtn.addEventListener('click', () => this.sendText());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendText(); }
    });

    resetBtn.addEventListener('click', () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'reset' }));
        document.getElementById('chat-log').innerHTML = '';
        this.addChatMsg('[ Memory wiped. Worm Man has forgotten everything. ]', 'npc');
      }
    });

    micBtn.addEventListener('click', () => this.toggleRecording());
    micBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.toggleRecording(); });
  },

  // ─── Send Text ───

  sendText() {
    const input = document.getElementById('text-input');
    const msg = input.value.trim();
    if (!msg) return;

    this.addChatMsg(msg, 'user');
    input.value = '';
    this.setStatus('THINKING', 'thinking');

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'text', message: msg }));
    }
  },

  // ─── Voice Recording (toggle: click to start, click to stop & send) ───

  toggleRecording() {
    if (this.recording) {
      this.stopAndSendRecording();
    } else {
      this.startRecording();
    }
  },

  async startRecording() {
    if (this.recording) return;
    this.audioChunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }
      });

      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      this.mediaRecorder.start(250);
      this.recording = true;
      document.getElementById('btn-mic').classList.add('recording');
      document.getElementById('mic-label').textContent = 'CLICK TO SEND';
      this.setStatus('RECORDING — CLICK MIC TO SEND', 'recording');
    } catch (err) {
      console.error('Mic error:', err);
      this.setStatus('MIC ERROR — CHECK PERMISSIONS', '');
    }
  },

  async stopAndSendRecording() {
    if (!this.recording || !this.mediaRecorder) return;
    this.recording = false;
    document.getElementById('btn-mic').classList.remove('recording');
    document.getElementById('mic-label').textContent = 'CLICK TO TALK';

    const recorder = this.mediaRecorder;
    recorder.stop();

    await new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    recorder.stream.getTracks().forEach(t => t.stop());

    if (this.audioChunks.length === 0) {
      this.setStatus('STANDBY', '');
      return;
    }

    const blob = new Blob(this.audioChunks, { type: recorder.mimeType || 'audio/webm' });
    const buffer = await blob.arrayBuffer();

    this.setStatus('PROCESSING VOICE', 'thinking');

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(buffer);
    }
  },

  // ─── Display Response ───

  showResponse(msg) {
    this.addChatMsg(msg.text, 'npc');

    const replyBubble = document.getElementById('reply-bubble');
    const replyText = document.getElementById('reply-text');
    const replyTiming = document.getElementById('reply-timing');

    replyText.textContent = msg.text;
    if (msg.timing) {
      replyTiming.textContent = `Brain: ${msg.timing.brain}s | Voice: ${msg.timing.voice}s | Total: ${msg.timing.total}s`;
    }
    replyBubble.style.display = 'block';

    // Trigger emotion pulse on the character
    CharacterRenderer.triggerEmotion('excited');

    if (msg.media_url) {
      this.playAudioWithLipSync(msg.media_url);
    } else {
      this.setStatus('STANDBY', '');
    }
  },

  playAudioWithLipSync(url) {
    const audio = this.audioEl;

    // Clear old handlers
    audio.oncanplaythrough = null;
    audio.onended = null;
    audio.onerror = null;

    audio.src = url;
    audio.crossOrigin = 'anonymous';

    let started = false;

    audio.oncanplaythrough = () => {
      if (started) return;
      started = true;
      try {
        AudioSync.connectToElement(audio);
      } catch (e) {
        console.warn('AudioSync connect failed:', e);
      }
      CharacterRenderer.startSpeaking();
      this.setStatus('SPEAKING', 'speaking');
      audio.play().catch((e) => console.error('Audio play failed:', e));
    };

    audio.onended = () => {
      CharacterRenderer.stopSpeaking();
      this.setStatus('STANDBY', '');
    };

    audio.onerror = (e) => {
      console.error('Audio error:', audio.error);
      CharacterRenderer.stopSpeaking();
      this.setStatus('AUDIO ERROR', '');
    };

    audio.load();
  },

  // ─── Chat Log ───

  addChatMsg(text, role) {
    const log = document.getElementById('chat-log');
    const el = document.createElement('div');
    el.className = `chat-msg ${role}`;
    el.textContent = role === 'user' ? `YOU: ${text}` : `WORM MAN: ${text}`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  },

  // ─── Status ───

  setStatus(text, mode) {
    document.getElementById('status-text').textContent = text;
    const dot = document.getElementById('status-dot');
    dot.className = 'status-dot';
    if (mode) dot.classList.add(mode);
  },

  // ─── VHS Clock ───

  startVHSClock() {
    const el = document.getElementById('vhs-time');
    const update = () => {
      const d = new Date();
      el.textContent = d.toTimeString().split(' ')[0];
    };
    update();
    setInterval(update, 1000);
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
