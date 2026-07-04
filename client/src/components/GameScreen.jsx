import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Target, CheckCircle, XCircle, Eye, EyeOff, Zap, Clock } from 'lucide-react';
import { ChunkyButton } from './UI';

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
      {/* Circular progress */}
      <div style={{ position: 'relative', width: 52, height: 52 }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5"/>
          <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 22}`}
            strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct)}`}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="display-font" style={{ fontSize: '1rem', color, lineHeight: 1 }}>{timeLeft}</span>
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

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isGuessing ? onGuess(char.id) : onToggle(char.id)}
      style={{
        position: 'relative',
        aspectRatio: '3/4',
        borderRadius: 10,
        border: isSecret
          ? '3px solid #FFD700'
          : isGuessing && hovered
            ? '3px solid #00FF66'
            : isEliminated
              ? '2px solid rgba(255,42,95,0.3)'
              : '2px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isSecret
          ? '0 0 20px rgba(255,215,0,0.4), inset 0 0 20px rgba(255,215,0,0.05)'
          : hovered && !isEliminated
            ? '0 8px 25px rgba(0,0,0,0.5), 0 0 15px rgba(0,229,255,0.2)'
            : '0 4px 12px rgba(0,0,0,0.3)',
        transform: hovered && !isEliminated ? 'scale(1.05) translateY(-3px)' : 'scale(1)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease',
        background: isEliminated ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.04)',
      }}
    >
      {/* Character Image */}
      <img src={char.image} alt={char.name}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: isEliminated ? 'grayscale(1) brightness(0.2) blur(1px)' : 'none',
          transition: 'filter 0.3s ease',
        }}
      />

      {/* Name badge */}
      {!isEliminated && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '14px 4px 4px' }}>
          <div className="display-font" style={{ fontSize: '0.6rem', color: isSecret ? '#FFD700' : '#FFF', textAlign: 'center', letterSpacing: 0.5, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
            {char.name}
          </div>
        </div>
      )}

      {/* Red X */}
      {isEliminated && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'eliminateIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
          <svg viewBox="0 0 100 100" style={{ width: '60%', height: '60%', filter: 'drop-shadow(0 0 6px rgba(255,42,95,0.6))' }}>
            <line x1="15" y1="15" x2="85" y2="85" stroke="#FF2A5F" strokeWidth="16" strokeLinecap="round"/>
            <line x1="85" y1="15" x2="15" y2="85" stroke="#FF2A5F" strokeWidth="16" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Secret star */}
      {isSecret && !isEliminated && (
        <div style={{ position: 'absolute', top: 4, right: 4, background: '#FFD700', border: '2px solid rgba(0,0,0,0.3)', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, boxShadow: '0 0 8px rgba(255,215,0,0.6)' }}>⭐</div>
      )}

      {/* Guess hover */}
      {isGuessing && hovered && !isEliminated && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,102,0.18)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8 }}>
          <div style={{ background: '#00FF66', border: '2px solid rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 10px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.65rem', color: '#000' }}>
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
}) {
  const [inputQ, setInputQ] = useState('');
  // I need to answer if: there's a question AND the asker is NOT me
  const iNeedToAnswer = !!question && askerId !== myId;
  // I asked, waiting for answer
  const iAsked = !!question && askerId === myId;

  const handleSend = () => {
    if (!inputQ.trim()) return;
    onSendQuestion(inputQ.trim());
    setInputQ('');
  };

  return (
    <div style={{
      background: 'rgba(13,13,26,0.95)',
      borderTop: '2px solid rgba(124,58,237,0.3)',
      backdropFilter: 'blur(10px)',
      minHeight: 80, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      padding: '0.8rem 1.2rem', gap: '0.8rem', flexWrap: 'wrap',
    }}>

      {/* ── Last answer display pill ── */}
      {lastAnswer && (
        <div style={{
          position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
          background: lastAnswer === 'YES' ? '#00FF66' : '#FF2A5F',
          border: '4px solid #000', borderRadius: 14,
          padding: '12px 32px', zIndex: 100,
          boxShadow: `0 0 40px ${lastAnswer === 'YES' ? 'rgba(0,255,102,0.6)' : 'rgba(255,42,95,0.6)'}`,
          animation: 'answerPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}>
          <span className="display-font" style={{ fontSize: '2rem', color: lastAnswer === 'YES' ? '#000' : '#FFF' }}>
            {lastAnswer === 'YES' ? '✅ YES!' : '❌ NO!'}
          </span>
        </div>
      )}

      {/* ── MY TURN: No question pending, ask or guess ── */}
      {isMyTurn && !question && !isGuessing && (
        <>
          <div style={{ flex: 1, minWidth: 180 }}>
            <input id="question-input" value={inputQ}
              onChange={e => setInputQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a yes/no question..."
              maxLength={120}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.06)',
                border: '2px solid rgba(124,58,237,0.4)', borderRadius: 10,
                padding: '0.65rem 1rem', color: '#FFF', fontSize: '0.95rem',
                fontFamily: "'Nunito'", fontWeight: 700, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#00E5FF'}
              onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.4)'}
            />
          </div>
          <ChunkyButton id="btn-send-question" color="#00E5FF" onClick={handleSend} disabled={!inputQ.trim()} style={{ padding: '0.65rem 1.2rem' }}>
            <Send size={16}/> SEND
          </ChunkyButton>
          <ChunkyButton id="btn-make-guess" color="#9D00FF" onClick={() => setIsGuessing(true)} style={{ padding: '0.65rem 1.2rem', whiteSpace: 'nowrap' }}>
            <Target size={16}/> <span style={{ color: '#FFF' }}>GUESS!</span>
          </ChunkyButton>
        </>
      )}

      {/* ── MY TURN: Guessing mode ── */}
      {isMyTurn && isGuessing && !question && (
        <>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(0,255,102,0.12)', border: '2px solid rgba(0,255,102,0.4)', borderRadius: 8, padding: '8px 16px', fontFamily: "'Nunito'", fontWeight: 900, color: '#00FF66', fontSize: '0.9rem' }}>
              🎯 GUESSING MODE — Click a character on the board!
            </div>
          </div>
          <ChunkyButton color="#FF2A5F" onClick={() => setIsGuessing(false)} style={{ padding: '0.65rem 1.2rem' }}>
            <XCircle size={16}/> <span style={{ color: '#FFF' }}>CANCEL</span>
          </ChunkyButton>
        </>
      )}

      {/* ── I ASKED — waiting for opponent to answer ── */}
      {iAsked && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, animation: 'slideUp 0.3s ease-out' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px' }}>
            <p style={{ color: '#64748B', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.7rem', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 1 }}>Your question</p>
            <p style={{ color: '#E2E8F0', fontFamily: "'Nunito'", fontWeight: 800, margin: 0, fontSize: '0.9rem' }}>"{question}"</p>
          </div>
          <div style={{ color: '#64748B', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', animation: 'pulseHard 1.5s infinite', whiteSpace: 'nowrap' }}>
            ⏳ {opponentName} answering...
          </div>
        </div>
      )}

      {/* ── OPPONENT'S TURN: Waiting for their question ── */}
      {!isMyTurn && !question && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} color="#FFD700" style={{ animation: 'pulseHard 1.5s infinite', flexShrink: 0 }}/>
          <p style={{ color: '#64748B', fontFamily: "'Nunito'", fontWeight: 900, animation: 'pulseHard 2s infinite', fontSize: '0.9rem' }}>
            Waiting for <strong style={{ color: '#FFD700' }}>{opponentName}</strong> to ask...
          </p>
        </div>
      )}

      {/* ── OPPONENT ASKED — I need to answer in 15s ── */}
      {iNeedToAnswer && (
        <>
          <AnswerTimer active={true} onTimeout={onAnswerTimeout}/>
          <div style={{ flex: 1, background: 'rgba(0,229,255,0.06)', border: '2px solid rgba(0,229,255,0.3)', borderRadius: 10, padding: '8px 14px', animation: 'questionSlideIn 0.3s ease-out' }}>
            <p style={{ color: '#00E5FF', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.7rem', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: 1 }}>{opponentName} asks:</p>
            <p style={{ color: '#FFF', fontFamily: "'Nunito'", fontWeight: 800, margin: 0, fontSize: '0.95rem' }}>"{question}"</p>
          </div>
          <ChunkyButton id="btn-answer-yes" color="#00FF66" onClick={() => onAnswer('YES')} style={{ padding: '0.7rem 1.3rem', fontSize: '1rem' }}>
            <CheckCircle size={18}/> YES
          </ChunkyButton>
          <ChunkyButton id="btn-answer-no" color="#FF2A5F" onClick={() => onAnswer('NO')} style={{ padding: '0.7rem 1.3rem', fontSize: '1rem' }}>
            <XCircle size={18}/> <span style={{ color: '#FFF' }}>NO</span>
          </ChunkyButton>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN GAME SCREEN — Deep Space Theme + 6×4 Grid
═══════════════════════════════════════════════════════ */
export default function GameScreen({
  characters, mySecretCharId, myId, myName, opponentName,
  currentTurn, round, category, question, askerId, lastAnswer,
  onSendQuestion, onAnswer, onMakeGuess, onEliminateChar, onAnswerTimeout,
}) {
  const [eliminated, setEliminated] = useState(new Set());
  const [isGuessing, setIsGuessing] = useState(false);
  const [showSecret, setShowSecret] = useState(true);
  const [answerFlash, setAnswerFlash] = useState(null);

  const isMyTurn = currentTurn === myId;
  const mySecret = characters.find(c => c.id === mySecretCharId);

  // Clear guessing mode when question arrives
  useEffect(() => { if (question) setIsGuessing(false); }, [question]);

  // Flash the answer
  useEffect(() => {
    if (lastAnswer) {
      setAnswerFlash(lastAnswer);
      const t = setTimeout(() => setAnswerFlash(null), 3000);
      return () => clearTimeout(t);
    }
  }, [lastAnswer, round]);

  const toggleEliminate = useCallback((charId) => {
    if (charId === mySecretCharId) return;
    setEliminated(prev => {
      const next = new Set(prev);
      next.has(charId) ? next.delete(charId) : next.add(charId);
      onEliminateChar(charId);
      return next;
    });
  }, [mySecretCharId, onEliminateChar]);

  const handleGuess = useCallback((charId) => {
    setIsGuessing(false);
    onMakeGuess(charId);
  }, [onMakeGuess]);

  const aliveCount = characters.length - eliminated.size;

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'linear-gradient(160deg, #0D0D1A 0%, #120b24 40%, #0D0D1A 100%)',
      position: 'relative',
    }}>
      {/* Background grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }}/>

      {/* ── HEADER ── */}
      <header style={{
        background: 'rgba(13,13,26,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '2px solid rgba(124,58,237,0.3)',
        padding: '0.5rem 1.2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '0.8rem', flexShrink: 0, flexWrap: 'wrap', zIndex: 10,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)', border: '2px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '4px 14px', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
            <span className="display-font" style={{ fontSize: '1rem', color: '#FFF' }}>GUESS WHO?</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: '#64748B' }}>
              Round {round}
            </span>
            <span style={{ background: isMyTurn ? 'rgba(0,255,102,0.12)' : 'rgba(255,42,95,0.12)', border: `2px solid ${isMyTurn ? 'rgba(0,255,102,0.5)' : 'rgba(255,42,95,0.5)'}`, borderRadius: 6, padding: '3px 10px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: isMyTurn ? '#00FF66' : '#FF2A5F', animation: isMyTurn ? 'pulseHard 1.5s infinite' : 'none' }}>
              {isMyTurn ? '🎯 YOUR TURN' : `⏳ ${opponentName}`}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 10px', fontFamily: "'Nunito'", fontWeight: 700, fontSize: '0.75rem', color: '#475569' }}>
              {aliveCount} left
            </span>
          </div>
        </div>

        {/* Secret Character (center) */}
        <div onClick={() => setShowSecret(s => !s)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>Your char:</span>
          {mySecret && showSecret ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,215,0,0.08)', border: '2px solid rgba(255,215,0,0.4)', borderRadius: 10, padding: '4px 10px', boxShadow: '0 0 15px rgba(255,215,0,0.15)', animation: 'secretReveal 0.4s ease-out' }}>
              <img src={mySecret.image} alt={mySecret.name} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid rgba(255,215,0,0.5)', objectFit: 'cover' }}/>
              <span className="display-font" style={{ fontSize: '0.8rem', color: '#FFD700' }}>{mySecret.name}</span>
              <EyeOff size={14} color="#64748B"/>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={14} color="#475569"/>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem', color: '#475569' }}>Hidden</span>
            </div>
          )}
        </div>

        {/* Category badge */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '4px 12px' }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 }}>{category}</span>
        </div>
      </header>

      {/* ── GUESSING MODE BANNER ── */}
      {isGuessing && (
        <div style={{ background: 'linear-gradient(90deg, rgba(0,255,102,0.12), rgba(0,229,255,0.08))', borderBottom: '2px solid rgba(0,255,102,0.4)', padding: '0.4rem', textAlign: 'center', animation: 'slideUp 0.2s ease-out', zIndex: 5 }}>
          <span className="display-font" style={{ fontSize: '0.9rem', color: '#00FF66', letterSpacing: 2 }}>🎯 CLICK THE CHARACTER YOU THINK IS THEIRS!</span>
        </div>
      )}

      {/* ── CHARACTER GRID — STRICT 6 COLUMNS ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.8rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.5rem',
          maxWidth: 960,
          margin: '0 auto',
        }}>
          {characters.map((char, i) => (
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

      {/* ── Q&A PANEL ── */}
      <QAPanel
        isMyTurn={isMyTurn}
        question={question}
        askerId={askerId}
        myId={myId}
        opponentName={opponentName}
        onSendQuestion={onSendQuestion}
        onAnswer={onAnswer}
        isGuessing={isGuessing}
        setIsGuessing={setIsGuessing}
        lastAnswer={answerFlash}
        onAnswerTimeout={onAnswerTimeout}
      />
    </div>
  );
}
