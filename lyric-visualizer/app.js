// ─── Background Canvas — slow-moving water/ink particles ───

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;
let startTime = 0;
let timeouts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.15 + 0.03;
    this.hue = 200 + Math.random() * 30;
    this.life = 0;
    this.maxLife = 300 + Math.random() * 500;
  }

  update(phase) {
    this.life++;

    let swirlStrength = 0;
    if (phase === 'swirl') {
      const dx = this.x - canvas.width / 2;
      const dy = this.y - canvas.height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      swirlStrength = Math.max(0, 1 - dist / 400) * 0.8;
      this.speedX += Math.cos(angle + Math.PI / 2) * swirlStrength * 0.1;
      this.speedY += Math.sin(angle + Math.PI / 2) * swirlStrength * 0.1;
      this.speedX += -dx * 0.0001;
      this.speedY += -dy * 0.0001;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.speedX *= 0.998;
    this.speedY *= 0.998;

    if (this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10 ||
        this.life > this.maxLife) {
      this.reset();
    }
  }

  draw() {
    const fade = 1 - Math.max(0, (this.life - this.maxLife * 0.7)) / (this.maxLife * 0.3);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 30%, 50%, ${this.opacity * Math.max(0, fade)})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) {
  particles.push(new Particle());
}

let bgPhase = 'idle';

function animateBg() {
  ctx.fillStyle = 'rgba(10, 10, 12, 0.06)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.update(bgPhase);
    p.draw();
  }
  animFrame = requestAnimationFrame(animateBg);
}
animateBg();

// ─── Sequencer ───

const stage = document.getElementById('stage');
const btnPlay = document.getElementById('btn-play');
const btnRestart = document.getElementById('btn-restart');
let currentEl = null;

function showLine(entry) {
  if (entry.effect === 'pause') return;

  if (currentEl) {
    currentEl.classList.add('exiting');
    const old = currentEl;
    setTimeout(() => old.remove(), 800);
  }

  const el = document.createElement('div');
  stage.appendChild(el);
  currentEl = el;

  const effectFn = Effects[entry.effect];
  if (effectFn) {
    effectFn(el, entry.text, entry.duration);
  } else {
    el.className = 'line';
    el.textContent = entry.text;
  }

  if (entry.effect === 'vortex' || entry.effect === 'vortexFinal' ||
      entry.effect === 'spiral' || entry.effect === 'drain') {
    bgPhase = 'swirl';
    setTimeout(() => { bgPhase = 'idle'; }, entry.duration);
  }
}

function play() {
  btnPlay.style.display = 'none';
  btnRestart.style.display = 'inline-block';
  startTime = performance.now();

  for (const entry of LYRICS) {
    const t = setTimeout(() => showLine(entry), entry.delay);
    timeouts.push(t);
  }

  const lastEntry = LYRICS[LYRICS.length - 1];
  const totalDur = lastEntry.delay + lastEntry.duration + 2000;
  timeouts.push(setTimeout(() => {
    if (currentEl) {
      currentEl.classList.add('exiting');
      setTimeout(() => { if (currentEl) currentEl.remove(); }, 800);
    }
  }, totalDur));
}

function restart() {
  for (const t of timeouts) clearTimeout(t);
  timeouts = [];
  stage.innerHTML = '';
  currentEl = null;
  bgPhase = 'idle';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  play();
}

btnPlay.addEventListener('click', play);
btnRestart.addEventListener('click', restart);
