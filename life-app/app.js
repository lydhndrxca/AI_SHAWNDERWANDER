// ─── State ───

let currentScreen = 'home';
let prevScreen = 'home';
let currentCategory = null;
let deck = [];
let deckIndex = 0;
let punchRevealed = false;

// ─── DOM ───

const screens = {
  home: document.getElementById('home'),
  'joke-pick': document.getElementById('joke-pick'),
  'card-view': document.getElementById('card-view'),
};

const card = document.getElementById('card');
const cardSetup = document.getElementById('card-setup');
const cardPunch = document.getElementById('card-punch');
const btnReveal = document.getElementById('btn-reveal');
const btnNext = document.getElementById('btn-next');
const cardCounter = document.getElementById('card-counter');

// ─── Navigation ───

function goTo(screenId) {
  prevScreen = currentScreen;
  screens[currentScreen]?.classList.remove('active');
  currentScreen = screenId;
  screens[currentScreen]?.classList.add('active');
}

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.to;
    if (target === 'back') {
      goTo(prevScreen === 'card-view' ? 'home' : prevScreen);
    } else {
      goTo(target);
    }
  });
});

// ─── Home Tiles ───

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const cat = tile.dataset.cat;

    if (cat === 'jokes') {
      goTo('joke-pick');
      return;
    }

    currentCategory = cat;

    if (cat === 'starters') {
      deck = shuffle(DATA.starters).map(s => ({ type: 'single', text: s }));
    } else if (cat === 'wyr') {
      deck = shuffle(DATA.wouldYouRather).map(w => ({ type: 'wyr', options: w }));
    } else if (cat === 'icebreakers') {
      deck = shuffle(DATA.iceBreakers).map(s => ({ type: 'single', text: s }));
    } else if (cat === 'toasts') {
      deck = shuffle(DATA.toasts).map(s => ({ type: 'single', text: s }));
    }

    deckIndex = 0;
    showCard();
    goTo('card-view');
  });
});

// ─── Joke Mode Picker ───

document.querySelectorAll('.pick-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    currentCategory = 'jokes';
    const raw = mode === 'kids' ? DATA.kidsJokes : DATA.adultJokes;
    deck = shuffle(raw).map(j => ({ type: 'joke', setup: j.setup, punch: j.punch }));
    deckIndex = 0;
    showCard();
    goTo('card-view');
  });
});

// ─── Card Display ───

function showCard() {
  const item = deck[deckIndex];
  punchRevealed = false;

  card.className = 'card';
  cardSetup.textContent = '';
  cardPunch.textContent = '';
  cardPunch.classList.remove('visible');

  if (item.type === 'joke') {
    cardSetup.textContent = item.setup;
    cardPunch.textContent = item.punch || '';
    btnReveal.classList.toggle('hidden', !item.punch);
    btnNext.textContent = 'Next';
  } else if (item.type === 'single') {
    card.classList.add('single');
    cardSetup.textContent = item.text;
    btnReveal.classList.add('hidden');
    btnNext.textContent = 'Next';
  } else if (item.type === 'wyr') {
    card.classList.add('wyr-card');
    cardSetup.innerHTML = '';

    const opt1 = document.createElement('div');
    opt1.className = 'wyr-option';
    opt1.textContent = item.options[0];

    const or = document.createElement('div');
    or.className = 'wyr-or';
    or.textContent = 'or';

    const opt2 = document.createElement('div');
    opt2.className = 'wyr-option';
    opt2.textContent = item.options[1];

    cardSetup.appendChild(opt1);
    cardSetup.appendChild(or);
    cardSetup.appendChild(opt2);

    btnReveal.classList.add('hidden');
    btnNext.textContent = 'Next';
  }

  cardCounter.textContent = `${deckIndex + 1} / ${deck.length}`;
}

// ─── Reveal Punchline ───

btnReveal.addEventListener('click', () => {
  if (punchRevealed) return;
  punchRevealed = true;
  cardPunch.classList.add('visible');
  btnReveal.classList.add('hidden');
});

// ─── Next Card ───

btnNext.addEventListener('click', nextCard);

function nextCard() {
  card.classList.add('swipe-out');

  setTimeout(() => {
    deckIndex++;
    if (deckIndex >= deck.length) {
      deck = shuffle(deck);
      deckIndex = 0;
    }

    card.classList.remove('swipe-out');
    card.classList.add('swipe-in');
    showCard();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.remove('swipe-in');
      });
    });
  }, 280);
}

// ─── Swipe Gesture on Card ───

let touchX = 0;
let touchY = 0;

document.getElementById('card-container').addEventListener('touchstart', (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}, { passive: true });

document.getElementById('card-container').addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;

  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) nextCard();
  }
}, { passive: true });

// ─── Tap card to reveal (for jokes) ───

card.addEventListener('click', (e) => {
  if (e.target.closest('.action-btn')) return;
  if (deck[deckIndex]?.type === 'joke' && !punchRevealed && deck[deckIndex].punch) {
    punchRevealed = true;
    cardPunch.classList.add('visible');
    btnReveal.classList.add('hidden');
  }
});
