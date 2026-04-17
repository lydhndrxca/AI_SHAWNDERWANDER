// ─── Waveform Renderer — canvas-based, per-track ───

const Waveform = {
  draw(canvas, buffer, color = '#4090d0', zoom = 1, scrollX = 0) {
    if (!buffer) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const data = buffer.getChannelData(0);
    const totalSamples = data.length;
    const samplesPerPixel = Math.max(1, Math.floor(totalSamples / (w * zoom)));
    const startSample = Math.floor(scrollX * samplesPerPixel);
    const mid = h / 2;

    ctx.fillStyle = color + '18';
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.moveTo(0, mid);

    for (let px = 0; px < w; px++) {
      const sampleStart = startSample + px * samplesPerPixel;
      const sampleEnd = Math.min(sampleStart + samplesPerPixel, totalSamples);
      let min = 1, max = -1;
      for (let s = sampleStart; s < sampleEnd; s++) {
        if (s < 0 || s >= totalSamples) continue;
        const val = data[s];
        if (val < min) min = val;
        if (val > max) max = val;
      }
      const yMax = mid - max * mid;
      const yMin = mid - min * mid;
      ctx.lineTo(px, yMax);
    }

    for (let px = w - 1; px >= 0; px--) {
      const sampleStart = startSample + px * samplesPerPixel;
      const sampleEnd = Math.min(sampleStart + samplesPerPixel, totalSamples);
      let min = 1;
      for (let s = sampleStart; s < sampleEnd; s++) {
        if (s < 0 || s >= totalSamples) continue;
        if (data[s] < min) min = data[s];
      }
      ctx.lineTo(px, mid - min * mid);
    }

    ctx.closePath();
    ctx.fillStyle = color + '60';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Center line
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.strokeStyle = color + '30';
    ctx.lineWidth = 1;
    ctx.stroke();
  },

  drawMini(canvas, buffer, color = '#4090d0') {
    this.draw(canvas, buffer, color, 1, 0);
  },

  getPixelsPerSecond(canvas, buffer, zoom = 1) {
    if (!buffer || !canvas) return 100;
    const w = canvas.clientWidth;
    return (w * zoom) / buffer.duration;
  },

  timeToPixel(time, canvas, buffer, zoom = 1, scrollX = 0) {
    if (!buffer) return 0;
    const pps = this.getPixelsPerSecond(canvas, buffer, zoom);
    return time * pps - scrollX;
  },

  pixelToTime(px, canvas, buffer, zoom = 1, scrollX = 0) {
    if (!buffer) return 0;
    const pps = this.getPixelsPerSecond(canvas, buffer, zoom);
    return (px + scrollX) / pps;
  },
};
