const io = require('socket.io-client');

async function runTest() {
  const p1 = io('http://localhost:3002');
  const p2 = io('http://localhost:3002');

  let roomCode = '';

  p1.on('connect', () => {
    console.log('P1 connected:', p1.id);
    p1.emit('create_room', { playerName: 'Player 1' });
  });

  p1.on('room_created', (data) => {
    roomCode = data.roomCode;
    console.log('Room created:', roomCode);
    p2.emit('join_room', { roomCode, playerName: 'Player 2' });
  });

  p2.on('room_joined', () => {
    console.log('P2 joined room');
    const chars = [{id: '1', name: 'Char1'}, {id: '2', name: 'Char2'}];
    p1.emit('start_game', { roomCode, category: 'test', characters: chars });
  });

  p1.on('selection_phase', () => p1.emit('select_character', { roomCode, charId: '1' }));
  p2.on('selection_phase', () => p2.emit('select_character', { roomCode, charId: '2' }));

  let activePlayer = null;

  p1.on('game_start', (data) => {
    console.log('Game started! Current turn:', data.currentTurn);
    activePlayer = data.currentTurn === p1.id ? p1 : p2;
    setTimeout(() => {
      console.log('Active player clicking pass turn...');
      activePlayer.emit('pass_turn', { roomCode });
    }, 1000);
  });

  p1.on('turn_passed', (data) => {
    console.log('P1 received turn_passed! New turn:', data.newTurn);
    setTimeout(() => process.exit(0), 500);
  });
  
  p2.on('turn_passed', (data) => {
    console.log('P2 received turn_passed! New turn:', data.newTurn);
  });

  p1.on('game_error', (data) => console.log('P1 ERROR:', data));
  p2.on('game_error', (data) => console.log('P2 ERROR:', data));
}

runTest();
