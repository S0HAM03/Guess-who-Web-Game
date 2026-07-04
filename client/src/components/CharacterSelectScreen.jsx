import { useState } from 'react';
import { Search, Lock, CheckCircle, Clock, Eye, Target } from 'lucide-react';
import { ChunkyButton } from './UI';

export default function CharacterSelectScreen({
  characters,
  myId,
  myName,
  opponentName,
  category,
  onSelect,
  selectionStatus = [],
}) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [search, setSearch] = useState('');

  const myStatus = selectionStatus.find(s => s.id === myId);
  const oppStatus = selectionStatus.find(s => s.id !== myId);
  const bothSelected = selectionStatus.length === 2 && selectionStatus.every(s => s.hasSelected);

  const filtered = search.trim()
    ? characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : characters;

  const handleLock = () => {
    if (!selected || locked) return;
    setLocked(true);
    onSelect(selected.id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0533 50%, #0D0D1A 100%)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '3px solid rgba(124,58,237,0.4)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #00E5FF)', border: '3px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '6px 16px', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
            <span className="display-font" style={{ fontSize: '1rem', color: '#FFF', letterSpacing: 2 }}>🎭 CHARACTER SELECT</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px' }}>
            <span style={{ color: '#94A3B8', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem' }}>Category: </span>
            <span style={{ color: '#FFD700', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>{category}</span>
          </div>
        </div>

        {/* Player status */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: myStatus?.hasSelected ? '#00FF66' : '#334155', border: '3px solid', borderColor: myStatus?.hasSelected ? '#00FF66' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', transition: 'all 0.3s', boxShadow: myStatus?.hasSelected ? '0 0 15px rgba(0,255,102,0.5)' : 'none' }}>
              {myStatus?.hasSelected ? <CheckCircle size={20} color="#000"/> : <Clock size={20} color="#64748B"/>}
            </div>
            <div style={{ color: '#FFF', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem' }}>YOU</div>
          </div>
          <div style={{ color: '#334155', fontFamily: "'Nunito'", fontWeight: 900 }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: oppStatus?.hasSelected ? '#00FF66' : '#334155', border: '3px solid', borderColor: oppStatus?.hasSelected ? '#00FF66' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', transition: 'all 0.3s', boxShadow: oppStatus?.hasSelected ? '0 0 15px rgba(0,255,102,0.5)' : 'none' }}>
              {oppStatus?.hasSelected ? <CheckCircle size={20} color="#000"/> : <Clock size={20} color="#64748B"/>}
            </div>
            <div style={{ color: '#94A3B8', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.75rem', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opponentName}</div>
          </div>
        </div>
      </div>

      {/* ── INSTRUCTION BANNER ── */}
      <div style={{ padding: '0.8rem 2rem', background: 'rgba(124,58,237,0.15)', borderBottom: '2px solid rgba(124,58,237,0.3)', textAlign: 'center' }}>
        {locked ? (
          <p style={{ color: '#00FF66', fontFamily: "'Nunito'", fontWeight: 900, animation: 'pulseHard 1.5s infinite' }}>
            ✅ You've locked in! Waiting for <strong>{opponentName}</strong>...
          </p>
        ) : (
          <p style={{ color: '#E2E8F0', fontFamily: "'Nunito'", fontWeight: 800 }}>
            👆 Pick the character you want <strong style={{ color: '#FFD700' }}>{opponentName}</strong> to guess, then click <strong style={{ color: '#00FF66' }}>LOCK IN</strong>. They can't see your choice!
          </p>
        )}
      </div>

      {/* ── SEARCH ── */}
      <div style={{ padding: '0.8rem 2rem 0', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search characters..."
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px 8px 36px', color: '#FFF', fontFamily: "'Nunito'", fontWeight: 700, outline: 'none', fontSize: '0.9rem' }}/>
        </div>
        {selected && !locked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,255,102,0.1)', border: '2px solid rgba(0,255,102,0.3)', borderRadius: 10, padding: '6px 14px', animation: 'fadeInScale 0.3s ease-out' }}>
            <img src={selected.image} alt={selected.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}/>
            <span style={{ color: '#00FF66', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.9rem' }}>{selected.name}</span>
          </div>
        )}
      </div>

      {/* ── CHARACTER GRID ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.8rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '0.6rem',
        }}>
          {filtered.map((char, idx) => {
            const isSelected = selected?.id === char.id;
            return (
              <button key={char.id}
                onClick={() => !locked && setSelected(isSelected ? null : char)}
                disabled={locked}
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  borderRadius: 12,
                  border: isSelected ? '3px solid #00FF66' : '2px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(0,255,102,0.08)' : 'rgba(255,255,255,0.03)',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 0 20px rgba(0,255,102,0.35), 0 4px 15px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.3)',
                  transform: isSelected ? 'scale(1.04) translateY(-3px)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  animation: `slideUp 0.3s ${0.02 * idx}s both`,
                  padding: 0,
                }}
              >
                <img src={char.image} alt={char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '16px 6px 5px' }}>
                  <div className="display-font" style={{ fontSize: '0.65rem', color: isSelected ? '#00FF66' : '#FFF', textAlign: 'center', letterSpacing: 0.5, lineHeight: 1.2, textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                    {char.name}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: 6, right: 6, background: '#00FF66', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={14} color="#000"/>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LOCK IN BUTTON ── */}
      <div style={{ padding: '1rem 2rem', background: 'rgba(0,0,0,0.4)', borderTop: '2px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
        {locked ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,255,102,0.12)', border: '3px solid #00FF66', borderRadius: 12, padding: '0.8rem 2rem', boxShadow: '0 0 20px rgba(0,255,102,0.2)' }}>
              <CheckCircle size={24} color="#00FF66"/>
              <span className="display-font" style={{ color: '#00FF66', fontSize: '1.1rem' }}>LOCKED IN!</span>
            </div>
            <p style={{ color: '#64748B', fontFamily: "'Nunito'", fontWeight: 800, fontSize: '0.8rem', marginTop: 8, animation: 'pulseHard 2s infinite' }}>
              Waiting for {opponentName} to lock in...
            </p>
          </div>
        ) : (
          <ChunkyButton id="btn-lock-in" color="#00FF66" onClick={handleLock} disabled={!selected}
            style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>
            <Lock size={20}/> LOCK IN {selected ? `— ${selected.name}` : ''}
          </ChunkyButton>
        )}
      </div>
    </div>
  );
}
