// ─── UI Renderer ───

const UI = {
  narrativeEl: null,
  choicesEl: null,
  actionEl: null,
  holeInfoEl: null,
  scoreDisplayEl: null,
  traitBarEl: null,
  scorecardEl: null,

  init() {
    this.narrativeEl = document.getElementById('narrative-text');
    this.choicesEl = document.getElementById('choices-area');
    this.actionEl = document.getElementById('action-area');
    this.holeInfoEl = document.getElementById('hole-info');
    this.scoreDisplayEl = document.getElementById('score-display');
    this.traitBarEl = document.getElementById('trait-bar');
    this.scorecardEl = document.getElementById('scorecard-mini');
  },

  clear() {
    this.narrativeEl.innerHTML = '';
    this.choicesEl.innerHTML = '';
    this.actionEl.innerHTML = '';
  },

  clearChoices() {
    this.choicesEl.innerHTML = '';
    this.actionEl.innerHTML = '';
  },

  async typeText(text, cssClass = '', delayMs = 30) {
    const p = document.createElement('p');
    if (cssClass) p.className = cssClass;
    this.narrativeEl.appendChild(p);
    p.style.animationDelay = '0s';

    // Scroll to bottom
    const main = document.querySelector('main');

    // Type character by character for immersion
    if (delayMs > 0 && text.length < 500) {
      p.style.opacity = '1';
      p.style.transform = 'none';
      p.style.animation = 'none';
      for (let i = 0; i < text.length; i++) {
        p.textContent += text[i];
        main.scrollTop = main.scrollHeight;
        if (text[i] === '.' || text[i] === '—') {
          await sleep(delayMs * 3);
        } else if (text[i] === ',') {
          await sleep(delayMs * 2);
        } else {
          await sleep(delayMs);
        }
      }
    } else {
      p.textContent = text;
    }

    main.scrollTop = main.scrollHeight;
    return p;
  },

  addText(text, cssClass = '') {
    const p = document.createElement('p');
    if (cssClass) p.className = cssClass;
    p.textContent = text;
    this.narrativeEl.appendChild(p);
    const main = document.querySelector('main');
    main.scrollTop = main.scrollHeight;
    return p;
  },

  addHoleTitle(hole) {
    const title = document.createElement('div');
    title.className = 'hole-title';
    title.textContent = `HOLE ${hole.number} — ${hole.name}`;
    this.narrativeEl.appendChild(title);

    const stats = document.createElement('div');
    stats.className = 'hole-stats';
    stats.textContent = `PAR ${hole.par} • ${hole.yards} YARDS`;
    this.narrativeEl.appendChild(stats);
  },

  showChoices(choices, onSelect) {
    this.choicesEl.innerHTML = '';
    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-label">${choice.label}</span>${choice.text}`;
      btn.style.animationDelay = `${idx * 0.1}s`;
      btn.addEventListener('click', () => {
        this.choicesEl.querySelectorAll('.choice-btn').forEach(b => {
          b.disabled = true;
          if (b !== btn) b.style.opacity = '0.25';
        });
        btn.classList.add('selected');
        onSelect(choice, idx);
      });
      this.choicesEl.appendChild(btn);
    });
    const main = document.querySelector('main');
    main.scrollTop = main.scrollHeight;
  },

  showDialogueResponses(responses, state, onSelect) {
    this.choicesEl.innerHTML = '';
    const visible = getVisibleResponses(responses, state);

    visible.forEach((response, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (response.locked) btn.classList.add('locked');

      let labelHTML = `<span class="choice-label">${response.label}</span>`;
      if (response.locked && response.lockReason) {
        labelHTML += `<span class="choice-lock-badge">${response.lockReason}</span>`;
      }

      let hintHTML = '';
      if (!response.locked) {
        const hints = this._buildEffectHints(response);
        if (hints) hintHTML = `<span class="choice-effect-hint">${hints}</span>`;
      }

      btn.innerHTML = `${labelHTML}${response.text}${hintHTML}`;
      btn.style.animationDelay = `${idx * 0.1}s`;

      if (response.locked) {
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          this.choicesEl.querySelectorAll('.choice-btn').forEach(b => {
            b.disabled = true;
            if (b !== btn) b.style.opacity = '0.15';
          });
          btn.classList.add('selected');
          onSelect(response, idx);
        });
      }
      this.choicesEl.appendChild(btn);
    });
    const main = document.querySelector('main');
    main.scrollTop = main.scrollHeight;
  },

  // ─── Micro-Thought Mini-Game ───
  // Timed fleeting thoughts during the backswing. Pick one in ~2s or it randomizes.
  showMicroThoughts(thoughts, timeMs, onSelect) {
    this.choicesEl.innerHTML = '';
    this.actionEl.innerHTML = '';
    let resolved = false;

    // Backswing narrative
    const label = document.createElement('div');
    label.className = 'micro-label';
    label.textContent = 'BACKSWING — WHAT FLASHES THROUGH YOUR MIND?';
    this.choicesEl.appendChild(label);

    // Timer bar
    const timerWrap = document.createElement('div');
    timerWrap.className = 'micro-timer-wrap';
    const timerBar = document.createElement('div');
    timerBar.className = 'micro-timer-bar';
    timerBar.style.animationDuration = timeMs + 'ms';
    timerWrap.appendChild(timerBar);
    this.choicesEl.appendChild(timerWrap);

    // Thought buttons — appear staggered
    const btnContainer = document.createElement('div');
    btnContainer.className = 'micro-thoughts-grid';

    thoughts.forEach((thought, idx) => {
      const btn = document.createElement('button');
      btn.className = 'micro-btn';
      btn.textContent = thought.text;

      // Category color hint
      const catColors = { focus: 'micro-focus', distraction: 'micro-distract', swagger: 'micro-swagger', anxiety: 'micro-anxiety', neutral: 'micro-neutral' };
      btn.classList.add(catColors[thought.category] || 'micro-neutral');

      // Stagger appearance
      btn.style.animationDelay = (100 + idx * 120) + 'ms';

      btn.addEventListener('click', () => {
        if (resolved) return;
        resolved = true;
        this._resolveMicroPick(btnContainer, btn, thought, onSelect);
      });

      btnContainer.appendChild(btn);
    });

    this.choicesEl.appendChild(btnContainer);

    // Auto-resolve on timeout
    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      const randomIdx = Math.floor(Math.random() * thoughts.length);
      const randomThought = thoughts[randomIdx];
      const randomBtn = btnContainer.children[randomIdx];
      this._resolveMicroPick(btnContainer, randomBtn, randomThought, onSelect, true);
    }, timeMs);

    const main = document.querySelector('main');
    main.scrollTop = main.scrollHeight;
  },

  _resolveMicroPick(container, chosenBtn, thought, onSelect, wasTimeout = false) {
    // Flash the chosen one, fade others
    container.querySelectorAll('.micro-btn').forEach(b => {
      b.disabled = true;
      if (b !== chosenBtn) {
        b.classList.add('micro-faded');
      }
    });
    chosenBtn.classList.add('micro-chosen');
    if (wasTimeout) chosenBtn.classList.add('micro-random');

    // Brief pause for the "impact" feel
    setTimeout(() => {
      onSelect(thought, wasTimeout);
    }, 400);
  },

  _buildEffectHints(response) {
    const parts = [];
    if (response.traitEffects) {
      for (const [trait, delta] of Object.entries(response.traitEffects)) {
        const label = TRAITS[trait]?.label || trait.toUpperCase();
        const cls = delta > 0 ? 'effect-positive' : 'effect-negative';
        const sign = delta > 0 ? '+' : '';
        parts.push(`<span class="${cls}">${label} ${sign}${delta}</span>`);
      }
    }
    if (response.partnerEffect?.impression) {
      const d = response.partnerEffect.impression;
      const cls = d > 0 ? 'effect-positive' : 'effect-negative';
      parts.push(`<span class="${cls}">DAVE ${d > 0 ? '+' : ''}${d}</span>`);
    }
    if (response.shotModifier) {
      const d = response.shotModifier;
      const cls = d < 0 ? 'effect-positive' : 'effect-negative';
      const label = d < 0 ? 'NEXT SHOT +' : 'NEXT SHOT −';
      parts.push(`<span class="${cls}">${label}</span>`);
    }
    return parts.length ? parts.join(' &middot; ') : '';
  },

  async showSpeakerText(speaker, text, delayMs = 20) {
    const speakerLabels = {
      dave: 'DAVE',
      narrator: null,
      thought: 'YOUR MIND',
      you: 'YOU',
    };

    const speakerClasses = {
      dave: 'dialogue-dave',
      narrator: 'dialogue-narrator',
      thought: 'thought',
      you: 'dialogue-you',
    };

    if (speakerLabels[speaker]) {
      const labelEl = document.createElement('span');
      labelEl.className = `speaker-label speaker-${speaker}`;
      labelEl.textContent = speakerLabels[speaker];
      this.narrativeEl.appendChild(labelEl);
    }

    return await this.typeText(text, speakerClasses[speaker] || '', delayMs);
  },

  flashTraitChange(traitKey, delta) {
    const items = this.traitBarEl.querySelectorAll('.trait-item');
    const keys = Object.keys(TRAITS);
    const idx = keys.indexOf(traitKey);
    if (idx >= 0 && items[idx]) {
      const cls = delta > 0 ? 'trait-flash-up' : 'trait-flash-down';
      items[idx].classList.remove('trait-flash-up', 'trait-flash-down');
      void items[idx].offsetWidth;
      items[idx].classList.add(cls);
    }
  },

  showAction(text, cssClass = '', onClick) {
    this.actionEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = `action-btn ${cssClass}`;
    btn.textContent = text;
    btn.addEventListener('click', () => {
      btn.disabled = true;
      onClick();
    });
    this.actionEl.appendChild(btn);
    const main = document.querySelector('main');
    main.scrollTop = main.scrollHeight;
  },

  updateHeader(state) {
    const hole = COURSE_DATA.holes[state.currentHole];
    if (hole) {
      this.holeInfoEl.textContent = `HOLE ${hole.number} • PAR ${hole.par}`;
    }

    const scoreStr = formatScore(state.totalScore);
    this.scoreDisplayEl.textContent = scoreStr;
    this.scoreDisplayEl.className = 'score-display';
    if (state.totalScore > 0) this.scoreDisplayEl.classList.add('over-par');
    else if (state.totalScore < 0) this.scoreDisplayEl.classList.add('under-par');
  },

  updateTraits(state) {
    this.traitBarEl.innerHTML = '';
    for (const [key, meta] of Object.entries(TRAITS)) {
      const val = state.traits[key];
      const tree = SKILL_TREES[key];
      const item = document.createElement('span');
      item.className = 'trait-item';
      const valClass = val >= 70 ? 'high' : val <= 30 ? 'low' : '';
      const perkCount = state.perks.filter(pid =>
        tree && tree.perks.some(p => p.id === pid)
      ).length;
      const perkDot = perkCount > 0 ? `<span class="trait-perk-dot" style="color:${tree ? tree.color : ''}">${'●'.repeat(perkCount)}</span>` : '';
      item.innerHTML = `${meta.label} <span class="trait-value ${valClass}">${val}</span>${perkDot}`;
      this.traitBarEl.appendChild(item);
    }
  },

  updateScorecard(state) {
    this.scorecardEl.innerHTML = '';
    const holes = COURSE_DATA.holes;
    const grid = document.createElement('div');
    grid.className = 'sc-table';

    // Row 1: HOLE headers
    grid.appendChild(this._scCell('HOLE', 'sc-header'));
    for (let i = 0; i < holes.length; i++) {
      const cls = i === state.currentHole ? 'sc-header sc-current' : 'sc-header';
      grid.appendChild(this._scCell(holes[i].number, cls));
    }
    grid.appendChild(this._scCell('TOT', 'sc-header'));

    // Row 2: PAR values
    grid.appendChild(this._scCell('PAR', 'sc-header'));
    let totalPar = 0;
    for (let i = 0; i < holes.length; i++) {
      totalPar += holes[i].par;
      grid.appendChild(this._scCell(holes[i].par, 'sc-par'));
    }
    grid.appendChild(this._scCell(totalPar, 'sc-total'));

    // Row 3: Player scores
    grid.appendChild(this._scCell('YOU', 'sc-header'));
    let totalStrokes = 0;
    let holesPlayed = 0;
    for (let i = 0; i < holes.length; i++) {
      const score = state.scorecard[i];
      if (i === state.currentHole && score === null) {
        grid.appendChild(this._scCell('●', 'sc-current'));
      } else if (score !== null) {
        totalStrokes += score;
        holesPlayed++;
        const diff = score - holes[i].par;
        let cls = 'sc-par';
        let display = score;
        if (diff <= -2) cls = 'sc-eagle';
        else if (diff === -1) cls = 'sc-birdie';
        else if (diff === 0) cls = 'sc-par';
        else if (diff === 1) cls = 'sc-bogey';
        else cls = 'sc-double';
        grid.appendChild(this._scCell(display, cls));
      } else {
        grid.appendChild(this._scCell('–', ''));
      }
    }
    const totalDisp = holesPlayed > 0 ? totalStrokes : '–';
    grid.appendChild(this._scCell(totalDisp, 'sc-total'));

    // Row 4: +/- par
    grid.appendChild(this._scCell('+/–', 'sc-header'));
    let runningDiff = 0;
    for (let i = 0; i < holes.length; i++) {
      const score = state.scorecard[i];
      if (score !== null) {
        const diff = score - holes[i].par;
        runningDiff += diff;
        let cls = diff < 0 ? 'sc-birdie' : diff > 0 ? 'sc-bogey' : 'sc-par';
        grid.appendChild(this._scCell(diff === 0 ? 'E' : (diff > 0 ? '+' + diff : diff), cls));
      } else if (i === state.currentHole) {
        grid.appendChild(this._scCell('●', 'sc-current'));
      } else {
        grid.appendChild(this._scCell('', ''));
      }
    }
    const totalDiff = holesPlayed > 0 ? (runningDiff === 0 ? 'E' : (runningDiff > 0 ? '+' + runningDiff : runningDiff)) : '–';
    grid.appendChild(this._scCell(totalDiff, 'sc-total'));

    this.scorecardEl.appendChild(grid);
  },

  _scCell(content, extraClass) {
    const cell = document.createElement('div');
    cell.className = 'sc-cell' + (extraClass ? ' ' + extraClass : '');
    cell.textContent = content;
    return cell;
  },

  // ─── Character Sheet ───
  renderCharacterSheet(state) {
    const el = document.getElementById('cs-content');
    el.innerHTML = '';

    // Title
    el.innerHTML += `<div class="cs-title">CHARACTER SHEET</div>`;

    // ─── Trait Bars ───
    let traitsHTML = `<div class="cs-section"><div class="cs-section-title">ATTRIBUTES</div>`;
    for (const [key, meta] of Object.entries(TRAITS)) {
      const val = state.traits[key];
      const tree = SKILL_TREES[key];
      const pct = val;
      const colorVar = tree ? tree.color : 'var(--green)';
      const tierMarkers = PERK_TIERS.map(t =>
        `<div class="cs-bar-marker" style="left:${t.threshold}%" title="Tier ${t.label}: ${t.threshold}"></div>`
      ).join('');

      traitsHTML += `
        <div class="cs-trait-row">
          <div class="cs-trait-header">
            <span class="cs-trait-icon" style="color:${colorVar}">${tree ? tree.icon : '•'}</span>
            <span class="cs-trait-name">${meta.label}</span>
            <span class="cs-trait-val" style="color:${colorVar}">${val}</span>
          </div>
          <div class="cs-bar-track">
            <div class="cs-bar-fill" style="width:${pct}%; background:${colorVar}"></div>
            ${tierMarkers}
          </div>
          <div class="cs-trait-desc">${meta.description}</div>
        </div>`;
    }
    traitsHTML += `</div>`;
    el.innerHTML += traitsHTML;

    // ─── Dave Impression ───
    const imp = state.partner.impression;
    const mood = getPartnerMood(imp);
    const moodLabels = { great: 'BEST FRIENDS', good: 'WARMING UP', neutral: 'ACQUAINTANCES', annoyed: 'FROSTY', cold: 'FROZEN OUT' };
    el.innerHTML += `
      <div class="cs-section">
        <div class="cs-section-title">DAVE — ${moodLabels[mood] || 'UNKNOWN'}</div>
        <div class="cs-bar-track cs-dave-bar">
          <div class="cs-bar-fill" style="width:${imp}%; background:var(--blue)"></div>
        </div>
        <div class="cs-trait-desc">Impression: ${imp}/100</div>
      </div>`;

    // ─── Skill Trees ───
    let treesHTML = `<div class="cs-section"><div class="cs-section-title">SKILL TREES</div>`;
    for (const [traitKey, tree] of Object.entries(SKILL_TREES)) {
      treesHTML += `<div class="cs-tree">`;
      treesHTML += `<div class="cs-tree-header" style="color:${tree.color}">
        <span>${tree.icon}</span> ${tree.name}
      </div>`;

      for (const tierDef of PERK_TIERS) {
        const tierPerks = tree.perks.filter(p => p.tier === tierDef.tier);
        const traitVal = state.traits[traitKey];
        const unlocked = traitVal >= tierDef.threshold;
        const chosen = tierPerks.find(p => state.perks.includes(p.id));
        const notChosen = chosen ? tierPerks.find(p => p.id !== chosen.id) : null;

        treesHTML += `<div class="cs-tier ${unlocked ? 'unlocked' : 'locked'}">`;
        treesHTML += `<div class="cs-tier-label">TIER ${tierDef.label} <span class="cs-tier-req">${tierDef.threshold}+</span></div>`;

        treesHTML += `<div class="cs-perk-pair">`;
        for (const perk of tierPerks) {
          const isActive = state.perks.includes(perk.id);
          const isSkipped = chosen && !isActive;
          let cardClass = 'cs-perk-card';
          if (isActive) cardClass += ' active';
          else if (isSkipped) cardClass += ' skipped';
          else if (!unlocked) cardClass += ' locked';
          else cardClass += ' available';

          treesHTML += `
            <div class="${cardClass}" style="--tree-color:${tree.color}">
              <div class="cs-perk-name">${perk.name}</div>
              <div class="cs-perk-desc">${perk.description}</div>
              ${isActive ? '<div class="cs-perk-badge">ACTIVE</div>' : ''}
              ${isSkipped ? '<div class="cs-perk-badge skipped-badge">—</div>' : ''}
              ${!unlocked ? `<div class="cs-perk-badge locked-badge">${tierDef.threshold}+ ${TRAITS[traitKey].label}</div>` : ''}
            </div>`;
        }
        treesHTML += `</div></div>`;
      }
      treesHTML += `</div>`;
    }
    treesHTML += `</div>`;
    el.innerHTML += treesHTML;

    // ─── Active Perks Summary ───
    if (state.perks.length > 0) {
      let perksHTML = `<div class="cs-section"><div class="cs-section-title">ACTIVE PERKS (${state.perks.length})</div>`;
      perksHTML += `<div class="cs-active-perks">`;
      for (const pid of state.perks) {
        const perk = getPerkById(pid);
        if (!perk) continue;
        const treeKey = Object.keys(SKILL_TREES).find(k => SKILL_TREES[k].perks.some(p => p.id === pid));
        const tree = SKILL_TREES[treeKey];
        perksHTML += `
          <div class="cs-active-perk" style="--tree-color:${tree ? tree.color : 'var(--green)'}">
            <span class="cs-ap-icon">${tree ? tree.icon : '•'}</span>
            <span class="cs-ap-name">${perk.name}</span>
            <span class="cs-ap-desc">${perk.description}</span>
          </div>`;
      }
      perksHTML += `</div></div>`;
      el.innerHTML += perksHTML;
    }

    // ─── Round Stats ───
    let totalShots = 0;
    let holesPlayed = 0;
    let bestDiff = Infinity;
    let worstDiff = -Infinity;
    for (let i = 0; i < COURSE_DATA.holes.length; i++) {
      if (state.scorecard[i] !== null) {
        holesPlayed++;
        totalShots += state.scorecard[i];
        const d = state.scorecard[i] - COURSE_DATA.holes[i].par;
        if (d < bestDiff) bestDiff = d;
        if (d > worstDiff) worstDiff = d;
      }
    }
    if (holesPlayed > 0) {
      el.innerHTML += `
        <div class="cs-section">
          <div class="cs-section-title">ROUND STATS</div>
          <div class="cs-stats-grid">
            <div class="cs-stat"><span class="cs-stat-val">${holesPlayed}</span><span class="cs-stat-label">HOLES</span></div>
            <div class="cs-stat"><span class="cs-stat-val">${totalShots}</span><span class="cs-stat-label">STROKES</span></div>
            <div class="cs-stat"><span class="cs-stat-val">${formatScore(state.totalScore)}</span><span class="cs-stat-label">VS PAR</span></div>
            <div class="cs-stat"><span class="cs-stat-val">${formatScore(bestDiff)}</span><span class="cs-stat-label">BEST HOLE</span></div>
            <div class="cs-stat"><span class="cs-stat-val">${formatScore(worstDiff)}</span><span class="cs-stat-label">WORST HOLE</span></div>
            <div class="cs-stat"><span class="cs-stat-val">${state.perks.length}</span><span class="cs-stat-label">PERKS</span></div>
          </div>
        </div>`;
    }
  },

  // ─── Perk Unlock Overlay ───
  showPerkUnlockOverlay(opts) {
    const overlay = document.getElementById('perk-unlock-overlay');
    const panel = document.getElementById('pu-panel');

    let html = `
      <div class="pu-header">
        <div class="pu-icon" style="color:${opts.treeColor}">${opts.treeIcon}</div>
        <div class="pu-title">${opts.treeName} — TIER ${opts.tierLabel}</div>
        <div class="pu-subtitle">Reached ${opts.threshold}. Choose a perk.</div>
      </div>
      <div class="pu-trait-bar">
        <div class="pu-bar-track">
          <div class="pu-bar-fill" style="width:${opts.traitValue}%; background:${opts.treeColor}"></div>
        </div>
        <div class="pu-bar-val" style="color:${opts.treeColor}">${opts.traitValue}</div>
      </div>
      <div class="pu-choices">`;

    for (const perk of opts.perks) {
      html += `
        <button class="pu-perk-card" data-perk-id="${perk.id}" style="--tree-color:${opts.treeColor}">
          <div class="pu-perk-slot">${perk.slot}</div>
          <div class="pu-perk-name">${perk.name}</div>
          <div class="pu-perk-desc">${perk.description}</div>
          <div class="pu-perk-flavor">${perk.flavor}</div>
        </button>`;
    }

    html += `</div>`;
    panel.innerHTML = html;

    panel.querySelectorAll('.pu-perk-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const perkId = btn.dataset.perkId;
        const perk = opts.perks.find(p => p.id === perkId);
        panel.querySelectorAll('.pu-perk-card').forEach(b => {
          b.disabled = true;
          if (b !== btn) b.classList.add('pu-not-chosen');
        });
        btn.classList.add('pu-chosen');
        setTimeout(() => opts.onSelect(perk), 600);
      });
    });

    overlay.classList.add('open');
  },

  hidePerkUnlockOverlay() {
    const overlay = document.getElementById('perk-unlock-overlay');
    overlay.classList.remove('open');
  },
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
