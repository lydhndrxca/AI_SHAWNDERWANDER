// ─── SHAWNDERMIXER — Main App Bootstrap ───

const App = {
  init() {
    Engine.init();
    Timeline.init();
    MixerPanel.init();
    MixerPanel.render();
    Transport.init();
    FileMenu.init();
    DragDrop.init();
    StemSplit.init();
    this._setupKeyboard();
    Timeline.render();

    document.getElementById('status-bar').textContent = 'Ready — drag audio files onto the timeline or use File > Import';
  },

  _setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (Engine.state === 'playing') Engine.pause();
        else Engine.play();
        Transport._updateState();
      }

      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        FileMenu.saveProject();
      }

      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        FileMenu.openProject();
      }

      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        FileMenu.exportWav();
      }

      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        FileMenu.importAudio();
      }

      if (e.key === 'Home') {
        Engine.seek(0);
      }

      if (e.key === 'End') {
        Engine.seek(Engine.getDuration());
      }

      if (e.key === 'l' || e.key === 'L') {
        Engine.loopEnabled = !Engine.loopEnabled;
        Transport._updateState();
        Timeline.render();
      }

      if (e.key === 'r' || e.key === 'R') {
        if (Automation.isRecording()) {
          Automation.stopRecording();
        } else {
          Automation.startRecording();
          if (Engine.state !== 'playing') Engine.play();
        }
        Transport._updateState();
      }

      if (e.key === '+' || e.key === '=') {
        Timeline.setZoom(Timeline.zoom * 1.2);
      }
      if (e.key === '-' || e.key === '_') {
        Timeline.setZoom(Timeline.zoom / 1.2);
      }
    });
  },
};

window.addEventListener('DOMContentLoaded', () => App.init());
