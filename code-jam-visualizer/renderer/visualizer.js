const THREE = require('three');
const Tone = require('tone');
const { startSong, stopSong, getMasterNode } = require('./song');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// ─── Shader loading ───
const vertSrc = fs.readFileSync(path.join(__dirname, 'shaders', 'passthrough.vert'), 'utf-8');
const fragSrc = fs.readFileSync(path.join(__dirname, 'shaders', 'plasma.frag'), 'utf-8');

// ─── State ───
let animId = null;
let analyser = null;
let freqData = null;
let smoothBass = 0, smoothMid = 0, smoothHigh = 0, smoothRMS = 0;
let mouseHasMoved = false;
let initialMousePos = null;

const MOUSE_DEAD_ZONE = 8;
const ATTACK = 0.35;
const RELEASE = 0.92;

// ─── FFT band boundaries (for fftSize=512 → 256 bins, sampleRate 44100) ───
function getBandAverages(data, sampleRate, fftSize) {
  const binCount = data.length;
  const binHz = sampleRate / fftSize;

  let bassSum = 0, bassN = 0;
  let midSum = 0, midN = 0;
  let highSum = 0, highN = 0;
  let rmsSum = 0;

  for (let i = 0; i < binCount; i++) {
    const freq = i * binHz;
    const val = (data[i] + 140) / 140; // normalize dB range [-140, 0] → [0, 1]
    const clamped = Math.max(0, Math.min(1, val));

    if (freq < 250) { bassSum += clamped; bassN++; }
    else if (freq < 2000) { midSum += clamped; midN++; }
    else if (freq < 16000) { highSum += clamped; highN++; }

    rmsSum += clamped * clamped;
  }

  return {
    bass: bassN > 0 ? bassSum / bassN : 0,
    mid: midN > 0 ? midSum / midN : 0,
    high: highN > 0 ? highSum / highN : 0,
    rms: Math.sqrt(rmsSum / binCount),
  };
}

function lerp(current, target, factor) {
  return current + (target - current) * factor;
}

function smoothValue(current, target) {
  if (target > current) return lerp(current, target, ATTACK);
  return lerp(current, target, 1 - RELEASE);
}

// ─── Three.js setup ───
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const spectrumWidth = 256;
const spectrumData = new Uint8Array(spectrumWidth * 4);
const spectrumTex = new THREE.DataTexture(spectrumData, spectrumWidth, 1, THREE.RGBAFormat);
spectrumTex.needsUpdate = true;

const uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  uBass: { value: 0 },
  uMid: { value: 0 },
  uHigh: { value: 0 },
  uRMS: { value: 0 },
  uSpectrum: { value: spectrumTex },
};

const material = new THREE.ShaderMaterial({
  vertexShader: vertSrc,
  fragmentShader: fragSrc,
  uniforms,
});

const plane = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(plane, material);
scene.add(mesh);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// ─── Audio analysis setup (called after startSong so masterGain exists) ───
function setupAnalyser() {
  const ctx = Tone.getContext().rawContext;
  analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.75;
  freqData = new Float32Array(analyser.frequencyBinCount);

  const master = getMasterNode();
  if (master) {
    Tone.connect(master, analyser);
  }
}

// ─── Animation loop ───
const clock = new THREE.Clock();

function animate() {
  animId = requestAnimationFrame(animate);

  if (analyser && freqData) {
    analyser.getFloatFrequencyData(freqData);
    const sampleRate = Tone.getContext().rawContext.sampleRate || 44100;
    const bands = getBandAverages(freqData, sampleRate, analyser.fftSize);

    smoothBass = smoothValue(smoothBass, bands.bass);
    smoothMid = smoothValue(smoothMid, bands.mid);
    smoothHigh = smoothValue(smoothHigh, bands.high);
    smoothRMS = smoothValue(smoothRMS, bands.rms);

    uniforms.uBass.value = smoothBass;
    uniforms.uMid.value = smoothMid;
    uniforms.uHigh.value = smoothHigh;
    uniforms.uRMS.value = smoothRMS;

    // Update spectrum texture
    const byteData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(byteData);
    for (let i = 0; i < spectrumWidth; i++) {
      const idx = i * 4;
      const val = i < byteData.length ? byteData[i] : 0;
      spectrumData[idx] = val;
      spectrumData[idx + 1] = val;
      spectrumData[idx + 2] = val;
      spectrumData[idx + 3] = 255;
    }
    spectrumTex.needsUpdate = true;
  }

  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}

// ─── Mouse exit (screensaver behavior) ───
function handleMouseMove(e) {
  if (!initialMousePos) {
    initialMousePos = { x: e.clientX, y: e.clientY };
    return;
  }

  const dx = e.clientX - initialMousePos.x;
  const dy = e.clientY - initialMousePos.y;

  if (Math.sqrt(dx * dx + dy * dy) > MOUSE_DEAD_ZONE && !mouseHasMoved) {
    mouseHasMoved = true;
    exitVisualizer();
  }
}

function exitVisualizer() {
  const overlay = document.getElementById('fade-overlay');
  overlay.classList.remove('transparent');

  setTimeout(() => {
    cleanup();
    ipcRenderer.send('stop-visualizer');
  }, 600);
}

function cleanup() {
  if (animId) cancelAnimationFrame(animId);
  stopSong();
  document.removeEventListener('mousemove', handleMouseMove);

  if (analyser) {
    try {
      const master = getMasterNode();
      if (master) Tone.disconnect(master, analyser);
    } catch (_) {}
    analyser = null;
  }

  renderer.dispose();
  material.dispose();
  plane.dispose();
  spectrumTex.dispose();
}

// ─── Boot ───
async function boot() {
  try {
    const config = await ipcRenderer.invoke('get-song-config');
    await startSong(config);
    setupAnalyser();
    animate();

    requestAnimationFrame(() => {
      document.getElementById('fade-overlay').classList.add('transparent');
    });

    setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
    }, 500);
  } catch (err) {
    console.error('Visualizer boot failed:', err);
  }
}

boot();
