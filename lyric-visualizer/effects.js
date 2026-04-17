// ─── Effects Engine — each effect is a function(el, text, duration) ───

const Effects = {

  // ─── Water / Sink Effects ───

  drip(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line drip';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'drip-char';
      span.style.animationDelay = `${i * 80}ms`;
      el.appendChild(span);
    });
  },

  drain(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line drain';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'drain-word';
      span.style.animationDelay = `${i * 200}ms`;
      span.style.setProperty('--sink-angle', `${(i - 1.5) * 15}deg`);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  spiral(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line spiral-container';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'spiral-char';
      const angle = (i / chars.length) * 720;
      const radius = 120 - (i / chars.length) * 80;
      span.style.setProperty('--angle', `${angle}deg`);
      span.style.setProperty('--radius', `${radius}px`);
      span.style.animationDelay = `${i * 60}ms`;
      el.appendChild(span);
    });
  },

  vortex(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line vortex';
    el.textContent = text;
    el.style.setProperty('--dur', `${dur}ms`);
  },

  vortexFinal(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line vortex-final';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'vortex-final-char';
      span.style.animationDelay = `${i * 100}ms`;
      span.style.setProperty('--i', i);
      el.appendChild(span);
    });
  },

  mudSmear(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line mud';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'mud-word';
      span.style.animationDelay = `${i * 250}ms`;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  // ─── Character / Age Effects ───

  counter(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line counter';
    const target = parseInt(text) || 41;
    let current = 0;
    const step = dur / target;
    const numEl = document.createElement('span');
    numEl.className = 'counter-num';
    const labelEl = document.createElement('span');
    labelEl.className = 'counter-label';
    labelEl.textContent = ' years';
    labelEl.style.opacity = '0';
    el.appendChild(numEl);
    el.appendChild(labelEl);

    const interval = setInterval(() => {
      current++;
      numEl.textContent = current;
      if (current >= target) {
        clearInterval(interval);
        labelEl.style.opacity = '1';
        labelEl.style.transition = 'opacity 0.5s';
      }
    }, step);
  },

  explode(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line explode';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'explode-word';
      span.style.setProperty('--dx', `${(Math.random() - 0.5) * 300}px`);
      span.style.setProperty('--dy', `${(Math.random() - 0.5) * 200}px`);
      span.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);
      span.style.animationDelay = `${i * 120}ms`;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  salt(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line salt';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'salt-grain';
      span.style.animationDelay = `${Math.random() * 1500}ms`;
      span.style.setProperty('--fall', `${30 + Math.random() * 80}px`);
      el.appendChild(span);
    });
  },

  // ─── Haze / Glaze Effects ───

  melt(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line melt';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'melt-word';
      span.style.animationDelay = `${i * 200}ms`;
      span.style.setProperty('--droop', `${10 + Math.random() * 30}px`);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  glaze(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line glaze';
    el.textContent = text;
  },

  glazeDeep(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line glaze-deep';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'glaze-deep-char';
      span.style.animationDelay = `${i * 120}ms`;
      el.appendChild(span);
    });
  },

  // ─── Type / Write Effects ───

  typewriter(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line typewriter';
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.textContent = '|';
    el.appendChild(cursor);

    const type = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(type, 80 + Math.random() * 60);
      }
    };
    type();
  },

  handwritten(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line handwritten';
    el.textContent = text;
  },

  // ─── Emotion Effects ───

  bloom(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line bloom';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'bloom-word';
      span.style.animationDelay = `${i * 300}ms`;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  rise(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line rise';
    el.innerHTML = text.replace(/\n/g, '<br>');
  },

  pulse(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line pulse-text';
    el.textContent = text;
  },

  reach(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line reach';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'reach-word';
      span.style.animationDelay = `${i * 200}ms`;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  calm(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line calm';
    el.textContent = text;
  },

  // ─── Burning / Fatigue ───

  ember(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line ember';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'ember-char';
      span.style.animationDelay = `${i * 150}ms`;
      el.appendChild(span);
    });
  },

  collapse(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line collapse';
    el.textContent = text;
  },

  rewind(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line rewind';
    el.innerHTML = text.replace(/\n/g, '<br>');
  },

  glow(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line glow';
    el.textContent = text;
  },

  settle(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line settle';
    el.innerHTML = text.replace(/\n/g, '<br>');
  },

  // ─── Walk ───

  footsteps(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line footsteps';
    const words = text.split(' ');
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.className = 'step-word';
      span.style.animationDelay = `${i * 350}ms`;
      span.style.setProperty('--bob', i % 2 === 0 ? '-8px' : '8px');
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  },

  dissolve(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line dissolve';
    const chars = text.split('');
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.className = 'dissolve-char';
      span.style.animationDelay = `${i * 50}ms`;
      el.appendChild(span);
    });
  },

  // ─── Utility ───

  pause(el, text, dur) {
    el.innerHTML = '';
    el.className = 'line pause';
  },
};
