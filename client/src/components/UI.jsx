import { useState, useEffect } from 'react';
import {
  Gamepad2, Users, ArrowLeft, ChevronRight, Play, Search,
  Dices, Trophy, Clock, Zap, Shield, Globe, ChevronDown,
  Sparkles, Target, HelpCircle, CheckCircle, XCircle, Eye, Star
} from 'lucide-react';
import { SmartImage } from './SmartImage';

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — Neo-Brutalism (matches HiveMind)
═══════════════════════════════════════════════════════ */
export const PALETTE = [
  { bg: '#00E5FF', text: '#000000' }, // Electric Cyan
  { bg: '#FF2A5F', text: '#FFFFFF' }, // Hot Pink
  { bg: '#00FF66', text: '#000000' }, // Toxic Green
  { bg: '#FFD700', text: '#000000' }, // Arcade Yellow
  { bg: '#9D00FF', text: '#FFFFFF' }, // Deep Purple
  { bg: '#FF6600', text: '#FFFFFF' }, // Blaze Orange
];

const ADJECTIVES = ['Sneaky','Toxic','Based','Epic','Savage','Ghost','Neon','Cyber','Mega','Salty','Cursed','Sly'];
const NOUNS = ['Goblin','Ninja','Wizard','Panda','Slime','Glitch','Cyborg','Viper','Potato','Gremlin','Phantom'];

export const generateAIName = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};

