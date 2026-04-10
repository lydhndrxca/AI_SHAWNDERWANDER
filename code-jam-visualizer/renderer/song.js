const Tone = require('tone');

let synths = [];
let parts = [];
let masterGain = null;
let isPlaying = false;

// ─── Note/scale utilities ───

const ALL_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Intervals from root for common scales
const SCALE_INTERVALS = {
  minor:      [0, 2, 3, 5, 7, 8, 10],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  blues:      [0, 3, 5, 6, 7, 10],
  pentatonic: [0, 3, 5, 7, 10],
  major:      [0, 2, 4, 5, 7, 9, 11],
};

function noteIndex(noteName) {
  return ALL_NOTES.indexOf(noteName);
}

function scaleNotes(root, scaleType, octaveLow, octaveHigh) {
  const rootIdx = noteIndex(root);
  const intervals = SCALE_INTERVALS[scaleType] || SCALE_INTERVALS.minor;
  const notes = [];
  for (let oct = octaveLow; oct <= octaveHigh; oct++) {
    for (const interval of intervals) {
      const idx = (rootIdx + interval) % 12;
      notes.push(ALL_NOTES[idx] + oct);
    }
  }
  return notes;
}

function buildChordNotes(root, type, octave) {
  const r = noteIndex(root);
  const chordDefs = {
    'm7':   [0, 3, 7, 10],
    'm9':   [0, 3, 7, 10, 14],
    'dom7': [0, 4, 7, 10],
    '7#9':  [0, 4, 7, 10, 15],
    'dim7': [0, 3, 6, 9],
    'm11':  [0, 3, 7, 10, 14, 17],
    'maj7': [0, 4, 7, 11],
  };
  const intervals = chordDefs[type] || chordDefs['m7'];
  return intervals.map(semitones => {
    const noteIdx = (r + semitones) % 12;
    const oct = octave + Math.floor((r + semitones) / 12);
    return ALL_NOTES[noteIdx] + oct;
  });
}

// ─── ToeJam & Earl FM Synth Patches ───

function createFMSlapBass() {
  return new Tone.FMSynth({
    harmonicity: 3.01,
    modulationIndex: 12,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.2, sustain: 0.15, release: 0.15 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.1 },
  });
}

function createFMWahLead() {
  const synth = new Tone.FMSynth({
    harmonicity: 2,
    modulationIndex: 8,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.3 },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.2 },
  });
  return synth;
}

function createFMClavinet() {
  return new Tone.FMSynth({
    harmonicity: 5,
    modulationIndex: 15,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0.0, release: 0.08 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
  });
}

function createFMChordStab() {
  return new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3,
    modulationIndex: 6,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.003, decay: 0.2, sustain: 0.0, release: 0.1 },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 0.003, decay: 0.1, sustain: 0, release: 0.08 },
  });
}

// ─── Procedural Funk Generator ───

// ToeJam & Earl chord progressions (in scale degrees for minor/dorian)
const FUNK_PROGRESSIONS = [
  // i - iv - v - iv  (classic funk)
  [{ deg: 0, type: 'm7' }, { deg: 3, type: 'm7' }, { deg: 4, type: 'dom7' }, { deg: 3, type: 'm7' }],
  // i - bVII - iv - v
  [{ deg: 0, type: 'm9' }, { deg: 6, type: 'maj7' }, { deg: 3, type: 'm7' }, { deg: 4, type: 'dom7' }],
  // i - iv - bVII - i  (Herbie Hancock style)
  [{ deg: 0, type: 'm7' }, { deg: 3, type: 'm11' }, { deg: 6, type: 'dom7' }, { deg: 0, type: 'm9' }],
  // i - bIII - iv - v  (ToeJam Jammin')
  [{ deg: 0, type: 'm7' }, { deg: 2, type: 'maj7' }, { deg: 3, type: 'm7' }, { deg: 4, type: '7#9' }],
];

