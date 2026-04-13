// ─── Pixel Perfect — UX Scoring Engine v2 ───
//
// 8 distinct dimensions. No double-punishment. Partial credit everywhere.
// Diagnostic tips for every low score. Grid-aware. Section-aware.

const Scoring = {

  // 8 dimensions, each measuring something genuinely distinct
  WEIGHTS: {
    zones:      0.14,  // Is each component in a valid region?
    journey:    0.18,  // Can the user complete their task by scanning naturally? (merged flow + task flow)
    structure:  0.16,  // Are structural rules and conventions satisfied? (merged constraints + convention)
    alignment:  0.12,  // Do items share a clean column grid?
    grouping:   0.12,  // Are related items clustered together?
    balance:    0.10,  // Is the layout visually balanced? (structural elements excluded)
    spacing:    0.10,  // Consistent gaps within sections, no overlaps?
    cognitive:  0.08,  // Clear visual priority, no competing CTAs?
  },

  LABELS: {
    zones:      { name: 'Zone Placement',    icon: '📍', desc: 'Components in valid regions' },
    journey:    { name: 'User Journey',      icon: '🔄', desc: 'Task flow is scannable top-to-bottom' },
    structure:  { name: 'Structure',         icon: '📐', desc: 'Layout rules and conventions met' },
    alignment:  { name: 'Alignment',         icon: '⊞', desc: 'Clean column grid, shared edges' },
    grouping:   { name: 'Grouping',          icon: '◫', desc: 'Related items near each other' },
    balance:    { name: 'Visual Balance',    icon: '⚖', desc: 'Content weight distributed evenly' },
    spacing:    { name: 'Spacing',           icon: '⬜', desc: 'Consistent gaps, no overlaps' },
    cognitive:  { name: 'Clarity',           icon: '🧠', desc: 'Clear priority, no decision overload' },
  },

  STRUCTURAL_TYPES: new Set(['navbar', 'sidebar', 'tabBar', 'footer']),

  // ─── Main Entry Point ───
  evaluate(level, placedComponents, gridCols, gridRows) {
    const placed = this._buildPlacementMap(level, placedComponents);
    const ctx = { level, placed, gridCols, gridRows };
    const scores = {};
    const tips = {};

    scores.zones     = this._scoreZones(ctx);
    scores.journey   = this._scoreJourney(ctx);
    scores.structure = this._scoreStructure(ctx);
    scores.alignment = this._scoreAlignment(ctx);
    scores.grouping  = this._scoreGrouping(ctx);
    scores.balance   = this._scoreBalance(ctx);
    scores.spacing   = this._scoreSpacing(ctx);
    scores.cognitive = this._scoreCognitive(ctx);

    // Generate tips for any non-perfect score
    for (const key of Object.keys(scores)) {
      if (scores[key] < 100) {
        tips[key] = this._getTip(key, ctx, scores[key]);
      }
    }

    // Weighted total
    let total = 0;
    for (const [key, weight] of Object.entries(this.WEIGHTS)) {
      total += (scores[key] || 0) * weight;
    }

    // Penalty: missing required components
    const requiredIds = level.components.filter(c => c.required).map(c => c.id);
    const missingRequired = requiredIds.filter(id => !placed.has(id));
    if (missingRequired.length > 0) {
      const penalty = (missingRequired.length / requiredIds.length) * 25;
      total = Math.max(0, total - penalty);
    }

    const percentage = Math.round(Math.min(100, total));
    const { grade, stars } = this._getGrade(percentage);

    return {
      percentage,
      grade,
      stars,
      scores,
      tips,
      missingRequired,
      feedback: this._getFeedback(level, grade),
    };
  },

  // ─── Helpers ───
  _buildPlacementMap(level, placedComponents) {
    const map = new Map();
    for (const comp of placedComponents) {
      const def = level.components.find(c => c.id === comp.id);
      if (!def) continue;
      map.set(comp.id, {
        id: comp.id,
        type: comp.type,
        col: comp.placedCol,
        row: comp.placedRow,
        w: comp.w,
        h: comp.h,
        def,
      });
    }
    return map;
  },

  _centerOf(p) { return { x: p.col + p.w / 2, y: p.row + p.h / 2 }; },
  _area(p) { return p.w * p.h; },
  _dist(a, b) {
    const ca = this._centerOf(a), cb = this._centerOf(b);
    return Math.sqrt((ca.x - cb.x) ** 2 + (ca.y - cb.y) ** 2);
  },
  _overlaps(a, b) {
    return !(a.col + a.w <= b.col || b.col + b.w <= a.col ||
             a.row + a.h <= b.row || b.row + b.h <= a.row);
  },
  _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

  // ═══════════════════════════════════════
  // 1. ZONES (14%)
  // Is each component within its valid region?
  // Partial credit by distance from zone edge.
  // ═══════════════════════════════════════
  _scoreZones(ctx) {
    const { level, placed } = ctx;
    let total = 0, count = 0;

    for (const comp of level.components) {
      if (!comp.zone && !comp.idealZone) continue;
      const p = placed.get(comp.id);
      if (!p) {
        if (comp.required) { count++; } // 0 for missing required
        continue;
      }
      count++;
      const zone = comp.zone || this._zoneFromIdeal(comp.idealZone, level.gridRows, level.gridCols);

      // Check how much of the component is inside the zone
      const overlapLeft = Math.max(p.col, zone.colMin);
      const overlapRight = Math.min(p.col + p.w, zone.colMax);
      const overlapTop = Math.max(p.row, zone.rowMin);
      const overlapBot = Math.min(p.row + p.h, zone.rowMax);

      if (overlapRight > overlapLeft && overlapBot > overlapTop) {
        const overlapArea = (overlapRight - overlapLeft) * (overlapBot - overlapTop);
        const compArea = p.w * p.h;
        const ratio = overlapArea / compArea;
        total += ratio * 100; // Fully inside = 100, half inside = 50
      } else {
        // Completely outside — score by distance to nearest zone edge
        const colOff = Math.max(0, zone.colMin - (p.col + p.w), p.col - zone.colMax);
        const rowOff = Math.max(0, zone.rowMin - (p.row + p.h), p.row - zone.rowMax);
        total += Math.max(0, 40 - (colOff + rowOff) * 10);
      }
    }

    return count > 0 ? total / count : 100;
  },

  _zoneFromIdeal(ideal, gridRows, gridCols) {
    const m = 3;
    return {
      colMin: Math.max(0, ideal.col - m),
      colMax: Math.min(gridCols || 12, ideal.col + ideal.w + m),
      rowMin: Math.max(0, ideal.row - m),
      rowMax: Math.min(gridRows, ideal.row + ideal.h + m),
    };
  },

  // ═══════════════════════════════════════
  // 2. USER JOURNEY (18%)
  // Merged: flow order + golden path + task completion.
  // Can a user scan top-to-bottom and complete their goal?
  // ═══════════════════════════════════════
  _scoreJourney(ctx) {
    const { level, placed } = ctx;

    // Use goldenPath if available, else flowOrder, else fallback
    const path = level.goldenPath
      ? level.goldenPath.map(s => s.id)
      : level.flowOrder || [];

    if (path.length < 2) return this._fallbackJourneyScore(ctx);

    let pairScore = 0, pairCount = 0;
    let backtrackCount = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const a = placed.get(path[i]);
      const b = placed.get(path[i + 1]);
      if (!a || !b) continue;
      pairCount++;

      const rowDelta = b.row - a.row;

      if (rowDelta > 0) {
        // Natural downward scan — grade by distance (close = great, far = okay)
        pairScore += rowDelta <= 4 ? 100 : rowDelta <= 7 ? 80 : rowDelta <= 10 ? 60 : 40;
      } else if (rowDelta === 0) {
        // Same row — left-to-right is fine, right-to-left is meh
        const colDelta = b.col - a.col;
        pairScore += colDelta >= 0 ? 75 : 50;
      } else {
        // BACKTRACK — user has to scan upward. Penalize proportionally.
        backtrackCount++;
        pairScore += this._clamp(40 - Math.abs(rowDelta) * 8, 0, 35);
      }
    }

    if (pairCount === 0) return 40;

    let score = pairScore / pairCount;

    // Bonus: all path items placed
    const placedCount = path.filter(id => placed.has(id)).length;
    const completionRatio = placedCount / path.length;
    score = score * 0.8 + completionRatio * 100 * 0.2;

    // Extra penalty for multiple backtracks
    if (backtrackCount >= 2) score -= backtrackCount * 5;

    return this._clamp(score, 0, 100);
  },

  _fallbackJourneyScore(ctx) {
    const typePriority = { navbar: 0, sidebar: 0, logo: 1, search: 1, heading: 2, image: 2, hero: 2, text: 3, input: 3, toggle: 4, card: 4, list: 4, chart: 4, button: 5, divider: 6, footer: 7, tabBar: 8 };
    const items = [...ctx.placed.values()]
      .filter(p => typePriority[p.type] !== undefined)
      .sort((a, b) => a.row - b.row || a.col - b.col);
    if (items.length < 2) return 50;
    let ordered = 0;
    for (let i = 0; i < items.length - 1; i++) {
      if (typePriority[items[i].type] <= typePriority[items[i + 1].type]) ordered++;
    }
    return (ordered / (items.length - 1)) * 100;
  },

  // ═══════════════════════════════════════
  // 3. STRUCTURE (16%)
  // Merged: constraints + conventions.
  // All checks use partial credit (0-100 per check).
  // ═══════════════════════════════════════
  _scoreStructure(ctx) {
    const { level, placed, gridRows, gridCols } = ctx;
    const checks = [];

    // Constraint rules (partial credit)
    if (level.constraints) {
      for (const rule of level.constraints) {
        checks.push(this._checkConstraintPartial(rule, placed, level));
      }
    }

    // Convention rules (partial credit)
    if (level.conventions) {
      for (const conv of level.conventions) {
        checks.push(this._checkConventionPartial(conv, placed, gridRows, gridCols));
      }
    }

    if (checks.length === 0) return 75;
    return checks.reduce((s, v) => s + v, 0) / checks.length;
  },

  _checkConstraintPartial(rule, placed, level) {
    const a = rule.a ? placed.get(rule.a) : null;
    const b = rule.b ? placed.get(rule.b) : null;

    switch (rule.type) {
      case 'above': {
        if (!a || !b) return a || b ? 20 : 0;
        const gap = b.row - (a.row + a.h);
        if (gap >= 0) return 100;       // A fully above B
        if (gap >= -1) return 75;        // Slight overlap/touching — close enough
        return this._clamp(50 + gap * 15, 0, 50); // Increasingly wrong
      }
      case 'below': {
        if (!a || !b) return a || b ? 20 : 0;
        const gap = a.row - (b.row + b.h);
        if (gap >= 0) return 100;
        if (gap >= -1) return 75;
        return this._clamp(50 + gap * 15, 0, 50);
      }
      case 'leftOf': {
        if (!a || !b) return a || b ? 20 : 0;
        const gap = b.col - (a.col + a.w);
        if (gap >= 0) return 100;
        if (gap >= -1) return 70;
        return this._clamp(40 + gap * 15, 0, 40);
      }
      case 'sameRow': {
        if (!a || !b) return a || b ? 20 : 0;
        const diff = Math.abs(a.row - b.row);
        if (diff === 0) return 100;
        if (diff === 1) return 80;
        if (diff === 2) return 50;
        return Math.max(0, 30 - diff * 5);
      }
      case 'adjacent': {
        if (!a || !b) return 0;
        const vGap = Math.min(Math.abs(a.row + a.h - b.row), Math.abs(b.row + b.h - a.row));
        return vGap <= 1 ? 100 : vGap <= 2 ? 70 : Math.max(0, 50 - vGap * 10);
      }
      case 'bottomRegion': {
        if (!a) return 0;
        const threshold = level.gridRows * 0.75;
        if (a.row >= threshold) return 100;
        const off = threshold - a.row;
        return this._clamp(80 - off * 8, 0, 80);
      }
      case 'topRegion': {
        if (!a) return 0;
        const threshold = level.gridRows * 0.25;
        if (a.row <= threshold) return 100;
        const off = a.row - threshold;
        return this._clamp(80 - off * 8, 0, 80);
      }
      case 'fullWidth': {
        if (!a) return 0;
        const ratio = a.w / level.gridCols;
        if (ratio >= 0.92) return 100;
        if (ratio >= 0.75) return 70;
        return ratio * 60;
      }
      case 'centered': {
        if (!a) return 0;
        const center = a.col + a.w / 2;
        const gridCenter = level.gridCols / 2;
        const off = Math.abs(center - gridCenter);
        if (off <= 0.5) return 100;
        if (off <= 1.5) return 80;
        return this._clamp(70 - off * 12, 0, 70);
      }
      case 'placed':
        return placed.has(rule.a) ? 100 : 0;
      default:
        return 100;
    }
  },

  _checkConventionPartial(conv, placed, gridRows, gridCols) {
    const p = placed.get(conv.id);
    if (!p) return 0;

    switch (conv.expect) {
      case 'top': {
        if (p.row <= 1) return 100;
        if (p.row <= 3) return 75;
        return this._clamp(60 - (p.row - 3) * 10, 0, 60);
      }
      case 'bottom': {
        const fromBot = gridRows - (p.row + p.h);
        if (fromBot <= 1) return 100;
        if (fromBot <= 3) return 75;
        return this._clamp(60 - (fromBot - 3) * 10, 0, 60);
      }
      case 'topLeft': {
        const score = (p.row <= 2 ? 50 : Math.max(0, 30 - p.row * 5)) +
                      (p.col <= 2 ? 50 : Math.max(0, 30 - p.col * 5));
        return score;
      }
      case 'topRight': {
        const rScore = p.row <= 2 ? 50 : Math.max(0, 30 - p.row * 5);
        const cScore = p.col + p.w >= gridCols - 2 ? 50 : Math.max(0, 30 - (gridCols - 2 - p.col - p.w) * 5);
        return rScore + cScore;
      }
      case 'center': {
        const off = Math.abs((p.col + p.w / 2) - gridCols / 2);
        if (off <= 1) return 100;
        if (off <= 2) return 75;
        return this._clamp(60 - off * 10, 0, 60);
      }
      case 'fullWidth': {
        const ratio = p.w / gridCols;
        if (ratio >= 0.92) return 100;
        if (ratio >= 0.75) return 70;
        return ratio * 60;
      }
      case 'leftEdge': {
        if (p.col === 0) return 100;
        if (p.col <= 1) return 85;
        return this._clamp(60 - p.col * 12, 0, 60);
      }
      case 'prominent': {
        let s = 0;
        if (p.w >= 8) s += 40; else if (p.w >= 6) s += 30; else if (p.w >= 4) s += 15;
        const midZone = p.row >= gridRows * 0.25 && p.row <= gridRows * 0.8;
        s += midZone ? 60 : 30;
        return Math.min(100, s);
      }
      default:
        return 100;
    }
  },

  // ═══════════════════════════════════════
  // 4. ALIGNMENT (12%)
  // Grid-aware: detects column grids instead of penalizing
  // dashboards with sidebars.
  // ═══════════════════════════════════════
  _scoreAlignment(ctx) {
    const { placed, gridCols } = ctx;
    if (placed.size < 2) return 100;

    // Separate structural frame from content
    const structural = [];
    const content = [];
    for (const p of placed.values()) {
      if (this.STRUCTURAL_TYPES.has(p.type)) structural.push(p);
      else content.push(p);
    }

    if (content.length < 2) return 90;

    // Collect left edges of content items
    const leftEdges = content.map(p => p.col);
    const rightEdges = content.map(p => p.col + p.w);
    const centers = content.map(p => p.col + p.w / 2);

    // Detect column grid: find common left-edge intervals
    const uniqueLefts = [...new Set(leftEdges)].sort((a, b) => a - b);

    // Check if left edges form a regular grid (consistent intervals)
    let gridRegularity = 100;
    if (uniqueLefts.length >= 3) {
      const intervals = [];
      for (let i = 1; i < uniqueLefts.length; i++) {
        intervals.push(uniqueLefts[i] - uniqueLefts[i - 1]);
      }
      const mean = intervals.reduce((s, v) => s + v, 0) / intervals.length;
      const variance = intervals.reduce((s, v) => s + (v - mean) ** 2, 0) / intervals.length;
      const cv = mean > 0 ? Math.sqrt(variance) / mean : 0;
      // Low coefficient of variation = regular grid
      gridRegularity = cv <= 0.15 ? 100 : cv <= 0.4 ? 80 : cv <= 0.7 ? 60 : 40;
    }

    // How many items share a left edge with at least one other item?
    let sharedEdgeCount = 0;
    for (const p of content) {
      const peers = content.filter(q => q !== p && q.col === p.col);
      if (peers.length > 0) sharedEdgeCount++;
    }
    const shareRatio = sharedEdgeCount / content.length;

    // Center alignment bonus
    const gridCenter = gridCols / 2;
    const centerCount = centers.filter(c => Math.abs(c - gridCenter) <= 1).length;
    const centerBonus = Math.min(15, (centerCount / content.length) * 30);

    // Composite: fewer unique columns and/or regular grid = better
    const columnScore = uniqueLefts.length <= 2 ? 100 :
                        uniqueLefts.length <= 3 ? 85 :
                        uniqueLefts.length <= 4 ? 70 :
                        Math.max(30, 100 - uniqueLefts.length * 8);

    return this._clamp(
      columnScore * 0.35 + gridRegularity * 0.25 + shareRatio * 100 * 0.25 + centerBonus,
      0, 100
    );
  },

  // ═══════════════════════════════════════
  // 5. GROUPING (12%)
  // Semantic proximity — section-aware.
  // ═══════════════════════════════════════
  _scoreGrouping(ctx) {
    const { level, placed } = ctx;
    const groups = level.semanticGroups;
    if (!groups || groups.length === 0) return this._fallbackGrouping(ctx);

    let totalScore = 0, groupCount = 0;

    for (const group of groups) {
      const members = group.ids.map(id => placed.get(id)).filter(Boolean);
      if (members.length < 2) continue;
      groupCount++;

      // Average pairwise distance
      let totalDist = 0, pairs = 0;
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          totalDist += this._dist(members[i], members[j]);
          pairs++;
        }
      }
      const avgDist = pairs > 0 ? totalDist / pairs : 0;
      const maxDist = group.maxDist || 6;

      // Smooth falloff instead of cliff
      if (avgDist <= maxDist * 0.5) totalScore += 100;
      else if (avgDist <= maxDist) totalScore += 100 - ((avgDist - maxDist * 0.5) / (maxDist * 0.5)) * 20;
      else totalScore += this._clamp(60 - (avgDist - maxDist) * 10, 0, 60);
    }

    return groupCount > 0 ? totalScore / groupCount : 70;
  },

  _fallbackGrouping(ctx) {
    const byType = {};
    for (const p of ctx.placed.values()) {
      if (!byType[p.type]) byType[p.type] = [];
      byType[p.type].push(p);
    }
    let score = 0, groups = 0;
    for (const items of Object.values(byType)) {
      if (items.length < 2) continue;
      groups++;
      let totalDist = 0, pairs = 0;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          totalDist += this._dist(items[i], items[j]);
          pairs++;
        }
      }
      const avg = pairs > 0 ? totalDist / pairs : 0;
      score += avg <= 5 ? 100 : this._clamp(100 - avg * 8, 0, 100);
    }
    return groups > 0 ? score / groups : 70;
  },

  // ═══════════════════════════════════════
  // 6. VISUAL BALANCE (10%)
  // Center-of-mass for CONTENT only. Structural elements excluded.
  // ═══════════════════════════════════════
  _scoreBalance(ctx) {
    const { placed, gridCols, gridRows } = ctx;
    if (placed.size === 0) return 0;

    // Only content elements contribute to balance
    const contentItems = [...placed.values()].filter(p => !this.STRUCTURAL_TYPES.has(p.type));
    if (contentItems.length < 2) return 85;

    // Find the content region (exclude structural frame)
    let contentColMin = 0, contentColMax = gridCols;
    for (const p of placed.values()) {
      if (p.type === 'sidebar' && p.col <= 1) contentColMin = Math.max(contentColMin, p.col + p.w);
    }

    let totalMassX = 0, totalMassY = 0, totalMass = 0;
    for (const p of contentItems) {
      const mass = this._area(p);
      const center = this._centerOf(p);
      totalMassX += center.x * mass;
      totalMassY += center.y * mass;
      totalMass += mass;
    }

    if (totalMass === 0) return 50;

    const comX = totalMassX / totalMass;
    const comY = totalMassY / totalMass;

    // Content center should be near the geometric center of the content region
    const contentCenterX = (contentColMin + contentColMax) / 2;
    const contentCenterY = gridRows / 2;

    const hDev = Math.abs(comX - contentCenterX) / ((contentColMax - contentColMin) / 2 || 1);
    const vDev = Math.abs(comY - contentCenterY) / (gridRows / 2);

    // Horizontal imbalance matters; vertical bias toward top is natural
    const hScore = this._clamp(100 - hDev * 80, 0, 100);
    const vScore = this._clamp(100 - Math.max(0, vDev - 0.35) * 80, 0, 100);

    return hScore * 0.65 + vScore * 0.35;
  },

  // ═══════════════════════════════════════
  // 7. SPACING (10%)
  // Section-aware: measures gap consistency WITHIN semantic groups
  // and between major sections.
  // ═══════════════════════════════════════
  _scoreSpacing(ctx) {
    const { level, placed, gridCols, gridRows } = ctx;
    if (placed.size < 2) return 80;

    const items = [...placed.values()].sort((a, b) => a.row - b.row || a.col - b.col);

    // Overlap check (still a hard penalty)
    let overlapCount = 0;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        // Allow overlaps for avatar-over-cover style patterns
        if (this._isAllowedOverlap(items[i], items[j], level)) continue;
        if (this._overlaps(items[i], items[j])) overlapCount++;
      }
    }
    if (overlapCount > 0) return this._clamp(60 - overlapCount * 15, 0, 60);

    // Section-aware gap consistency
    let totalConsistency = 0, sectionCount = 0;

    // A) Within semantic groups
    if (level.semanticGroups) {
      for (const group of level.semanticGroups) {
        const members = group.ids.map(id => placed.get(id)).filter(Boolean);
        if (members.length < 2) continue;
        const sorted = [...members].sort((a, b) => a.row - b.row || a.col - b.col);
        const gaps = this._measureGaps(sorted);
        if (gaps.length >= 2) {
          sectionCount++;
          totalConsistency += this._gapConsistencyScore(gaps);
        }
      }
    }

    // B) Between major vertical sections (all items)
    const allGaps = this._measureGaps(items);
    if (allGaps.length >= 2) {
      sectionCount++;
      // Global gaps can vary more — use a softer penalty
      totalConsistency += this._gapConsistencyScore(allGaps) * 0.7 + 30 * 0.3;
    }

    return sectionCount > 0 ? this._clamp(totalConsistency / sectionCount, 0, 100) : 80;
  },

  _measureGaps(sorted) {
    const gaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (b.row >= a.row + a.h) {
        gaps.push(b.row - (a.row + a.h));
      }
    }
    return gaps;
  },

  _gapConsistencyScore(gaps) {
    if (gaps.length < 2) return 85;
    const mean = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    const variance = gaps.reduce((s, g) => s + (g - mean) ** 2, 0) / gaps.length;
    const stdDev = Math.sqrt(variance);
    // stdDev 0=perfect, 0.5=good, 2+=inconsistent
    return this._clamp(100 - stdDev * 20, 20, 100);
  },

  _isAllowedOverlap(a, b, level) {
    // Avatar overlapping cover photo is intentional (profile pages)
    if ((a.type === 'avatar' && b.type === 'image') || (a.type === 'image' && b.type === 'avatar')) return true;
    if ((a.type === 'badge' || b.type === 'badge')) return true;
    return false;
  },

  // ═══════════════════════════════════════
  // 8. COGNITIVE CLARITY (8%)
  // Visual priority, Fitts's Law, decision overload.
  // Weighted by visual area, not raw count.
  // ═══════════════════════════════════════
  _scoreCognitive(ctx) {
    const { level, placed, gridCols, gridRows } = ctx;
    let score = 100;

    const interactiveTypes = new Set(['button', 'buttonSec', 'input', 'toggle', 'search']);
    const interactives = [...placed.values()].filter(p => interactiveTypes.has(p.type));

    // A. Competing visual weight in same zone
    // Divide into 3 vertical bands (top/mid/bottom) and check for competing large interactives
    const bands = [[], [], []];
    for (const p of interactives) {
      const cy = p.row + p.h / 2;
      const band = cy < gridRows * 0.33 ? 0 : cy < gridRows * 0.66 ? 1 : 2;
      bands[band].push(p);
    }

    for (const band of bands) {
      // Count elements with significant visual area (not tiny toggles)
      const significant = band.filter(p => this._area(p) >= 6);
      if (significant.length > 2) {
        score -= (significant.length - 2) * 10;
      }
    }

    // B. Primary CTA check (Fitts's Law)
    const primaryCTA = level.primaryCTA;
    if (primaryCTA) {
      const cta = placed.get(primaryCTA);
      if (cta) {
        // Should be wide
        if (cta.w >= 8) score += 5;
        else if (cta.w < 4) score -= 12;

        // On mobile (tall screens), should be in the middle-to-bottom zone
        if (gridRows >= 18) {
          if (cta.row < gridRows * 0.2) score -= 10;
          else if (cta.row >= gridRows * 0.35 && cta.row <= gridRows * 0.75) score += 5;
        }

        // CTA should be the visually largest interactive element
        const ctaArea = this._area(cta);
        const largerElements = interactives.filter(p => p.id !== cta.id && this._area(p) > ctaArea);
        if (largerElements.length > 0) score -= 8;
      } else {
        score -= 20;
      }
    }

    return this._clamp(score, 0, 100);
  },

  // ═══════════════════════════════════════
  // DIAGNOSTIC TIPS
  // One concrete actionable tip per low-scoring dimension.
  // ═══════════════════════════════════════
  _getTip(dimension, ctx, score) {
    const { level, placed, gridRows, gridCols } = ctx;
    const _name = (id) => level.components.find(c => c.id === id)?.label || id;

    switch (dimension) {

      case 'zones': {
        // Find the worst offender
        let worstComp = null, worstScore = Infinity;
        for (const comp of level.components) {
          const p = placed.get(comp.id);
          if (!p) { if (comp.required) return `"${comp.label || comp.id}" isn't placed — it's required.`; continue; }
          const zone = comp.zone || this._zoneFromIdeal(comp.idealZone, gridRows, gridCols);
          const inZone = p.col >= zone.colMin && p.col + p.w <= zone.colMax && p.row >= zone.rowMin && p.row + p.h <= zone.rowMax;
          if (!inZone) {
            const off = Math.max(0, zone.colMin - p.col, p.col + p.w - zone.colMax) + Math.max(0, zone.rowMin - p.row, p.row + p.h - zone.rowMax);
            if (off < worstScore || !worstComp) { worstScore = off; worstComp = { comp, p, zone }; }
          }
        }
        if (worstComp) {
          const { comp, p, zone } = worstComp;
          const dir = p.row < zone.rowMin ? 'lower' : p.row + p.h > zone.rowMax ? 'higher' : p.col < zone.colMin ? 'right' : 'left';
          return `"${comp.label}" is outside its region — try nudging it ${dir}.`;
        }
        if (score >= 80) return 'Most components are well-placed. Fine-tune positions for a perfect score.';
        return 'Some components are outside their expected regions.';
      }

      case 'journey': {
        const path = level.goldenPath ? level.goldenPath.map(s => s.id) : level.flowOrder || [];
        // Find backtracks
        for (let i = 0; i < path.length - 1; i++) {
          const a = placed.get(path[i]), b = placed.get(path[i + 1]);
          if (a && b && b.row < a.row) {
            return `"${_name(path[i + 1])}" is above "${_name(path[i])}" — users scan downward, so this forces them to backtrack.`;
          }
        }
        // Find large gaps
        for (let i = 0; i < path.length - 1; i++) {
          const a = placed.get(path[i]), b = placed.get(path[i + 1]);
          if (a && b && (b.row - a.row) > 6) {
            return `Big gap between "${_name(path[i])}" and "${_name(path[i + 1])}" — the user's eye has to jump too far.`;
          }
        }
        // Missing steps
        const missing = path.filter(id => !placed.has(id));
        if (missing.length > 0) return `"${_name(missing[0])}" is part of the user journey but isn't placed.`;
        if (score >= 80) return 'Flow is good. Tighten vertical spacing between steps for a seamless scan.';
        return 'The task flow has some jumps or gaps that slow the user down.';
      }

      case 'structure': {
        // Find the worst convention or constraint
        let worstName = '', worstHint = '', worstVal = 100;
        if (level.conventions) {
          const hints = { top: 'near the top', bottom: 'at the bottom', leftEdge: 'on the left edge', center: 'centered horizontally', fullWidth: 'spanning full width', prominent: 'large and prominently placed', topLeft: 'in the top-left', topRight: 'in the top-right' };
          for (const conv of level.conventions) {
            const s = this._checkConventionPartial(conv, placed, gridRows, gridCols);
            if (s < worstVal) { worstVal = s; worstName = _name(conv.id); worstHint = hints[conv.expect] || conv.expect; }
          }
        }
        if (level.constraints) {
          for (const rule of level.constraints) {
            const s = this._checkConstraintPartial(rule, placed, level);
            if (s < worstVal) {
              worstVal = s;
              const ruleHints = { above: `"${_name(rule.a)}" should be above "${_name(rule.b)}"`, below: `"${_name(rule.a)}" should be below "${_name(rule.b)}"`, sameRow: `"${_name(rule.a)}" and "${_name(rule.b)}" should be on the same row`, leftOf: `"${_name(rule.a)}" should be left of "${_name(rule.b)}"`, fullWidth: `"${_name(rule.a)}" should span full width`, centered: `"${_name(rule.a)}" should be centered`, topRegion: `"${_name(rule.a)}" should be near the top`, bottomRegion: `"${_name(rule.a)}" should be near the bottom` };
              worstHint = ruleHints[rule.type] || `${rule.type} rule not fully met`;
              worstName = '';
            }
          }
        }
        if (worstName && worstVal < 80) return `Users expect "${worstName}" ${worstHint}.`;
        if (!worstName && worstVal < 80) return worstHint + '.';
        if (score >= 80) return 'Structure is solid. Small positioning tweaks would make it textbook.';
        return 'Some layout conventions or structural rules aren\'t fully met.';
      }

      case 'alignment': {
        const content = [...placed.values()].filter(p => !this.STRUCTURAL_TYPES.has(p.type));
        const lefts = [...new Set(content.map(p => p.col))].sort((a, b) => a - b);
        if (lefts.length > 4) return `Content has ${lefts.length} different left edges — try aligning to 2-3 consistent columns.`;
        if (lefts.length > 3) return `${lefts.length} left-edge positions. Reducing to 2-3 would feel cleaner.`;
        // Check center alignment
        const gridCenter = gridCols / 2;
        const offCenter = content.filter(p => Math.abs(p.col + p.w / 2 - gridCenter) > 1.5).length;
        if (offCenter > content.length * 0.5 && score < 85) return 'Many items are off-center. Centering key elements would improve visual alignment.';
        if (score >= 80) return 'Alignment is clean. A few items could share edges more consistently.';
        return 'Components don\'t share enough common edges — try lining up left margins.';
      }

      case 'grouping': {
        if (level.semanticGroups) {
          let worstGroup = null, worstDist = 0;
          for (const group of level.semanticGroups) {
            const members = group.ids.map(id => placed.get(id)).filter(Boolean);
            if (members.length < 2) continue;
            let maxD = 0;
            for (let i = 0; i < members.length; i++) {
              for (let j = i + 1; j < members.length; j++) {
                maxD = Math.max(maxD, this._dist(members[i], members[j]));
              }
            }
            if (maxD > worstDist) { worstDist = maxD; worstGroup = group; }
          }
          if (worstGroup && worstDist > (worstGroup.maxDist || 6)) {
            return `"${worstGroup.label}" items are spread ${Math.round(worstDist)} cells apart — cluster them tighter.`;
          }
          if (worstGroup && score < 90) {
            return `"${worstGroup.label}" could be grouped more tightly for clearer visual association.`;
          }
        }
        if (score >= 80) return 'Groups are close. Tightening the gaps between related items would perfect it.';
        return 'Related components are too spread out. Cluster similar items together.';
      }

      case 'balance': {
        const contentItems = [...placed.values()].filter(p => !this.STRUCTURAL_TYPES.has(p.type));
        if (contentItems.length < 2) return 'Not enough content elements placed to evaluate balance.';
        let totalMassX = 0, totalMass = 0;
        let contentColMin = 0;
        for (const p of placed.values()) { if (p.type === 'sidebar' && p.col <= 1) contentColMin = Math.max(contentColMin, p.col + p.w); }
        for (const p of contentItems) { const m = this._area(p); totalMassX += (p.col + p.w / 2) * m; totalMass += m; }
        if (totalMass > 0) {
          const comX = totalMassX / totalMass;
          const contentCenter = (contentColMin + gridCols) / 2;
          if (comX < contentCenter - 1) return 'Content is heavier on the left side. Shift some elements right for better balance.';
          if (comX > contentCenter + 1) return 'Content is heavier on the right side. Shift some elements left for better balance.';
        }
        if (score >= 80) return 'Balance is good. Minor weight distribution tweaks would perfect it.';
        return 'The layout feels lopsided. Distribute content more evenly across the screen.';
      }

      case 'spacing': {
        const items = [...placed.values()].sort((a, b) => a.row - b.row);
        // Check overlaps first
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            if (this._overlaps(items[i], items[j]) && !this._isAllowedOverlap(items[i], items[j], level)) {
              return `"${items[i].def?.label || items[i].id}" overlaps "${items[j].def?.label || items[j].id}" — separate them.`;
            }
          }
        }
        // Check gap consistency
        const gaps = this._measureGaps(items);
        if (gaps.length >= 2) {
          const min = Math.min(...gaps), max = Math.max(...gaps);
          if (max - min > 3) return `Gaps range from ${min} to ${max} rows. Aim for more consistent spacing between elements.`;
          if (max - min > 1) return `Spacing varies between ${min} and ${max} rows. Closer to uniform would feel more polished.`;
        }
        if (score >= 80) return 'Spacing is mostly consistent. Evening out the last few gaps would nail it.';
        return 'Spacing between elements is inconsistent. Try making gaps more uniform.';
      }

      case 'cognitive': {
        const primaryCTA = level.primaryCTA;
        if (primaryCTA && !placed.has(primaryCTA)) return `The primary action "${_name(primaryCTA)}" isn't placed — it's the most important element.`;
        if (primaryCTA) {
          const cta = placed.get(primaryCTA);
          if (cta) {
            if (cta.w < 4) return `"${_name(primaryCTA)}" is too narrow — make the primary action wider so it's easy to find.`;
            if (gridRows >= 18 && cta.row < gridRows * 0.2) return `"${_name(primaryCTA)}" is too high on the screen — primary actions work better in the middle-to-bottom zone.`;
            const interactiveTypes = new Set(['button', 'buttonSec', 'input', 'toggle', 'search']);
            const interactives = [...placed.values()].filter(p => interactiveTypes.has(p.type));
            const largerThanCTA = interactives.filter(p => p.id !== cta.id && this._area(p) > this._area(cta));
            if (largerThanCTA.length > 0) return `"${_name(largerThanCTA[0].id)}" is visually larger than the primary action — the CTA should be the most prominent interactive element.`;
          }
        }
        if (score >= 80) return 'Clarity is good. Ensure the primary action stands out as the single most prominent element.';
        return 'Multiple interactive elements compete for attention — make the primary action clearly dominant.';
      }

      default: return '';
    }
  },

  // ─── Grading ───
  _getGrade(pct) {
    if (pct >= 92) return { grade: 'S', stars: 5 };
    if (pct >= 82) return { grade: 'A', stars: 5 };
    if (pct >= 70) return { grade: 'B', stars: 4 };
    if (pct >= 55) return { grade: 'C', stars: 3 };
    if (pct >= 40) return { grade: 'D', stars: 2 };
    return { grade: 'F', stars: 1 };
  },

  _getFeedback(level, grade) {
    const key = grade.toLowerCase();
    return (level.feedback && level.feedback[key]) || '';
  },
};
