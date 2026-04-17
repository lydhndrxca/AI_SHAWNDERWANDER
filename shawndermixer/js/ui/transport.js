// ─── Transport Controls ───

const Transport = {
  init() {
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnStop = document.getElementById('btn-stop');
    const btnRecord = document.getElementById('btn-record');
    const btnLoop = document.getElementById('btn-loop');
    const masterVol = document.getElementById('master-volume');
    const bpmInput = document.getElementById('bpm-input');

    btnPlay.addEventListener('click', () => {
      Engine.play();
      this._updateState();
    });

    btnPause.addEventListener('click', () => {
      Engine.pause();
      this._updateState();
    });

    btnStop.addEventListener('click', () => {
      Engine.stop();
      Automation.stopRecording();
      this._updateState();
    });

    btnRecord.addEventListener('click', () => {
      if (Automation.isRecording()) {
        Automation.stopRecording();
      } else {
        Automation.startRecording();
        if (Engine.state !== 'playing') Engine.play();
      }
      this._updateState();
    });

    btnLoop.addEventListener('click', () => {
      Engine.loopEnabled = !Engine.loopEnabled;
      this._updateState();
      Timeline.render();
    });

    if (masterVol) {
      masterVol.addEventListener('input', () => {
        Engine.setMasterVolume(parseFloat(masterVol.value));
      });
    }

    if (bpmInput) {
      bpmInput.addEventListener('change', () => {
        Engine.bpm = parseInt(bpmInput.value) || 120;
      });
    }
  },

  _updateState() {
    const btnPlay = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnRecord = document.getElementById('btn-record');
    const btnLoop = document.getElementById('btn-loop');

    btnPlay.classList.toggle('active', Engine.state === 'playing');
    btnPause.classList.toggle('active', Engine.state === 'paused');
    btnRecord.classList.toggle('active', Automation.isRecording());
    btnLoop.classList.toggle('active', Engine.loopEnabled);
  },
};
