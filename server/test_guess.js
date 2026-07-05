const io = require('socket.io-client');

async function runTest() {
  const p1 = io('http://localhost:3002');
  const p2 = io('http://localhost:3002');

  let roomCode = '';

  p1.on('connect', () => p1.emit('create_room', { playerName: 'Player 1' }));

  p1.on('room_created', (data) => {
    roomCode = data.roomCode;
    p2.connect();
  });

  p2.on('connect', () => p2.emit('join_room', { roomCode, playerName: 'Player 2' }));

  p2.on('room_joined', () => {
    const chars = [{id: '1', name: 'Char1'}, {id: '2', name: 'Char2'}];
    p1.emit('start_game', { roomCode, category: 'test', characters: chars });
  });

  p1.on('selection_phase', () => p1.emit('select_character', { roomCode, charId: '1' }));
  p2.on('selection_phase', () => p2.emit('select_character', { roomCode, charId: '2' }));

  let activePlayer = null;

  p1.on('game_start', (data) => {
    activePlayer = data.currentTurn === p1.id ? p1 : p2;
    setTimeout(() => {
      console.log('Active player guessing WRONG character...');
      // If p1 is active, opponent is p2. p2's secret is '2'. So guessing '1' is wrong.
      // If p2 is active, opponent is p1. p1's secret is '1'. So guessing '2' is wrong.
      const wrongGuess = data.currentTurn === p1.id ? '1' : '2';
      activePlayer.emit('make_guess', { roomCode, charId: wrongGuess });
    }, 1000);
  });

  p1.on('guess_result', (data) => console.log('P1 received guess_result:', data));
  p2.on('guess_result', (data) => console.log('P2 received guess_result:', data));

  p1.on('turn_passed', (data) => {
    console.log('P1 received turn_passed (from wrong guess)! New turn:', data.newTurn);
    setTimeout(() => process.exit(0), 500);
  });
  
  p1.on('game_over', (data) => {
    console.log('P1 received GAME OVER! (this is BAD if wrong guess)', data);
    process.exit(1);
  });
}

runTest();
