// ─── Procedural Sound System ───
// All sounds synthesized via Web Audio API. No external files.

const SFX = {
  ctx: null,
  master: null,
  enabled: true,
  _volume: 0.25,
  _ambient: null,
  _ambientGain: null,
  _ambientNodes: [],

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = this._volume;
    this.master.connect(this.ctx.destination);
    this.enabled = localStorage.getItem('gm_sfx') !== 'off';
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('gm_sfx', this.enabled ? 'on' : 'off');
    if (!this.enabled) this.stopAmbient();
    return this.enabled;
  },

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this._volume;
  },

  _osc(freq, type, duration, gainVal, rampDown) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainVal;
    if (rampDown) {
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    }
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  _noise(duration, gainVal) {
    if (!this.ctx || !this.enabled) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = gainVal;
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();
  },

  // Typing character tick
  tick() {
    this._osc(4200, 'square', 0.008, 0.04, false);
  },

  // Hover over choice
  hover() {
    this._osc(1800, 'sine', 0.03, 0.02, true);
  },

  // Choice selected
  select() {
    if (!this.ctx || !this.enabled) return;
    this._osc(700, 'sine', 0.08, 0.08, true);
    setTimeout(() => this._osc(1050, 'sine', 0.1, 0.06, true), 60);
  },

  // Action button confirm
  confirm() {
    if (!this.ctx || !this.enabled) return;
    this._osc(440, 'triangle', 0.06, 0.1, true);
    setTimeout(() => this._osc(660, 'triangle', 0.12, 0.08, true), 50);
    setTimeout(() => this._osc(880, 'sine', 0.15, 0.05, true), 100);
  },

  // Good shot
  shotGood() {
    if (!this.ctx || !this.enabled) return;
    this._osc(523, 'sine', 0.12, 0.1, true);
    setTimeout(() => this._osc(659, 'sine', 0.12, 0.08, true), 80);
    setTimeout(() => this._osc(784, 'sine', 0.2, 0.06, true), 160);
  },

  // Bad shot
  shotBad() {
    if (!this.ctx || !this.enabled) return;
    this._osc(300, 'sawtooth', 0.15, 0.06, true);
    setTimeout(() => this._osc(280, 'sawtooth', 0.2, 0.04, true), 100);
  },

  // Shank
  shotShank() {
    if (!this.ctx || !this.enabled) return;
    this._noise(0.12, 0.08);
    this._osc(120, 'sawtooth', 0.2, 0.06, true);
  },

  // Hole transition
  holeTransition() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.3);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.4);
  },

  // Phone vibrate
  phoneVibrate() {
    if (!this.ctx || !this.enabled) return;
    const buzz = (delay) => {
      setTimeout(() => {
        this._osc(80, 'square', 0.08, 0.06, true);
        this._noise(0.08, 0.03);
      }, delay);
    };
    buzz(0);
    buzz(120);
    buzz(350);
    buzz(470);
  },

  // Panic onset
  panicOnset() {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 110;
    osc2.type = 'sine';
    osc2.frequency.value = 116.5; // minor 2nd
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.0);
    gain.gain.linearRampToValueAtTime(0.02, now + 2.0);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.master);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.0);
    osc2.stop(now + 2.0);
  },

  // Panic spiral tick
  panicTick() {
    if (!this.ctx || !this.enabled) return;
    const freq = 2000 + Math.random() * 3000;
    this._osc(freq, 'square', 0.015, 0.05, false);
  },

  // Perk unlock
  perkUnlock() {
    if (!this.ctx || !this.enabled) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => this._osc(f, 'sine', 0.15, 0.07 - i * 0.01, true), i * 80);
    });
  },

  // ─── Ambient Scenes ───
  startAmbient(scene) {
    if (!this.ctx || !this.enabled) return;
    this.stopAmbient();

    const now = this.ctx.currentTime;
    this._ambientGain = this.ctx.createGain();
    this._ambientGain.gain.setValueAtTime(0, now);
    this._ambientGain.connect(this.master);
    this._ambientNodes = [];

    if (scene === 'course') {
      const drone = this.ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 80;
      const droneGain = this.ctx.createGain();
      droneGain.gain.value = 0.5;
      drone.connect(droneGain);
      droneGain.connect(this._ambientGain);
      drone.start();
      this._ambientNodes.push(drone);

      this._ambientGain.gain.linearRampToValueAtTime(0.03, now + 2.0);

    } else if (scene === 'tense') {
      const drone = this.ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 95;
      const detune = this.ctx.createOscillator();
      detune.type = 'sine';
      detune.frequency.value = 98;
      const dGain = this.ctx.createGain();
      dGain.gain.value = 0.4;
      drone.connect(dGain);
      detune.connect(dGain);
      dGain.connect(this._ambientGain);
      drone.start();
      detune.start();
      this._ambientNodes.push(drone, detune);

      this._ambientGain.gain.linearRampToValueAtTime(0.04, now + 1.5);

    } else if (scene === 'panic') {
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 110;
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 116.5;
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 2;
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      const pGain = this.ctx.createGain();
      pGain.gain.value = 0.5;
      osc1.connect(pGain);
      osc2.connect(pGain);
      lfoGain.connect(pGain.gain);
      pGain.connect(this._ambientGain);
      osc1.start();
      osc2.start();
      lfo.start();
      this._ambientNodes.push(osc1, osc2, lfo);

      this._ambientGain.gain.linearRampToValueAtTime(0.06, now + 0.5);

    } else if (scene === 'void') {
      const drone = this.ctx.createOscillator();
      drone.type = 'sine';
      drone.frequency.value = 55;
      const vGain = this.ctx.createGain();
      vGain.gain.value = 0.6;
      drone.connect(vGain);
      vGain.connect(this._ambientGain);
      drone.start();
      this._ambientNodes.push(drone);

      this._ambientGain.gain.linearRampToValueAtTime(0.02, now + 3.0);

    } else {
      return;
    }

    this._ambient = scene;
  },

  stopAmbient() {
    if (this._ambientGain) {
      try {
        const now = this.ctx.currentTime;
        this._ambientGain.gain.linearRampToValueAtTime(0, now + 0.5);
        const nodes = this._ambientNodes;
        const gain = this._ambientGain;
        setTimeout(() => {
          nodes.forEach(n => { try { n.stop(); } catch {} });
          try { gain.disconnect(); } catch {}
        }, 600);
      } catch {}
    }
    this._ambientNodes = [];
    this._ambientGain = null;
    this._ambient = null;
  },
};
