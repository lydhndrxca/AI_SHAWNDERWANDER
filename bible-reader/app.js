// ─── State ───
let currentBook = null;
let currentPage = 0;
let currentDepth = 0;

// ─── DOM ───
const libScreen = document.getElementById('library');
const libScroll = document.getElementById('lib-scroll');
const readerScreen = document.getElementById('reader-view');
const pageContent = document.getElementById('page-content');
const pageArea = document.getElementById('page-area');
const bookTitle = document.getElementById('book-title');
const chapterTitle = document.getElementById('chapter-title');
const pageNum = document.getElementById('page-num');
const progressFill = document.getElementById('progress-fill');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const dots = document.querySelectorAll('.dot');
const tocPanel = document.getElementById('toc-panel');
const tocList = document.getElementById('toc-list');
const wikiPanel = document.getElementById('wiki-panel');
const overlay = document.getElementById('overlay');

// ─── Build Library ───
(function buildLibrary() {
  const grouped = {};
  const testamentOrder = [];

  for (const sec of SECTIONS) {
    const t = TESTAMENT_FOR[sec.id];
    if (!grouped[t]) { grouped[t] = []; testamentOrder.push(t); }
    const books = ALL_BOOKS.filter(b => b.section === sec.id);
    if (books.length) grouped[t].push({ section: sec, books });
  }

  for (const t of testamentOrder) {
    const tLabel = document.createElement('div');
    tLabel.className = 'testament-label';
    tLabel.textContent = t;
    libScroll.appendChild(tLabel);

    for (const { section, books } of grouped[t]) {
      const sLabel = document.createElement('div');
      sLabel.className = 'section-label';
      sLabel.textContent = section.name;
      libScroll.appendChild(sLabel);

      for (const book of books) {
        const row = document.createElement('div');
        row.className = 'book-row';
        row.innerHTML = `<span class="book-row-name">${book.shortTitle}</span><span class="book-row-ch">${book.chapters} ch</span>`;
        row.addEventListener('click', () => openBook(book));
        libScroll.appendChild(row);
      }
    }
  }
})();

// ─── Open / Close Book ───
function openBook(book) {
  currentBook = book;
  currentPage = 0;
  currentDepth = 0;
  bookTitle.textContent = book.shortTitle;
  buildTOC();
  renderPage();
  libScreen.classList.remove('active');
  readerScreen.classList.add('active');
  VerseCache.prefetchBook(book.apiBook, book.chapters);
}

document.getElementById('btn-back').addEventListener('click', () => {
  readerScreen.classList.remove('active');
  libScreen.classList.add('active');
  closeAllPanels();
});

// ─── TOC ───
function buildTOC() {
  tocList.innerHTML = '';
  currentBook.pages.forEach((p, i) => {
    const li = document.createElement('li');
    const ch = document.createElement('span');
    ch.className = 'toc-ch';
    ch.textContent = p.chapter;
    li.appendChild(ch);
    li.appendChild(document.createTextNode(p.title));
    li.addEventListener('click', () => { currentPage = i; currentDepth = 0; closeAllPanels(); renderPage(); });
    tocList.appendChild(li);
  });
}

document.getElementById('toc-btn').addEventListener('click', () => openPanel('toc'));

// ─── Panels ───
function openPanel(id) {
  closeAllPanels();
  document.getElementById(id + '-panel').classList.remove('hidden');
  document.getElementById(id + '-panel').classList.add('visible');
  overlay.classList.remove('hidden');
  overlay.classList.add('visible');
}

function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => { p.classList.remove('visible'); p.classList.add('hidden'); });
  overlay.classList.remove('visible'); overlay.classList.add('hidden');
}

document.querySelectorAll('.panel-close').forEach(btn => btn.addEventListener('click', closeAllPanels));
overlay.addEventListener('click', closeAllPanels);
document.addEventListener('click', e => {
  if (e.target.matches('#jesus-toc-panel .panel-close')) closeAllPanels();
});

