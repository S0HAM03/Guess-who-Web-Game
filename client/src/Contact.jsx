import React from 'react';
import Footer from './components/Footer';
import { AnimatedCursor } from './components/UI';

export default function Contact() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white' }}>
      <AnimatedCursor />
      <style>{`* { cursor: none !important; }`}</style>
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#38bdf8' }}>Contact Us</h1>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We would love to hear from you! If you have any questions, feedback, or issues with the game, please reach out.
        </p>
        <div style={{ marginTop: '40px', padding: '30px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Email Support</h2>
          <p style={{ color: '#aaa' }}>
            You can email us directly at: <a href="mailto:sohamgadekar3@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>sohamgadekar3@gmail.com</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
