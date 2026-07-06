// 8-Bit Web Audio API Synthesizer
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(val) {
    this.isMuted = val;
  }

  playTone(freq, type, duration, vol = 0.1, slideFreq = null) {
    if (this.isMuted) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, now + duration);
    }

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  playHover() {
    this.playTone(800, 'sine', 0.05, 0.02);
  }

  playEliminate() {
    // A quick descending noise/square
    this.playTone(300, 'square', 0.2, 0.05, 50);
  }

  playSuccess() {
    // Arpeggio up
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    [440, 554, 659, 880].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = f;
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      gain.gain.setValueAtTime(0.05, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
      
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  }

  playError() {
    // Low buzz
    this.playTone(150, 'sawtooth', 0.4, 0.1, 100);
  }

  playChat() {
    // Pleasant high ping
    this.playTone(1200, 'sine', 0.15, 0.05, 1000);
  }

  playTurnStart() {
    // Two quick notes
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    [600, 800].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      gain.gain.setValueAtTime(0.1, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
      
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.2);
    });
  }
}

export const Sound = new SoundEngine();
