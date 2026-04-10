// ─── Encounter Engine ───
// Detects when two players should interact based on location/proximity.
// Encounter types: clubhouse, passing (between holes), nearby (same hole area)

const { v4: uuid } = require('uuid');

class EncounterEngine {
  constructor() {
    this.active = new Map();       // encounterId → encounter data
    this.cooldowns = new Map();    // "p1|p2" → timestamp (prevent spam)
  }

  _pairKey(id1, id2) {
    return [id1, id2].sort().join('|');
  }

  _onCooldown(id1, id2) {
    const key = this._pairKey(id1, id2);
    const lastTime = this.cooldowns.get(key);
    if (!lastTime) return false;
    // 3-minute cooldown between encounters with same player
    return (Date.now() - lastTime) < 180_000;
  }

  _setCooldown(id1, id2) {
    this.cooldowns.set(this._pairKey(id1, id2), Date.now());
  }

  // Check if any encounters should trigger for a given player in their room
  check(room, playerId) {
    const player = room.getPlayer(playerId);
    if (!player) return [];

    const results = [];

    // Already in an active encounter? Skip
    for (const enc of this.active.values()) {
      if (enc.player1 === playerId || enc.player2 === playerId) return [];
    }

    const allPlayers = Array.from(room.players.values());

    for (const other of allPlayers) {
      if (other.id === playerId) continue;
      if (this._onCooldown(playerId, other.id)) continue;

      // Skip if other is already in an encounter
      let otherBusy = false;
      for (const enc of this.active.values()) {
        if (enc.player1 === other.id || enc.player2 === other.id) {
          otherBusy = true;
          break;
        }
      }
      if (otherBusy) continue;

      const encType = this._detectEncounterType(player, other);
      if (encType) {
        results.push({ player1: playerId, player2: other.id, type: encType });
        break; // One encounter at a time
      }
    }

    return results;
  }

  _detectEncounterType(p1, p2) {
    // Both in clubhouse → clubhouse encounter
    if (p1.location === 'clubhouse' && p2.location === 'clubhouse') {
      return 'clubhouse';
    }

    // Both between holes → passing encounter (random chance)
    if (p1.location === 'between_holes' && p2.location === 'between_holes') {
      if (Math.random() < 0.6) return 'passing';
    }

    // Same hole, different phases → nearby encounter
    if (p1.currentHole === p2.currentHole && p1.location !== 'clubhouse' && p2.location !== 'clubhouse') {
      if (Math.random() < 0.4) return 'nearby';
    }

    // Adjacent holes, both on course → distant wave
    if (Math.abs(p1.currentHole - p2.currentHole) === 1 &&
        p1.location !== 'clubhouse' && p2.location !== 'clubhouse') {
      if (Math.random() < 0.25) return 'wave';
    }

    return null;
  }

  create(player1, player2, type) {
    const id = uuid();
    this.active.set(id, {
      id,
      player1,
      player2,
      type,
      createdAt: Date.now(),
    });
    this._setCooldown(player1, player2);
    return id;
  }

  get(encounterId) {
    return this.active.get(encounterId);
  }

  remove(encounterId) {
    this.active.delete(encounterId);
  }

  removeByPlayer(playerId) {
    for (const [id, enc] of this.active) {
      if (enc.player1 === playerId || enc.player2 === playerId) {
        this.active.delete(id);
      }
    }
  }
}

module.exports = { EncounterEngine };
