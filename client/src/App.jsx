import { Routes, Route } from 'react-router-dom';
import MainGame from './MainGame';
import Privacy from './Privacy';
import Terms from './Terms';
import Contact from './Contact';
import HowToPlay from './HowToPlay';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainGame />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