// Breakbeat-style drum patterns (each bar = array of events)
const DRUM_PATTERNS = [
  // Classic breakbeat
  { kick: [0, 0, 2.5, 0], snare: [0, 1, 0, 1], hihat: [0.5, 0.5, 0.5, 0.5], hatOpen: [0, 0, 0, 0.5] },
  // Funky variation
  { kick: [0, 0, 2, 0.5], snare: [0, 1, 0, 1], hihat: [0.5, 0.5, 0.5, 0.5], hatOpen: [0, 0.5, 0, 0] },
  // Laid-back hip-hop
  { kick: [0, 0, 2, 0], snare: [0, 1, 0, 1.5], hihat: [0.5, 0.5, 0.5, 0.5], hatOpen: [0.5, 0, 0.5, 0] },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBassLine(rootNote, scaleType, numBars) {
  const bassNotes = scaleNotes(rootNote, scaleType === 'major' ? 'major' : 'dorian', 1, 3);
  const rootOctave = 2;
  const events = [];

  for (let bar = 0; bar < numBars; bar++) {
    const root = rootNote + rootOctave;
    // Slap bass pattern: root on 1, ghost notes, chromatic approach, octave pops
    const patterns = [
      // Pattern A: root - ghost - fifth - chromatic approach
      [
        { time: `${bar}:0:0`, note: root, dur: '8n' },
        { time: `${bar}:0:3`, note: root, dur: '32n' },
        { time: `${bar}:1:0`, note: pickRandom(bassNotes), dur: '8n' },
        { time: `${bar}:1:2`, note: pickRandom(bassNotes), dur: '16n' },
        { time: `${bar}:2:0`, note: root, dur: '8n' },
        { time: `${bar}:2:2`, note: pickRandom(bassNotes), dur: '8n' },
        { time: `${bar}:3:0`, note: pickRandom(bassNotes), dur: '8n' },
        { time: `${bar}:3:2`, note: pickRandom(bassNotes), dur: '16n' },
        { time: `${bar}:3:3`, note: pickRandom(bassNotes), dur: '16n' },
      ],
      // Pattern B: syncopated slap
      [
        { time: `${bar}:0:0`, note: root, dur: '8n' },
        { time: `${bar}:0:2`, note: rootNote + (rootOctave + 1), dur: '32n' },
        { time: `${bar}:1:0`, note: pickRandom(bassNotes), dur: '16n' },
        { time: `${bar}:1:2`, note: root, dur: '8n' },
        { time: `${bar}:2:0`, note: pickRandom(bassNotes), dur: '8n' },
        { time: `${bar}:2:3`, note: root, dur: '16n' },
        { time: `${bar}:3:0`, note: pickRandom(bassNotes), dur: '8n' },
        { time: `${bar}:3:2`, note: pickRandom(bassNotes), dur: '16n' },
      ],
    ];
    events.push(...pickRandom(patterns));
  }
  return events;
}

function generateChordProgression(rootNote, mode, numBars) {
  const scale = SCALE_INTERVALS[mode === 'major' ? 'major' : 'minor'];
  const progression = pickRandom(FUNK_PROGRESSIONS);
  const events = [];

  for (let bar = 0; bar < numBars; bar++) {
    const chord = progression[bar % progression.length];
    const chordRoot = ALL_NOTES[(noteIndex(rootNote) + scale[chord.deg % scale.length]) % 12];
    const notes = buildChordNotes(chordRoot, chord.type, 4);

    // Offbeat stabs (classic funk guitar voicing rhythm)
    const stabPatterns = [
      [`${bar}:0:2`, `${bar}:1:2`, `${bar}:2:2`, `${bar}:3:2`],
      [`${bar}:0:2`, `${bar}:1:0`, `${bar}:2:2`, `${bar}:3:0`],
      [`${bar}:0:2`, `${bar}:1:2`, `${bar}:2:0`, `${bar}:3:2`],
    ];
    const pattern = pickRandom(stabPatterns);
    for (const time of pattern) {
      events.push({ time, notes: notes.slice(0, 4), dur: '16n' });
    }
  }
  return events;
}

function generateLeadMelody(rootNote, mode, numBars) {
  const melodyNotes = scaleNotes(rootNote, mode === 'major' ? 'pentatonic' : 'blues', 4, 6);
  const events = [];
  let prevIdx = Math.floor(melodyNotes.length / 2);

  for (let bar = 0; bar < numBars; bar++) {
    // Leave some bars empty for space (ToeJam & Earl has lots of breathing room)
    if (Math.random() < 0.3) continue;

    const numNotes = 3 + Math.floor(Math.random() * 5);
    const positions = [];
    for (let n = 0; n < numNotes; n++) {
      const beat = Math.floor(Math.random() * 4);
      const sub = Math.floor(Math.random() * 4);
      positions.push({ beat, sub });
    }
    positions.sort((a, b) => a.beat * 4 + a.sub - (b.beat * 4 + b.sub));

    for (const pos of positions) {
      // Stepwise or small interval motion
      const step = Math.floor(Math.random() * 5) - 2;
      prevIdx = Math.max(0, Math.min(melodyNotes.length - 1, prevIdx + step));
      const note = melodyNotes[prevIdx];
      const durs = ['16n', '8n', '8n', '8n.', '4n'];
      events.push({
        time: `${bar}:${pos.beat}:${pos.sub}`,
        note,
        dur: pickRandom(durs),
      });
    }
  }
  return events;
}

function generateDrumPattern(numBars) {
  const template = pickRandom(DRUM_PATTERNS);
  const events = [];

  for (let bar = 0; bar < numBars; bar++) {
    for (let beat = 0; beat < 4; beat++) {
      // Kick
      if (template.kick[beat] > 0) {
        events.push({ time: `${bar}:${beat}:0`, type: 'kick' });
      }
      if (template.kick[beat] > 1) {
        events.push({ time: `${bar}:${beat}:2`, type: 'kick' });
      }
      // Snare
      if (template.snare[beat] > 0) {
        events.push({ time: `${bar}:${beat}:0`, type: 'snare' });
      }
      if (template.snare[beat] > 1) {
        events.push({ time: `${bar}:${beat}:2`, type: 'snare' });
      }
      // Hi-hat (closed)
      for (let sub = 0; sub < 4; sub += 2) {
        events.push({ time: `${bar}:${beat}:${sub}`, type: 'hihat' });
      }
      // Open hi-hat
      if (template.hatOpen[beat] > 0) {
        events.push({ time: `${bar}:${beat}:2`, type: 'hatOpen' });
      }
      // Ghost snare for groove
      if (Math.random() < 0.2) {
        events.push({ time: `${bar}:${beat}:3`, type: 'ghostSnare' });
      }
    }
  }
  return events;
}

// ─── Main API ───

function getMasterNode() {
  return masterGain;
}

function createSynthEngine() {
  masterGain = new Tone.Gain(1);
  masterGain.toDestination();

  // --- Slap bass ---
  const bass = createFMSlapBass();
  const bassComp = new Tone.Compressor({ threshold: -20, ratio: 4, attack: 0.003, release: 0.1 });
  bass.chain(bassComp, masterGain);

  // --- Wah lead ---
  const lead = createFMWahLead();
  const autoFilter = new Tone.AutoFilter({ frequency: '4n', baseFrequency: 400, octaves: 4, wet: 0.7 }).start();
  const leadDelay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.15, wet: 0.12 });
  lead.chain(autoFilter, leadDelay, masterGain);

  // --- Chord stabs (clavinet-style) ---
  const chords = createFMChordStab();
  const chordFilter = new Tone.AutoFilter({ frequency: '2n', baseFrequency: 800, octaves: 3, wet: 0.5 }).start();
  const chordVol = new Tone.Volume(-6);
  chords.chain(chordFilter, chordVol, masterGain);

  // --- Kick (FM for that Genesis punch) ---
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.04,
    octaves: 5,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.15 },
  });
  kick.connect(masterGain);

  // --- Snare ---
  const snare = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.08 },
  });
  const snareFilter = new Tone.Filter({ frequency: 4500, type: 'bandpass' });
  const snareVol = new Tone.Volume(-4);
  snare.chain(snareFilter, snareVol, masterGain);

  // --- Ghost snare (quieter, higher) ---
  const ghostSnare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.04 },
  });
  const ghostFilter = new Tone.Filter({ frequency: 6000, type: 'bandpass' });
  const ghostVol = new Tone.Volume(-14);
  ghostSnare.chain(ghostFilter, ghostVol, masterGain);

  // --- Hi-hat ---
  const hihat = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
  });
  const hihatFilter = new Tone.Filter({ frequency: 9000, type: 'highpass' });
  const hihatVol = new Tone.Volume(-10);
  hihat.chain(hihatFilter, hihatVol, masterGain);

  // --- Open hi-hat ---
  const hatOpen = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0.05, release: 0.1 },
  });
  const hatOpenFilter = new Tone.Filter({ frequency: 7000, type: 'highpass' });
  const hatOpenVol = new Tone.Volume(-8);
  hatOpen.chain(hatOpenFilter, hatOpenVol, masterGain);

  const allSynths = [
    bass, bassComp, lead, autoFilter, leadDelay,
    chords, chordFilter, chordVol,
    kick, snare, snareFilter, snareVol,
    ghostSnare, ghostFilter, ghostVol,
    hihat, hihatFilter, hihatVol,
    hatOpen, hatOpenFilter, hatOpenVol,
    masterGain,
  ];
  synths = allSynths;

  return { bass, lead, chords, kick, snare, ghostSnare, hihat, hatOpen };
}

