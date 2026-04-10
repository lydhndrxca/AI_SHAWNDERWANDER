// ─── Multiplayer Client ───
// Connects to the game server via Socket.io. Handles encounters,
// stat-filtered dialogue, and player awareness.

const MP = {
  socket: null,
  connected: false,
  roomCode: null,
  playerName: null,
  playerId: null,
  players: [],
  activeEncounter: null,
  encounterCallback: null,

  // Copy of dialogue variants for the sender's choice display
  dialogueOptions: null,

  connect(serverUrl, playerName, roomCode) {
    return new Promise((resolve, reject) => {
      if (typeof io === 'undefined') {
        reject(new Error('Socket.io client not loaded'));
        return;
      }

      this.playerName = playerName;
      this.socket = io(serverUrl, { transports: ['websocket', 'polling'] });

      this.socket.on('connect', () => {
        this.connected = true;
        this.playerId = this.socket.id;
        this.socket.emit('join-room', { roomCode, playerName });
      });

      this.socket.on('room-joined', (data) => {
        this.roomCode = data.code;
        this.players = data.players;
        resolve(data);
      });

      this.socket.on('player-joined', (player) => {
        this.players.push(player);
        if (this._onPlayersChanged) this._onPlayersChanged(this.players);
        this._showNotification(`${player.name} joined the course`);
      });

      this.socket.on('player-left', (player) => {
        this.players = this.players.filter(p => p.id !== player.id);
        if (this._onPlayersChanged) this._onPlayersChanged(this.players);
        this._showNotification(`${player.name} left the course`);
      });

      this.socket.on('player-location', (data) => {
        const p = this.players.find(pl => pl.id === data.id);
        if (p) {
          p.currentHole = data.currentHole;
          p.location = data.location;
        }
      });

      // ─── Encounter Events ───
      this.socket.on('encounter-start', (data) => {
        this.activeEncounter = data;
        if (this._onEncounterStart) this._onEncounterStart(data);
      });

      this.socket.on('encounter-ended', (data) => {
        if (this.activeEncounter && this.activeEncounter.encounterId === data.encounterId) {
          this.activeEncounter = null;
          if (this._onEncounterEnd) this._onEncounterEnd();
        }
      });

      // ─── Dialogue Display ───
      this.socket.on('mp-dialogue-display', (data) => {
        if (this._onDialogueReceived) this._onDialogueReceived(data);
      });

      this.socket.on('clubhouse-display', (data) => {
        if (this._onClubhouseMessage) this._onClubhouseMessage(data);
      });

      this.socket.on('connect_error', (err) => {
        this.connected = false;
        reject(err);
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        this._showNotification('Disconnected from server');
      });

      setTimeout(() => {
        if (!this.connected) reject(new Error('Connection timeout'));
      }, 5000);
    });
  },

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.roomCode = null;
    this.activeEncounter = null;
  },

  // Send game state to server (call after each phase)
  sendStateUpdate(gameState) {
    if (!this.connected) return;

    let location = 'fairway';
    const phase = gameState.phase;
    if (phase === 'title') location = 'clubhouse';
    else if (phase === 'hole_intro' || phase === 'tee_setup' || phase === 'tee_thought') location = 'tee';
    else if (phase === 'putt_setup' || phase === 'putt_thought' || phase === 'putt_result') location = 'green';
    else if (phase === 'between_holes') location = 'between_holes';
    else if (phase === 'round_summary') location = 'clubhouse';
    else if (phase === 'hole_summary') location = 'green';

    this.socket.emit('state-update', {
      currentHole: gameState.currentHole,
      phase: gameState.phase,
      totalScore: gameState.totalScore,
      traits: { ...gameState.traits },
      perks: [...gameState.perks],
      location,
    });
  },

  // Send a dialogue choice during an encounter
  sendDialogue(choiceId, rawText) {
    if (!this.connected || !this.activeEncounter) return;
    this.socket.emit('mp-dialogue', {
      encounterId: this.activeEncounter.encounterId,
      choiceId,
      rawText,
    });
  },

  // Send a clubhouse message
  sendClubhouseMessage(choiceId, rawText) {
    if (!this.connected) return;
    this.socket.emit('clubhouse-message', { choiceId, text: rawText });
  },

  // End the current encounter
  endEncounter() {
    if (!this.connected || !this.activeEncounter) return;
    this.socket.emit('encounter-end', {
      encounterId: this.activeEncounter.encounterId,
    });
    this.activeEncounter = null;
  },

  // ─── Event Handlers (set by UI) ───
  _onPlayersChanged: null,
  _onEncounterStart: null,
  _onEncounterEnd: null,
  _onDialogueReceived: null,
  _onClubhouseMessage: null,

  onPlayersChanged(fn) { this._onPlayersChanged = fn; },
  onEncounterStart(fn) { this._onEncounterStart = fn; },
  onEncounterEnd(fn) { this._onEncounterEnd = fn; },
  onDialogueReceived(fn) { this._onDialogueReceived = fn; },
  onClubhouseMessage(fn) { this._onClubhouseMessage = fn; },

  _showNotification(text) {
    const el = document.getElementById('mp-notification');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
  },
};
