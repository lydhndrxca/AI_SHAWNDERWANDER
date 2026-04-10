// ─── Room Management ───

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

class Room {
  constructor(code) {
    this.code = code;
    this.players = new Map();
    this.createdAt = Date.now();
  }

  addPlayer(socketId, name) {
    this.players.set(socketId, {
      id: socketId,
      name,
      joinedAt: Date.now(),
      currentHole: 0,
      phase: 'title',
      totalScore: 0,
      traits: { focus: 50, swagger: 50, humor: 50, knowledge: 50, zen: 50 },
      perks: [],
      location: 'clubhouse',
    });
  }

  removePlayer(socketId) {
    this.players.delete(socketId);
  }

  updatePlayer(socketId, data) {
    const player = this.players.get(socketId);
    if (!player) return;
    Object.assign(player, data);
  }

  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  playerCount() {
    return this.players.size;
  }

  getPublicPlayerList() {
    return Array.from(this.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      currentHole: p.currentHole,
      location: p.location,
    }));
  }

  getPlayersAtLocation(location) {
    return Array.from(this.players.values()).filter(p => p.location === location);
  }

  getPlayersNearHole(holeNumber, range = 1) {
    return Array.from(this.players.values()).filter(p =>
      Math.abs(p.currentHole - holeNumber) <= range && p.location !== 'clubhouse'
    );
  }
}

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  joinOrCreate(requestedCode, socketId, playerName) {
    if (requestedCode) {
      const existing = this.rooms.get(requestedCode.toUpperCase());
      if (existing) {
        existing.addPlayer(socketId, playerName);
        return existing;
      }
    }

    let code = requestedCode ? requestedCode.toUpperCase() : generateCode();
    while (this.rooms.has(code)) code = generateCode();

    const room = new Room(code);
    room.addPlayer(socketId, playerName);
    this.rooms.set(code, room);
    return room;
  }

  getRoom(code) {
    return code ? this.rooms.get(code) : null;
  }

  removeRoom(code) {
    this.rooms.delete(code);
  }
}

module.exports = { Room, RoomManager };