// ─── Render Page ───
function renderPage() {
  const page = currentBook.pages[currentPage];
  pageContent.style.opacity = '0';
  setTimeout(() => {
    pageContent.innerHTML = '';
    pageArea.scrollTop = 0;
    chapterTitle.textContent = page.title;
    if (currentDepth === 0) renderSummary(page);
    else renderFull(page);
    updateNav(); updateDots(); updateProgress();
    pageContent.style.opacity = '1';
  }, 180);
}

function renderSummary(page) {
  const el = document.createElement('div');
  el.className = 'depth-0';
  el.textContent = page.summary;
  el.addEventListener('click', () => { currentDepth = 1; renderPage(); });
  pageContent.appendChild(el);
}

async function renderFull(page) {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Loading verses\u2026';
  pageContent.appendChild(loading);

  let verses = await VerseCache.getChapter(currentBook.apiBook, page.chapter);
  if (!verses) { loading.textContent = 'Could not load verses. Check your connection.'; loading.className = 'loading error'; return; }
  if (page.verseStart && page.verseEnd) verses = verses.filter(v => v.num >= page.verseStart && v.num <= page.verseEnd);

  loading.remove();

  const label = document.createElement('span');
  label.className = 'depth-label';
  label.textContent = `chapter ${page.chapter}`;
  pageContent.appendChild(label);

  const container = document.createElement('div');
  container.className = 'depth-1-full';
  for (const v of verses) {
    const el = document.createElement('div');
    el.className = 'verse';
    el.innerHTML = `<span class="verse-num">${v.num}</span><span class="verse-text">${injectWiki(v.text, page.wikiTerms)}</span>`;
    container.appendChild(el);
  }
  pageContent.appendChild(container);

  container.querySelectorAll('.wiki-link').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); showWiki(a.dataset.wikiId); });
  });
}

