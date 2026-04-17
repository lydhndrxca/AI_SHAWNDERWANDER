// ─── Timeline UI — scrollable, zoomable, playhead, loop region ───

const Timeline = {
  container: null,
  rulerCanvas: null,
  tracksContainer: null,
  playheadEl: null,
  loopRegionEl: null,
  zoom: 1,
  scrollX: 0,
  _animId: null,
  _isDraggingLoop: false,
  _loopDragStart: 0,

  init() {
    this.container = document.getElementById('timeline');
    this.rulerCanvas = document.getElementById('ruler-canvas');
    this.tracksContainer = document.getElementById('tracks-container');
    this.playheadEl = document.getElementById('playhead');
    this.loopRegionEl = document.getElementById('loop-region');

    this.rulerCanvas.addEventListener('click', (e) => this._onRulerClick(e));
    this.rulerCanvas.addEventListener('mousedown', (e) => this._onLoopDragStart(e));

    this.container.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom = Math.max(0.5, Math.min(50, this.zoom * delta));
        this.render();
      } else {
        this.scrollX = Math.max(0, this.scrollX + e.deltaX + e.deltaY);
        this.render();
      }
    }, { passive: false });

    this._startAnimation();
  },

  _startAnimation() {
    const tick = () => {
      this._updatePlayhead();
      if (Engine.state === 'playing') {
        Automation.playback(Engine.getPlaybackTime());
      }
      this._animId = requestAnimationFrame(tick);
    };
    tick();
  },

  render() {
    this._drawRuler();
    this._drawTracks();
    this._updateLoopRegion();
  },

  _drawRuler() {
    const canvas = this.rulerCanvas;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#1e1e22';
    ctx.fillRect(0, 0, w, h);

    const duration = Math.max(Engine.getDuration(), 60);
    const pps = (w * this.zoom) / duration;
    const step = this._niceStep(duration / (w / 80));

    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;

    for (let t = 0; t <= duration; t += step) {
      const x = t * pps - this.scrollX;
      if (x < -50 || x > w + 50) continue;

      ctx.beginPath();
      ctx.moveTo(x, h - 8);
      ctx.lineTo(x, h);
      ctx.stroke();

      const label = this._formatTime(t);
      ctx.fillText(label, x + 2, h - 12);
    }

    const halfStep = step / 2;
    ctx.strokeStyle = '#333';
    for (let t = halfStep; t <= duration; t += step) {
      const x = t * pps - this.scrollX;
      if (x < 0 || x > w) continue;
      ctx.beginPath();
      ctx.moveTo(x, h - 4);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
  },

  _drawTracks() {
    const existing = this.tracksContainer.querySelectorAll('.track-lane');
    const existingMap = {};
    existing.forEach(el => { existingMap[el.dataset.trackId] = el; });

    const emptyState = document.getElementById('empty-state');
    if (emptyState) emptyState.style.display = Engine.tracks.length === 0 ? '' : 'none';

    for (const track of Engine.tracks) {
      let lane = existingMap[track.id];
      if (!lane) {
        lane = this._createTrackLane(track);
        this.tracksContainer.appendChild(lane);
      }
      const canvas = lane.querySelector('.waveform-canvas');
      if (canvas) {
        Waveform.draw(canvas, track.buffer, track.color, this.zoom, this.scrollX);
      }
      delete existingMap[track.id];
    }

    for (const id in existingMap) existingMap[id].remove();
  },

  _createTrackLane(track) {
    const lane = document.createElement('div');
    lane.className = 'track-lane';
    lane.dataset.trackId = track.id;

    lane.innerHTML = `
      <div class="track-header">
        <div class="track-color" style="background:${track.color}"></div>
        <span class="track-name">${track.name}</span>
        <button class="btn-sm btn-remove-track" title="Remove">&times;</button>
      </div>
      <div class="track-waveform-wrap">
        <canvas class="waveform-canvas"></canvas>
      </div>
    `;

    lane.querySelector('.btn-remove-track').addEventListener('click', () => {
      Engine.removeTrack(track);
      lane.remove();
      MixerPanel.render();
    });

    const attachRename = (el) => {
      el.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.className = 'track-name-input';
        input.value = track.name;
        el.replaceWith(input);
        input.focus();
        const finish = () => {
          track.name = input.value || track.name;
          const newName = document.createElement('span');
          newName.className = 'track-name';
          newName.textContent = track.name;
          input.replaceWith(newName);
          attachRename(newName);
          MixerPanel.render();
        };
        input.addEventListener('blur', finish);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(); });
      });
    };
    attachRename(lane.querySelector('.track-name'));

    return lane;
  },

  _updatePlayhead() {
    if (!this.playheadEl) return;
    const time = Engine.getPlaybackTime();
    const duration = Math.max(Engine.getDuration(), 60);
    const w = this.container.clientWidth;
    const pps = (w * this.zoom) / duration;
    const x = time * pps - this.scrollX;
    this.playheadEl.style.left = x + 'px';
    this.playheadEl.style.display = (x >= 0 && x <= w) ? 'block' : 'none';

    const timeDisplay = document.getElementById('time-display');
    if (timeDisplay) timeDisplay.textContent = this._formatTime(time);
  },

  _updateLoopRegion() {
    if (!this.loopRegionEl) return;
    if (!Engine.loopEnabled || Engine.loopEnd <= Engine.loopStart) {
      this.loopRegionEl.style.display = 'none';
      return;
    }
    const duration = Math.max(Engine.getDuration(), 60);
    const w = this.container.clientWidth;
    const pps = (w * this.zoom) / duration;
    const x1 = Engine.loopStart * pps - this.scrollX;
    const x2 = Engine.loopEnd * pps - this.scrollX;
    this.loopRegionEl.style.left = x1 + 'px';
    this.loopRegionEl.style.width = (x2 - x1) + 'px';
    this.loopRegionEl.style.display = 'block';
  },

  _onRulerClick(e) {
    const rect = this.rulerCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left + this.scrollX;
    const duration = Math.max(Engine.getDuration(), 60);
    const pps = (this.rulerCanvas.clientWidth * this.zoom) / duration;
    Engine.seek(x / pps);
  },

  _onLoopDragStart(e) {
    if (!e.shiftKey) return;
    this._isDraggingLoop = true;
    const rect = this.rulerCanvas.getBoundingClientRect();
    const duration = Math.max(Engine.getDuration(), 60);
    const pps = (this.rulerCanvas.clientWidth * this.zoom) / duration;
    this._loopDragStart = (e.clientX - rect.left + this.scrollX) / pps;
    Engine.loopStart = this._loopDragStart;
    Engine.loopEnd = this._loopDragStart;

    const onMove = (ev) => {
      const x = (ev.clientX - rect.left + this.scrollX) / pps;
      Engine.loopStart = Math.min(this._loopDragStart, x);
      Engine.loopEnd = Math.max(this._loopDragStart, x);
      this._updateLoopRegion();
    };
    const onUp = () => {
      this._isDraggingLoop = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  },

  _niceStep(rough) {
    const steps = [0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300];
    for (const s of steps) if (s >= rough) return s;
    return 600;
  },

  _formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = (secs % 60).toFixed(1);
    return `${m}:${s.padStart(4, '0')}`;
  },

  setZoom(z) {
    this.zoom = Math.max(0.5, Math.min(50, z));
    this.render();
  },
};
