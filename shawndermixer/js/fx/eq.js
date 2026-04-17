// ─── 3-Band Parametric EQ ───

class EQEffect {
  constructor(ctx) {
    this.ctx = ctx;

    this.low = ctx.createBiquadFilter();
    this.low.type = 'lowshelf';
    this.low.frequency.value = 320;
    this.low.gain.value = 0;

    this.mid = ctx.createBiquadFilter();
    this.mid.type = 'peaking';
    this.mid.frequency.value = 1000;
    this.mid.Q.value = 1;
    this.mid.gain.value = 0;

    this.high = ctx.createBiquadFilter();
    this.high.type = 'highshelf';
    this.high.frequency.value = 3200;
    this.high.gain.value = 0;

    this.low.connect(this.mid);
    this.mid.connect(this.high);

    this._inputNode = this.low;
    this._outputNode = this.high;
  }

  connect(sourceNode) {
    sourceNode.connect(this._inputNode);
  }

  disconnect() {
    this._inputNode.disconnect();
    this._outputNode.disconnect();
    this.mid.disconnect();
  }

  getParams() {
    return [
      { name: 'lowGain', label: 'Low', min: -12, max: 12, value: this.low.gain.value, unit: 'dB', step: 0.5 },
      { name: 'midGain', label: 'Mid', min: -12, max: 12, value: this.mid.gain.value, unit: 'dB', step: 0.5 },
      { name: 'midFreq', label: 'Mid Freq', min: 200, max: 5000, value: this.mid.frequency.value, unit: 'Hz', step: 10 },
      { name: 'highGain', label: 'High', min: -12, max: 12, value: this.high.gain.value, unit: 'dB', step: 0.5 },
    ];
  }

  setParam(name, value) {
    const t = this.ctx.currentTime;
    switch (name) {
      case 'lowGain': this.low.gain.setValueAtTime(value, t); break;
      case 'midGain': this.mid.gain.setValueAtTime(value, t); break;
      case 'midFreq': this.mid.frequency.setValueAtTime(value, t); break;
      case 'highGain': this.high.gain.setValueAtTime(value, t); break;
    }
  }

  serializeParams() {
    return { lowGain: this.low.gain.value, midGain: this.mid.gain.value, midFreq: this.mid.frequency.value, highGain: this.high.gain.value };
  }

  getUI() {
    return this._buildUI();
  }

  _buildUI() {
    const div = document.createElement('div');
    div.className = 'fx-controls';
    for (const p of this.getParams()) {
      div.appendChild(this._knob(p));
    }
    return div;
  }

  _knob(param) {
    const wrap = document.createElement('div');
    wrap.className = 'fx-param';
    wrap.innerHTML = `<label>${param.label}</label><input type="range" min="${param.min}" max="${param.max}" step="${param.step}" value="${param.value}"><span class="fx-val">${param.value}${param.unit}</span>`;
    const input = wrap.querySelector('input');
    const span = wrap.querySelector('.fx-val');
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      this.setParam(param.name, v);
      span.textContent = `${v}${param.unit}`;
      if (Engine.automationRecording) Automation.recordPoint(this, param.name, v);
    });
    return wrap;
  }
}

EQEffect.LABEL = '3-Band EQ';
EffectsRegistry.register('eq', EQEffect);
