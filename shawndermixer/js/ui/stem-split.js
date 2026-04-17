// ─── Stem Splitter — Demucs integration UI ───

const StemSplit = {
  _available: null,
  _modal: null,

  async init() {
    document.getElementById('btn-stems').addEventListener('click', () => this._openPicker());
    this._checkBackend();
  },

  async _checkBackend() {
    try {
      const res = await fetch('/api/stems/status');
      const data = await res.json();
      this._available = data.available;
      const btn = document.getElementById('btn-stems');
      if (!data.available) {
        btn.title = 'Stem separation unavailable — backend not running';
        btn.style.opacity = '0.4';
      }
    } catch {
      this._available = false;
      const btn = document.getElementById('btn-stems');
      btn.title = 'Stem server not running — use run.bat to start';
      btn.style.opacity = '0.4';
    }
  },

  _openPicker() {
    if (this._available === false) {
      const statusEl = document.getElementById('status-bar');
      if (statusEl) statusEl.textContent = 'Stem server not running — start with run.bat for stem splitting';
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.addEventListener('change', () => {
      if (input.files.length) this._startSeparation(input.files[0]);
    });
    input.click();
  },

  async _startSeparation(file) {
    this._showModal(file.name);
    const statusEl = document.getElementById('status-bar');

    try {
      if (statusEl) statusEl.textContent = `Splitting stems: ${file.name}...`;
      this._updateProgress('Uploading to Demucs...', 10);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/stems/separate', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      this._updateProgress('Separating stems on GPU...', 50);

      const data = await res.json();
      this._updateProgress('Loading stems into mixer...', 85);

      const stemColors = {
        vocals: '#e06090',
        drums: '#e0a030',
        bass: '#4090d0',
        other: '#50b860',
      };

      for (const stem of data.stems) {
        const stemRes = await fetch(stem.url);
        const blob = await stemRes.blob();
        const stemFile = new File([blob], `${stem.name}.wav`, { type: 'audio/wav' });
        const buffer = await Engine.decodeFile(stemFile);
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const track = new Track(`${baseName} — ${stem.name}`, buffer);
        if (stemColors[stem.name]) track.color = stemColors[stem.name];
        Engine.addTrack(track);
      }

      Timeline.render();
      MixerPanel.render();
      this._updateProgress('Done!', 100);

      if (statusEl) statusEl.textContent = `Stems loaded: ${data.stems.map(s => s.name).join(', ')}`;

      setTimeout(() => this._closeModal(), 800);

    } catch (err) {
      console.error('Stem separation failed:', err);
      this._updateProgress(`Error: ${err.message}`, 0);
      if (statusEl) statusEl.textContent = `Stem separation failed: ${err.message}`;
    }
  },

  _showModal(filename) {
    if (this._modal) this._modal.remove();

    const modal = document.createElement('div');
    modal.id = 'stem-modal';
    modal.innerHTML = `
      <div class="stem-modal-inner">
        <div class="stem-modal-title">SPLIT STEMS</div>
        <div class="stem-modal-file">${filename}</div>
        <div class="stem-progress-wrap">
          <div class="stem-progress-bar"><div class="stem-progress-fill"></div></div>
          <div class="stem-progress-text">Preparing...</div>
        </div>
        <div class="stem-stems-preview">
          <span class="stem-chip" style="--c:#e06090">Vocals</span>
          <span class="stem-chip" style="--c:#e0a030">Drums</span>
          <span class="stem-chip" style="--c:#4090d0">Bass</span>
          <span class="stem-chip" style="--c:#50b860">Other</span>
        </div>
        <button class="stem-cancel-btn" id="stem-cancel">Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
    this._modal = modal;

    document.getElementById('stem-cancel').addEventListener('click', () => this._closeModal());
  },

  _updateProgress(text, pct) {
    if (!this._modal) return;
    const fill = this._modal.querySelector('.stem-progress-fill');
    const label = this._modal.querySelector('.stem-progress-text');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = text;
  },

  _closeModal() {
    if (this._modal) {
      this._modal.remove();
      this._modal = null;
    }
  },
};
