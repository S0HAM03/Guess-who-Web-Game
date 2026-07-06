import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Target, CheckCircle, XCircle, Eye, EyeOff, Zap, Clock } from 'lucide-react';
import { ChunkyButton } from './UI';
import { SmartImage } from './SmartImage';

/* ═══════════════════════════════════════════════════════
   15-SECOND ANSWER TIMER (only shown to the answerer)
═══════════════════════════════════════════════════════ */
function AnswerTimer({ active, onTimeout }) {
  const TOTAL = 15;
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const ref = useRef(null);

  useEffect(() => {
    setTimeLeft(TOTAL);
    if (!active) { clearInterval(ref.current); return; }
    ref.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(ref.current); onTimeout(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active]);

  if (!active) return null;

  const pct = timeLeft / TOTAL;
  const color = pct > 0.5 ? '#00FF66' : pct > 0.25 ? '#FFD700' : '#FF2A5F';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="#E5E7EB" strokeWidth="5"/>
          <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="display-font" style={{ fontSize: '1rem', color: '#000', lineHeight: 1 }}>{timeLeft}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHARACTER CARD — 6×4 GRID VERSION
═══════════════════════════════════════════════════════ */
function CharacterCard({ char, isEliminated, isSecret, isGuessing, onToggle, onGuess }) {
  const [hovered, setHovered] = useState(false);

  let borderCol = isSecret ? '#FFD700' : isGuessing && hovered ? '#00FF66' : '#000';
  let borderWidth = isSecret || (isGuessing && hovered) ? '4px' : '3px';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isGuessing ? onGuess(char.id) : onToggle(char.id)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3/4',
        borderRadius: 10,
        border: `${borderWidth} solid ${borderCol}`,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: hovered && !isEliminated ? '4px 4px 0px #000' : '2px 2px 0px rgba(0,0,0,0.2)',
        transform: hovered && !isEliminated ? 'translate(-2px, -2px)' : 'none',
        transition: 'all 0.1s ease',
        background: isEliminated ? '#334155' : '#1e293b',
      }}
    >
      <SmartImage character={char}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: isEliminated ? 'grayscale(1) opacity(0.3)' : 'none',
          transition: 'filter 0.2s ease',
        }}
      />

      {/* Name badge */}
      {!isEliminated && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#1e293b', padding: '6px 4px 4px', borderTop: '2px solid #334155' }}>
          <div className="display-font" style={{ fontSize: '0.65rem', color: '#f8fafc', textAlign: 'center', letterSpacing: 0.5 }}>
            {char.name}
          </div>
        </div>
      )}

      {/* Red X */}
      {isEliminated && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 100 100" style={{ width: '60%', height: '60%' }}>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#FF2A5F" strokeWidth="12" strokeLinecap="round"/>
            <line x1="80" y1="20" x2="20" y2="80" stroke="#FF2A5F" strokeWidth="12" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Secret star */}
      {isSecret && !isEliminated && (
        <div style={{ position: 'absolute', top: 4, right: 4, background: '#FFD700', border: '2px solid #000', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, boxShadow: '2px 2px 0 #000' }}>⭐</div>
      )}

      {/* Guess hover */}
      {isGuessing && hovered && !isEliminated && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,102,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ background: '#FFF', border: '3px solid #000', borderRadius: 8, padding: '4px 12px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: '#000', boxShadow: '2px 2px 0 #000' }}>
            GUESS?
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Q&A PANEL — 2-way, 15s answer timer
═══════════════════════════════════════════════════════ */
function QAPanel({
  isMyTurn, question, askerId, myId, opponentName,
  onSendQuestion, onAnswer, isGuessing, setIsGuessing, lastAnswer, onAnswerTimeout,
  turnTimeLeft, onPassTurn, hasAskedThisTurn
}) {
  const [inputQ, setInputQ] = useState('');
  const iNeedToAnswer = !!question && askerId !== myId;
  const iAsked = !!question && askerId === myId;

  const handleSend = () => {
    if (!inputQ.trim()) return;
    onSendQuestion(inputQ.trim());
    setInputQ('');
  };

  return (
    <div style={{
      background: '#1e293b',
      borderTop: '2px solid #334155',
      minHeight: 80, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      padding: '0.8rem 1.2rem', gap: '1rem', flexWrap: 'wrap',
    }}>

      {lastAnswer && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: lastAnswer === 'YES' ? '#00FF66' : '#FF2A5F',
          border: '4px solid #000', borderRadius: 16,
          padding: '12px 32px', zIndex: 100,
          boxShadow: '8px 8px 0 #000',
          animation: 'answerPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}>
          <span className="display-font" style={{ fontSize: '2rem', color: '#000' }}>
            {lastAnswer === 'YES' ? 'YES!' : 'NO!'}
          </span>
        </div>
      )}

      {isMyTurn && !question && !isGuessing && (
        <>
          {!hasAskedThisTurn ? (
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: "'Nunito'", fontWeight: 800 }}>TYPE YOUR QUESTION</span>
                <span style={{ color: turnTimeLeft <= 10 ? '#FF2A5F' : '#94a3b8', fontSize: '0.75rem', fontFamily: "'Nunito'", fontWeight: 900, animation: turnTimeLeft <= 10 ? 'pulseHard 1s infinite' : 'none' }}>
                  ⏳ {turnTimeLeft}s LEFT
                </span>
              </div>
              <input id="question-input" value={inputQ}
                onChange={e => setInputQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask a yes/no question..."
                maxLength={120}
                style={{
                  width: '100%', background: '#0f172a',
                  border: '2px solid #334155', borderRadius: 10,
                  padding: '0.65rem 1rem', color: '#f8fafc', fontSize: '1rem',
                  fontFamily: "'Nunito'", fontWeight: 800, outline: 'none',
                  boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)'
                }}
              />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#00E5FF', fontSize: '1.1rem', fontFamily: "'Nunito'", fontWeight: 900 }}>
                You already asked a question!
              </span>
              <span style={{ color: turnTimeLeft <= 10 ? '#FF2A5F' : '#94a3b8', fontSize: '0.75rem', fontFamily: "'Nunito'", fontWeight: 900, animation: turnTimeLeft <= 10 ? 'pulseHard 1s infinite' : 'none' }}>
                ⏳ {turnTimeLeft}s LEFT
              </span>
            </div>
          )}
          
          {!hasAskedThisTurn && (
            <ChunkyButton id="btn-send-question" color="#00E5FF" onClick={handleSend} disabled={!inputQ.trim()} style={{ padding: '0.65rem 1.2rem' }}>
              <Send size={18}/> SEND
            </ChunkyButton>
          )}
          
          <ChunkyButton id="btn-make-guess" color="#FFD700" onClick={() => setIsGuessing(true)} style={{ padding: '0.65rem 1.2rem', whiteSpace: 'nowrap' }}>
            <Target size={18}/> GUESS!
          </ChunkyButton>

          <ChunkyButton color="#FF2A5F" onClick={onPassTurn} style={{ padding: '0.65rem 1.2rem', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#FFF' }}>PASS TURN</span>
          </ChunkyButton>
        </>
      )}

      {isMyTurn && isGuessing && !question && (
        <>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#00FF66', border: '3px solid #000', borderRadius: 8, padding: '8px 16px', fontFamily: "'Nunito'", fontWeight: 900, color: '#000', fontSize: '0.95rem', boxShadow: '3px 3px 0 #000' }}>
              🎯 GUESSING MODE — Click a character on the board!
            </div>
          </div>
          <ChunkyButton color="#FF2A5F" onClick={() => setIsGuessing(false)} style={{ padding: '0.65rem 1.2rem' }}>
            <XCircle size={18}/> <span style={{ color: '#FFF' }}>CANCEL</span>
          </ChunkyButton>
        </>
      )}

      {iAsked && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, background: '#E2E8F0', border: '3px solid #000', borderRadius: 10, padding: '8px 14px', boxShadow: '3px 3px 0 #000' }}>
            <p style={{ color: '#475569', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.7rem', margin: '0 0 2px', textTransform: 'uppercase' }}>Your question</p>
            <p style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, margin: 0, fontSize: '0.95rem' }}>"{question}"</p>
          </div>
          <div style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            ⏳ {opponentName} answering...
          </div>
        </div>
      )}

      {!isMyTurn && !question && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={20} color="#000" />
            <p style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1rem', margin: 0 }}>
              Waiting for <strong>{opponentName}</strong> to ask...
            </p>
          </div>
          <div style={{ color: '#475569', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.9rem' }}>
            ⏳ {turnTimeLeft}s
          </div>
        </div>
      )}

      {iNeedToAnswer && (
        <>
          <AnswerTimer active={true} onTimeout={onAnswerTimeout}/>
          <div style={{ flex: 1, background: '#E0F2FE', border: '3px solid #000', borderRadius: 10, padding: '8px 14px', boxShadow: '3px 3px 0 #000' }}>
            <p style={{ color: '#0369A1', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', margin: '0 0 2px', textTransform: 'uppercase' }}>{opponentName} asks:</p>
            <p style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, margin: 0, fontSize: '1rem' }}>"{question}"</p>
          </div>
          <ChunkyButton id="btn-answer-yes" color="#00FF66" onClick={() => onAnswer('YES')} style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}>
            <CheckCircle size={20}/> YES
          </ChunkyButton>
          <ChunkyButton id="btn-answer-no" color="#FF2A5F" onClick={() => onAnswer('NO')} style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}>
            <XCircle size={20}/> <span style={{ color: '#FFF' }}>NO</span>
          </ChunkyButton>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN GAME SCREEN
═══════════════════════════════════════════════════════ */
export default function GameScreen({
  characters, mySecretCharId, myId, myName, opponentName,
  currentTurn: currentTurnProp, round: roundProp, category, question, askerId, lastAnswer,
  onSendQuestion, onAnswer, onMakeGuess, onEliminateChar, onAnswerTimeout, onPassTurn, turnSkipped, wrongGuessFlash, activityLog
}) {
  const [eliminated, setEliminated] = useState(new Set());
  const [isGuessing, setIsGuessing] = useState(false);
  const [showSecret, setShowSecret] = useState(true);
  const [answerFlash, setAnswerFlash] = useState(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState(90);
  const [skippedAlertMsg, setSkippedAlertMsg] = useState(null);
  const [hasAskedThisTurn, setHasAskedThisTurn] = useState(false);
  // Local turn state — allows instant client-side pass
  const [localTurn, setLocalTurn] = useState(currentTurnProp);
  const [localRound, setLocalRound] = useState(roundProp);

  // Keep localTurn in sync when server pushes a real turn update
  useEffect(() => {
    setLocalTurn(currentTurnProp);
  }, [currentTurnProp]);

  useEffect(() => {
    setLocalRound(roundProp);
  }, [roundProp]);

  const isMyTurn = localTurn === myId;
  const mySecret = characters.find(c => c.id === mySecretCharId);

  // When turn changes (locally or from server), reset timer + asked flag
  useEffect(() => {
    setTurnTimeLeft(90);
    setHasAskedThisTurn(false);
    setIsGuessing(false);
  }, [localTurn]);

  useEffect(() => { if (question) setIsGuessing(false); }, [question]);

  useEffect(() => {
    if (lastAnswer) {
      setAnswerFlash(lastAnswer.text);
      const t = setTimeout(() => setAnswerFlash(null), 3000);
      return () => clearTimeout(t);
    }
  }, [lastAnswer]);

  useEffect(() => {
    if (wrongGuessFlash) {
      setEliminated(prev => {
        const next = new Set(prev);
        next.add(wrongGuessFlash);
        return next;
      });
      onEliminateChar(wrongGuessFlash);
    }
  }, [wrongGuessFlash, onEliminateChar]);

  useEffect(() => {
    // 90s Turn Timer countdown logic
    if (question) {
      setHasAskedThisTurn(true);
      return; // Pause timer while waiting for opponent's answer
    }
    const interval = setInterval(() => {
      setTurnTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [localTurn, question]);

  useEffect(() => {
    if (turnSkipped) {
      if (isMyTurn) {
        setSkippedAlertMsg(`⚠️ ${opponentName} ran out of time! It's your turn!`);
      } else {
        setSkippedAlertMsg(`⚠️ You ran out of time! Turn passed to ${opponentName}.`);
      }
      const t = setTimeout(() => setSkippedAlertMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [turnSkipped, isMyTurn, opponentName]);

  // CLIENT-SIDE INSTANT pass turn — UI flips immediately, server syncs both players
  const handlePassTurn = useCallback(() => {
    // Flip localTurn instantly: use a placeholder so isMyTurn becomes false right now
    setLocalTurn('__waiting__');
    setLocalRound(prev => prev + 1);
    setTurnTimeLeft(0);
    setHasAskedThisTurn(false);
    setIsGuessing(false);
    // Tell the server — it will emit turn_passed to BOTH players,
    // which will sync localTurn to the real socket IDs on both screens
    onPassTurn();
  }, [onPassTurn]);

  const toggleEliminate = useCallback((charId) => {
    setEliminated(prev => {
      const next = new Set(prev);
      next.has(charId) ? next.delete(charId) : next.add(charId);
      onEliminateChar(charId);
      return next;
    });
  }, [onEliminateChar]);

  const handleGuess = useCallback((charId) => {
    setIsGuessing(false);
    onMakeGuess(charId);
  }, [onMakeGuess]);

  const aliveCount = characters.length - eliminated.size;

  return (
    <div className="game-bg" style={{
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── HEADER ── */}
      <header style={{
        background: '#FFF',
        borderBottom: '4px solid #000',
        padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '0.8rem', flexShrink: 0, flexWrap: 'wrap', zIndex: 10,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FFD700', border: '3px solid #000', borderRadius: 8, padding: '4px 14px', boxShadow: '3px 3px 0 #000' }}>
            <span className="display-font" style={{ fontSize: '1rem', color: '#000' }}>GUESS WHO?</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: isMyTurn ? '#00FF66' : '#FF2A5F', border: '2px solid #000', borderRadius: 6, padding: '4px 12px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: isMyTurn ? '#000' : '#FFF', boxShadow: '2px 2px 0 #000' }}>
              {isMyTurn ? '🎯 YOUR TURN' : `⏳ ${opponentName}`}
            </span>
            <span style={{ background: '#FFF', border: '2px solid #000', borderRadius: 6, padding: '4px 12px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: '#000' }}>
              {aliveCount} LEFT
            </span>
          </div>
        </div>

        {/* Secret Character (center) */}
        <div onClick={() => setShowSecret(s => !s)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: '#F8FAFC', border: '2px dashed #94A3B8', borderRadius: 10, padding: '4px 12px' }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: '#475569', textTransform: 'uppercase' }}>Your char:</span>
          {mySecret && showSecret ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src={mySecret.image} alt={mySecret.name} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid #000', objectFit: 'cover' }}/>
              <span className="display-font" style={{ fontSize: '0.8rem', color: '#000' }}>{mySecret.name}</span>
              <EyeOff size={16} color="#000"/>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={16} color="#000"/>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem', color: '#000' }}>HIDDEN</span>
            </div>
          )}
        </div>

        {/* Category badge */}
        <div style={{ background: '#00E5FF', border: '3px solid #000', borderRadius: 8, padding: '4px 12px', boxShadow: '2px 2px 0 #000' }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem', color: '#000', textTransform: 'uppercase' }}>{category}</span>
        </div>
      </header>

      {/* ── CONTENT (GRID + LOG) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* CHARACTER GRID (Left Side) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '1rem',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '1rem 1rem 4rem 1rem'
          }}>
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                char={char}
                isEliminated={eliminated.has(char.id)}
                isSecret={char.id === mySecretCharId}
                isGuessing={isGuessing && isMyTurn}
                onToggle={toggleEliminate}
                onGuess={handleGuess}
              />
            ))}
          </div>
        </div>

        {/* ACTIVITY LOG (Right Side) */}
        <div style={{ width: 280, background: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #334155' }}>
            <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Activity Log</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activityLog?.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: 20 }}>No activity yet...</div>
            ) : (
              activityLog?.map(log => (
                <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {log.type === 'qa' && (
                    <>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        <strong style={{ color: '#38bdf8', fontWeight: 600 }}>{log.askerName}</strong> asked:
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#f8fafc', padding: '8px 12px', background: '#334155', borderRadius: 6, alignSelf: 'flex-start', lineHeight: 1.4 }}>
                        {log.question}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: log.answer === 'YES' ? '#4ade80' : '#f87171', marginTop: 2 }}>
                        ↳ {log.answererName} replied {log.answer}
                      </div>
                    </>
                  )}
                  {log.type === 'timeout' && (
                    <div style={{ fontSize: '0.85rem', color: '#fbbf24' }}>
                      ⏱ {log.player} ran out of time.
                    </div>
                  )}
                  {log.type === 'pass' && (
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      ⏭ {log.player} passed their turn.
                    </div>
                  )}
                  {log.type === 'guess' && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: log.correct ? '#4ade80' : '#f87171' }}>
                      {log.correct ? '🏆' : '❌'} {log.guesserName} guessed {log.guessedChar}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      
      <div style={{ maxWidth: 1000, margin: 'auto', width: '100%', paddingBottom: '1rem' }}>
        <QAPanel
          isMyTurn={isMyTurn} question={question} askerId={askerId} myId={myId} opponentName={opponentName}
          onSendQuestion={onSendQuestion} onAnswer={onAnswer} isGuessing={isGuessing}
          setIsGuessing={setIsGuessing} lastAnswer={answerFlash} onAnswerTimeout={onAnswerTimeout}
          turnTimeLeft={turnTimeLeft} onPassTurn={handlePassTurn} hasAskedThisTurn={hasAskedThisTurn}
        />
      </div>

      {skippedAlertMsg && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#FF2A5F', color: '#FFF', border: '3px solid #000', borderRadius: 12,
          padding: '12px 24px', zIndex: 1000, boxShadow: '4px 4px 0 #000',
          fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1rem',
          animation: 'bounceDown 0.5s cubic-bezier(0.175,0.885,0.32,1.275)'
        }}>
          {skippedAlertMsg}
        </div>
      )}

      {wrongGuessFlash && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#FFD700', color: '#000', border: '4px solid #000', borderRadius: 16,
          padding: '16px 32px', zIndex: 1000, boxShadow: '8px 8px 0 #000',
          fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1.2rem', textAlign: 'center',
          animation: 'bounceDown 0.5s cubic-bezier(0.175,0.885,0.32,1.275)'
        }}>
          ❌ WRONG GUESS!<br/>
          <span style={{ fontSize: '0.9rem' }}>Turn passed to opponent.</span>
        </div>
      )}
    </div>
  );
}
