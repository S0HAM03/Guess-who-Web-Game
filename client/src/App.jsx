import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  AnimatedCursor, LandingView, HostSetupView, JoinSetupView,
  LobbyView, CategorySelectView, WinnerScreen, DisconnectOverlay,
} from './components/UI';
import GameScreen from './components/GameScreen';
import CharacterSelectScreen from './components/CharacterSelectScreen';
import CATEGORIES, { getCharacters } from './data/characters';
import './index.css';

// ── Socket connection ──────────────────────────────────
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3002';
let socket = null;

function getSocket() {
  if (!socket) {
    socket = io(SERVER_URL, { autoConnect: false, reconnectionAttempts: 5 });
  }
  return socket;
}

/* ═══════════════════════════════════════════════════════
   VIEWS:
   landing | host_setup | join_setup | lobby |
   category_select | character_select | game | winner
═══════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState('landing');
  const [roomCode, setRoomCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [lobbyError, setLobbyError] = useState('');

  // Character selection phase
  const [selectData, setSelectData] = useState({
    characters: [], category: null, myId: null, myName: '', opponentName: '',
    selectionStatus: [],
  });

  // Game state
  const [gameState, setGameState] = useState({
    characters: [], category: null, mySecretCharId: null,
    myId: null, myName: '', opponentName: '',
    currentTurn: null, round: 1,
    question: null, askerId: null, lastAnswer: null,
  });

  const [winnerState, setWinnerState] = useState(null);
  const [disconnected, setDisconnected] = useState(false);
  const socketRef = useRef(null);

  // ── Connect & register events ──────────────────────────
  useEffect(() => {
    const s = getSocket();
    socketRef.current = s;
    s.connect();

    // Lobby
    s.on('room_created', ({ roomCode }) => {
      setRoomCode(roomCode); setIsHost(true); setView('lobby'); setLobbyError('');
    });
    s.on('room_joined', ({ roomCode }) => {
      setRoomCode(roomCode); setIsHost(false); setView('lobby'); setLobbyError('');
    });
    s.on('room_error', ({ message }) => setLobbyError(message));
    s.on('player_list', (list) => setPlayers(list));

    // ── Character selection phase ──
    s.on('selection_phase', ({ characters, category, myId, myName, opponentName }) => {
      setSelectData({ characters, category, myId, myName, opponentName, selectionStatus: [] });
      setView('character_select');
    });

    s.on('selection_update', ({ selectionStatus }) => {
      setSelectData(prev => ({ ...prev, selectionStatus }));
    });

    // ── Game start (both selected) ──
    s.on('game_start', ({ characters, category, mySecretCharId, currentTurn, round, opponentName, myName, myId }) => {
      setGameState({
        characters, category, mySecretCharId,
        myId, myName, opponentName,
        currentTurn, round,
        question: null, askerId: null, lastAnswer: null,
      });
      setWinnerState(null);
      setDisconnected(false);
      setView('game');
    });

    // ── Q&A events ──
    s.on('question_received', ({ question, askerId }) => {
      setGameState(prev => ({ ...prev, question, askerId, lastAnswer: null }));
    });

    s.on('answer_received', ({ answer, newTurn, round, timeout }) => {
      setGameState(prev => ({
        ...prev,
        question: null, askerId: null,
        lastAnswer: timeout ? null : answer,
        currentTurn: newTurn,
        round,
      }));
    });

    // ── Game over ──
    s.on('game_over', ({ winnerId, correct, guessedCharId, secretCharId }) => {
      setGameState(prev => {
        const guessedChar = prev.characters.find(c => c.id === guessedCharId);
        const secretChar = prev.characters.find(c => c.id === secretCharId);
        const winnerName = prev.myId === winnerId ? prev.myName : prev.opponentName;
        setWinnerState({ winnerId, myId: prev.myId, winnerName, guessedChar, secretChar, correct });
        return prev;
      });
      setView('winner');
    });

    // ── Rematch ──
    s.on('rematch_ready', ({ playerList }) => {
      setPlayers(playerList);
      setWinnerState(null);
      setView('lobby');
    });

    s.on('opponent_disconnected', () => setDisconnected(true));

    return () => {
      s.off('room_created'); s.off('room_joined'); s.off('room_error');
      s.off('player_list'); s.off('selection_phase'); s.off('selection_update');
      s.off('game_start'); s.off('question_received'); s.off('answer_received');
      s.off('game_over'); s.off('rematch_ready'); s.off('opponent_disconnected');
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────

  const handleHostEnter = useCallback((playerName) => {
    socketRef.current.emit('create_room', { playerName });
  }, []);

  const handleJoinEnter = useCallback((code, playerName) => {
    socketRef.current.emit('join_room', { roomCode: code, playerName });
  }, []);

  const handleStartGame = useCallback(() => {
    setView('category_select');
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    const chars = getCharacters(categoryId);
    socketRef.current.emit('start_game', { roomCode, category: categoryId, characters: chars });
  }, [roomCode]);

  const handleCharacterSelect = useCallback((charId) => {
    socketRef.current.emit('select_character', { roomCode, charId });
  }, [roomCode]);

  const handleSendQuestion = useCallback((question) => {
    socketRef.current.emit('send_question', { roomCode, question });
  }, [roomCode]);

  const handleSendAnswer = useCallback((answer) => {
    socketRef.current.emit('send_answer', { roomCode, answer });
  }, [roomCode]);

  const handleMakeGuess = useCallback((charId) => {
    socketRef.current.emit('make_guess', { roomCode, charId });
  }, [roomCode]);

  const handleEliminateChar = useCallback((charId) => {
    socketRef.current.emit('eliminate_character', { roomCode, charId });
  }, [roomCode]);

  // Client-side timeout: tell server answer timed out
  const handleAnswerTimeout = useCallback(() => {
    socketRef.current.emit('send_answer', { roomCode, answer: 'NO' }); // auto-answer NO
  }, [roomCode]);

  const handleRematch = useCallback(() => {
    socketRef.current.emit('rematch', { roomCode });
  }, [roomCode]);

  const handleLeave = useCallback(() => {
    window.location.reload();
  }, []);

  const handleBackToLanding = useCallback(() => {
    setView('landing'); setLobbyError('');
  }, []);

  // ── Render ────────────────────────────────────────────

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <AnimatedCursor/>

      {view === 'landing' && (
        <LandingView onHost={() => setView('host_setup')} onJoin={() => setView('join_setup')}/>
      )}
      {view === 'host_setup' && (
        <HostSetupView onBack={handleBackToLanding} onEnter={handleHostEnter}/>
      )}
      {view === 'join_setup' && (
        <JoinSetupView onBack={handleBackToLanding} onEnter={handleJoinEnter}/>
      )}
      {view === 'lobby' && (
        <LobbyView
          roomCode={roomCode} players={players} isHost={isHost}
          onBack={handleLeave} onStart={handleStartGame} error={lobbyError}
        />
      )}
      {view === 'category_select' && (
        <CategorySelectView categories={CATEGORIES} onSelect={handleCategorySelect}/>
      )}
      {view === 'character_select' && (
        <CharacterSelectScreen
          characters={selectData.characters}
          myId={selectData.myId}
          myName={selectData.myName}
          opponentName={selectData.opponentName}
          category={selectData.category}
          selectionStatus={selectData.selectionStatus}
          onSelect={handleCharacterSelect}
        />
      )}
      {view === 'game' && (
        <GameScreen
          characters={gameState.characters}
          mySecretCharId={gameState.mySecretCharId}
          myId={gameState.myId}
          myName={gameState.myName}
          opponentName={gameState.opponentName}
          currentTurn={gameState.currentTurn}
          round={gameState.round}
          category={gameState.category}
          question={gameState.question}
          askerId={gameState.askerId}
          lastAnswer={gameState.lastAnswer}
          onSendQuestion={handleSendQuestion}
          onAnswer={handleSendAnswer}
          onMakeGuess={handleMakeGuess}
          onEliminateChar={handleEliminateChar}
          onAnswerTimeout={handleAnswerTimeout}
        />
      )}
      {view === 'winner' && winnerState && (
        <WinnerScreen
          winnerId={winnerState.winnerId}
          myId={winnerState.myId}
          winnerName={winnerState.winnerName}
          guessedChar={winnerState.guessedChar}
          secretChar={winnerState.secretChar}
          correct={winnerState.correct}
          onRematch={handleRematch}
          onLeave={handleLeave}
        />
      )}
      {disconnected && view === 'game' && (
        <DisconnectOverlay onLeave={handleLeave}/>
      )}
    </>
  );
}
