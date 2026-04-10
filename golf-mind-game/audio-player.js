// ─── Audio Player ───
// Plays voice lines alongside text rendering. Falls back gracefully if audio missing.

const AudioPlayer = {
  _cache: {},
  _current: null,
  _enabled: true,
  _volume: 0.8,
  _basePath: 'audio/generated/',

  init() {
    this._enabled = localStorage.getItem('gm_audio') !== 'off';
  },

  toggle() {
    this._enabled = !this._enabled;
    localStorage.setItem('gm_audio', this._enabled ? 'on' : 'off');
    if (!this._enabled) this.stop();
    return this._enabled;
  },

  setVolume(v) {
    this._volume = Math.max(0, Math.min(1, v));
    if (this._current) this._current.volume = this._volume;
  },

  _buildPath(voice, category, lineId) {
    return `${this._basePath}${voice}_${category}_${lineId}.mp3`;
  },

  async preload(voice, category, lineId) {
    const path = this._buildPath(voice, category, lineId);
    if (this._cache[path]) return;

    try {
      const audio = new Audio(path);
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });
      this._cache[path] = audio;
    } catch {
      // Audio file doesn't exist — silent fallback
    }
  },

  async play(voice, category, lineId) {
    if (!this._enabled) return;

    this.stop();

    const path = this._buildPath(voice, category, lineId);
    let audio = this._cache[path];

    if (!audio) {
      try {
        audio = new Audio(path);
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        this._cache[path] = audio;
      } catch {
        return;
      }
    }

    audio.currentTime = 0;
    audio.volume = this._volume;
    this._current = audio;

    try {
      await audio.play();
    } catch {
      // Autoplay blocked or missing file
    }
  },

  stop() {
    if (this._current) {
      this._current.pause();
      this._current.currentTime = 0;
      this._current = null;
    }
  },

  // Play a random ambient sound for a character
  async playAmbient(voice, lineIds) {
    if (!this._enabled || !lineIds || lineIds.length === 0) return;
    const id = lineIds[Math.floor(Math.random() * lineIds.length)];
    await this.play(voice, 'ambient_reactions', id);
  },

  // Play based on speaker type from dialogue system
  async playForSpeaker(speaker, lineId, category) {
    const voiceMap = {
      dave: 'dave',
      narrator: 'narrator',
      thought: 'inner_voice',
      you: 'inner_voice',
    };
    const voice = voiceMap[speaker];
    if (voice && lineId) {
      await this.play(voice, category || 'dialogue_tree_lines', lineId);
    }
  },
};
