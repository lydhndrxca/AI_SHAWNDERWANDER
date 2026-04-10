const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { RoomManager } = require('./rooms');
const { EncounterEngine } = require('./encounters');
const { filterDialogue } = require('./stat-filter');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// Serve the game files
app.use(express.static(path.join(__dirname, '..')));

const rooms = new RoomManager();
const encounters = new EncounterEngine();

io.on('connection', (socket) => {
  console.log(`[CONNECT] ${socket.id}`);

  // ─── Join / Create Room ───
  socket.on('join-room', ({ roomCode, playerName }) => {
    const room = rooms.joinOrCreate(roomCode, socket.id, playerName);
    socket.join(room.code);
    socket.data.roomCode = room.code;
    socket.data.playerName = playerName;

    socket.emit('room-joined', {
      code: room.code,
      players: room.getPublicPlayerList(),
      you: socket.id,
    });

    socket.to(room.code).emit('player-joined', {
      id: socket.id,
      name: playerName,
    });

    console.log(`[JOIN] ${playerName} → room ${room.code} (${room.playerCount()} players)`);
  });

  // ─── Player State Update ───
  // Sent after each hole/phase — keeps the server aware of where everyone is
  socket.on('state-update', (data) => {
    const room = rooms.getRoom(socket.data.roomCode);
    if (!room) return;

    room.updatePlayer(socket.id, {
      currentHole: data.currentHole,
      phase: data.phase,
      totalScore: data.totalScore,
      traits: data.traits,
      perks: data.perks,
      location: data.location, // 'tee', 'fairway', 'green', 'clubhouse', 'between_holes'
    });

    // Check for encounters
    const possibleEncounters = encounters.check(room, socket.id);
    for (const enc of possibleEncounters) {
      const p1 = room.getPlayer(enc.player1);
      const p2 = room.getPlayer(enc.player2);
      if (!p1 || !p2) continue;

      const encId = encounters.create(enc.player1, enc.player2, enc.type);

      io.to(enc.player1).emit('encounter-start', {
        encounterId: encId,
        type: enc.type,
        otherPlayer: { id: enc.player2, name: p2.name },
      });
      io.to(enc.player2).emit('encounter-start', {
        encounterId: encId,
        type: enc.type,
        otherPlayer: { id: enc.player1, name: p1.name },
      });
    }

    // Broadcast location to room for awareness
    socket.to(room.code).emit('player-location', {
      id: socket.id,
      name: socket.data.playerName,
      currentHole: data.currentHole,
      location: data.location,
    });
  });

  // ─── Multiplayer Dialogue (Stat-Filtered) ───
  // Player picks a dialogue option. Server filters it through their stats.
  socket.on('mp-dialogue', ({ encounterId, choiceId, rawText }) => {
    const enc = encounters.get(encounterId);
    if (!enc) return;

    const room = rooms.getRoom(socket.data.roomCode);
    if (!room) return;

    const sender = room.getPlayer(socket.id);
    if (!sender) return;

    const receiverId = enc.player1 === socket.id ? enc.player2 : enc.player1;

    // The sender sees their own text as-is
    socket.emit('mp-dialogue-display', {
      encounterId,
      from: socket.id,
      fromName: sender.name,
      text: rawText,
      isSelf: true,
    });

    // The receiver sees the stat-filtered version
    const filtered = filterDialogue(choiceId, sender.traits || {}, sender.perks || []);

    io.to(receiverId).emit('mp-dialogue-display', {
      encounterId,
      from: socket.id,
      fromName: sender.name,
      text: filtered.text,
      tier: filtered.tier,
      isSelf: false,
    });
  });

  // ─── Encounter End ───
  socket.on('encounter-end', ({ encounterId }) => {
    const enc = encounters.get(encounterId);
    if (!enc) return;

    const otherId = enc.player1 === socket.id ? enc.player2 : enc.player1;
    io.to(otherId).emit('encounter-ended', { encounterId });
    encounters.remove(encounterId);
  });

  // ─── Clubhouse Chat ───
  socket.on('clubhouse-message', ({ text, choiceId }) => {
    const room = rooms.getRoom(socket.data.roomCode);
    if (!room) return;

    const sender = room.getPlayer(socket.id);
    if (!sender) return;

    // Everyone in the clubhouse sees the stat-filtered version
    const filtered = filterDialogue(choiceId, sender.traits || {}, sender.perks || []);

    // Sender sees their own text
    socket.emit('clubhouse-display', {
      from: socket.id,
      fromName: sender.name,
      text,
      isSelf: true,
    });

    // Others see filtered version
    socket.to(room.code).emit('clubhouse-display', {
      from: socket.id,
      fromName: sender.name,
      text: filtered.text,
      tier: filtered.tier,
      isSelf: false,
    });
  });

  // ─── Disconnect ───
  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (roomCode) {
      const room = rooms.getRoom(roomCode);
      if (room) {
        room.removePlayer(socket.id);
        socket.to(roomCode).emit('player-left', {
          id: socket.id,
          name: socket.data.playerName,
        });
        if (room.playerCount() === 0) {
          rooms.removeRoom(roomCode);
        }
      }
    }
    encounters.removeByPlayer(socket.id);
    console.log(`[DISCONNECT] ${socket.data.playerName || socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ⛳ GOLF MIND GAME — Multiplayer Server`);
  console.log(`  ──────────────────────────────────────`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Share this address on your network to play together.\n`);
});
