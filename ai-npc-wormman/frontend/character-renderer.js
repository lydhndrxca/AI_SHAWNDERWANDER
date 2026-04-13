// ─── Character Renderer — Canvas-based animated Worm Man ───

const CharacterRenderer = {
  canvas: null,
  ctx: null,
  image: null,
  imageLoaded: false,

  // State
  speaking: false,
  mouthState: 0,       // 0=closed, 1=barely, 2=open, 3=wide, 4=very wide
  expression: 'neutral',
  blinkTimer: 0,
  blinkDuration: 0,
  isBlinking: false,
  idlePhase: 0,
  headBobPhase: 0,
  breathPhase: 0,
  lastFrameTime: 0,
  emotionPulse: 0,

  // Mouth region (relative to drawn image bounds — tuned to the action figure)
  // These define where on the character's face the mouth overlay is drawn
  mouth: {
    cx: 0.475,   // center X as fraction of image width
    cy: 0.325,   // center Y as fraction of image height
    w:  0.075,   // width as fraction of image width
    h:  0.018,   // height as fraction of image height (rest state)
  },

  // Eye regions for blink overlay
  eyes: {
    left:  { cx: 0.425, cy: 0.275, r: 0.028 },
    right: { cx: 0.530, cy: 0.270, r: 0.028 },
  },

  // Colors sampled from the figure
  skinColor: '#d4712a',
  skinDark: '#b35818',
  mouthInterior: '#1a0a00',
  mouthDark: '#3d1a08',

  init(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.image = new Image();
    this.image.onload = () => {
      this.imageLoaded = true;
      this._resize();
    };
    this.image.src = '/assets/wormman.png';

    window.addEventListener('resize', () => this._resize());
    this.lastFrameTime = performance.now();
    this._loop();
  },

  _resize() {
    const container = this.canvas.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight || w;
    this.canvas.width = w * devicePixelRatio;
    this.canvas.height = h * devicePixelRatio;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  },

  // ─── Main render loop ───

  _loop() {
    const now = performance.now();
    const dt = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    this._update(dt);
    this._draw();

    requestAnimationFrame(() => this._loop());
  },

  _update(dt) {
    // Idle sway
    this.idlePhase += dt * 0.6;
    this.breathPhase += dt * 1.2;

    // Head bob when speaking
    if (this.speaking) {
      this.headBobPhase += dt * 8;
    } else {
      this.headBobPhase *= 0.95;
    }

    // Emotion pulse decay
    if (this.emotionPulse > 0) {
      this.emotionPulse = Math.max(0, this.emotionPulse - dt * 2);
    }

    // Blink logic
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0 && !this.isBlinking) {
      this.isBlinking = true;
      this.blinkDuration = 0.12 + Math.random() * 0.08;
      this.blinkTimer = this.blinkDuration;
    }
    if (this.isBlinking) {
      this.blinkTimer -= dt;
      if (this.blinkTimer <= -0.05) {
        this.isBlinking = false;
        this.blinkTimer = 2.5 + Math.random() * 4;
      }
    }

    // Get mouth state from audio sync
    if (this.speaking && typeof AudioSync !== 'undefined') {
      this.mouthState = AudioSync.getMouthState();
    } else if (!this.speaking) {
      this.mouthState = Math.max(0, this.mouthState - 0.3);
    }
  },

  _draw() {
    const ctx = this.ctx;
    const cw = this.canvas.width / devicePixelRatio;
    const ch = this.canvas.height / devicePixelRatio;

    // Black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);

    if (!this.imageLoaded) return;

    // Calculate image drawing bounds (fit to canvas, centered)
    const imgAspect = this.image.width / this.image.height;
    const canvasAspect = cw / ch;
    let drawW, drawH, drawX, drawY;

    if (imgAspect < canvasAspect) {
      drawH = ch * 0.95;
      drawW = drawH * imgAspect;
    } else {
      drawW = cw * 0.95;
      drawH = drawW / imgAspect;
    }
    drawX = (cw - drawW) / 2;
    drawY = (ch - drawH) / 2;

    ctx.save();

    // ─── Idle transforms ───
    const sway = Math.sin(this.idlePhase) * 1.2;
    const breathScale = 1 + Math.sin(this.breathPhase) * 0.004;
    const headBob = this.speaking ? Math.sin(this.headBobPhase) * 1.5 : 0;
    const emotionScale = 1 + this.emotionPulse * 0.02;

    // Apply transforms from center of character
    const centerX = drawX + drawW / 2;
    const centerY = drawY + drawH / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((sway + headBob) * Math.PI / 180);
    ctx.scale(breathScale * emotionScale, breathScale * emotionScale);
    ctx.translate(-centerX, -centerY);

    // Draw the character image
    ctx.drawImage(this.image, drawX, drawY, drawW, drawH);

    // ─── Mouth overlay ───
    if (this.mouthState > 0.1) {
      this._drawMouth(ctx, drawX, drawY, drawW, drawH);
    }

    // ─── Blink overlay ───
    if (this.isBlinking && this.blinkTimer > -0.03) {
      this._drawBlink(ctx, drawX, drawY, drawW, drawH);
    }

    ctx.restore();

    // Scanline effect
    this._drawScanlines(ctx, cw, ch);
  },

  _drawMouth(ctx, dx, dy, dw, dh) {
    const m = this.mouth;
    const cx = dx + dw * m.cx;
    const cy = dy + dh * m.cy;
    const baseW = dw * m.w;
    const baseH = dh * m.h;

    // Scale mouth opening based on state (0-4)
    const openness = typeof this.mouthState === 'number' ? this.mouthState : 0;
    const openH = baseH * (1 + openness * 1.8);
    const openW = baseW * (1 + openness * 0.15);

    // Mouth shapes vary by state
    ctx.save();
    ctx.translate(cx, cy);

    // Dark interior
    ctx.beginPath();
    if (openness >= 3.5) {
      // Very wide — more rectangular/oval
      this._roundedRect(ctx, -openW / 2, -openH / 2, openW, openH, openH * 0.35);
    } else {
      ctx.ellipse(0, 0, openW / 2, openH / 2, 0, 0, Math.PI * 2);
    }
    ctx.fillStyle = this.mouthInterior;
    ctx.fill();

    // Subtle inner glow
    const grad = ctx.createRadialGradient(0, -openH * 0.2, 0, 0, 0, openW * 0.5);
    grad.addColorStop(0, this.mouthDark);
    grad.addColorStop(1, this.mouthInterior);
    ctx.fillStyle = grad;
    ctx.fill();

    // Lip border (skin-colored edge)
    ctx.strokeStyle = this.skinDark;
    ctx.lineWidth = Math.max(1, dw * 0.005);
    ctx.stroke();

    // Upper teeth hint when wide open
    if (openness >= 2.5) {
      ctx.fillStyle = '#e8ddd0';
      const teethH = openH * 0.15;
      ctx.fillRect(-openW * 0.3, -openH / 2 + 1, openW * 0.6, teethH);
    }

    ctx.restore();
  },

  _drawBlink(ctx, dx, dy, dw, dh) {
    const e = this.eyes;
    ctx.fillStyle = this.skinColor;

    // Left eye
    const lx = dx + dw * e.left.cx;
    const ly = dy + dh * e.left.cy;
    const lr = dw * e.left.r;
    ctx.beginPath();
    ctx.ellipse(lx, ly, lr, lr * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    const rx = dx + dw * e.right.cx;
    const ry = dy + dh * e.right.cy;
    const rr = dw * e.right.r;
    ctx.beginPath();
    ctx.ellipse(rx, ry, rr, rr * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  _drawScanlines(ctx, cw, ch) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < ch; y += 3) {
      ctx.fillRect(0, y, cw, 1);
    }
  },

  _roundedRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  // ─── Public API ───

  startSpeaking() {
    this.speaking = true;
  },

  stopSpeaking() {
    this.speaking = false;
    this.mouthState = 0;
  },

  triggerEmotion(type) {
    this.emotionPulse = 1;
    this.expression = type || 'excited';
  },
};
