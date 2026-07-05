import { useState } from 'react';
import { Search, Lock, CheckCircle, Clock } from 'lucide-react';
import { ChunkyButton } from './UI';

export default function CharacterSelectScreen({
  characters,
  myId,
  myName,
  opponentName,
  category,
  onSelect,
  selectionStatus = [],
  isHost,
  onCancel,
}) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [search, setSearch] = useState('');

  const myStatus = selectionStatus.find(s => s.id === myId);
  const oppStatus = selectionStatus.find(s => s.id !== myId);

  const filtered = search.trim()
    ? characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : characters;

  const handleLock = () => {
    if (!selected || locked) return;
    setLocked(true);
    onSelect(selected.id);
  };

  return (
    <div className="game-bg" style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      paddingBottom: '2rem'
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: '#1e293b',
        borderBottom: '2px solid #334155',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#FFD700', border: '3px solid #000', borderRadius: 8, padding: '6px 16px', boxShadow: '4px 4px 0 #000' }}>
            <span className="display-font" style={{ fontSize: '1rem', color: '#000', letterSpacing: 1 }}>CHARACTER SELECT</span>
          </div>
          <div style={{ background: '#E5E7EB', border: '2px solid #000', borderRadius: 8, padding: '4px 12px' }}>
            <span style={{ color: '#555', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem' }}>CATEGORY: </span>
            <span style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase' }}>{category}</span>
          </div>
        </div>

        {/* Player status */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: myStatus?.hasSelected ? '#00FF66' : '#334155', border: '2px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', boxShadow: '2px 2px 0 #000' }}>
              {myStatus?.hasSelected ? <CheckCircle size={20} color="#000"/> : <Clock size={20} color="#94a3b8"/>}
            </div>
            <div style={{ color: '#f8fafc', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem' }}>YOU</div>
          </div>
          <div style={{ color: '#f8fafc', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1.2rem' }}>VS</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: oppStatus?.hasSelected ? '#00FF66' : '#334155', border: '2px solid #0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px', boxShadow: '2px 2px 0 #000' }}>
              {oppStatus?.hasSelected ? <CheckCircle size={20} color="#000"/> : <Clock size={20} color="#94a3b8"/>}
            </div>
            <div style={{ color: '#94a3b8', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.85rem', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opponentName}</div>
          </div>
        </div>
      </div>

      {/* ── INSTRUCTION BANNER ── */}
      <div style={{ padding: '1rem 2rem', background: '#3b82f6', borderBottom: '2px solid #1e3a8a', textAlign: 'center' }}>
        {locked ? (
          <p style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900 }}>
            ✅ You've locked in! Waiting for <strong style={{ textDecoration: 'underline' }}>{opponentName}</strong>...
          </p>
        ) : (
          <p style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 800 }}>
            👆 Pick the character you want <strong>{opponentName}</strong> to guess, then click <strong>LOCK IN</strong>. They can't see your choice!
          </p>
        )}
      </div>

      {/* ── SEARCH ── */}
      <div style={{ padding: '1.5rem 2rem 0', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search characters..."
            style={{ width: '100%', background: '#0f172a', border: '2px solid #334155', borderRadius: 10, padding: '10px 14px 10px 42px', color: '#f8fafc', fontFamily: "'Nunito'", fontWeight: 800, outline: 'none', fontSize: '1rem', boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)' }}/>
        </div>
        {isHost && (
          <ChunkyButton onClick={onCancel} color="#FF2A5F" style={{ padding: '0 1rem', height: 42, fontSize: '0.9rem' }}>
            CANCEL CATEGORY
          </ChunkyButton>
        )}
        {selected && !locked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#00FF66', border: '3px solid #000', borderRadius: 10, padding: '8px 16px', boxShadow: '4px 4px 0 #000' }}>
            <img src={selected.image} alt={selected.name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', border: '2px solid #000' }}/>
            <span style={{ color: '#000', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '1rem' }}>{selected.name}</span>
          </div>
        )}
      </div>

      {/* ── CHARACTER GRID ── */}
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((char) => {
            const isSelected = selected?.id === char.id;
            return (
              <button key={char.id}
                onClick={() => !locked && setSelected(isSelected ? null : char)}
                disabled={locked}
                style={{
                  position: 'relative',
                  aspectRatio: '3/4',
                  borderRadius: 12,
                  border: isSelected ? '4px solid #00FF66' : '2px solid #334155',
                  background: isSelected ? '#00FF66' : '#1e293b',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '6px 6px 0px #000' : '4px 4px 0px #000',
                  transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                  transition: 'all 0.1s ease',
                  padding: 0,
                }}
              >
                <img src={char.image} alt={char.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: isSelected ? '#000' : '#1e293b', padding: '8px 4px', borderTop: isSelected ? '3px solid #00FF66' : '2px solid #334155' }}>
                  <div className="display-font" style={{ fontSize: '0.65rem', color: isSelected ? '#00FF66' : '#f8fafc', textAlign: 'center', letterSpacing: 0.5, lineHeight: 1.2 }}>
                    {char.name}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: 6, right: 6, background: '#00FF66', borderRadius: '50%', width: 24, height: 24, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={16} color="#000"/>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LOCK IN BUTTON ── */}
      <div style={{ padding: '0 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {locked ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#00FF66', border: '4px solid #000', borderRadius: 12, padding: '0.8rem 2rem', boxShadow: '6px 6px 0 #000' }}>
              <CheckCircle size={24} color="#000"/>
              <span className="display-font" style={{ color: '#000', fontSize: '1.1rem' }}>LOCKED IN!</span>
            </div>
            <p style={{ color: '#555', fontFamily: "'Nunito'", fontWeight: 900, fontSize: '0.9rem', marginTop: 12 }}>
              Waiting for {opponentName} to lock in...
            </p>
          </div>
        ) : (
          <ChunkyButton id="btn-lock-in" color="#00FF66" onClick={handleLock} disabled={!selected}
            style={{ padding: '1.2rem 4rem', fontSize: '1.3rem', width: '100%', maxWidth: 400 }}>
            <Lock size={20}/> LOCK IN {selected ? `— ${selected.name}` : ''}
          </ChunkyButton>
        )}
      </div>
    </div>
  );
}
