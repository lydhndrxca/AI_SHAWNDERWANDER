// ─── Pixel Perfect — Game Engine ───

const Game = {
  currentLevel: 0,
  placedComponents: [],
  grid: { cols: 12, rows: 20, cellW: 0, cellH: 0 },
  dragging: null,
  ghost: null,
  canvasRect: null,
  gridEl: null,

  init() {
    document.getElementById('btn-start').addEventListener('click', () => this.startGame());
    document.getElementById('btn-next').addEventListener('click', () => this.nextLevel());
    document.getElementById('btn-check').addEventListener('click', () => this.submitDesign());
    document.getElementById('btn-clear').addEventListener('click', () => this.clearCanvas());
    document.getElementById('btn-brief').addEventListener('click', () => this.toggleBrief());

    // Global drag events
    document.addEventListener('mousemove', (e) => this.onDrag(e));
    document.addEventListener('mouseup', (e) => this.onDragEnd(e));
    document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
    document.addEventListener('touchend', (e) => this.onDragEnd(e));
  },

  // ─── Screen Management ───
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  },

  startGame() {
    this.currentLevel = 0;
    this.loadLevel(0);
    this.showScreen('game-screen');
  },

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel >= LEVELS.length) {
      this.currentLevel = 0;
    }
    this.loadLevel(this.currentLevel);
    this.showScreen('game-screen');
  },

  // ─── Level Loading ───
  loadLevel(idx) {
    const level = LEVELS[idx];
    this.placedComponents = [];
    this.grid.cols = level.gridCols;
    this.grid.rows = level.gridRows;

    // Update header
    document.getElementById('topbar-level').textContent = `PROJECT ${level.id}`;
    document.getElementById('topbar-client').textContent = `Client: ${level.client}`;
    document.getElementById('canvas-header').textContent = level.screenName;

    // Size canvas
    const frame = document.getElementById('canvas-frame');
    frame.style.width = level.canvasW + 'px';
    frame.style.height = level.canvasH + 'px';

    // Calculate cell sizes
    this.grid.cellW = level.canvasW / level.gridCols;
    this.grid.cellH = level.canvasH / level.gridRows;

    // Build grid
    this.gridEl = document.getElementById('canvas-grid');
    this.gridEl.innerHTML = '';
    this.gridEl.style.backgroundSize = `${this.grid.cellW}px ${this.grid.cellH}px`;

    // Build palette
    this.buildPalette(level);

    // Build brief
    this.buildBrief(level);

    // Update status
    this.updateStatus();
  },

  buildPalette(level) {
    const list = document.getElementById('palette-list');
    list.innerHTML = '';

    level.components.forEach(comp => {
      const type = COMPONENT_TYPES[comp.type];
      const item = document.createElement('div');
      item.className = 'palette-item';
      item.dataset.compId = comp.id;

      const iconColor = comp.required ? 'var(--accent)' : 'var(--text-dim)';

      item.innerHTML = `
        <div class="palette-icon" style="background: ${type.css.includes('navbar') || type.css.includes('sidebar') ? '#2d3436' : 'var(--bg)'}; color: ${iconColor};">
          ${type.icon}
        </div>
        <div>
          <div class="palette-label">${comp.label || type.label}</div>
          <div class="palette-desc">${comp.required ? 'REQUIRED' : 'OPTIONAL'}</div>
        </div>
      `;

      // Drag start
      item.addEventListener('mousedown', (e) => this.onPaletteDragStart(e, comp, item));
      item.addEventListener('touchstart', (e) => this.onPaletteDragStart(e, comp, item), { passive: false });

      list.appendChild(item);
    });
  },

  buildBrief(level) {
    const body = document.getElementById('brief-body');
    body.innerHTML = `
      <div class="brief-client-name">${level.client}</div>
      <div class="brief-project-type">${level.projectType}</div>

      <div class="brief-section">
        <div class="brief-section-title">PROJECT BRIEF</div>
        <div class="brief-text">${level.description}</div>
      </div>

      <div class="brief-section">
        <div class="brief-section-title">REQUIREMENTS</div>
        <div id="brief-reqs">
          ${level.requirements.map((r, i) => `
            <div class="brief-req" id="brief-req-${i}">
              <div class="brief-req-check" id="brief-check-${i}"></div>
              <div class="brief-req-text">${r}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="brief-section">
        <div class="brief-section-title">COMPONENTS</div>
        <div class="brief-text" style="color: var(--text-dim);">
          ${level.components.length} total — ${level.components.filter(c => c.required).length} required
        </div>
      </div>
    `;
  },

  toggleBrief() {
    const panel = document.getElementById('brief-panel');
    panel.style.display = panel.style.display === 'none' ? '' : 'none';
  },

  // ─── Drag from Palette ───
  onPaletteDragStart(e, comp, paletteItem) {
    e.preventDefault();
    const pos = this.getEventPos(e);
    const type = COMPONENT_TYPES[comp.type];

    // Check if already placed
    if (this.placedComponents.find(p => p.id === comp.id)) return;

    // Create ghost
    const ghost = document.createElement('div');
    ghost.className = `drag-ghost ${type.css}`;
    ghost.style.width = (comp.w * this.grid.cellW) + 'px';
    ghost.style.height = (comp.h * this.grid.cellH) + 'px';
    ghost.style.left = (pos.x - (comp.w * this.grid.cellW) / 2) + 'px';
    ghost.style.top = (pos.y - (comp.h * this.grid.cellH) / 2) + 'px';
    ghost.textContent = comp.text || type.text;
    document.body.appendChild(ghost);

    this.ghost = ghost;
    this.dragging = {
      comp,
      type,
      source: 'palette',
      paletteItem,
      offsetX: (comp.w * this.grid.cellW) / 2,
      offsetY: (comp.h * this.grid.cellH) / 2,
    };

    paletteItem.classList.add('used');
    this.updateCanvasRect();
  },

  // ─── Drag from Canvas (reposition) ───
  onCanvasDragStart(e, placedEl, compData) {
    e.preventDefault();
    e.stopPropagation();
    const pos = this.getEventPos(e);
    const type = COMPONENT_TYPES[compData.type];

    placedEl.classList.add('dragging');

    this.dragging = {
      comp: compData,
      type,
      source: 'canvas',
      placedEl,
      offsetX: pos.x - placedEl.getBoundingClientRect().left,
      offsetY: pos.y - placedEl.getBoundingClientRect().top,
      origCol: compData.placedCol,
      origRow: compData.placedRow,
    };

    this.updateCanvasRect();
  },

  onDrag(e) {
    if (!this.dragging) return;
    e.preventDefault();
    const pos = this.getEventPos(e);

    if (this.dragging.source === 'palette' && this.ghost) {
      this.ghost.style.left = (pos.x - this.dragging.offsetX) + 'px';
      this.ghost.style.top = (pos.y - this.dragging.offsetY) + 'px';
    } else if (this.dragging.source === 'canvas' && this.dragging.placedEl) {
      const el = this.dragging.placedEl;
      const canvasRect = this.canvasRect;

      // Move relative to canvas
      let newX = pos.x - canvasRect.left - this.dragging.offsetX;
      let newY = pos.y - canvasRect.top - this.dragging.offsetY;

      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
      el.style.transition = 'none';

      // Highlight nearest cell
      this.highlightNearestCell(newX, newY, this.dragging.comp.w, this.dragging.comp.h);
    }
  },

  onDragEnd(e) {
    if (!this.dragging) return;
    const pos = this.getEventPos(e);

    if (this.dragging.source === 'palette') {
      this.handlePaletteDrop(pos);
    } else if (this.dragging.source === 'canvas') {
      this.handleCanvasDrop(pos);
    }

    this.clearHighlights();
    this.dragging = null;
  },

  handlePaletteDrop(pos) {
    const { comp, type, paletteItem } = this.dragging;

    // Remove ghost
    if (this.ghost) {
      this.ghost.remove();
      this.ghost = null;
    }

    // Check if dropped on canvas
    const canvasRect = this.canvasRect;
    if (!canvasRect) {
      paletteItem.classList.remove('used');
      return;
    }

    const dropX = pos.x - canvasRect.left - this.dragging.offsetX;
    const dropY = pos.y - canvasRect.top - this.dragging.offsetY;

    // Check if within canvas bounds
    if (pos.x < canvasRect.left || pos.x > canvasRect.right ||
        pos.y < canvasRect.top || pos.y > canvasRect.bottom) {
      paletteItem.classList.remove('used');
      return;
    }

    // Snap to nearest grid position
    let snapCol = Math.round(dropX / this.grid.cellW);
    let snapRow = Math.round(dropY / this.grid.cellH);

    // Clamp to grid bounds
    snapCol = Math.max(0, Math.min(this.grid.cols - comp.w, snapCol));
    snapRow = Math.max(0, Math.min(this.grid.rows - comp.h, snapRow));

    // Place the component
    this.placeComponent(comp, snapCol, snapRow);
  },

  handleCanvasDrop(pos) {
    const { comp, placedEl } = this.dragging;
    placedEl.classList.remove('dragging');

    const canvasRect = this.canvasRect;

    // If dragged outside canvas, remove component
    if (pos.x < canvasRect.left - 50 || pos.x > canvasRect.right + 50 ||
        pos.y < canvasRect.top - 50 || pos.y > canvasRect.bottom + 50) {
      this.removeComponent(comp.id);
      return;
    }

    // Snap to nearest grid position
    let dropX = pos.x - canvasRect.left - this.dragging.offsetX;
    let dropY = pos.y - canvasRect.top - this.dragging.offsetY;

    let snapCol = Math.round(dropX / this.grid.cellW);
    let snapRow = Math.round(dropY / this.grid.cellH);

    snapCol = Math.max(0, Math.min(this.grid.cols - comp.w, snapCol));
    snapRow = Math.max(0, Math.min(this.grid.rows - comp.h, snapRow));

    // Update placement data
    comp.placedCol = snapCol;
    comp.placedRow = snapRow;

    // Gooey snap animation
    const targetX = snapCol * this.grid.cellW;
    const targetY = snapRow * this.grid.cellH;

    placedEl.style.transition = '';
    Physics.snapTo(placedEl, targetX, targetY);

    this.updateStatus();
  },

  placeComponent(comp, col, row) {
    const type = COMPONENT_TYPES[comp.type];

    // Create placed element
    const el = document.createElement('div');
    el.className = `placed-component ${type.css}`;
    el.dataset.compId = comp.id;

    const w = comp.w * this.grid.cellW;
    const h = comp.h * this.grid.cellH;

    el.style.width = w + 'px';
    el.style.height = h + 'px';

    // Start at drop position then snap
    el.style.left = (col * this.grid.cellW) + 'px';
    el.style.top = (row * this.grid.cellH) + 'px';
    el.textContent = comp.text || type.text;

    // Make it draggable from canvas
    el.addEventListener('mousedown', (e) => this.onCanvasDragStart(e, el, comp));
    el.addEventListener('touchstart', (e) => this.onCanvasDragStart(e, el, comp), { passive: false });

    this.gridEl.appendChild(el);

    // Save placement
    comp.placedCol = col;
    comp.placedRow = row;
    comp.element = el;
    this.placedComponents.push(comp);

    // Gooey snap animation
    requestAnimationFrame(() => {
      Physics.snapTo(el, col * this.grid.cellW, row * this.grid.cellH, w, h);
    });

    this.updateStatus();
  },

  removeComponent(compId) {
    const idx = this.placedComponents.findIndex(p => p.id === compId);
    if (idx === -1) return;

    const comp = this.placedComponents[idx];
    if (comp.element) comp.element.remove();
    comp.element = null;
    comp.placedCol = undefined;
    comp.placedRow = undefined;
    this.placedComponents.splice(idx, 1);

    // Un-grey the palette item
    const paletteItem = document.querySelector(`.palette-item[data-comp-id="${compId}"]`);
    if (paletteItem) paletteItem.classList.remove('used');

    this.updateStatus();
  },

  clearCanvas() {
    const level = LEVELS[this.currentLevel];
    [...this.placedComponents].forEach(comp => this.removeComponent(comp.id));
    this.placedComponents = [];
    this.updateStatus();
  },

  // ─── Grid Highlighting ───
  highlightNearestCell(x, y, w, h) {
    this.clearHighlights();

    let snapCol = Math.round(x / this.grid.cellW);
    let snapRow = Math.round(y / this.grid.cellH);
    snapCol = Math.max(0, Math.min(this.grid.cols - w, snapCol));
    snapRow = Math.max(0, Math.min(this.grid.rows - h, snapRow));

    const highlight = document.createElement('div');
    highlight.className = 'grid-cell highlight';
    highlight.style.left = (snapCol * this.grid.cellW) + 'px';
    highlight.style.top = (snapRow * this.grid.cellH) + 'px';
    highlight.style.width = (w * this.grid.cellW) + 'px';
    highlight.style.height = (h * this.grid.cellH) + 'px';
    highlight.dataset.temp = 'true';
    this.gridEl.appendChild(highlight);
  },

  clearHighlights() {
    this.gridEl.querySelectorAll('[data-temp="true"]').forEach(el => el.remove());
  },

  // ─── Scoring ───
  submitDesign() {
    const level = LEVELS[this.currentLevel];
    const results = Scoring.evaluate(level, this.placedComponents, this.grid.cols, this.grid.rows);
    this.showGrade(results, level);
  },

  showGrade(results, level) {
    const letterEl = document.getElementById('grade-letter');
    letterEl.textContent = results.grade;
    letterEl.className = 'grade-letter grade-' + results.grade.toLowerCase();

    // Stars
    const starsEl = document.getElementById('grade-stars');
    starsEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const span = document.createElement('span');
      span.className = i < results.stars ? 'star-filled' : 'star-empty';
      span.textContent = '★';
      starsEl.appendChild(span);
    }

    // Feedback
    document.getElementById('grade-feedback').textContent = results.feedback;

    // 8-dimension breakdown
    const breakdownEl = document.getElementById('grade-breakdown');
    breakdownEl.innerHTML = '';

    for (const [key, weight] of Object.entries(Scoring.WEIGHTS)) {
      const dimScore = Math.round(results.scores[key] || 0);
      const meta = Scoring.LABELS[key];
      const weightPct = Math.round(weight * 100);

      const row = document.createElement('div');
      row.className = 'grade-row';

      const valClass = dimScore >= 80 ? 'good' : dimScore >= 55 ? 'ok' : 'bad';
      const barWidth = Math.max(2, dimScore);

      let tipHTML = '';
      if (dimScore === 100) {
        tipHTML = `<div class="grade-tip perfect">✓ Perfect</div>`;
      } else if (results.tips[key]) {
        const tipClass = dimScore >= 80 ? 'grade-tip mild' : 'grade-tip';
        tipHTML = `<div class="${tipClass}">${results.tips[key]}</div>`;
      }

      row.innerHTML = `
        <div class="grade-row-header">
          <span class="grade-row-label">${meta.icon} ${meta.name} <span style="opacity:0.4; font-size:10px;">${weightPct}%</span></span>
          <span class="grade-row-value-wrap">
            <span class="grade-bar"><span class="grade-bar-fill ${valClass}" style="width:${barWidth}%"></span></span>
            <span class="grade-row-value ${valClass}">${dimScore}</span>
          </span>
        </div>
        ${tipHTML}
      `;
      breakdownEl.appendChild(row);
    }

    // Missing required warning
    if (results.missingRequired.length > 0) {
      const warn = document.createElement('div');
      warn.className = 'grade-warning';
      warn.textContent = `⚠ Missing ${results.missingRequired.length} required component${results.missingRequired.length > 1 ? 's' : ''} — grade penalized`;
      breakdownEl.appendChild(warn);
    }

    // Overall
    const overallRow = document.createElement('div');
    overallRow.className = 'grade-row grade-row-total';
    overallRow.innerHTML = `
      <span class="grade-row-label" style="font-weight:600;">OVERALL</span>
      <span class="grade-row-value" style="font-size:16px; color: var(--accent-light);">${results.percentage}%</span>
    `;
    breakdownEl.appendChild(overallRow);

    // Button text
    const nextBtn = document.getElementById('btn-next');
    nextBtn.textContent = this.currentLevel < LEVELS.length - 1 ? 'NEXT PROJECT →' : 'PLAY AGAIN →';

    this.showScreen('grade-screen');
  },

  // ─── Status Updates ───
  updateStatus() {
    const level = LEVELS[this.currentLevel];
    const required = level.components.filter(c => c.required).length;
    const placed = this.placedComponents.filter(p => level.components.find(c => c.id === p.id && c.required)).length;

    document.getElementById('status-placed').textContent = `${this.placedComponents.length} / ${level.components.length} placed`;
    document.getElementById('status-hint').textContent = placed < required ? `${required - placed} required remaining` : '✓ All required placed';
    document.getElementById('status-hint').style.color = placed >= required ? 'var(--green)' : 'var(--text-dim)';

    // Update brief checkmarks
    const reqChecks = level.requirements.length;
    const checkRatio = placed / required;
    for (let i = 0; i < reqChecks; i++) {
      const check = document.getElementById(`brief-check-${i}`);
      const text = document.querySelector(`#brief-req-${i} .brief-req-text`);
      if (!check) continue;
      if (i < Math.floor(checkRatio * reqChecks)) {
        check.classList.add('done');
        check.textContent = '✓';
        if (text) text.classList.add('done');
      } else {
        check.classList.remove('done');
        check.textContent = '';
        if (text) text.classList.remove('done');
      }
    }
  },

  // ─── Utilities ───
  updateCanvasRect() {
    const frame = document.getElementById('canvas-frame');
    this.canvasRect = frame.getBoundingClientRect();
  },

  getEventPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  },
};

// Boot
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
