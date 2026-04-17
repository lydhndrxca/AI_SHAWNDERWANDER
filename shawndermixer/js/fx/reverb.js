// ─── Convolution Reverb ───

class ReverbEffect {
  constructor(ctx) {
    this.ctx = ctx;

    this.dry = ctx.createGain();
    this.dry.gain.value = 1;

    this.wet = ctx.createGain();
    this.wet.gain.value = 0.3;

    this.convolver = ctx.createConvolver();
    this._merger = ctx.createGain();

    this.dry.connect(this._merger);
    this.wet.connect(this._merger);

    this._inputSplitter = ctx.createGain();
    this._inputSplitter.connect(this.dry);
    this._inputSplitter.connect(this.convolver);
    this.convolver.connect(this.wet);

    this._inputNode = this._inputSplitter;
    this._outputNode = this._merger;

    this._decay = 2;
    this._generateIR(this._decay);
  }

  _generateIR(decay) {
    const rate = this.ctx.sampleRate;
    const length = rate * decay;
    const ir = this.ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    this.convolver.buffer = ir;
  }

  connect(sourceNode) {
    sourceNode.connect(this._inputNode);
  }

  disconnect() {
    this._inputNode.disconnect();
    this._outputNode.disconnect();
  }

  getParams() {
    return [
      { name: 'mix', label: 'Mix', min: 0, max: 1, value: this.wet.gain.value, unit: '', step: 0.01 },
      { name: 'decay', label: 'Decay', min: 0.1, max: 6, value: this._decay, unit: 's', step: 0.1 },
    ];
  }

  setParam(name, value) {
    const t = this.ctx.currentTime;
    switch (name) {
      case 'mix':
        this.wet.gain.setValueAtTime(value, t);
        this.dry.gain.setValueAtTime(1 - value, t);
        break;
      case 'decay':
        this._decay = value;
        this._generateIR(value);
        break;
    }
  }

  serializeParams() {
    return { mix: this.wet.gain.value, decay: this._decay };
  }

  getUI() {
    const div = document.createElement('div');
    div.className = 'fx-controls';
    for (const p of this.getParams()) {
      const wrap = document.createElement('div');
      wrap.className = 'fx-param';
      wrap.innerHTML = `<label>${p.label}</label><input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}"><span class="fx-val">${Math.round(p.value * 100) / 100}${p.unit}</span>`;
      const input = wrap.querySelector('input');
      const span = wrap.querySelector('.fx-val');
      input.addEventListener('input', () => {
        const v = parseFloat(input.value);
        this.setParam(p.name, v);
        span.textContent = `${Math.round(v * 100) / 100}${p.unit}`;
        if (Engine.automationRecording) Automation.recordPoint(this, p.name, v);
      });
      div.appendChild(wrap);
    }
    return div;
  }
}

ReverbEffect.LABEL = 'Reverb';
EffectsRegistry.register('reverb', ReverbEffect);
