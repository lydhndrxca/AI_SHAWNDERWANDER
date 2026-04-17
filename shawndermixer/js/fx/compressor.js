// ─── Compressor ───

class CompressorEffect {
  constructor(ctx) {
    this.ctx = ctx;

    this.compressor = ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    this.makeup = ctx.createGain();
    this.makeup.gain.value = 1;

    this.compressor.connect(this.makeup);

    this._inputNode = this.compressor;
    this._outputNode = this.makeup;
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
      { name: 'threshold', label: 'Threshold', min: -60, max: 0, value: this.compressor.threshold.value, unit: 'dB', step: 1 },
      { name: 'knee', label: 'Knee', min: 0, max: 40, value: this.compressor.knee.value, unit: 'dB', step: 1 },
      { name: 'ratio', label: 'Ratio', min: 1, max: 20, value: this.compressor.ratio.value, unit: ':1', step: 0.5 },
      { name: 'attack', label: 'Attack', min: 0, max: 1, value: this.compressor.attack.value, unit: 's', step: 0.001 },
      { name: 'release', label: 'Release', min: 0.01, max: 1, value: this.compressor.release.value, unit: 's', step: 0.01 },
      { name: 'makeup', label: 'Makeup', min: 0, max: 4, value: this.makeup.gain.value, unit: 'x', step: 0.1 },
    ];
  }

  setParam(name, value) {
    const t = this.ctx.currentTime;
    switch (name) {
      case 'threshold': this.compressor.threshold.setValueAtTime(value, t); break;
      case 'knee': this.compressor.knee.setValueAtTime(value, t); break;
      case 'ratio': this.compressor.ratio.setValueAtTime(value, t); break;
      case 'attack': this.compressor.attack.setValueAtTime(value, t); break;
      case 'release': this.compressor.release.setValueAtTime(value, t); break;
      case 'makeup': this.makeup.gain.setValueAtTime(value, t); break;
    }
  }

  serializeParams() {
    const c = this.compressor;
    return {
      threshold: c.threshold.value, knee: c.knee.value, ratio: c.ratio.value,
      attack: c.attack.value, release: c.release.value, makeup: this.makeup.gain.value,
    };
  }

  getUI() {
    const div = document.createElement('div');
    div.className = 'fx-controls';
    for (const p of this.getParams()) {
      const wrap = document.createElement('div');
      wrap.className = 'fx-param';
      wrap.innerHTML = `<label>${p.label}</label><input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}"><span class="fx-val">${Math.round(p.value * 1000) / 1000}${p.unit}</span>`;
      const input = wrap.querySelector('input');
      const span = wrap.querySelector('.fx-val');
      input.addEventListener('input', () => {
        const v = parseFloat(input.value);
        this.setParam(p.name, v);
        span.textContent = `${Math.round(v * 1000) / 1000}${p.unit}`;
        if (Engine.automationRecording) Automation.recordPoint(this, p.name, v);
      });
      div.appendChild(wrap);
    }

    const reductionBar = document.createElement('div');
    reductionBar.className = 'fx-param';
    reductionBar.innerHTML = '<label>GR</label><div class="gr-meter"><div class="gr-bar"></div></div>';
    div.appendChild(reductionBar);
    const grBar = reductionBar.querySelector('.gr-bar');

    const updateGR = () => {
      const reduction = this.compressor.reduction;
      const pct = Math.min(100, Math.abs(reduction) * 2.5);
      grBar.style.width = pct + '%';
      requestAnimationFrame(updateGR);
    };
    updateGR();

    return div;
  }
}

CompressorEffect.LABEL = 'Compressor';
EffectsRegistry.register('compressor', CompressorEffect);
