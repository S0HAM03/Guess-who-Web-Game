/**
 * index.js — Guess Who! Web Edition Server
 * Express + Socket.io, port 3002
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const {
  createRoom, joinRoom, getRoomBySocket,
  initSelectionPhase, selectCharacter, beginGame,
  submitQuestion, submitAnswer, makeGuess,
  eliminateCharacter, removePlayer, getPlayerList,
  handleAnswerTimeout, forcePassTurn, passTurn,
} = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

const allowedOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*';

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', game: 'Guess Who!', port: PORT }));

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'] },
});

// Track server-side answer timeout timers per room
const answerTimers = new Map(); // roomCode → setTimeout handle

function clearAnswerTimer(roomCode) {
  if (answerTimers.has(roomCode)) {
    clearTimeout(answerTimers.get(roomCode));
    answerTimers.delete(roomCode);
  }
}

function startAnswerTimer(roomCode, askerId, TIMEOUT_MS = 15000) {
  clearAnswerTimer(roomCode);
  const handle = setTimeout(() => {
    const result = handleAnswerTimeout(roomCode, askerId);
    if (result) {
      io.to(roomCode).emit('answer_received', {
        answer: null,        // null = timeout
        timeout: true,
        newTurn: result.newTurn,
        round: result.round,
      });
      console.log(`[TIMEOUT] ${roomCode}: no answer in 15s. Turn → ${result.newTurn}`);
    }
  }, TIMEOUT_MS);
  answerTimers.set(roomCode, handle);
}

// Track server-side 90s turn timers per room
const turnTimers = new Map(); // roomCode → setTimeout handle
const turnEndsAt = new Map(); // roomCode → timestamp of when it ends
const pausedTimeLeft = new Map(); // roomCode → timeLeft when paused

function clearTurnTimer(roomCode) {
  if (turnTimers.has(roomCode)) {
    clearTimeout(turnTimers.get(roomCode));
    turnTimers.delete(roomCode);
  }
}

function startTurnTimer(roomCode, currentTurnId, TIMEOUT_MS = 90000) {
  clearTurnTimer(roomCode);
  turnEndsAt.set(roomCode, Date.now() + TIMEOUT_MS);
  const handle = setTimeout(() => {
    const result = forcePassTurn(roomCode, currentTurnId);
    if (result) {
      io.to(roomCode).emit('turn_timeout', {
        newTurn: result.newTurn,
        round: result.round,
      });
      console.log(`[TIMEOUT] ${roomCode}: no question/guess in 90s. Turn passed → ${result.newTurn}`);
      startTurnTimer(roomCode, result.newTurn, 90000); // next player gets full 90s
    }
  }, TIMEOUT_MS);
  turnTimers.set(roomCode, handle);
}

function pauseTurnTimer(roomCode) {
  clearTurnTimer(roomCode);
  const endsAt = turnEndsAt.get(roomCode);
  let timeLeft = 90000;
  if (endsAt) {
    timeLeft = Math.max(0, endsAt - Date.now());
  }
  pausedTimeLeft.set(roomCode, timeLeft);
}

// ─────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] Connected: ${socket.id}`);

  // ── CREATE ROOM ──
  socket.on('create_room', ({ playerName }) => {
    const result = createRoom(socket.id, playerName);
    if (!result.success) { socket.emit('room_error', { message: result.message }); return; }
    socket.join(result.roomCode);
    socket.emit('room_created', { roomCode: result.roomCode });
    io.to(result.roomCode).emit('player_list', getPlayerList(result.room));
    console.log(`[ROOM] ${result.roomCode} created by ${playerName}`);
  });

  // ── JOIN ROOM ──
  socket.on('join_room', ({ roomCode, playerName }) => {
    const result = joinRoom(socket.id, roomCode, playerName);
    if (!result.success) { socket.emit('room_error', { message: result.message }); return; }
    socket.join(roomCode);
    socket.emit('room_joined', { roomCode });
    io.to(roomCode).emit('player_list', getPlayerList(result.room));
    console.log(`[ROOM] ${playerName} joined ${roomCode}`);
  });

  // ── HOST SELECTS CATEGORY → enter selection phase ──
  socket.on('start_game', ({ roomCode, category, characters }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || room.hostId !== socket.id) {
      socket.emit('room_error', { message: 'Only the host can start the game.' }); return;
    }
    const result = initSelectionPhase(roomCode, characters, category);
    if (!result.success) { socket.emit('room_error', { message: result.message }); return; }

    // Tell both players to enter selection phase
    result.room.players.forEach(p => {
      const opponentName = result.room.players.find(op => op.id !== p.id)?.name || '???';
      io.to(p.id).emit('selection_phase', {
        characters: result.room.characters,
        category: result.room.category,
        myId: p.id,
        myName: p.name,
        opponentName,
      });
    });
    console.log(`[SELECT] ${roomCode} entering character selection. Category: ${category}`);
  });

  // ── HOST CANCELS SELECTION ──
  socket.on('cancel_selection', ({ roomCode }) => {
    const room = getRoomBySocket(socket.id);
    if (!room || room.hostId !== socket.id) return;
    room.status = 'waiting';
    room.category = null;
    room.characters = [];
    room.players.forEach(p => {
      p.secretCharId = null;
      p.hasSelected = false;
    });
    io.to(roomCode).emit('selection_cancelled');
    console.log(`[SELECT] ${roomCode} cancelled by host. Back to lobby.`);
  });

  // ── PLAYER SELECTS THEIR SECRET CHARACTER ──
  socket.on('select_character', ({ roomCode, charId }) => {
    const result = selectCharacter(roomCode, socket.id, charId);
    if (!result.success) { socket.emit('game_error', { message: result.message }); return; }

    // Notify both who has selected (don't reveal WHICH char)
    const selectionStatus = result.room.players.map(p => ({ id: p.id, hasSelected: p.hasSelected }));
    io.to(roomCode).emit('selection_update', { selectionStatus });

    if (result.bothDone) {
      // Begin actual game
      const gameResult = beginGame(roomCode);
      if (!gameResult.success) return;
      const r = gameResult.room;

      r.players.forEach(p => {
        const opponentName = r.players.find(op => op.id !== p.id)?.name || '???';
        io.to(p.id).emit('game_start', {
          characters: r.characters,
          category: r.category,
          mySecretCharId: p.secretCharId,
          currentTurn: r.currentTurn,
          round: r.round,
          opponentName,
          myName: p.name,
          myId: p.id,
        });
      });
      console.log(`[GAME] ${roomCode} started. First turn: ${r.currentTurn}`);
      startTurnTimer(roomCode, r.currentTurn, 90000);
    }
  });

  // ── SEND QUESTION ──
  socket.on('send_question', ({ roomCode, question }) => {
    const result = submitQuestion(roomCode, socket.id, question);
    if (!result.success) { socket.emit('game_error', { message: result.message }); return; }

    io.to(roomCode).emit('question_received', {
      question: result.question,
      askerId: result.askerId,
    });

    pauseTurnTimer(roomCode); // Pause the 90s timer while waiting for answer
    // Start 15-second server-side answer timer
    startAnswerTimer(roomCode, result.askerId);
    console.log(`[Q] ${roomCode}: "${question}"`);
  });

  // ── SEND ANSWER ──
  socket.on('send_answer', ({ roomCode, answer }) => {
    clearAnswerTimer(roomCode); // player answered before timeout
    const result = submitAnswer(roomCode, socket.id, answer);
    if (!result.success) { socket.emit('game_error', { message: result.message }); return; }

    io.to(roomCode).emit('answer_received', {
      answer,
      timeout: false,
      newTurn: result.newTurn,
      round: result.round,
      prevQuestion: result.prevQuestion,
    });
    console.log(`[A] ${roomCode}: ${answer}. New turn: ${result.newTurn}`);
    
    // Start fresh turn timer for the new player
    startTurnTimer(roomCode, result.newTurn, 90000);
  });

  // ── ELIMINATE CHARACTER (client-local only) ──
  socket.on('eliminate_character', ({ roomCode, charId }) => {
    eliminateCharacter(roomCode, socket.id, charId);
  });

  // ── MAKE FINAL GUESS ──
  socket.on('make_guess', ({ roomCode, charId }) => {
    const result = makeGuess(roomCode, socket.id, charId);
    if (!result.success) { socket.emit('game_error', { message: result.message }); return; }
    
    if (result.correct) {
      clearAnswerTimer(roomCode);
      clearTurnTimer(roomCode);
      io.to(roomCode).emit('game_over', {
        winnerId: result.winnerId,
        correct: result.correct,
        guessedCharId: charId,
        secretCharId: result.secretCharId,
      });
    } else {
      // Incorrect guess - automatically pass turn
      io.to(roomCode).emit('guess_result', {
        correct: false,
        guesserId: socket.id,
        guessedCharId: charId
      });
      const passResult = passTurn(roomCode, socket.id);
      if (passResult) {
        io.to(roomCode).emit('turn_passed', {
          newTurn: passResult.newTurn,
          round: passResult.round
        });
        startTurnTimer(roomCode, passResult.newTurn, 90000);
      }
    }
  });

  // ── PASS TURN MANUALLY ──
  socket.on('pass_turn', ({ roomCode }) => {
    console.log(`[PASS ATTEMPT] ${roomCode} by ${socket.id}`);
    const passResult = passTurn(roomCode, socket.id);
    if (passResult) {
      io.to(roomCode).emit('turn_passed', {
        newTurn: passResult.newTurn,
        round: passResult.round
      });
      console.log(`[PASS SUCCESS] ${roomCode}: ${socket.id} passed turn.`);
      startTurnTimer(roomCode, passResult.newTurn, 90000);
    } else {
      console.log(`[PASS FAILED] passTurn returned null for ${socket.id}`);
      socket.emit('game_error', { message: 'Cannot pass turn right now.' });
    }
  });

  // ── REMATCH ──
  socket.on('rematch', ({ roomCode }) => {
    clearAnswerTimer(roomCode);
    const room = getRoomBySocket(socket.id);
    if (!room) return;
    room.status = 'waiting';
    room.pendingQuestion = null;
    room.pendingAskerId = null;
    room.winner = null;
    room.currentTurn = null;
    room.players.forEach(p => { p.secretCharId = null; p.eliminatedIds = []; p.hasSelected = false; });
    io.to(roomCode).emit('rematch_ready', { playerList: getPlayerList(room) });
    console.log(`[REMATCH] ${roomCode}`);
  });

  // ── DISCONNECT ──
  socket.on('disconnect', () => {
    const result = removePlayer(socket.id);
    if (result?.roomCode) clearAnswerTimer(result.roomCode);
    if (result?.opponentId) {
      io.to(result.opponentId).emit('opponent_disconnected', {});
    }
    console.log(`[-] Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n🎭 Guess Who! Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

