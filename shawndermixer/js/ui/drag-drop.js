// ─── Drag and Drop File Import ───

const DragDrop = {
  init() {
    const dropZone = document.getElementById('timeline');
    const overlay = document.getElementById('drop-overlay');

    ['dragenter', 'dragover'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (overlay) overlay.classList.add('visible');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (overlay) overlay.classList.remove('visible');
      });
    });

    dropZone.addEventListener('drop', async (e) => {
      const files = e.dataTransfer.files;
      for (const file of files) {
        if (file.type.startsWith('audio/') || /\.(wav|mp3|ogg|flac|aac|aiff|m4a|wma)$/i.test(file.name)) {
          await this.handleFile(file);
        }
      }
    });

    // Also handle body-level drops so user can drop anywhere
    document.body.addEventListener('dragover', (e) => e.preventDefault());
    document.body.addEventListener('drop', async (e) => {
      e.preventDefault();
      if (overlay) overlay.classList.remove('visible');
      const files = e.dataTransfer.files;
      for (const file of files) {
        if (file.type.startsWith('audio/') || /\.(wav|mp3|ogg|flac|aac|aiff|m4a|wma)$/i.test(file.name)) {
          await this.handleFile(file);
        }
      }
    });
  },

  async handleFile(file) {
    const statusEl = document.getElementById('status-bar');
    try {
      if (statusEl) statusEl.textContent = `Loading ${file.name}...`;
      const buffer = await Engine.decodeFile(file);
      const name = file.name.replace(/\.[^.]+$/, '');
      const track = new Track(name, buffer);
      Engine.addTrack(track);
      Timeline.render();
      MixerPanel.render();
      if (statusEl) statusEl.textContent = `Added track: ${name}`;
    } catch (err) {
      console.error('Failed to decode:', err);
      if (statusEl) statusEl.textContent = `Failed to load ${file.name}`;
    }
  },
};
