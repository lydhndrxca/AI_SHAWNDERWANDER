// ─── Automation — record, playback, lanes, breakpoint editing ───

const Automation = {
  _lanes: [],
  _recording: false,
  _recordInterval: null,

  startRecording() {
    this._recording = true;
    Engine.automationRecording = true;
  },

  stopRecording() {
    this._recording = false;
    Engine.automationRecording = false;
  },

  isRecording() {
    return this._recording;
  },

  recordPoint(targetObj, paramName, value) {
    if (!this._recording || Engine.state !== 'playing') return;
    const time = Engine.getPlaybackTime();
    const laneKey = this._getLaneKey(targetObj, paramName);
    let lane = this._findLane(laneKey);
    if (!lane) {
      lane = this._createLane(laneKey, targetObj, paramName);
    }
    lane.points.push({ time, value });
    lane.points.sort((a, b) => a.time - b.time);
  },

  _getLaneKey(obj, param) {
    if (obj instanceof Track) return `track_${obj.id}_${param}`;
    if (obj.type) return `fx_${obj._trackId || 'unknown'}_${obj.type}_${param}`;
    return `unknown_${param}`;
  },

  _findLane(key) {
    return this._lanes.find(l => l.key === key);
  },

  _createLane(key, targetObj, paramName) {
    const lane = {
      key,
      target: targetObj,
      paramName,
      points: [],
      enabled: true,
    };
    this._lanes.push(lane);
    return lane;
  },

  playback(time) {
    for (const lane of this._lanes) {
      if (!lane.enabled || lane.points.length === 0) continue;
      const value = this._interpolate(lane.points, time);
      if (value !== null) {
        this._applyValue(lane.target, lane.paramName, value);
      }
    }
  },

  _interpolate(points, time) {
    if (points.length === 0) return null;
    if (time <= points[0].time) return points[0].value;
    if (time >= points[points.length - 1].time) return points[points.length - 1].value;

    for (let i = 0; i < points.length - 1; i++) {
      if (time >= points[i].time && time <= points[i + 1].time) {
        const t = (time - points[i].time) / (points[i + 1].time - points[i].time);
        return points[i].value + t * (points[i + 1].value - points[i].value);
      }
    }
    return null;
  },

  _applyValue(target, param, value) {
    if (target instanceof Track) {
      switch (param) {
        case 'volume': target.setVolume(value); break;
        case 'pan': target.setPan(value); break;
      }
    } else if (typeof target.setParam === 'function') {
      target.setParam(param, value);
    }
  },

  getLanesForTrack(trackId) {
    return this._lanes.filter(l => l.key.startsWith(`track_${trackId}`) || l.key.startsWith(`fx_${trackId}`));
  },

  clearLane(key) {
    const lane = this._findLane(key);
    if (lane) lane.points = [];
  },

  clearAll() {
    this._lanes = [];
  },

  drawLane(canvas, lane, duration, color = '#e0a030') {
    if (!lane || lane.points.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color + '10';
    ctx.fillRect(0, 0, w, h);

    const params = lane.target.getParams ? lane.target.getParams() : [];
    const paramDef = params.find(p => p.name === lane.paramName);
    const min = paramDef ? paramDef.min : 0;
    const max = paramDef ? paramDef.max : 1;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    for (let i = 0; i < lane.points.length; i++) {
      const pt = lane.points[i];
      const x = (pt.time / duration) * w;
      const y = h - ((pt.value - min) / (max - min)) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = color;
    for (const pt of lane.points) {
      const x = (pt.time / duration) * w;
      const y = h - ((pt.value - min) / (max - min)) * h;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  serialize() {
    return this._lanes.map(l => ({
      key: l.key,
      paramName: l.paramName,
      enabled: l.enabled,
      points: [...l.points],
    }));
  },

  deserialize(data, trackMap) {
    this._lanes = [];
    for (const ld of data) {
      const lane = { key: ld.key, paramName: ld.paramName, enabled: ld.enabled, points: ld.points, target: null };
      this._lanes.push(lane);
    }
  },
};
