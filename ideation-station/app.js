// ─── Matrix Rain ───

(function initRain() {
  const canvas = document.getElementById('rain');
  const ctx = canvas.getContext('2d');
  let cols, drops;
  const chars = 'IDEATIONSTATION01アイデア'.split('');
  const fontSize = 14;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

// ─── Build Cards ───

const grid = document.getElementById('card-grid');
const overlay = document.getElementById('detail-overlay');
const detailContent = document.getElementById('detail-content');
const detailClose = document.getElementById('detail-close');

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function scoreClass(v) { return v >= 7 ? 'high' : v >= 5 ? 'mid' : 'low'; }

for (const b of BRAINSTORMS) {
  const card = document.createElement('div');
  card.className = 'brainstorm-card';
  card.innerHTML = `
    <div class="card-date">${esc(b.date)}</div>
    <div class="card-seed">${esc(b.seed)}</div>
    <div class="card-winner-label">TOP RESULT</div>
    <div class="card-winner-title">${esc(b.winner.title)}</div>
    <div class="card-score">${b.winner.score}/10</div>
    <div class="card-pitch">${esc(b.winner.pitch)}</div>
    <div class="card-risk">${esc(b.winner.risk)}</div>
    <div class="card-expand-hint">CLICK TO EXPAND FULL REPORT</div>
  `;
  card.addEventListener('click', () => openDetail(b));
  grid.appendChild(card);
}

// ─── Detail View ───

detailClose.addEventListener('click', closeDetail);
overlay.addEventListener('click', e => { if (e.target === overlay) closeDetail(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

function closeDetail() { overlay.classList.add('hidden'); document.body.style.overflow = ''; }

function openDetail(b) {
  const s = b.stages;
  let html = '';

  // Header
  html += `<div class="detail-header">
    <div class="detail-date">${esc(b.date)} &mdash; ${esc(b.title)}</div>
    <div class="detail-title">${esc(b.winner.title)}</div>
    <div class="detail-seed">${esc(b.seed)}</div>
  </div>`;

  // Stimuli
  html += `<div class="stage-section">
    <div class="stage-label">STAGE 3 &mdash; CROSS-DOMAIN STIMULI</div>`;
  for (const st of s.stimuli) {
    html += `<div class="stimulus-item">
      <span class="stimulus-domain">${esc(st.domain)}</span> &mdash;
      <span class="stimulus-principle">${esc(st.principle)}</span><br>
      <span class="stimulus-connection">${esc(st.connection)}</span>
    </div>`;
  }
  html += `</div>`;

  // Candidates
  html += `<div class="stage-section">
    <div class="stage-label">STAGE 4-5 &mdash; CANDIDATES &amp; SCORES</div>
    <div class="score-header">
      <span>#</span><span>TITLE</span><span>GEN</span><span>NOV</span><span>FEA</span><span></span>
    </div>
    <div class="candidates-grid">`;
  for (const c of s.candidates) {
    const k = c.kept ? 'kept' : 'cut';
    const lensClass = 'lens-' + c.lens;
    html += `<div class="candidate-row ${k}">
      <span class="candidate-num">${c.num}</span>
      <span class="candidate-title">${esc(c.title)}<span class="lens-tag ${lensClass}">${c.lens}</span></span>
      <span class="score-cell ${scoreClass(10 - c.generic)}">${c.generic}</span>
      <span class="score-cell ${scoreClass(c.novel)}">${c.novel}</span>
      <span class="score-cell ${scoreClass(c.feasible)}">${c.feasible}</span>
      <span class="candidate-verdict ${k}">${c.kept ? 'KEEP' : 'CUT'}</span>
      <div class="candidate-pitch">${esc(c.pitch)}${c.cutReason ? ' <span style="color:var(--red);">(' + esc(c.cutReason) + ')</span>' : ''}</div>
    </div>`;
  }
  html += `</div></div>`;

  // Hybrids
  html += `<div class="stage-section">
    <div class="stage-label">STAGE 6 &mdash; HYBRIDS</div>`;
  for (const h of s.hybrids) {
    html += `<div class="hybrid-item">
      <div class="hybrid-title">${esc(h.title)}</div>
      <div class="hybrid-parents">Parents: ${esc(h.parents)}</div>
      <div class="hybrid-pitch">${esc(h.pitch)}</div>
    </div>`;
  }
  html += `</div>`;

  // Final Ranking
  html += `<div class="stage-section">
    <div class="stage-label">STAGE 9 &mdash; FINAL RANKING</div>
    <table class="ranking-table">
      <thead><tr>
        <th>#</th><th>IDEA</th><th>FIT</th><th>FEAS</th><th>DIST</th><th>RES</th><th>SCORE</th>
      </tr></thead><tbody>`;
  for (const r of s.ranking) {
    const pct = (r.score / 10) * 100;
    html += `<tr>
      <td class="ranking-rank">${r.rank}</td>
      <td class="ranking-title-cell">${esc(r.title)}</td>
      <td>${r.fit}</td><td>${r.feasible}</td><td>${r.distinct}</td><td>${r.resilient}</td>
      <td>
        <span class="ranking-score">${r.score}</span>
        <div class="ranking-bar"><div class="ranking-bar-fill" style="width:${pct}%"></div></div>
      </td>
    </tr>`;
  }
  html += `</tbody></table></div>`;

  // Challenges
  html += `<div class="stage-section">
    <div class="stage-label">STAGE 8 &mdash; ADVERSARIAL CHALLENGES</div>`;
  for (const ch of s.challenges) {
    html += `<div class="challenge-item">
      <div class="challenge-title">${esc(ch.title)}</div>
      <div class="challenge-perspective">${esc(ch.perspective)}</div>
      <div class="challenge-objection">"${esc(ch.objection)}"</div>
      <div class="challenge-killshot">${esc(ch.killShot)}</div>
      <div class="challenge-rebuttal">${esc(ch.rebuttal)}</div>
      <div class="challenge-confidence">CONFIDENCE: ${ch.confidence}/10</div>
    </div>`;
  }
  html += `</div>`;

  detailContent.innerHTML = html;
  overlay.classList.remove('hidden');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
