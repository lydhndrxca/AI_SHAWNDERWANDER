// ─── Gooey Spring Physics ───
// Handles the satisfying "slurp into position" snap effect.

const Physics = {
  // Spring parameters
  stiffness: 300,
  damping: 20,
  mass: 1,

  // Active springs (for continuous animation if needed)
  activeSprings: [],
  animFrame: null,

  // Snap an element to a target position with gooey spring effect
  snapTo(el, targetX, targetY, targetW, targetH, onComplete) {
    // Apply the CSS transition-based snap (uses cubic-bezier in CSS)
    el.style.left = targetX + 'px';
    el.style.top = targetY + 'px';
    if (targetW !== undefined) el.style.width = targetW + 'px';
    if (targetH !== undefined) el.style.height = targetH + 'px';

    // Add the gooey scale animation
    el.classList.remove('snapping');
    void el.offsetWidth; // force reflow
    el.classList.add('snapping');

    // Ripple effect at snap point
    this.createRipple(el.parentElement, targetX + (targetW || el.offsetWidth) / 2, targetY + (targetH || el.offsetHeight) / 2);

    el.addEventListener('animationend', function handler() {
      el.classList.remove('snapping');
      el.removeEventListener('animationend', handler);
      if (onComplete) onComplete();
    });
  },

  // Wobble effect when hovering over a valid drop zone
  wobble(el) {
    el.classList.remove('wobble');
    void el.offsetWidth;
    el.classList.add('wobble');
  },

  // Ripple on snap
  createRipple(container, x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'snap-ripple';
    ripple.style.width = '30px';
    ripple.style.height = '30px';
    ripple.style.left = (x - 15) + 'px';
    ripple.style.top = (y - 15) + 'px';
    container.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  },

  // Elastic bounce for rejection
  reject(el) {
    const startX = parseFloat(el.style.left);
    const startY = parseFloat(el.style.top);
    el.style.transition = 'transform 0.15s ease';
    el.style.transform = 'scale(0.9)';
    setTimeout(() => {
      el.style.transform = 'scale(1.05)';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        setTimeout(() => {
          el.style.transition = '';
        }, 150);
      }, 100);
    }, 150);
  },

  // Calculate distance between two points
  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },

  // Find the nearest grid cell to a position
  findNearestCell(cells, x, y, w, h) {
    let best = null;
    let bestDist = Infinity;

    for (const cell of cells) {
      const cx = cell.col * cell.cellW;
      const cy = cell.row * cell.cellH;
      const dist = this.distance(x, y, cx, cy);
      if (dist < bestDist) {
        bestDist = dist;
        best = cell;
      }
    }

    return best;
  },

  // Magnetic pull — returns adjusted position when near a snap point
  magneticPull(currentX, currentY, snapX, snapY, threshold = 40) {
    const dist = this.distance(currentX, currentY, snapX, snapY);
    if (dist > threshold) return null;

    const strength = 1 - (dist / threshold);
    const pullX = currentX + (snapX - currentX) * strength * 0.3;
    const pullY = currentY + (snapY - currentY) * strength * 0.3;
    return { x: pullX, y: pullY, strength };
  },
};
