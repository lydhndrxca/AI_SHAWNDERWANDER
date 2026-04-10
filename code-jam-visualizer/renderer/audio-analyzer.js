// Krumhansl-Schmuckler key profiles (empirically derived)
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function pearsonCorrelation(a, b) {
  const n = a.length;
  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  return num / (Math.sqrt(denA) * Math.sqrt(denB) + 1e-10);
}

function rotateArray(arr, n) {
  const len = arr.length;
  const r = ((n % len) + len) % len;
  return [...arr.slice(r), ...arr.slice(0, r)];
}

function detectKey(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const data = audioBuffer.getChannelData(0);

  // Compute chroma vector from the full signal using DFT-based approach
  const chroma = new Float64Array(12);
  const fftSize = 8192;
  const hopSize = 4096;
  const numFrames = Math.floor((data.length - fftSize) / hopSize);

  for (let frame = 0; frame < numFrames; frame++) {
    const offset = frame * hopSize;
    // Simple magnitude spectrum via autocorrelation shortcut:
    // Map each FFT bin to its pitch class and accumulate energy
    const segment = data.slice(offset, offset + fftSize);

    // Apply Hann window
    const windowed = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      windowed[i] = segment[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / fftSize));
    }

    // Compute power spectrum using real FFT approximation
    // We'll use the frequency of each bin to map to chroma
    const real = new Float64Array(fftSize);
    const imag = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      real[i] = windowed[i];
    }
    simpleDFT(real, imag, fftSize);

    for (let k = 1; k < fftSize / 2; k++) {
      const freq = k * sampleRate / fftSize;
      if (freq < 60 || freq > 5000) continue;
      const magnitude = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      const midiNote = 12 * Math.log2(freq / 440) + 69;
      const pitchClass = Math.round(midiNote) % 12;
      if (pitchClass >= 0 && pitchClass < 12) {
        chroma[pitchClass] += magnitude * magnitude;
      }
    }
  }

  // Normalize chroma
  const maxChroma = Math.max(...chroma);
  if (maxChroma > 0) {
    for (let i = 0; i < 12; i++) chroma[i] /= maxChroma;
  }

  // Correlate with all 24 keys
  let bestKey = 'C';
  let bestMode = 'major';
  let bestCorr = -Infinity;

  for (let i = 0; i < 12; i++) {
    const rotated = Array.from(rotateArray(Array.from(chroma), i));
    const majCorr = pearsonCorrelation(rotated, MAJOR_PROFILE);
    const minCorr = pearsonCorrelation(rotated, MINOR_PROFILE);

    if (majCorr > bestCorr) {
      bestCorr = majCorr;
      bestKey = NOTE_NAMES[i];
      bestMode = 'major';
    }
    if (minCorr > bestCorr) {
      bestCorr = minCorr;
      bestKey = NOTE_NAMES[i];
      bestMode = 'minor';
    }
  }

  return { key: bestKey, mode: bestMode, confidence: bestCorr, chroma: Array.from(chroma) };
}

// Minimal in-place DFT for small-ish segments (we limit frame count to keep it fast)
function simpleDFT(real, imag, N) {
  // Use Cooley-Tukey FFT for power-of-2 sizes
  const bits = Math.log2(N);
  // Bit-reversal permutation
  for (let i = 0; i < N; i++) {
    let j = 0;
    for (let b = 0; b < bits; b++) {
      j = (j << 1) | ((i >> b) & 1);
    }
    if (j > i) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }
  // FFT butterfly
  for (let size = 2; size <= N; size *= 2) {
    const halfSize = size / 2;
    const angle = -2 * Math.PI / size;
    for (let i = 0; i < N; i += size) {
      for (let j = 0; j < halfSize; j++) {
        const cos = Math.cos(angle * j);
        const sin = Math.sin(angle * j);
        const tr = real[i + j + halfSize] * cos - imag[i + j + halfSize] * sin;
        const ti = real[i + j + halfSize] * sin + imag[i + j + halfSize] * cos;
        real[i + j + halfSize] = real[i + j] - tr;
        imag[i + j + halfSize] = imag[i + j] - ti;
        real[i + j] += tr;
        imag[i + j] += ti;
      }
    }
  }
}

function detectBPM(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const data = audioBuffer.getChannelData(0);

  // Onset detection via spectral flux
  const fftSize = 1024;
  const hopSize = 512;
  const numFrames = Math.floor((data.length - fftSize) / hopSize);

  const prevSpectrum = new Float64Array(fftSize / 2);
  const onsetStrength = [];

  for (let frame = 0; frame < numFrames; frame++) {
    const offset = frame * hopSize;
    const segment = data.slice(offset, offset + fftSize);

    const windowed = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      windowed[i] = segment[i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / fftSize));
    }

    const real = new Float64Array(fftSize);
    const imag = new Float64Array(fftSize);
    for (let i = 0; i < fftSize; i++) real[i] = windowed[i];
    simpleDFT(real, imag, fftSize);

    let flux = 0;
    for (let k = 0; k < fftSize / 2; k++) {
      const mag = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      const diff = mag - prevSpectrum[k];
      if (diff > 0) flux += diff;
      prevSpectrum[k] = mag;
    }
    onsetStrength.push(flux);
  }

  // Autocorrelation of onset strength for BPM
  const minBPM = 60;
  const maxBPM = 200;
  const framesPerSecond = sampleRate / hopSize;
  const minLag = Math.floor(framesPerSecond * 60 / maxBPM);
  const maxLag = Math.floor(framesPerSecond * 60 / minBPM);
  const maxSearchLen = Math.min(onsetStrength.length, maxLag * 4);

  let bestLag = minLag;
  let bestCorr = -Infinity;

  for (let lag = minLag; lag <= Math.min(maxLag, maxSearchLen); lag++) {
    let corr = 0;
    let count = 0;
    for (let i = 0; i < maxSearchLen - lag; i++) {
      corr += onsetStrength[i] * onsetStrength[i + lag];
      count++;
    }
    corr /= (count || 1);
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  const bpm = Math.round(60 * framesPerSecond / bestLag);
  return { bpm, confidence: bestCorr };
}

function extractEnergyProfile(audioBuffer, windowSeconds = 2) {
  const sampleRate = audioBuffer.sampleRate;
  const data = audioBuffer.getChannelData(0);
  const windowSamples = Math.floor(sampleRate * windowSeconds);
  const numWindows = Math.floor(data.length / windowSamples);
  const energy = [];

  for (let w = 0; w < numWindows; w++) {
    const offset = w * windowSamples;
    let rms = 0;
    for (let i = 0; i < windowSamples; i++) {
      rms += data[offset + i] * data[offset + i];
    }
    rms = Math.sqrt(rms / windowSamples);
    energy.push(rms);
  }

  // Normalize to 0-1
  const maxE = Math.max(...energy, 0.001);
  return energy.map(e => e / maxE);
}

let _analysisCtx = null;
function getAnalysisContext() {
  if (!_analysisCtx) _analysisCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _analysisCtx;
}

async function analyzeAudioFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = getAnalysisContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const bpmResult = detectBPM(audioBuffer);
  const keyResult = detectKey(audioBuffer);
  const energyProfile = extractEnergyProfile(audioBuffer);

  return {
    bpm: bpmResult.bpm,
    key: keyResult.key,
    mode: keyResult.mode,
    keyConfidence: keyResult.confidence,
    energyProfile,
    duration: audioBuffer.duration,
  };
}

module.exports = { analyzeAudioFile, detectBPM, detectKey, extractEnergyProfile };
