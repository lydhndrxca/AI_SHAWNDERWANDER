// ─── Audio Engine — AudioContext, master bus, decode, export ───

const Engine = {
  ctx: null,
  masterGain: null,
  masterAnalyser: null,
  sampleRate: 44100,

  // Transport
  state: 'stopped', // stopped | playing | paused
  startTime: 0,     // ctx.currentTime when playback started
  pauseOffset: 0,   // how far into the mix we paused
  bpm: 120,
  loopEnabled: false,
  loopStart: 0,
  loopEnd: 0,
  automationRecording: false,

  tracks: [],

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: this.sampleRate });

    this.masterGain = this.ctx.createGain();
    this.masterAnalyser = this.ctx.createAnalyser();
    this.masterAnalyser.fftSize = 2048;
    this.masterAnalyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.ctx.destination);
  },

  getMasterOutput() {
    return this.masterGain;
  },

  async decodeFile(file) {
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    const arrayBuffer = await file.arrayBuffer();
    return await this.ctx.decodeAudioData(arrayBuffer);
  },

  getPlaybackTime() {
    if (this.state === 'stopped') return 0;
    if (this.state === 'paused') return this.pauseOffset;
    const t = this.ctx.currentTime - this.startTime + this.pauseOffset;
    if (this.loopEnabled && this.loopEnd > this.loopStart && t >= this.loopEnd) {
      this.stop();
      this.pauseOffset = this.loopStart;
      this.play();
      return this.loopStart;
    }
    return t;
  },

  play() {
    if (this.state === 'playing') return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const offset = this.pauseOffset;
    this.startTime = this.ctx.currentTime;
    this.state = 'playing';

    for (const track of this.tracks) {
      track.play(offset);
    }
  },

  pause() {
    if (this.state !== 'playing') return;
    this.pauseOffset = this.getPlaybackTime();
    this.state = 'paused';
    for (const track of this.tracks) track.stop();
  },

  stop() {
    this.state = 'stopped';
    this.pauseOffset = 0;
    for (const track of this.tracks) track.stop();
  },

  seek(time) {
    const wasPlaying = this.state === 'playing';
    if (wasPlaying) {
      for (const track of this.tracks) track.stop();
    }
    this.pauseOffset = Math.max(0, time);
    this.startTime = this.ctx.currentTime;
    if (wasPlaying) {
      for (const track of this.tracks) track.play(this.pauseOffset);
    }
  },

  getDuration() {
    let max = 0;
    for (const t of this.tracks) {
      if (t.buffer) max = Math.max(max, t.buffer.duration);
    }
    return max;
  },

  addTrack(track) {
    this.tracks.push(track);
    track.connectTo(this.masterGain);
  },

  removeTrack(track) {
    const idx = this.tracks.indexOf(track);
    if (idx !== -1) {
      track.stop();
      track.disconnect();
      this.tracks.splice(idx, 1);
    }
  },

  setMasterVolume(val) {
    this.masterGain.gain.setValueAtTime(val, this.ctx.currentTime);
  },

  async exportWav() {
    const duration = this.getDuration();
    if (duration === 0) return null;

    const offline = new OfflineAudioContext(2, Math.ceil(duration * this.sampleRate), this.sampleRate);
    const offlineMaster = offline.createGain();
    offlineMaster.gain.value = this.masterGain.gain.value;
    offlineMaster.connect(offline.destination);

    for (const track of this.tracks) {
      if (track.muted && !track.soloed) continue;
      const src = offline.createBufferSource();
      src.buffer = track.buffer;

      const gain = offline.createGain();
      gain.gain.value = track.gainNode.gain.value;

      const pan = offline.createStereoPanner();
      pan.pan.value = track.panNode.pan.value;

      src.connect(gain);
      gain.connect(pan);
      pan.connect(offlineMaster);
      src.start(0);
    }

    const rendered = await offline.startRendering();
    return this._audioBufferToWav(rendered);
  },

  _audioBufferToWav(buffer) {
    const numCh = buffer.numberOfChannels;
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numCh * bytesPerSample;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const arrayBuffer = new ArrayBuffer(headerSize + dataSize);
    const view = new DataView(arrayBuffer);

    const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numCh, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);

    const channels = [];
    for (let ch = 0; ch < numCh; ch++) channels.push(buffer.getChannelData(ch));

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numCh; ch++) {
        const sample = Math.max(-1, Math.min(1, channels[ch][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  },
};
