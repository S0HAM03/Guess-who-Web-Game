import { Link } from 'react-router-dom';
import '../index.css';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      zIndex: 100,
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.9rem'
    }}>
      <Link to="/how-to-play" style={{ color: '#38bdf8', textDecoration: 'none', transition: 'color 0.2s', fontWeight: 'bold' }}>How to Play</Link>
      <Link to="/privacy" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='#ccc'}>Privacy Policy</Link>
      <Link to="/terms" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link>
      <Link to="/contact" style={{ color: '#ccc', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</Link>
    </footer>
  );
}