function buildParts(instruments, rootNote, mode, bpm, numBars) {
  const { bass, lead, chords, kick, snare, ghostSnare, hihat, hatOpen } = instruments;

  const bassEvents = generateBassLine(rootNote, mode, numBars);
  const bassPart = new Tone.Part((time, val) => {
    bass.triggerAttackRelease(val.note, val.dur, time);
  }, bassEvents);
  bassPart.loop = true;
  bassPart.loopEnd = `${numBars}:0:0`;

  const chordEvents = generateChordProgression(rootNote, mode, numBars);
  const chordPart = new Tone.Part((time, val) => {
    chords.triggerAttackRelease(val.notes, val.dur, time);
  }, chordEvents);
  chordPart.loop = true;
  chordPart.loopEnd = `${numBars}:0:0`;

  const leadEvents = generateLeadMelody(rootNote, mode, numBars);
  const leadPart = new Tone.Part((time, val) => {
    lead.triggerAttackRelease(val.note, val.dur, time);
  }, leadEvents);
  leadPart.loop = true;
  leadPart.loopEnd = `${numBars}:0:0`;

  const drumEvents = generateDrumPattern(numBars);
  const drumPart = new Tone.Part((time, val) => {
    switch (val.type) {
      case 'kick':
        kick.triggerAttackRelease('C1', '8n', time);
        break;
      case 'snare':
        snare.triggerAttackRelease('8n', time);
        break;
      case 'ghostSnare':
        ghostSnare.triggerAttackRelease('32n', time);
        break;
      case 'hihat':
        hihat.triggerAttackRelease('32n', time);
        break;
      case 'hatOpen':
        hatOpen.triggerAttackRelease('16n', time);
        break;
    }
  }, drumEvents);
  drumPart.loop = true;
  drumPart.loopEnd = `${numBars}:0:0`;

  parts = [bassPart, chordPart, leadPart, drumPart];
  return parts;
}

// Default config if no audio file is analyzed
const DEFAULT_CONFIG = { bpm: 98, key: 'C', mode: 'minor' };

async function startSong(config) {
  if (isPlaying) return;
  await Tone.start();

  const { bpm, key, mode } = config || DEFAULT_CONFIG;
  const numBars = 8;

  Tone.getTransport().bpm.value = bpm;
  Tone.getTransport().swing = 0.25;
  Tone.getTransport().swingSubdivision = '16n';

  const instruments = createSynthEngine();
  const allParts = buildParts(instruments, key, mode, bpm, numBars);

  allParts.forEach(p => p.start(0));
  Tone.getTransport().start();
  isPlaying = true;
}

function stopSong() {
  if (!isPlaying) return;
  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  parts.forEach(p => {
    p.stop();
    p.dispose();
  });
  parts = [];

  synths.forEach(s => {
    try { s.dispose(); } catch (_) {}
  });
  synths = [];
  masterGain = null;
  isPlaying = false;
}

module.exports = { startSong, stopSong, getMasterNode };