/* ═══════════════════════════════════════════════════════
   ANIMATED CURSOR
═══════════════════════════════════════════════════════ */
export function AnimatedCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, []);
  return (
    <div style={{ position:'fixed',left:0,top:0,transform:`translate(${pos.x}px,${pos.y}px)`,pointerEvents:'none',zIndex:99999 }}>
      <div style={{ transform:`rotate(${clicked?-15:0}deg) scale(${clicked?0.8:1})`,transition:'transform 0.1s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" style={{ filter:'drop-shadow(3px 3px 0px rgba(0,0,0,0.5))' }}>
          <path d="M4 2 L4 22 L10 16 L15 22 L18 19 L13 13 L20 13 Z" fill="#00E5FF" stroke="#000" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CHUNKY BUTTON (identical to HiveMind)
═══════════════════════════════════════════════════════ */
export function ChunkyButton({ children, color = '#FFFFFF', onClick, disabled = false, style = {}, id }) {
  const [active, setActive] = useState(false);
  return (
    <button id={id} onClick={onClick} disabled={disabled}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => !disabled && setActive(false)}
      onMouseLeave={() => setActive(false)}
      style={{
        background: disabled ? '#D1D5DB' : color,
        border: '4px solid #000', borderRadius: '12px',
        padding: '1rem 1.5rem', fontSize: '1.1rem', fontWeight: 900,
        fontFamily: "'Nunito', sans-serif", textTransform: 'uppercase',
        letterSpacing: '2px', color: disabled ? '#9CA3AF' : '#000',
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: active || disabled ? '0px 0px 0px #000' : '6px 6px 0px #000',
        transform: active || disabled ? 'translate(6px,6px)' : 'translate(0,0)',
        transition: 'transform 0.05s linear, box-shadow 0.05s linear',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        ...style,
      }}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════════════════
   CHUNKY INPUT
═══════════════════════════════════════════════════════ */
export function ChunkyInput({ value, onChange, placeholder, maxLength, onKeyDown, id }) {
  return (
    <input id={id} value={value} onChange={onChange} onKeyDown={onKeyDown}
      maxLength={maxLength} placeholder={placeholder}
      className="display-font"
      style={{
        width: '100%', textAlign: 'center', fontSize: '2rem',
        background: '#FFF', border: '6px solid #000', borderRadius: '16px',
        padding: '1rem', color: '#000', outline: 'none', boxShadow: '6px 6px 0px #000',
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   LANDING VIEW
═══════════════════════════════════════════════════════ */
export function LandingView({ onHost, onJoin }) {
  const sectionStyle = { width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 2rem' };
  const cardStyle = (color, delay) => ({
    background: color, border: '4px solid #000', borderRadius: 16,
    padding: '2rem', boxShadow: '6px 6px 0px #000',
    animation: `slideUp 0.5s ${delay}s both`,
  });

  const HOW_STEPS = [
    { icon: <Gamepad2 size={32}/>, title: 'Create or Join', desc: 'Host a room or enter a 4-letter code to challenge a friend.', color: '#00FF66' },
    { icon: <Search size={32}/>, title: 'Pick a Category', desc: 'Choose from 12 categories — Streamers, footballers, anime & more!', color: '#00E5FF' },
    { icon: <HelpCircle size={32}/>, title: 'Ask Questions', desc: 'Take turns asking yes/no questions to narrow down the suspects.', color: '#FFD700' },
    { icon: <Trophy size={32}/>, title: 'Make Your Guess!', desc: 'Think you know? Guess your opponent\'s secret character to win!', color: '#FF2A5F' },
  ];

  const FEATURES = [
    { icon: <Zap size={28}/>, title: 'Real-Time', desc: 'Instant WebSocket updates — no lag.', color: '#00E5FF' },
    { icon: <Clock size={28}/>, title: '90s Timer', desc: 'Each round timed to keep things fast.', color: '#FFD700' },
    { icon: <Shield size={28}/>, title: '12 Categories', desc: 'YouTubers, athletes, anime & more.', color: '#FF2A5F' },
    { icon: <Target size={28}/>, title: '24 Characters', desc: 'Big board for maximum mind games.', color: '#00FF66' },
    { icon: <Users size={28}/>, title: '2 Players', desc: '1v1 — pure brain vs. brain.', color: '#9D00FF' },
    { icon: <Globe size={28}/>, title: 'Browser Native', desc: 'No downloads. Share code, play.', color: '#FF6600' },
  ];

  const STATS = [
    { value: '12', label: 'Categories', color: '#00E5FF' },
    { value: '24', label: 'Characters', color: '#FFD700' },
    { value: '90', label: 'Sec Timer', color: '#00FF66' },
    { value: '1v1', label: 'Format', color: '#FF2A5F' },
  ];

  return (
    <div className="game-bg" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'floaty 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FFD700', border: '4px solid #000', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #000' }}>
              <Eye size={40} color="#000"/>
            </div>
          </div>
          <h1 className="display-font" style={{ fontSize: 'clamp(2.5rem,8vw,5rem)', color: '#FFD700', WebkitTextStroke: '4px #000', textShadow: '8px 8px 0px #000', letterSpacing: 4, lineHeight: 1 }}>
            GUESS<span style={{ color: '#FF2A5F' }}>WHO?</span>
          </h1>
          <div style={{ marginTop: '1rem', background: '#000', color: '#FFF', display: 'inline-block', padding: '8px 20px', borderRadius: 99, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>
            Web Edition — 1v1 Online
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 800 }}>
          <div style={{ flex: '1 1 300px' }}>
            <ChunkyButton id="btn-host-game" color="#00FF66" onClick={onHost} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 15 }}>
              <div style={{ background: '#000', color: '#FFF', padding: 15, borderRadius: 12 }}><Gamepad2 size={40}/></div>
              <h2 className="display-font" style={{ fontSize: '2rem', margin: 0 }}>Host Game</h2>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.7 }}>Create a room</span>
            </ChunkyButton>
          </div>
          <div style={{ flex: '1 1 300px' }}>
            <ChunkyButton id="btn-join-game" color="#FF2A5F" onClick={onJoin} style={{ flexDirection: 'column', padding: '2.5rem 1.5rem', gap: 15 }}>
              <div style={{ background: '#000', color: '#FFF', padding: 15, borderRadius: 12 }}><Users size={40}/></div>
              <h2 className="display-font" style={{ fontSize: '2rem', margin: 0, color: '#FFF' }}>Join Game</h2>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.7, color: '#FFF' }}>Enter room code</span>
            </ChunkyButton>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 30, animation: 'bounceDown 2s ease-in-out infinite' }}>
          <ChevronDown size={36} color="#000" strokeWidth={3}/>
        </div>
      </div>

      {/* ── HOW TO PLAY ── */}
      <div style={{ background: '#00E5FF', padding: '5rem 2rem', borderTop: '6px solid #000', borderBottom: '6px solid #000' }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="display-font" style={{ fontSize: '2.5rem', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}>HOW TO PLAY</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {HOW_STEPS.map((s, i) => (
              <div key={i} style={{ ...cardStyle('#FFF', 0.1 * i), textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ background: s.color, border: '3px solid #000', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0 #000' }}>{s.icon}</div>
                <div className="display-font" style={{ fontSize: 12, background: '#000', color: '#FFF', padding: '2px 10px', borderRadius: 99 }}>STEP {i + 1}</div>
                <h3 className="display-font" style={{ fontSize: '1.1rem', margin: 0 }}>{s.title}</h3>
                <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#555', fontFamily: "'Nunito'" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ background: '#111827', padding: '5rem 2rem' }}>
        <div style={sectionStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', background: '#9D00FF', border: '4px solid #000', borderRadius: 12, padding: 12, boxShadow: '6px 6px 0 #000', marginBottom: '1rem' }}><Zap size={32} color="#FFF"/></div>
            <h2 className="display-font" style={{ fontSize: '2.5rem', color: '#FFF', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 #000' }}>FEATURES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#1E293B', border: '4px solid #000', borderRadius: 16, padding: '1.5rem', boxShadow: '6px 6px 0 #000', animation: `slideUp 0.5s ${0.08 * i}s both`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: f.color, border: '3px solid #000', borderRadius: 10, padding: 10, flexShrink: 0, boxShadow: '3px 3px 0 #000' }}>{f.icon}</div>
                <div>
                  <h3 className="display-font" style={{ fontSize: '1rem', color: '#FFF', margin: '0 0 6px' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 700, fontFamily: "'Nunito'", lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background: '#FFD700', padding: '3rem 2rem', borderTop: '6px solid #000', borderBottom: '6px solid #000' }}>
        <div style={{ ...sectionStyle, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `countUp 0.4s ${0.1 * i}s both` }}>
              <div className="display-font" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', color: '#000', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontWeight: 900, fontSize: '0.85rem', background: '#000', color: s.color, padding: '4px 14px', borderRadius: 99, marginTop: 8, fontFamily: "'Nunito'", letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#111827', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 className="display-font" style={{ fontSize: '2.5rem', color: '#FFF', WebkitTextStroke: '2px #000', textShadow: '4px 4px 0 #000', marginBottom: '2rem' }}>READY TO GUESS?</h2>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <ChunkyButton color="#00FF66" onClick={onHost} style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
            <Gamepad2 size={24}/> Host Game
          </ChunkyButton>
          <ChunkyButton color="#FF2A5F" onClick={onJoin} style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}>
            <Users size={24}/> <span style={{color:'#FFF'}}>Join Game</span>
          </ChunkyButton>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: '#000', padding: '2rem', textAlign: 'center', borderTop: '4px solid #333' }}>
        <p style={{ color: '#555', fontWeight: 800, fontSize: '0.85rem', fontFamily: "'Nunito'" }}>
          GUESS WHO? WEB EDITION © 2026 — Built with 👁️ and WebSockets
        </p>
        <p style={{ color: '#333', fontWeight: 700, fontSize: '0.75rem', fontFamily: "'Nunito'", marginTop: 8 }}>
          Not responsible for friendships ruined by wrong guesses.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOST SETUP VIEW
═══════════════════════════════════════════════════════ */
export function HostSetupView({ onBack, onEnter }) {
  const [name, setName] = useState('');
  return (
    <div className="game-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <div><ChunkyButton color="#FFF" onClick={onBack} style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}><ArrowLeft size={20}/> Back</ChunkyButton></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'floaty 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#00FF66', border: '4px solid #000', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #000' }}><Gamepad2 size={32}/></div>
          </div>
          <h2 className="display-font" style={{ fontSize: '2.5rem', WebkitTextStroke: '2px #000' }}>HOST A ROOM</h2>
          <p style={{ fontWeight: 800, color: '#555', fontFamily: "'Nunito'" }}>Enter your name to create a lobby</p>
        </div>
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <ChunkyInput id="host-name-input" value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12}
              onKeyDown={(e) => e.key === 'Enter' && name.trim().length > 0 && onEnter(name)}/>
            <button onClick={() => setName(generateAIName().toUpperCase())}
              style={{ position: 'absolute', right: -20, top: -20, background: '#9D00FF', border: '3px solid #000', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '4px 4px 0px #000', color: '#FFF' }}
              title="Random Name">
              <Dices size={24}/>
            </button>
          </div>
        </div>
        <ChunkyButton id="btn-create-lobby" color="#00FF66" onClick={() => onEnter(name)} disabled={name.trim().length === 0} style={{ width: '320px', padding: '1.5rem' }}>
          Create Lobby <ChevronRight size={24}/>
        </ChunkyButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   JOIN SETUP VIEW
═══════════════════════════════════════════════════════ */
export function JoinSetupView({ onBack, onEnter }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  return (
    <div className="game-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <div><ChunkyButton color="#FFF" onClick={onBack} style={{ display: 'inline-flex', padding: '0.5rem 1rem' }}><ArrowLeft size={20}/> Back</ChunkyButton></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '-4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'floaty 4s ease-in-out infinite' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FF2A5F', border: '4px solid #000', borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #000' }}><Users size={32} color="#FFF"/></div>
          </div>
          <h2 className="display-font" style={{ fontSize: '2.5rem', WebkitTextStroke: '2px #000' }}>JOIN A ROOM</h2>
          <p style={{ fontWeight: 800, color: '#555', fontFamily: "'Nunito'" }}>Enter the 4-letter room code</p>
        </div>
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          <ChunkyInput id="join-code-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))} placeholder="ROOM CODE" maxLength={4}/>
          <div style={{ position: 'relative' }}>
            <ChunkyInput id="join-name-input" value={name} onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))} placeholder="YOUR NAME" maxLength={12}
              onKeyDown={(e) => e.key === 'Enter' && code.length === 4 && name.trim().length > 0 && onEnter(code, name)}/>
            <button onClick={() => setName(generateAIName().toUpperCase())}
              style={{ position: 'absolute', right: -20, top: -20, background: '#9D00FF', border: '3px solid #000', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '4px 4px 0px #000', color: '#FFF' }}
              title="Random Name">
              <Dices size={24}/>
            </button>
          </div>
        </div>
        <ChunkyButton id="btn-enter-lobby" color="#FF2A5F" onClick={() => onEnter(code, name)} disabled={code.length !== 4 || name.trim().length === 0} style={{ width: '320px', padding: '1.5rem', color: '#FFF' }}>
          Enter Lobby <ChevronRight size={24}/>
        </ChunkyButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOBBY VIEW (max 2 players)
═══════════════════════════════════════════════════════ */
export function LobbyView({ roomCode, players, isHost, onBack, onStart, error }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const canStart = isHost && players.length === 2;

  return (
    <div className="game-bg" style={{ height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '2rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <ChunkyButton color="#FFF" onClick={onBack} style={{ padding: '0.5rem 1rem' }}><ArrowLeft size={20}/> Leave</ChunkyButton>
        <div style={{ background: '#000', color: '#00FF66', padding: '8px 20px', borderRadius: '99px', fontWeight: 900, border: '3px solid #000', boxShadow: '4px 4px 0px rgba(0,0,0,0.2)', fontFamily: "'Nunito'" }}>
          {players.length === 2 ? (isHost ? '✅ READY TO START!' : '⏳ WAITING FOR HOST...') : '⏳ WAITING FOR PLAYER 2...'}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FF2A5F', border: '4px solid #000', borderRadius: 12, padding: '1rem', margin: '1rem 0', textAlign: 'center', fontWeight: 900, fontFamily: "'Nunito'", boxShadow: '4px 4px 0 #000', animation: 'fadeInScale 0.3s ease-out' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem', marginTop: '2rem' }}>
        {/* Room Code */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '-10px', fontFamily: "'Nunito'" }}>ROOM CODE</p>
          <div className="display-font" onClick={copyCode}
            style={{ fontSize: 'clamp(4rem,15vw,8rem)', background: '#FFD700', color: '#000', padding: '0rem 2rem', border: '8px solid #000', borderRadius: '24px', boxShadow: '12px 12px 0px #000', display: 'inline-block', cursor: 'pointer', transition: 'transform 0.1s', animation: 'glowPulse 2s infinite' }}>
            {roomCode}
          </div>
          <p style={{ marginTop: '1rem', fontWeight: 800, color: copied ? '#00FF66' : '#000', fontFamily: "'Nunito'", transition: 'color 0.3s' }}>
            {copied ? '✅ COPIED!' : '👆 CLICK TO COPY'}
          </p>
        </div>

        {/* Player Slots */}
        <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center', fontFamily: "'Nunito'" }}>
          <p style={{ fontWeight: 900, letterSpacing: '2px', color: 'rgba(0,0,0,0.5)', marginBottom: '1.5rem' }}>
            {players.length} OF 2 PLAYERS
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            {[0, 1].map((slot) => {
              const p = players[slot];
              const c = p ? PALETTE[p.color % PALETTE.length] : null;
              return (
                <div key={slot} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  {p ? (
                    <>
                      <div style={{ position: 'relative', width: 100, height: 100, background: c.bg, border: '5px solid #000', borderRadius: '24px', boxShadow: '8px 8px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInScale 0.4s ease-out' }}>
                        <span className="display-font" style={{ fontSize: '3rem', color: c.text }}>{(p.name || 'P').charAt(0)}</span>
                        {p.isHost && (
                          <div style={{ position: 'absolute', top: -12, right: -12, background: '#FFD700', border: '3px solid #000', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, boxShadow: '3px 3px 0 #000' }}>👑</div>
                        )}
                        <div style={{ position: 'absolute', bottom: -6, right: -6, width: 20, height: 20, background: '#00FF66', border: '3px solid #000', borderRadius: '50%', animation: 'pulseHard 1.5s infinite' }}/>
                      </div>
                      <span style={{ fontWeight: 900, fontSize: '1.1rem', background: '#000', color: '#FFF', padding: '6px 16px', borderRadius: '10px', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 100, height: 100, background: 'transparent', border: '5px dashed rgba(0,0,0,0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 24, height: 24, background: 'rgba(0,0,0,0.1)', borderRadius: '50%' }}/>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'rgba(0,0,0,0.3)', padding: '6px 16px' }}>Waiting...</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isHost && players.length < 2 && (
          <p style={{ fontWeight: 800, color: '#555', fontFamily: "'Nunito'", animation: 'pulseHard 2s infinite' }}>
            Share the room code with your opponent!
          </p>
        )}
      </div>

      {/* Start Button (host only) */}
      {canStart && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <ChunkyButton id="btn-start-game" color="#FF2A5F" onClick={onStart} style={{ padding: '1.5rem 4rem', fontSize: '1.5rem', color: '#FFF', boxShadow: '8px 8px 0px #000', animation: 'glowPulse 1.5s infinite' }}>
            <Play fill="#FFF" size={28}/> START GAME
          </ChunkyButton>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORY SELECT VIEW (host only)
═══════════════════════════════════════════════════════ */
export function CategorySelectView({ categories, onSelect, onOpenBuilder }) {
  const [hovered, setHovered] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = () => {
    if (!aiPrompt.trim()) return;
    onOpenBuilder([], aiPrompt);
  };

  return (
    <div className="game-bg" style={{ minHeight: '100vh', padding: '2rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 1000, margin: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'slideUp 0.5s ease-out' }}>
          <div style={{ display: 'inline-flex', background: '#FFD700', border: '3px solid #000', borderRadius: 12, padding: '8px 16px', boxShadow: '4px 4px 0 #000', marginBottom: '0.5rem', gap: 8, alignItems: 'center' }}>
            <Sparkles size={20} color="#000" />
            <span className="display-font" style={{ fontSize: '0.9rem', color: '#000' }}>HOST'S CHOICE</span>
          </div>
          <h1 className="display-font" style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', color: '#f8fafc', WebkitTextStroke: '2px #0f172a', textShadow: '3px 3px 0 #0f172a', margin: 0 }}>
            PICK A CATEGORY
          </h1>
          <p style={{ color: '#94a3b8', fontWeight: 900, fontFamily: "'Nunito'", marginTop: '0.2rem', fontSize: '0.9rem' }}>
            Choose the character set for this round
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem', padding: '0 1rem' }}>
          {categories.map((cat, i) => (
            <button key={cat.id} id={`cat-${cat.id}`}
              onClick={() => onSelect(cat.id)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === cat.id ? '#3b82f6' : '#1e293b',
                border: hovered === cat.id ? '2px solid #60a5fa' : '2px solid #334155',
                borderRadius: 12,
                padding: '0.8rem',
                cursor: 'pointer',
                boxShadow: hovered === cat.id ? '4px 4px 0px rgba(0,0,0,0.5)' : '3px 3px 0px rgba(0,0,0,0.3)',
                transform: hovered === cat.id ? 'translate(-2px, -2px)' : 'none',
                transition: 'all 0.1s ease',
                animation: `slideUp 0.4s ${0.05 * i}s both`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                textAlign: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 50, height: 50, background: '#3b82f6', border: '2px solid #1e3a8a', borderRadius: '50%', boxShadow: '2px 2px 0 rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                {cat.thumbnail ? (
                  <img src={cat.thumbnail} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px', background: '#fff', transform: cat.zoom ? `scale(${cat.zoom})` : 'none' }} />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>{cat.emoji || '✨'}</span>
                )}
              </div>
              <h3 className="display-font" style={{ fontSize: '0.85rem', color: '#f8fafc', margin: 0 }}>{cat.name}</h3>
              <span style={{ color: '#94a3b8', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.65rem', background: '#0f172a', border: '2px solid #334155', borderRadius: 6, padding: '2px 6px' }}>
                {cat.id === 's8ul' ? 33 : 24} Chars
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CUSTOM CATEGORY BUILDER
═══════════════════════════════════════════════════════ */
export function CustomCategoryBuilder({ initialNames, categoryName, onLockIn, onCancel }) {
  const [selected, setSelected] = useState(() => initialNames.slice(0, 24));
  const [customName, setCustomName] = useState('');
    
  const handleSearchAI = async () => {
    if (!customName.trim()) return;
    setIsSearching(true);
    
    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://guess-who-web-game.onrender.com';
      const res = await fetch(`${SERVER_URL}/api/search-character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: customName, categoryName })
      });
      
      if (res.status === 429 || res.status === 500) {
        const data = await res.json();
        if (data.details?.includes('429') || res.status === 429) {
           setSuggestions(['⚠️ AI Rate Limit Reached! Please wait 15 seconds.']);
           return;
        }
      }

      const data = await res.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeselect = (name) => {
    setSelected(s => s.filter(n => n !== name));
  };

  const handleAddCustom = (nameToAdd) => {
    const finalName = typeof nameToAdd === 'string' ? nameToAdd : customName;
    if (!finalName.trim() || selected.length >= 24) return;
    setSelected(s => [...s, finalName.trim()]);
    setCustomName('');
    
  };

  const handleLockIn = () => {
    if (selected.length !== 24) return;
    // Map to final format
    const finalCharacters = selected.map(name => ({
      id: name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      name,
      traits: {},
      image: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    }));
    onLockIn({
      id: `Custom: ${categoryName}`,
      characters: finalCharacters
    });
  };

  return (
    <div className="game-bg" style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ── HEADER ── */}
        <div style={{ background: '#1e293b', padding: '1.5rem 2rem', borderRadius: 16, border: '4px solid #000', boxShadow: '8px 8px 0 #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="display-font" style={{ color: '#00E5FF', margin: 0, fontSize: '2rem', textShadow: '2px 2px 0 #0f172a' }}>BUILDING: {categoryName.toUpperCase()}</h2>
            <p style={{ color: '#94a3b8', margin: 0, fontFamily: "'Nunito'", fontWeight: 900 }}>Select exactly 24 characters</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="display-font" style={{ color: selected.length === 24 ? '#00FF66' : '#FFD700', fontSize: '1.8rem', background: '#0f172a', padding: '8px 16px', borderRadius: 12, border: '4px solid #000', boxShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}>
              {selected.length} / 24
            </div>
            <ChunkyButton onClick={handleLockIn} disabled={selected.length !== 24} color={selected.length === 24 ? '#00FF66' : '#94a3b8'} style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem' }}>
              LOCK IN & PLAY
            </ChunkyButton>
            <ChunkyButton onClick={onCancel} color="#FF2A5F" style={{ padding: '0.8rem 1.5rem', fontSize: '1.2rem' }}>
              CANCEL
            </ChunkyButton>
          </div>
        </div>

        {/* ── CUSTOM ADDITION BAR & DROPDOWN ── */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: 16, border: '4px solid #000', boxShadow: '6px 6px 0 #000', display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
            <input 
              value={customName} 
              onChange={e => {
                setCustomName(e.target.value);
                
              }} 
              placeholder="Type full name (e.g. CarryMinati)..." 
              style={{ flex: 1, minWidth: 200, padding: '1rem', borderRadius: 12, border: '4px solid #000', background: '#1e293b', color: '#f8fafc', fontFamily: "'Nunito'", fontWeight: 800, fontSize: '1.2rem', outline: 'none', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)' }} 
              onKeyDown={e => e.key === 'Enter' && handleAddCustom(customName)}
            />
            
            <ChunkyButton onClick={() => handleAddCustom(customName)} disabled={selected.length >= 24 || !customName.trim()} color="#FFD700" style={{ padding: '0 1.5rem', fontSize: '1.1rem' }}>
              + ADD CUSTOM
            </ChunkyButton>
          </div>
          
          {/* SEARCH DROPDOWN */}
          {(suggestions.length > 0 || isSearching) && (
            <div style={{ position: 'absolute', top: '100%', left: '1.5rem', right: '1.5rem', marginTop: '0.5rem', background: '#1e293b', border: '4px solid #000', borderRadius: 12, boxShadow: '6px 6px 0 #000', zIndex: 9, overflow: 'hidden' }}>
              {isSearching ? (
                <div style={{ padding: '1rem', color: '#00E5FF', fontFamily: "'Nunito'", fontWeight: 800 }}>Searching AI for matches...</div>
              ) : (
                suggestions.map((sug, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAddCustom(sug)}
                    className="chunky-hover"
                    style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: i < suggestions.length - 1 ? '2px solid #334155' : 'none', color: '#f8fafc', fontFamily: "'Nunito'", fontWeight: 800, fontSize: '1.2rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #000', overflow: 'hidden', background: '#3b82f6', flexShrink: 0 }}>
                      <SmartImage character={{ id: sug.toLowerCase().replace(/[^a-z0-9]/g, ''), name: sug }} />
                    </div>
                    {sug}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── SELECTED BOARD ── */}
        <div style={{ background: '#1e293b', borderRadius: 16, border: '4px solid #000', boxShadow: '8px 8px 0 #000', overflow: 'hidden' }}>
          <div style={{ background: '#0f172a', padding: '1.5rem 2rem', borderBottom: '4px solid #000' }}>
            <h3 className="display-font" style={{ color: '#f8fafc', margin: 0, fontSize: '1.5rem' }}>SELECTED BOARD</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, fontFamily: "'Nunito'", fontWeight: 800 }}>Click to remove</p>
          </div>
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {selected.map((name, i) => (
              <button 
                key={`${name}-${i}`} 
                onClick={() => handleDeselect(name)} 
                className="chunky-hover"
                style={{ 
                  background: '#00E5FF', border: '4px solid #000', borderRadius: 12, padding: '1rem', 
                  fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1rem', cursor: 'pointer', 
                  boxShadow: '4px 4px 0 #000', transition: 'all 0.1s ease', textAlign: 'left',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #000', overflow: 'hidden', background: '#3b82f6', flexShrink: 0 }}>
                    <SmartImage character={{ id: name.toLowerCase().replace(/[^a-z0-9]/g, ''), name }} />
                  </div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span> 
                </div>
                <span style={{ color: '#FF2A5F', fontSize: '1.2rem', marginLeft: '0.5rem', flexShrink: 0 }}>✕</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WINNER SCREEN
═══════════════════════════════════════════════════════ */
export function WinnerScreen({ winnerId, myId, winnerName, guessedChar, secretChar, correct, onRematch, onLeave }) {
  const iWon = winnerId === myId;
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ['#FFD700', '#FF2A5F', '#00E5FF', '#00FF66', '#9D00FF', '#FF6600'][i % 6],
      size: 8 + Math.random() * 12,
    }))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', overflow: 'hidden' }}>
      {/* Confetti */}
      {iWon && confetti.map(c => (
        <div key={c.id} style={{ position: 'absolute', left: `${c.left}%`, top: -20, width: c.size, height: c.size, background: c.color, borderRadius: 3, border: '2px solid rgba(0,0,0,0.3)', animation: `confettiFall ${c.duration}s ${c.delay}s infinite linear` }}/>
      ))}

      <div style={{ textAlign: 'center', zIndex: 1, animation: 'fadeInScale 0.5s ease-out', padding: '2rem' }}>
        {/* Result Icon */}
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'winnerBounce 1.5s ease-in-out infinite' }}>
          {iWon ? '🏆' : '😔'}
        </div>

        {/* Title */}
        <h1 className="display-font" style={{ fontSize: 'clamp(3rem,10vw,6rem)', color: iWon ? '#FFD700' : '#FF2A5F', WebkitTextStroke: '3px #000', textShadow: '8px 8px 0 #000', marginBottom: '1rem' }}>
          {iWon ? 'YOU WIN!' : 'YOU LOSE!'}
        </h1>

        {/* Subtitle */}
        <div style={{ background: iWon ? '#FFD700' : '#1E293B', border: '4px solid #000', borderRadius: 16, padding: '1rem 2rem', boxShadow: '6px 6px 0 #000', marginBottom: '2rem', animation: 'slideUp 0.5s 0.2s both' }}>
          <p style={{ fontWeight: 900, fontSize: '1.2rem', fontFamily: "'Nunito'", color: iWon ? '#000' : '#FFF' }}>
            {correct
              ? iWon
                ? `✅ Correct! You guessed ${winnerName}'s character!`
                : `😵 ${winnerName} guessed your character correctly!`
              : iWon
                ? `🎉 ${winnerName} made a wrong guess — you win!`
                : `❌ Your wrong guess cost you the game!`
            }
          </p>
        </div>

        {/* Character Reveal */}
        {secretChar && (
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap', animation: 'slideUp 0.5s 0.35s both' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 900, color: '#94A3B8', marginBottom: 8, fontFamily: "'Nunito'" }}>OPPONENT'S CHARACTER</p>
              <div style={{ width: 100, height: 100, borderRadius: 16, border: '4px solid #FFD700', overflow: 'hidden', boxShadow: '6px 6px 0 #000', margin: '0 auto 8px' }}>
                <img src={secretChar.image} alt={secretChar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
              <div className="display-font" style={{ color: '#FFF', fontSize: '0.9rem' }}>{secretChar.name}</div>
            </div>
            {guessedChar && guessedChar.id !== secretChar.id && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 900, color: '#94A3B8', marginBottom: 8, fontFamily: "'Nunito'" }}>YOU GUESSED</p>
                <div style={{ width: 100, height: 100, borderRadius: 16, border: '4px solid #FF2A5F', overflow: 'hidden', boxShadow: '6px 6px 0 #000', margin: '0 auto 8px' }}>
                  <img src={guessedChar.image} alt={guessedChar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>
                <div className="display-font" style={{ color: '#FFF', fontSize: '0.9rem' }}>{guessedChar.name}</div>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', animation: 'slideUp 0.5s 0.5s both' }}>
          <ChunkyButton id="btn-rematch" color="#00FF66" onClick={onRematch} style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
            <Star size={20}/> REMATCH
          </ChunkyButton>
          <ChunkyButton id="btn-leave" color="#FFF" onClick={onLeave} style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
            <ArrowLeft size={20}/> LEAVE
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   OPPONENT DISCONNECTED OVERLAY
═══════════════════════════════════════════════════════ */
export function DisconnectOverlay({ onLeave }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInScale 0.3s ease-out' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📡</div>
        <h2 className="display-font" style={{ fontSize: '3rem', color: '#FF2A5F', WebkitTextStroke: '2px #000', textShadow: '6px 6px 0 #000', marginBottom: '1rem' }}>
          OPPONENT LEFT
        </h2>
        <p style={{ color: '#94A3B8', fontWeight: 800, fontFamily: "'Nunito'", marginBottom: '2rem' }}>
          Your opponent disconnected from the game.
        </p>
        <ChunkyButton color="#FFD700" onClick={onLeave} style={{ padding: '1.2rem 3rem', fontSize: '1.2rem' }}>
          <ArrowLeft size={20}/> Back to Lobby
        </ChunkyButton>
      </div>
    </div>
  );
}
