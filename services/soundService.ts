
class SoundService {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      // Cross-browser compatibility
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    return this.audioContext;
  }

  // Call this on a user interaction (click) to ensure the browser allows audio
  public init() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  }

  public playStart() {
    // Classic power-up sequence
    this.playTone(110, 'square', 0.1, 0, 0.1);
    this.playTone(220, 'square', 0.1, 0.1, 0.1);
    this.playTone(440, 'square', 0.1, 0.2, 0.1);
    this.playTone(880, 'square', 0.4, 0.3, 0.1);
  }

  public playClick() {
    // High pitched select sound
    this.playTone(600, 'square', 0.1, 0, 0.05);
  }

  public playNav() {
    // Softer menu navigation blip
    this.playTone(300, 'sine', 0.05, 0, 0.1);
  }

  public playSuccess() {
    // Victory / Coin sound
    this.playTone(1046.50, 'square', 0.1, 0, 0.1); // C6
    this.playTone(1318.51, 'square', 0.3, 0.1, 0.1); // E6
  }

  public playError() {
    // Low buzzer
    this.playTone(150, 'sawtooth', 0.2, 0, 0.2);
    this.playTone(100, 'sawtooth', 0.4, 0.1, 0.2);
  }

  public playBlip() {
    // Tiny blip for typing text
    this.playTone(800, 'square', 0.03, 0, 0.015);
  }
}

export const soundService = new SoundService();
