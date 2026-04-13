// ─── Audio Sync — Real-time amplitude analysis for lip sync ───

const AudioSync = {
  audioContext: null,
  analyser: null,
  dataArray: null,
  source: null,
  _connected: false,

  VISEME_THRESHOLDS: [0.03, 0.10, 0.22, 0.45],

  init() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.4;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  },

  connectToElement(audioEl) {
    if (!this.audioContext) this.init();

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.source) {
      try { this.source.disconnect(); } catch (e) {}
    }

    if (!audioEl._audioSyncSource) {
      audioEl._audioSyncSource = this.audioContext.createMediaElementSource(audioEl);
    }
    this.source = audioEl._audioSyncSource;
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this._connected = true;
  },

  getAmplitude() {
    if (!this._connected || !this.analyser) return 0;
    this.analyser.getByteTimeDomainData(this.dataArray);

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const v = (this.dataArray[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / this.dataArray.length);
  },

  getFrequencyBalance() {
    if (!this._connected || !this.analyser) return 0.5;
    this.analyser.getByteFrequencyData(this.dataArray);

    const mid = Math.floor(this.dataArray.length / 2);
    let low = 0, high = 0;
    for (let i = 0; i < mid; i++) low += this.dataArray[i];
    for (let i = mid; i < this.dataArray.length; i++) high += this.dataArray[i];

    const total = low + high;
    return total > 0 ? high / total : 0.5;
  },

  getMouthState() {
    const amp = this.getAmplitude();
    const T = this.VISEME_THRESHOLDS;
    if (amp < T[0]) return 0;  // closed
    if (amp < T[1]) return 1;  // barely open
    if (amp < T[2]) return 2;  // open
    if (amp < T[3]) return 3;  // wide
    return 4;                   // very wide
  },

  disconnect() {
    if (this.source) {
      try { this.source.disconnect(); } catch (e) {}
    }
    this._connected = false;
  },
};
