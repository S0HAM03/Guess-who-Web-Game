/**
 * gameLogic.js — Guess Who! Web Edition
 * 
 * Game phases:
 *   waiting → selecting (both players choose their secret char) → playing → finished
 */

const rooms = new Map();
const PLAYER_COLORS = [0, 3];

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function createRoom(socketId, playerName) {
  const roomCode = generateRoomCode();
  const room = {
    roomCode,
    hostId: socketId,
    players: [{ id: socketId, name: playerName, color: PLAYER_COLORS[0], secretCharId: null, eliminatedIds: [], hasSelected: false }],
    status: 'waiting',
    category: null,
    characters: [],
    currentTurn: null,  // socket ID of who asks the NEXT question
    pendingQuestion: null,
    pendingAskerId: null,
    round: 1,
    winner: null,
  };
  rooms.set(roomCode, room);
  return { success: true, roomCode, room };
}

function joinRoom(socketId, roomCode, playerName) {
  const room = rooms.get(roomCode);
  if (!room) return { success: false, message: 'Room not found! Check the code.' };
  if (room.players.length >= 2) return { success: false, message: 'Room is full! (Max 2 players)' };
  if (room.status !== 'waiting') return { success: false, message: 'Game already started!' };
  room.players.push({ id: socketId, name: playerName, color: PLAYER_COLORS[1], secretCharId: null, eliminatedIds: [], hasSelected: false });
  return { success: true, roomCode, room };
}

function getRoomBySocket(socketId) {
  for (const room of rooms.values()) {
    if (room.players.some(p => p.id === socketId)) return room;
  }
  return null;
}

// Move to selection phase — host has chosen category + characters
function initSelectionPhase(roomCode, characters, category) {
  const room = rooms.get(roomCode);
  if (!room || room.players.length < 2) return { success: false, message: 'Need 2 players.' };
  room.status = 'selecting';
  room.category = category;
  room.characters = characters;
  room.players.forEach(p => { p.secretCharId = null; p.hasSelected = false; });
  return { success: true, room };
}

// A player locks in their chosen secret character
function selectCharacter(roomCode, socketId, charId) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'selecting') return { success: false, message: 'Not in selection phase.' };
  const player = room.players.find(p => p.id === socketId);
  if (!player) return { success: false };

  player.secretCharId = charId;
  player.hasSelected = true;

  const bothDone = room.players.every(p => p.hasSelected);
  return { success: true, bothDone, room };
}

// Start the actual game (called after both selected)
function beginGame(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return { success: false };
  room.status = 'playing';
  room.round = 1;
  room.pendingQuestion = null;
  room.pendingAskerId = null;
  room.winner = null;
  // Randomly pick who asks first
  room.currentTurn = room.players[Math.floor(Math.random() * 2)].id;
  return { success: true, room };
}

// Submit a question (asker must be currentTurn)
function submitQuestion(roomCode, socketId, question) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return { success: false, message: 'Game not active.' };
  if (room.currentTurn !== socketId) return { success: false, message: 'Not your turn to ask!' };
  if (room.pendingQuestion) return { success: false, message: 'Already waiting for an answer.' };
  if (!question || !question.trim()) return { success: false, message: 'Question cannot be empty.' };

  room.pendingQuestion = question.trim();
  room.pendingAskerId = socketId;
  return { success: true, question: room.pendingQuestion, askerId: socketId };
}

// Submit answer (must be the NON-asker)
function submitAnswer(roomCode, socketId, answer) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return { success: false };
  if (room.pendingAskerId === socketId) return { success: false, message: "You asked the question!" };
  if (!room.pendingQuestion) return { success: false, message: 'No pending question.' };

  const prevQuestion = room.pendingQuestion;
  room.pendingQuestion = null;
  room.pendingAskerId = null;

  // Switch turn: now the answerer gets to ask
  room.currentTurn = socketId;
  room.round++;

  return { success: true, answer, newTurn: socketId, round: room.round, prevQuestion };
}

// Make a final guess
function makeGuess(roomCode, socketId, guessedCharId) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return { success: false };
  if (room.currentTurn !== socketId) return { success: false, message: 'Not your turn!' };

  const opponent = room.players.find(p => p.id !== socketId);
  const isCorrect = opponent.secretCharId === guessedCharId;

  room.status = 'finished';
  room.winner = isCorrect ? socketId : opponent.id;

  return { success: true, correct: isCorrect, winnerId: room.winner, secretCharId: opponent.secretCharId };
}

function eliminateCharacter(roomCode, socketId, charId) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const player = room.players.find(p => p.id === socketId);
  if (!player) return;
  const idx = player.eliminatedIds.indexOf(charId);
  if (idx === -1) player.eliminatedIds.push(charId);
  else player.eliminatedIds.splice(idx, 1);
}

function removePlayer(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room) return null;
  room.players = room.players.filter(p => p.id !== socketId);
  if (room.players.length === 0) { rooms.delete(room.roomCode); return { roomCode: room.roomCode, opponentId: null }; }
  if (room.hostId === socketId) room.hostId = room.players[0].id;
  room.status = 'waiting';
  return { roomCode: room.roomCode, opponentId: room.players[0]?.id || null, room };
}

function getPlayerList(room) {
  return room.players.map(p => ({ id: p.id, name: p.name, color: p.color, isHost: p.id === room.hostId }));
}

// Handle answer timeout — auto pass turn
function handleAnswerTimeout(roomCode, askerId) {
  const room = rooms.get(roomCode);
  if (!room || room.pendingAskerId !== askerId) return null; // already answered
  const answerer = room.players.find(p => p.id !== askerId);
  if (!answerer) return null;

  room.pendingQuestion = null;
  room.pendingAskerId = null;
  room.currentTurn = answerer.id;
  room.round++;

  return { newTurn: answerer.id, round: room.round };
}

// Force pass turn due to 90s timeout
function forcePassTurn(roomCode, timedOutPlayerId) {
  const room = rooms.get(roomCode);
  if (!room || room.status !== 'playing') return null;
  if (room.currentTurn !== timedOutPlayerId) return null; // already passed or answered
  
  const opponent = room.players.find(p => p.id !== timedOutPlayerId);
  if (!opponent) return null;

  // Clear any pending questions just in case, though they shouldn't exist if turn timer was running
  room.pendingQuestion = null;
  room.pendingAskerId = null;
  room.currentTurn = opponent.id;
  room.round++;

  return { newTurn: opponent.id, round: room.round };
}

module.exports = {
  createRoom, joinRoom, getRoomBySocket,
  initSelectionPhase, selectCharacter, beginGame,
  submitQuestion, submitAnswer, makeGuess,
  eliminateCharacter, removePlayer, getPlayerList,
  handleAnswerTimeout, forcePassTurn,
};
