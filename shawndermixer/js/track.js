// ─── Track — source, gain, pan, FX chain, mute/solo, analyser ───

let _trackIdCounter = 0;

class Track {
  constructor(name, buffer) {
    this.id = _trackIdCounter++;
    this.name = name;
    this.buffer = buffer;
    this.source = null;

    this.gainNode = Engine.ctx.createGain();
    this.panNode = Engine.ctx.createStereoPanner();
    this.analyser = Engine.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.7;

    this._fxChain = [];
    this._outputNode = null;

    this.muted = false;
    this.soloed = false;
    this.volume = 1;
    this.pan = 0;

    this.color = Track.COLORS[this.id % Track.COLORS.length];
    this.automationLanes = {};

    this._rebuildChain();
  }

  _rebuildChain() {
    try { this.gainNode.disconnect(); } catch (e) {}
    try { this.panNode.disconnect(); } catch (e) {}
    try { this.analyser.disconnect(); } catch (e) {}
    for (const fx of this._fxChain) { try { fx.disconnect(); } catch (e) {} }

    let current = this.gainNode;
    current.connect(this.panNode);
    current = this.panNode;

    for (const fx of this._fxChain) {
      fx.connect(current, null);
      current = fx._outputNode || current;
    }

    current.connect(this.analyser);

    if (this._outputNode) {
      this.analyser.connect(this._outputNode);
    }
  }

  connectTo(destination) {
    this._outputNode = destination;
    this.analyser.disconnect();
    this.analyser.connect(destination);
  }

  disconnect() {
    this.analyser.disconnect();
    this._outputNode = null;
  }

  play(offset = 0) {
    this.stop();
    if (!this.buffer) return;

    this.source = Engine.ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);

    const dur = this.buffer.duration;
    if (offset < dur) {
      this.source.start(0, offset);
    }

    this._applyMuteState();
  }

  stop() {
    if (this.source) {
      try { this.source.stop(); } catch (e) {}
      this.source.disconnect();
      this.source = null;
    }
  }

  setVolume(val) {
    this.volume = val;
    this._applyMuteState();
  }

  setPan(val) {
    this.pan = val;
    this.panNode.pan.setValueAtTime(val, Engine.ctx.currentTime);
  }

  setMute(muted) {
    this.muted = muted;
    this._applyMuteState();
  }

  setSolo(soloed) {
    this.soloed = soloed;
    for (const t of Engine.tracks) t._applyMuteState();
  }

  _applyMuteState() {
    const anySoloed = Engine.tracks.some(t => t.soloed);
    let audible;
    if (anySoloed) {
      audible = this.soloed;
    } else {
      audible = !this.muted;
    }
    const targetGain = audible ? this.volume : 0;
    this.gainNode.gain.setTargetAtTime(targetGain, Engine.ctx.currentTime, 0.02);
  }

  addEffect(effect) {
    this._fxChain.push(effect);
    this._rebuildChain();
  }

  removeEffect(effect) {
    const idx = this._fxChain.indexOf(effect);
    if (idx !== -1) {
      this._fxChain.splice(idx, 1);
      effect.disconnect();
      this._rebuildChain();
    }
  }

  getEffects() {
    return [...this._fxChain];
  }

  getPeakLevel() {
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    let peak = 0;
    for (let i = 0; i < data.length; i++) {
      const val = Math.abs((data[i] - 128) / 128);
      if (val > peak) peak = val;
    }
    return peak;
  }

  serialize() {
    return {
      name: this.name,
      volume: this.volume,
      pan: this.pan,
      muted: this.muted,
      soloed: this.soloed,
      effects: this._fxChain.map(fx => ({ type: fx.type, params: fx.serializeParams() })),
      automation: this.automationLanes,
    };
  }
}

Track.COLORS = [
  '#e06050', '#e0a030', '#50b860', '#4090d0',
  '#9060c0', '#d060a0', '#60b8b0', '#c08040',
  '#7090e0', '#b0b040', '#e07090', '#60c070',
];
