// ─── Delay with Feedback ───

class DelayEffect {
  constructor(ctx) {
    this.ctx = ctx;

    this.dry = ctx.createGain();
    this.dry.gain.value = 1;

    this.wet = ctx.createGain();
    this.wet.gain.value = 0.35;

    this.delay = ctx.createDelay(5.0);
    this.delay.delayTime.value = 0.4;

    this.feedback = ctx.createGain();
    this.feedback.gain.value = 0.4;

    this._input = ctx.createGain();
    this._output = ctx.createGain();

    this._input.connect(this.dry);
    this._input.connect(this.delay);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.delay.connect(this.wet);
    this.dry.connect(this._output);
    this.wet.connect(this._output);

    this._inputNode = this._input;
    this._outputNode = this._output;
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
      { name: 'time', label: 'Time', min: 0.01, max: 2, value: this.delay.delayTime.value, unit: 's', step: 0.01 },
      { name: 'feedback', label: 'Feedback', min: 0, max: 0.95, value: this.feedback.gain.value, unit: '', step: 0.01 },
      { name: 'mix', label: 'Mix', min: 0, max: 1, value: this.wet.gain.value, unit: '', step: 0.01 },
    ];
  }

  setParam(name, value) {
    const t = this.ctx.currentTime;
    switch (name) {
      case 'time': this.delay.delayTime.setValueAtTime(value, t); break;
      case 'feedback': this.feedback.gain.setValueAtTime(value, t); break;
      case 'mix':
        this.wet.gain.setValueAtTime(value, t);
        this.dry.gain.setValueAtTime(1 - value, t);
        break;
    }
  }

  serializeParams() {
    return { time: this.delay.delayTime.value, feedback: this.feedback.gain.value, mix: this.wet.gain.value };
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

DelayEffect.LABEL = 'Delay';
EffectsRegistry.register('delay', DelayEffect);
