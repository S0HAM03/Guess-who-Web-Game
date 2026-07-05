import React from 'react';
import Footer from './components/Footer';
import { AnimatedCursor } from './components/UI';
import { Link } from 'react-router-dom';

export default function HowToPlay() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white' }}>
      <AnimatedCursor />
      <style>{`* { cursor: none !important; }`}</style>
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#38bdf8', margin: 0 }}>How to Play</h1>
          <Link to="/" style={{ padding: '10px 20px', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Back to Game</Link>
        </div>
        
        <p style={{ lineHeight: '1.6', marginBottom: '20px', fontSize: '1.1rem', color: '#cbd5e1' }}>
          Welcome to the ultimate multiplayer deduction game! Test your knowledge of pop culture, streamers, anime, and superheroes. 
          The goal of the game is to guess your opponent's secret character before they guess yours.
        </p>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#e2e8f0' }}>1. Getting Started</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#94a3b8' }}>
            One player needs to <strong>Create a Game</strong> and share the generated Room Code. 
            The second player will click <strong>Join Game</strong> and enter that Room Code. 
            Once both players are in the lobby, the host can select a category (e.g., Streamers, Anime, Superheroes, or custom) to start!
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#e2e8f0' }}>2. Pick Your Character</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#94a3b8' }}>
            At the start of the match, both players are presented with a grid of characters. 
            You must secretly choose one character to be your "Secret Identity". Your opponent will be trying to guess who you picked, and you will be trying to guess theirs!
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#e2e8f0' }}>3. Asking Questions</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#94a3b8' }}>
            Players take turns asking <strong>Yes/No</strong> questions about their opponent's character. 
            For example: <em>"Does your character wear glasses?"</em> or <em>"Is your character from Marvel?"</em>.
          </p>
          <p style={{ lineHeight: '1.6', color: '#94a3b8' }}>
            Based on the opponent's answer, you can click on characters in your grid to eliminate them (they will turn dark/grayscale). This helps you narrow down the possibilities.
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#e2e8f0' }}>4. Making a Guess</h2>
          <p style={{ lineHeight: '1.6', marginBottom: '15px', color: '#94a3b8' }}>
            If you think you know who your opponent's secret character is, you can use your turn to click <strong>"Make a Guess"</strong>. 
            Be careful! If you guess wrong, your opponent gets a free turn. If you guess right, you win the game!
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
}
