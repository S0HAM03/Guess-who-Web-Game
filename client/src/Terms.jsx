import React from 'react';
import Footer from './components/Footer';
import { AnimatedCursor } from './components/UI';

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white' }}>
      <AnimatedCursor />
      <style>{`* { cursor: none !important; }`}</style>
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#38bdf8' }}>Terms of Service</h1>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          Welcome to our Guess Who Web Game! By accessing or using our website, you agree to be bound by these Terms of Service.
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Acceptable Use</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Please be respectful to other players.
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Disclaimer</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          The game and all related materials are provided "as is" without warranty of any kind. We do not guarantee uninterrupted or error-free operation.
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Changes to Terms</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of the new terms.
        </p>
      </div>
      <Footer />
    </div>
  );
}
