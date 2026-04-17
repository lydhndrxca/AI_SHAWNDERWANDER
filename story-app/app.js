// ─── State ───

let currentStory = null;
let currentPageIdx = 0;
let promptExpanded = false;

// ─── DOM ───

const libraryScreen = document.getElementById('library');
const storyScreen = document.getElementById('story-view');
const storyList = document.getElementById('story-list');
const storyText = document.getElementById('story-text');
const promptChip = document.getElementById('prompt-chip');
const promptLabel = document.getElementById('prompt-label');
const promptExpandEl = document.getElementById('prompt-expand');
const pageIndicator = document.getElementById('page-indicator');
const progressDots = document.getElementById('progress-dots');
const btnBackPage = document.getElementById('btn-back-page');
const btnNextPage = document.getElementById('btn-next-page');
const btnExit = document.getElementById('btn-exit');

// ─── Build Library ───

STORIES.forEach((story, idx) => {
  const card = document.createElement('button');
  card.className = 'story-card';
  card.style.setProperty('--card-color', story.color);

  card.innerHTML = `
    <div class="story-card-inspired">Inspired by ${story.inspired}</div>
    <div class="story-card-head">
      <span class="story-card-emoji">${story.emoji}</span>
      <span class="story-card-title">${story.title}</span>
    </div>
    <div class="story-card-desc">${story.cover}</div>
  `;

  card.addEventListener('click', () => openStory(idx));
  storyList.appendChild(card);
});

// ─── Open Story ───

function openStory(idx) {
  currentStory = STORIES[idx];
  currentPageIdx = 0;

  document.documentElement.style.setProperty('--story-color', currentStory.color);

  buildDots();
  renderPage();

  libraryScreen.classList.remove('active');
  storyScreen.classList.add('active');
}

function closeStory() {
  storyScreen.classList.remove('active');
  libraryScreen.classList.add('active');
  currentStory = null;
}

btnExit.addEventListener('click', closeStory);

// ─── Build Progress Dots ───

function buildDots() {
  progressDots.innerHTML = '';
  currentStory.pages.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'p-dot';
    progressDots.appendChild(dot);
  });
}

// ─── Render Page ───

function renderPage() {
  const page = currentStory.pages[currentPageIdx];

  storyText.classList.remove('visible');
  promptChip.style.opacity = '0';
  promptExpandEl.classList.remove('visible');
  promptChip.classList.remove('expanded');
  promptExpanded = false;

  setTimeout(() => {
    storyText.textContent = page.text;
    promptLabel.textContent = page.prompt;
    promptExpandEl.textContent = page.expand;

    storyText.classList.add('visible');
    promptChip.style.animation = 'none';
    promptChip.offsetHeight; // reflow
    promptChip.style.animation = '';
    promptChip.style.opacity = '';

    updateNav();
    updateDots();
  }, 200);
}

// ─── Prompt Toggle ───

promptChip.addEventListener('click', () => {
  promptExpanded = !promptExpanded;
  promptExpandEl.classList.toggle('visible', promptExpanded);
  promptChip.classList.toggle('expanded', promptExpanded);
});

// ─── Navigation ───

function updateNav() {
  btnBackPage.disabled = currentPageIdx === 0;
  btnNextPage.disabled = currentPageIdx === currentStory.pages.length - 1;
  pageIndicator.textContent = `${currentPageIdx + 1} / ${currentStory.pages.length}`;
}

function updateDots() {
  const dots = progressDots.querySelectorAll('.p-dot');
  dots.forEach((dot, i) => {
    dot.className = 'p-dot';
    if (i === currentPageIdx) dot.classList.add('active');
    else if (i < currentPageIdx) dot.classList.add('past');
  });
}

function goPage(idx) {
  if (idx < 0 || idx >= currentStory.pages.length) return;
  currentPageIdx = idx;
  renderPage();
}

btnBackPage.addEventListener('click', () => goPage(currentPageIdx - 1));
btnNextPage.addEventListener('click', () => goPage(currentPageIdx + 1));

// ─── Keyboard ───

document.addEventListener('keydown', (e) => {
  if (!currentStory) return;
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    goPage(currentPageIdx + 1);
  } else if (e.key === 'ArrowLeft') {
    goPage(currentPageIdx - 1);
  } else if (e.key === 'Escape') {
    closeStory();
  }
});

// ─── Swipe ───

let touchX = 0;
let touchY = 0;

document.addEventListener('touchstart', (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (!currentStory) return;
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) goPage(currentPageIdx + 1);
    else goPage(currentPageIdx - 1);
  }
}, { passive: true });
