// ─── Multiplayer UI ───
// Encounter overlay, stat-filtered chat display, lobby, player list

const MP_UI = {

  // ─── The encounter dialogue choices (loaded from server's variant data) ───
  // Duplicated client-side for the SENDER's choice display only.
  // The receiver's version comes from the server.
  DIALOGUE_MENUS: {
    clubhouse: [
      { id: 'greet_hey', label: 'SAY HI', text: 'Hey, good to meet you out here.' },
      { id: 'greet_playing_well', label: 'COMPLIMENT', text: 'Looks like you\'re playing well today.' },
      { id: 'club_cheers', label: 'CHEERS', text: 'Cheers — to a great day at Pebble Beach.' },
      { id: 'club_rematch', label: 'REMATCH', text: 'Same time next week?' },
    ],
    passing: [
      { id: 'greet_hey', label: 'SAY HI', text: 'Hey, good to meet you out here.' },
      { id: 'greet_wave', label: 'WAVE', text: '[Wave]' },
      { id: 'enc_nice_shot', label: 'NICE SHOT', text: 'Great shot.' },
      { id: 'joke_self_deprecating', label: 'SELF-ROAST', text: 'My swing coach would cry if he saw that.' },
    ],
    nearby: [
      { id: 'greet_hey', label: 'SAY HI', text: 'Hey, good to meet you out here.' },
      { id: 'golf_club_advice', label: 'CLUB ADVICE', text: 'I\'d go with one more club here.' },
      { id: 'golf_read_green', label: 'READ THE GREEN', text: 'I think it breaks more than it looks.' },
      { id: 'joke_after_bad_shot', label: 'JOKE', text: 'Hey, at least the ocean didn\'t get it.' },
      { id: 'comp_trash_talk', label: 'TRASH TALK', text: 'Nice shot. Mine was better though.' },
      { id: 'enc_tough_hole', label: 'ENCOURAGE', text: 'Shake it off. Plenty of holes left.' },
    ],
    wave: [
      { id: 'greet_wave', label: 'WAVE BACK', text: '[Wave]' },
      { id: 'enc_good_round', label: 'ACKNOWLEDGE', text: 'You\'re having a hell of a round.' },
    ],
  },

  showLobby(onJoin) {
    const overlay = document.getElementById('mp-overlay');
    const content = document.getElementById('mp-content');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div class="mp-lobby">
        <div class="mp-lobby-title">MULTIPLAYER</div>
        <div class="mp-lobby-subtitle">Play on the same course with real people</div>
        <div class="mp-lobby-form">
          <label class="mp-label">YOUR NAME</label>
          <input type="text" id="mp-name-input" class="mp-input" placeholder="Enter your name" maxlength="16" />
          <label class="mp-label">ROOM CODE <span class="mp-hint">(leave blank to create new)</span></label>
          <input type="text" id="mp-room-input" class="mp-input" placeholder="e.g. ABCD" maxlength="4" style="text-transform:uppercase" />
          <button id="mp-join-btn" class="mp-join-btn">JOIN COURSE</button>
          <button id="mp-cancel-btn" class="mp-cancel-btn">BACK</button>
        </div>
      </div>`;

    overlay.classList.add('open');

    document.getElementById('mp-join-btn').addEventListener('click', () => {
      const name = document.getElementById('mp-name-input').value.trim();
      const code = document.getElementById('mp-room-input').value.trim().toUpperCase();
      if (!name) return;
      onJoin(name, code || null);
    });

    document.getElementById('mp-cancel-btn').addEventListener('click', () => {
      overlay.classList.remove('open');
    });
  },

  showConnected(roomCode, players) {
    const content = document.getElementById('mp-content');
    if (!content) return;

    content.innerHTML = `
      <div class="mp-connected">
        <div class="mp-lobby-title">ON THE COURSE</div>
        <div class="mp-room-code">Room: ${roomCode}</div>
        <div class="mp-player-list" id="mp-player-list">
          ${players.map(p => `<div class="mp-player">${p.name}</div>`).join('')}
        </div>
        <div class="mp-hint">Share the room code with friends to join</div>
        <button id="mp-start-btn" class="mp-join-btn">TEE IT UP</button>
      </div>`;
  },

  hideLobby() {
    const overlay = document.getElementById('mp-overlay');
    if (overlay) overlay.classList.remove('open');
  },

  showEncounter(encounterData, onChoice, onLeave) {
    const overlay = document.getElementById('mp-encounter-overlay');
    const content = document.getElementById('mp-encounter-content');
    if (!overlay || !content) return;

    const type = encounterData.type;
    const otherName = encounterData.otherPlayer.name;
    const menu = this.DIALOGUE_MENUS[type] || this.DIALOGUE_MENUS.passing;

    const typeLabels = {
      clubhouse: 'IN THE CLUBHOUSE',
      passing: 'PASSING BY',
      nearby: 'ON THE SAME HOLE',
      wave: 'ACROSS THE FAIRWAY',
    };

    let html = `
      <div class="mp-enc-header">
        <div class="mp-enc-type">${typeLabels[type] || 'ENCOUNTER'}</div>
        <div class="mp-enc-name">You run into <strong>${otherName}</strong></div>
      </div>
      <div class="mp-enc-chat" id="mp-enc-chat"></div>
      <div class="mp-enc-choices" id="mp-enc-choices">`;

    for (const opt of menu) {
      html += `<button class="mp-enc-choice" data-id="${opt.id}" data-text="${opt.text.replace(/"/g, '&quot;')}">${opt.label}</button>`;
    }

    html += `</div>
      <button class="mp-enc-leave" id="mp-enc-leave">WALK AWAY</button>`;

    content.innerHTML = html;
    overlay.classList.add('open');

    content.querySelectorAll('.mp-enc-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const choiceId = btn.dataset.id;
        const rawText = btn.dataset.text;
        onChoice(choiceId, rawText);
        // Disable briefly to prevent spam
        content.querySelectorAll('.mp-enc-choice').forEach(b => b.disabled = true);
        setTimeout(() => {
          content.querySelectorAll('.mp-enc-choice').forEach(b => b.disabled = false);
        }, 2000);
      });
    });

    document.getElementById('mp-enc-leave').addEventListener('click', () => {
      overlay.classList.remove('open');
      onLeave();
    });
  },

  appendEncounterMessage(fromName, text, isSelf) {
    const chat = document.getElementById('mp-enc-chat');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = `mp-enc-msg ${isSelf ? 'self' : 'other'}`;
    msg.innerHTML = `<span class="mp-enc-msg-name">${fromName}</span><span class="mp-enc-msg-text">${text}</span>`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  },

  hideEncounter() {
    const overlay = document.getElementById('mp-encounter-overlay');
    if (overlay) overlay.classList.remove('open');
  },

  updatePlayerCount(count) {
    const el = document.getElementById('mp-player-count');
    if (el) {
      el.textContent = count > 0 ? `${count} ON COURSE` : '';
      el.style.display = count > 0 ? 'inline' : 'none';
    }
  },
};
