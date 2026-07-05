import React from 'react';
import Footer from './components/Footer';
import { AnimatedCursor } from './components/UI';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white' }}>
      <AnimatedCursor />
      <style>{`* { cursor: none !important; }`}</style>
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#38bdf8' }}>Privacy Policy</h1>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          This Privacy Policy describes how we collect, use, and handle your information when you use our website and services.
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Information We Collect</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We collect information you provide directly to us when you create or join a game room. This may include a chosen username. We do not require real names or personal identifiable information (PII).
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Cookies and Analytics</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          We may use cookies or similar technologies to enhance your experience, analyze trends, and administer the website. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this or other websites.
        </p>
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>Contact</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
      <Footer />
    </div>
  );
}
