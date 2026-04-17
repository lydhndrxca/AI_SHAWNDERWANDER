// ─── Mixer Panel — channel strips, faders, knobs, meters ───

const MixerPanel = {
  container: null,
  _meterAnimId: null,

  init() {
    this.container = document.getElementById('mixer-panel');
    this._startMeters();
  },

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    for (const track of Engine.tracks) {
      this.container.appendChild(this._createStrip(track));
    }

    this.container.appendChild(this._createMasterStrip());
  },

  _createStrip(track) {
    const strip = document.createElement('div');
    strip.className = 'channel-strip';
    strip.dataset.trackId = track.id;
    strip.style.borderTopColor = track.color;

    strip.innerHTML = `
      <div class="strip-name" style="color:${track.color}">${track.name}</div>
      <div class="strip-fader-wrap">
        <div class="strip-meter"><div class="meter-fill"></div></div>
        <input type="range" class="fader" min="0" max="1.5" step="0.01" value="${track.volume}" orient="vertical">
        <span class="fader-label">${Math.round(track.volume * 100)}%</span>
      </div>
      <div class="strip-pan-wrap">
        <label>Pan</label>
        <input type="range" class="knob-pan" min="-1" max="1" step="0.01" value="${track.pan}">
        <span class="pan-label">${track.pan === 0 ? 'C' : (track.pan < 0 ? 'L' + Math.round(-track.pan * 100) : 'R' + Math.round(track.pan * 100))}</span>
      </div>
      <div class="strip-buttons">
        <button class="btn-mute ${track.muted ? 'active' : ''}">M</button>
        <button class="btn-solo ${track.soloed ? 'active' : ''}">S</button>
      </div>
      <div class="strip-fx">
        <button class="btn-add-fx">+ FX</button>
        <div class="fx-list"></div>
      </div>
    `;

    const fader = strip.querySelector('.fader');
    const faderLabel = strip.querySelector('.fader-label');
    fader.addEventListener('input', () => {
      const v = parseFloat(fader.value);
      track.setVolume(v);
      faderLabel.textContent = Math.round(v * 100) + '%';
      if (Engine.automationRecording) Automation.recordPoint(track, 'volume', v);
    });

    const panKnob = strip.querySelector('.knob-pan');
    const panLabel = strip.querySelector('.pan-label');
    panKnob.addEventListener('input', () => {
      const v = parseFloat(panKnob.value);
      track.setPan(v);
      panLabel.textContent = v === 0 ? 'C' : (v < 0 ? 'L' + Math.round(-v * 100) : 'R' + Math.round(v * 100));
      if (Engine.automationRecording) Automation.recordPoint(track, 'pan', v);
    });

    strip.querySelector('.btn-mute').addEventListener('click', (e) => {
      track.setMute(!track.muted);
      e.target.classList.toggle('active', track.muted);
    });

    strip.querySelector('.btn-solo').addEventListener('click', (e) => {
      track.setSolo(!track.soloed);
      e.target.classList.toggle('active', track.soloed);
    });

    const fxList = strip.querySelector('.fx-list');
    strip.querySelector('.btn-add-fx').addEventListener('click', () => {
      this._showFXMenu(track, fxList);
    });
    this._renderFXList(track, fxList);

    return strip;
  },

  _createMasterStrip() {
    const strip = document.createElement('div');
    strip.className = 'channel-strip master-strip';

    strip.innerHTML = `
      <div class="strip-name" style="color:#fff">MASTER</div>
      <div class="strip-fader-wrap">
        <div class="strip-meter"><div class="meter-fill"></div></div>
        <input type="range" class="fader" min="0" max="1.5" step="0.01" value="${Engine.masterGain.gain.value}" orient="vertical">
        <span class="fader-label">${Math.round(Engine.masterGain.gain.value * 100)}%</span>
      </div>
    `;

    const fader = strip.querySelector('.fader');
    const label = strip.querySelector('.fader-label');
    fader.addEventListener('input', () => {
      const v = parseFloat(fader.value);
      Engine.setMasterVolume(v);
      label.textContent = Math.round(v * 100) + '%';
    });

    return strip;
  },

  _showFXMenu(track, fxList) {
    const existing = document.querySelector('.fx-menu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.className = 'fx-menu';
    for (const type of EffectsRegistry.getTypes()) {
      const btn = document.createElement('button');
      btn.textContent = EffectsRegistry.getLabel(type);
      btn.addEventListener('click', () => {
        const fx = EffectsRegistry.create(type);
        fx._trackId = track.id;
        track.addEffect(fx);
        this._renderFXList(track, fxList);
        menu.remove();
      });
      menu.appendChild(btn);
    }
    fxList.parentElement.appendChild(menu);

    setTimeout(() => {
      const close = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); } };
      document.addEventListener('click', close);
    }, 0);
  },

  _renderFXList(track, fxList) {
    fxList.innerHTML = '';
    for (const fx of track.getEffects()) {
      const item = document.createElement('div');
      item.className = 'fx-item';

      const header = document.createElement('div');
      header.className = 'fx-item-header';
      header.innerHTML = `<span>${EffectsRegistry.getLabel(fx.type)}</span><button class="btn-remove-fx">&times;</button>`;
      item.appendChild(header);

      header.querySelector('.btn-remove-fx').addEventListener('click', () => {
        track.removeEffect(fx);
        item.remove();
      });

      const expanded = document.createElement('div');
      expanded.className = 'fx-expanded';
      expanded.style.display = 'none';
      expanded.appendChild(fx.getUI());
      item.appendChild(expanded);

      header.querySelector('span').addEventListener('click', () => {
        expanded.style.display = expanded.style.display === 'none' ? 'block' : 'none';
      });

      fxList.appendChild(item);
    }
  },

  _startMeters() {
    const tick = () => {
      if (!this.container) { this._meterAnimId = requestAnimationFrame(tick); return; }
      const strips = this.container.querySelectorAll('.channel-strip');
      for (const strip of strips) {
        const fill = strip.querySelector('.meter-fill');
        if (!fill) continue;
        const trackId = strip.dataset.trackId;
        let level = 0;
        if (strip.classList.contains('master-strip')) {
          const data = new Uint8Array(Engine.masterAnalyser.frequencyBinCount);
          Engine.masterAnalyser.getByteTimeDomainData(data);
          for (let i = 0; i < data.length; i++) level = Math.max(level, Math.abs((data[i] - 128) / 128));
        } else {
          const track = Engine.tracks.find(t => t.id == trackId);
          if (track) level = track.getPeakLevel();
        }
        const pct = Math.min(100, level * 100);
        fill.style.height = pct + '%';
        fill.classList.toggle('hot', pct > 85);
      }
      this._meterAnimId = requestAnimationFrame(tick);
    };
    tick();
  },
};