// ─── Wiki ───
function injectWiki(text, terms) {
  if (!terms || !terms.length) return esc(text);
  let html = esc(text);
  const sorted = [...terms].sort((a, b) => b.phrase.length - a.phrase.length);
  const used = new Set();
  for (const t of sorted) {
    if (used.has(t.id)) continue;
    const re = new RegExp('\\b(' + t.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b', 'i');
    const m = html.match(re);
    if (m) { html = html.replace(re, `<a class="wiki-link" data-wiki-id="${t.id}" href="#">${m[0]}</a>`); used.add(t.id); }
  }
  return html;
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function showWiki(id) {
  const e = (typeof WIKI !== 'undefined') && WIKI[id];
  if (!e) return;
  document.getElementById('wiki-category').textContent = e.category;
  document.getElementById('wiki-title').textContent = e.title;
  document.getElementById('wiki-body').textContent = e.text;
  const refs = document.getElementById('wiki-refs');
  if (e.references?.length) { refs.textContent = e.references.join(' \u00B7 '); refs.style.display = ''; }
  else refs.style.display = 'none';
  openPanel('wiki');
}

// ─── Nav ───
function updateNav() {
  btnPrev.disabled = currentPage === 0;
  btnNext.disabled = currentPage === currentBook.pages.length - 1;
  pageNum.textContent = `${currentPage + 1} / ${currentBook.pages.length}`;
}

function updateDots() { dots.forEach((d, i) => d.classList.toggle('active', i === currentDepth)); }

function updateProgress() {
  const total = currentBook.pages.length * 2;
  progressFill.style.width = `${((currentPage * 2 + currentDepth + 1) / total) * 100}%`;
}

function goPage(i) {
  if (i < 0 || i >= currentBook.pages.length) return;
  currentPage = i; currentDepth = 0; closeAllPanels(); renderPage();
}

btnPrev.addEventListener('click', () => goPage(currentPage - 1));
btnNext.addEventListener('click', () => goPage(currentPage + 1));
dots.forEach(d => d.addEventListener('click', () => { const v = +d.dataset.depth; if (v !== currentDepth) { currentDepth = v; renderPage(); } }));

document.addEventListener('keydown', e => {
  if (jesusMode || argmapMode || !currentBook) return;
  if (e.key === 'ArrowLeft') goPage(currentPage - 1);
  else if (e.key === 'ArrowRight') goPage(currentPage + 1);
  else if ((e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') && currentDepth === 0) { e.preventDefault(); currentDepth = 1; renderPage(); }
  else if (e.key === 'ArrowUp' && currentDepth === 1) { e.preventDefault(); currentDepth = 0; renderPage(); }
  else if (e.key === 'Escape') { if (document.querySelector('.panel.visible')) closeAllPanels(); else if (currentDepth) { currentDepth = 0; renderPage(); } }
});

let tx = 0, ty = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  if (argmapMode) { dx < 0 ? argmapGo(argmapIdx + 1) : argmapGo(argmapIdx - 1); }
  else if (jesusMode) { dx < 0 ? jesusGo(jesusIdx + 1) : jesusGo(jesusIdx - 1); }
  else if (currentBook) { dx < 0 ? goPage(currentPage + 1) : goPage(currentPage - 1); }
}, { passive: true });

// ═══════ WORDS OF JESUS MODE ═══════

let jesusMode = false;
let jesusIdx = 0;

const jesusView = document.getElementById('jesus-view');
const jesusContent = document.getElementById('jesus-content');
const jesusArea = document.getElementById('jesus-area');
const jesusRef = document.getElementById('jesus-ref');
const jesusSectionName = document.getElementById('jesus-section-name');
const jesusContextEl = document.getElementById('jesus-context');
const jesusNum = document.getElementById('jesus-num');
const jesusProgressFill = document.getElementById('jesus-progress-fill');
const jesusPrev = document.getElementById('jesus-prev');
const jesusNext = document.getElementById('jesus-next');
const jesusTocPanel = document.getElementById('jesus-toc-panel');
const jesusTocList = document.getElementById('jesus-toc-list');
const jesusToggleBtn = document.getElementById('btn-jesus-mode');

jesusToggleBtn.addEventListener('click', () => {
  jesusMode = true;
  jesusIdx = 0;
  jesusToggleBtn.classList.add('active');
  libScreen.classList.remove('active');
  jesusView.classList.add('active');
  buildJesusTOC();
  renderJesus();
});

document.getElementById('jesus-btn-back').addEventListener('click', () => {
  jesusMode = false;
  jesusToggleBtn.classList.remove('active');
  jesusView.classList.remove('active');
  libScreen.classList.add('active');
  closeAllPanels();
});

document.getElementById('jesus-toc-btn').addEventListener('click', () => {
  closeAllPanels();
  jesusTocPanel.classList.remove('hidden');
  jesusTocPanel.classList.add('visible');
  overlay.classList.remove('hidden');
  overlay.classList.add('visible');
});

function buildJesusTOC() {
  jesusTocList.innerHTML = '';
  let globalIdx = 0;
  for (const sec of JESUS_SECTIONS) {
    const label = document.createElement('div');
    label.className = 'jesus-toc-section';
    label.textContent = sec.name;
    jesusTocList.appendChild(label);
    for (const r of sec.readings) {
      const idx = globalIdx++;
      const item = document.createElement('div');
      item.className = 'jesus-toc-item';
      item.innerHTML = `${r.label}<span class="jesus-toc-context">${r.context}</span>`;
      item.addEventListener('click', () => { jesusIdx = idx; closeAllPanels(); renderJesus(); });
      jesusTocList.appendChild(item);
    }
  }
}

async function renderJesus() {
  const r = JESUS_READINGS[jesusIdx];
  jesusContent.style.opacity = '0';

  setTimeout(async () => {
    jesusContent.innerHTML = '';
    jesusArea.scrollTop = 0;
    jesusSectionName.textContent = r.section;
    jesusRef.textContent = r.label;
    jesusContextEl.textContent = r.context;
    jesusContextEl.style.animation = 'none';
    jesusContextEl.offsetHeight;
    jesusContextEl.style.animation = '';

    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading\u2026';
    jesusContent.appendChild(loading);
    jesusContent.style.opacity = '1';

    let verses = await VerseCache.getChapter(r.book, r.chapter);
    if (!verses) { loading.textContent = 'Could not load verses.'; loading.className = 'loading error'; updateJesusNav(); return; }
    if (r.verses) verses = verses.filter(v => r.verses.includes(v.num));
    else if (r.verseStart && r.verseEnd) verses = verses.filter(v => v.num >= r.verseStart && v.num <= r.verseEnd);

    loading.remove();
    const container = document.createElement('div');
    container.className = 'jesus-verses-container';
    for (const v of verses) {
      const el = document.createElement('div');
      el.className = 'jesus-verse';
      el.innerHTML = `<span class="verse-num">${v.num}</span><span class="verse-text">${esc(v.text)}</span>`;
      container.appendChild(el);
    }
    jesusContent.appendChild(container);
    updateJesusNav();
  }, 180);
}

function updateJesusNav() {
  jesusPrev.disabled = jesusIdx === 0;
  jesusNext.disabled = jesusIdx === JESUS_READINGS.length - 1;
  jesusNum.textContent = `${jesusIdx + 1} / ${JESUS_READINGS.length}`;
  jesusProgressFill.style.width = `${((jesusIdx + 1) / JESUS_READINGS.length) * 100}%`;
}

function jesusGo(i) {
  if (i < 0 || i >= JESUS_READINGS.length) return;
  jesusIdx = i; closeAllPanels(); renderJesus();
}

jesusPrev.addEventListener('click', () => jesusGo(jesusIdx - 1));
jesusNext.addEventListener('click', () => jesusGo(jesusIdx + 1));

document.addEventListener('keydown', e => {
  if (!jesusMode) return;
  if (argmapMode) return;
  if (e.key === 'ArrowLeft') jesusGo(jesusIdx - 1);
  else if (e.key === 'ArrowRight') jesusGo(jesusIdx + 1);
  else if (e.key === 'Escape') { if (document.querySelector('.panel.visible')) closeAllPanels(); }
});

// ═══════ ARGUMENT MAP MODE ═══════

let argmapMode = false;
let argmapIdx = 0;

const argmapView = document.getElementById('argmap-view');
const argmapContent = document.getElementById('argmap-content');
const argmapArea = document.getElementById('argmap-area');
const argmapRef = document.getElementById('argmap-ref');
const argmapSectionName = document.getElementById('argmap-section-name');
const argmapContextEl = document.getElementById('argmap-context');
const argmapNum = document.getElementById('argmap-num');
const argmapProgressFill = document.getElementById('argmap-progress-fill');
const argmapPrev = document.getElementById('argmap-prev');
const argmapNext = document.getElementById('argmap-next');
const argmapTocPanel = document.getElementById('argmap-toc-panel');
const argmapTocList = document.getElementById('argmap-toc-list');
const argmapToggleBtn = document.getElementById('btn-argmap-mode');

const ARGMAP_TYPE_COLORS = {
  claim: '#3d5a80', ground: '#5e8c61', inference: '#8b6f4e',
  condition: '#9b7fb8', result: '#9b7fb8', contrast: '#c17b4a',
  exhortation: '#8b2020', question: '#6b8fa3', answer: '#6b8fa3',
};

const ARGMAP_TYPE_LABELS = {
  claim: 'Claim', ground: 'Reason', inference: 'Conclusion',
  condition: 'If', result: 'Then', contrast: 'Contrast',
  exhortation: 'Apply', question: 'Question', answer: 'Answer',
};

argmapToggleBtn.addEventListener('click', () => {
  argmapMode = true;
  argmapIdx = 0;
  argmapToggleBtn.classList.add('active');
  libScreen.classList.remove('active');
  argmapView.classList.add('active');
  buildArgmapTOC();
  renderArgMap();
});

document.getElementById('argmap-btn-back').addEventListener('click', () => {
  argmapMode = false;
  argmapToggleBtn.classList.remove('active');
  argmapView.classList.remove('active');
  libScreen.classList.add('active');
  closeAllPanels();
});

document.getElementById('argmap-toc-btn').addEventListener('click', () => {
  closeAllPanels();
  argmapTocPanel.classList.remove('hidden');
  argmapTocPanel.classList.add('visible');
  overlay.classList.remove('hidden');
  overlay.classList.add('visible');
});

document.addEventListener('click', e => {
  if (e.target.matches('#argmap-toc-panel .panel-close')) closeAllPanels();
});

function buildArgmapTOC() {
  argmapTocList.innerHTML = '';
  let globalIdx = 0;
  for (const sec of ARGUMENT_SECTIONS) {
    const label = document.createElement('div');
    label.className = 'argmap-toc-section';
    label.textContent = sec.name;
    argmapTocList.appendChild(label);
    for (const m of sec.maps) {
      const idx = globalIdx++;
      const item = document.createElement('div');
      item.className = 'argmap-toc-item';
      item.innerHTML = `${m.label}<span class="argmap-toc-context">${m.title}</span>`;
      item.addEventListener('click', () => { argmapIdx = idx; closeAllPanels(); renderArgMap(); });
      argmapTocList.appendChild(item);
    }
  }
}

function getNodeDepth(nodes, node) {
  let depth = 0;
  let current = node;
  while (current.parent) {
    const p = nodes.find(n => n.id === current.parent);
    if (!p) break;
    depth++;
    current = p;
  }
  return Math.min(depth, 3);
}

function renderArgMap() {
  const m = ARGUMENT_MAPS[argmapIdx];
  argmapContent.style.opacity = '0';

  setTimeout(() => {
    argmapContent.innerHTML = '';
    argmapArea.scrollTop = 0;
    argmapSectionName.textContent = m.section;
    argmapRef.textContent = m.label;
    argmapContextEl.textContent = m.context;
    argmapContextEl.style.animation = 'none';
    argmapContextEl.offsetHeight;
    argmapContextEl.style.animation = '';

    const usedTypes = [...new Set(m.nodes.map(n => n.type))];
    if (usedTypes.length > 1) {
      const legend = document.createElement('div');
      legend.className = 'argmap-legend';
      for (const t of usedTypes) {
        const item = document.createElement('span');
        item.className = 'argmap-legend-item';
        item.innerHTML = `<span class="argmap-legend-swatch" style="background:${ARGMAP_TYPE_COLORS[t] || 'var(--ink-faint)'}"></span>${ARGMAP_TYPE_LABELS[t] || t}`;
        legend.appendChild(item);
      }
      argmapContent.appendChild(legend);
    }

    const flow = document.createElement('div');
    flow.className = 'argmap-flow';

    for (let i = 0; i < m.nodes.length; i++) {
      const node = m.nodes[i];
      const depth = getNodeDepth(m.nodes, node);

      if (i > 0) {
        const conn = document.createElement('div');
        conn.className = 'argmap-connector';
        conn.dataset.depth = depth;
        flow.appendChild(conn);
      }

      const el = document.createElement('div');
      el.className = `argmap-node type-${node.type}`;
      el.dataset.depth = depth;

      let inner = '';
      if (node.keyword) {
        inner += `<div class="argmap-keyword">${esc(node.keyword)}</div>`;
      }
      inner += `<span class="argmap-verse-ref">${node.verses}</span>`;
      inner += `<span class="argmap-text">${esc(node.text)}</span>`;
      el.innerHTML = inner;
      flow.appendChild(el);
    }

    argmapContent.appendChild(flow);
    argmapContent.style.opacity = '1';
    updateArgmapNav();
  }, 180);
}

function updateArgmapNav() {
  argmapPrev.disabled = argmapIdx === 0;
  argmapNext.disabled = argmapIdx === ARGUMENT_MAPS.length - 1;
  argmapNum.textContent = `${argmapIdx + 1} / ${ARGUMENT_MAPS.length}`;
  argmapProgressFill.style.width = `${((argmapIdx + 1) / ARGUMENT_MAPS.length) * 100}%`;
}

function argmapGo(i) {
  if (i < 0 || i >= ARGUMENT_MAPS.length) return;
  argmapIdx = i; closeAllPanels(); renderArgMap();
}

argmapPrev.addEventListener('click', () => argmapGo(argmapIdx - 1));
argmapNext.addEventListener('click', () => argmapGo(argmapIdx + 1));

document.addEventListener('keydown', e => {
  if (!argmapMode) return;
  if (e.key === 'ArrowLeft') argmapGo(argmapIdx - 1);
  else if (e.key === 'ArrowRight') argmapGo(argmapIdx + 1);
  else if (e.key === 'Escape') { if (document.querySelector('.panel.visible')) closeAllPanels(); }
});
