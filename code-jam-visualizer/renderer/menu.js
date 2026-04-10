const { ipcRenderer } = require('electron');
const { analyzeAudioFile } = require('./audio-analyzer');

let analysisResult = null;

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const analysisInfo = document.getElementById('analysis-info');
const loadingIndicator = document.getElementById('loading-indicator');
const infoKey = document.getElementById('info-key');
const infoBpm = document.getElementById('info-bpm');
const infoStatus = document.getElementById('info-status');
const btnPlay = document.getElementById('btn-play');
const btnDefault = document.getElementById('btn-default');
const btnQuit = document.getElementById('btn-quit');

btnPlay.disabled = true;

// --- File loading ---

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('audio/')) {
    handleFile(file);
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

async function handleFile(file) {
  const dropText = dropZone.querySelector('.drop-text');
  const dropHint = dropZone.querySelector('.drop-hint');
  dropText.textContent = file.name;
  dropHint.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB`;

  loadingIndicator.classList.remove('hidden');
  analysisInfo.classList.add('hidden');
  btnPlay.disabled = true;

  try {
    analysisResult = await analyzeAudioFile(file);

    infoKey.textContent = `${analysisResult.key} ${analysisResult.mode.toUpperCase()}`;
    infoBpm.textContent = `${analysisResult.bpm}`;
    infoStatus.textContent = 'FUNKIFIED';

    analysisInfo.classList.remove('hidden');
    loadingIndicator.classList.add('hidden');
    dropZone.classList.add('loaded');
    btnPlay.disabled = false;
  } catch (err) {
    console.error('Analysis failed:', err);
    infoStatus.textContent = 'ANALYSIS FAILED';
    analysisInfo.classList.remove('hidden');
    loadingIndicator.classList.add('hidden');
  }
}

// --- Play buttons ---

btnPlay.addEventListener('click', () => {
  if (!analysisResult) return;
  const config = {
    bpm: analysisResult.bpm,
    key: analysisResult.key,
    mode: analysisResult.mode,
  };
  ipcRenderer.send('start-visualizer', config);
});

btnDefault.addEventListener('click', () => {
  ipcRenderer.send('start-visualizer', null);
});

btnQuit.addEventListener('click', () => {
  ipcRenderer.send('quit-app');
});
