// ─── File Menu — new, open, save, export ───

const FileMenu = {
  init() {
    document.getElementById('btn-new').addEventListener('click', () => this.newProject());
    document.getElementById('btn-open').addEventListener('click', () => this.openProject());
    document.getElementById('btn-save').addEventListener('click', () => this.saveProject());
    document.getElementById('btn-export').addEventListener('click', () => this.exportWav());
    document.getElementById('btn-import').addEventListener('click', () => this.importAudio());
  },

  newProject(skipConfirm = false) {
    if (!skipConfirm && Engine.tracks.length > 0 && !confirm('Start a new project? Unsaved changes will be lost.')) return false;
    Engine.stop();
    Automation.clearAll();
    while (Engine.tracks.length) Engine.removeTrack(Engine.tracks[0]);
    Timeline.render();
    MixerPanel.render();
    return true;
  },

  importAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.addEventListener('change', async () => {
      for (const file of input.files) {
        await DragDrop.handleFile(file);
      }
    });
    input.click();
  },

  async saveProject() {
    const project = {
      version: 1,
      bpm: Engine.bpm,
      masterVolume: Engine.masterGain.gain.value,
      loopEnabled: Engine.loopEnabled,
      loopStart: Engine.loopStart,
      loopEnd: Engine.loopEnd,
      tracks: [],
      automation: Automation.serialize(),
    };

    for (const track of Engine.tracks) {
      const td = track.serialize();
      if (track.buffer) {
        td.audioData = await this._bufferToBase64(track.buffer);
      }
      project.tracks.push(td);
    }

    const blob = new Blob([JSON.stringify(project)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'project.shawndermix';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  async openProject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.shawndermix';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;

      if (!this.newProject()) return;
      const text = await file.text();
      const project = JSON.parse(text);

      Engine.bpm = project.bpm || 120;
      Engine.setMasterVolume(project.masterVolume || 1);
      Engine.loopEnabled = project.loopEnabled || false;
      Engine.loopStart = project.loopStart || 0;
      Engine.loopEnd = project.loopEnd || 0;

      for (const td of project.tracks) {
        let buffer = null;
        if (td.audioData) {
          buffer = await this._base64ToBuffer(td.audioData);
        }
        const track = new Track(td.name, buffer);
        track.setVolume(td.volume);
        track.setPan(td.pan);
        track.setMute(td.muted);
        track.setSolo(td.soloed);
        for (const fxd of (td.effects || [])) {
          const fx = EffectsRegistry.create(fxd.type);
          fx._trackId = track.id;
          for (const [k, v] of Object.entries(fxd.params)) fx.setParam(k, v);
          track.addEffect(fx);
        }
        Engine.addTrack(track);
      }

      if (project.automation) {
        Automation.deserialize(project.automation);
      }

      Timeline.render();
      MixerPanel.render();
    });
    input.click();
  },

  async exportWav() {
    const statusEl = document.getElementById('status-bar');
    if (statusEl) statusEl.textContent = 'Exporting mix...';

    const blob = await Engine.exportWav();
    if (!blob) {
      if (statusEl) statusEl.textContent = 'Nothing to export — add some tracks first';
      return;
    }

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mix.wav';
    a.click();
    URL.revokeObjectURL(a.href);
    if (statusEl) statusEl.textContent = 'Export complete';
  },

  async _bufferToBase64(audioBuffer) {
    const wavBlob = Engine._audioBufferToWav(audioBuffer);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(wavBlob);
    });
  },

  async _base64ToBuffer(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return await Engine.ctx.decodeAudioData(bytes.buffer);
  },
};
