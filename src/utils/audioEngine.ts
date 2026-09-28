// ============================================================================
// ATELIER SOUND & MUSIC ENGINE (Web Audio API)
// 100% Procedural & Self-Contained — Zero External Assets or Latency
// Designed for Artist Kuldeep Singh Atelier & Fine Art Experience
// Features:
// 1. Ambient meditative neo-classical atelier chords (warm cello/pad drone)
// 2. Real-time Scroll Reactivity (Filter cutoff rises & resonance opens with scroll velocity)
// 3. Mouse Spatial Panning & Overtones (Cursor movement pans audio left/right)
// 4. Interactive Fine Art SFX (Water bubble bursts, brush swoosh, ceramic clicks)
// ============================================================================

class AtelierAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.65;

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Chord synth voice management
  private chordInterval: number | null = null;
  private currentChordIndex = 0;

  // Scroll reactivity tracking
  private lastScrollY = 0;
  private scrollVelocity = 0;
  private lastChimeTime = 0;
  private lastScrollThrottleTime = 0;
  private cachedNoiseBuffer: AudioBuffer | null = null;

  // Luxurious Neo-Classical Atelier Chords (D Lydian / A Dorian harmonies)
  // Frequencies in Hz:
  // Chord 1: D3 (146.8), A3 (220.0), F#4 (369.9), C#5 (554.3) - Ethereal Lydian
  // Chord 2: G2 (98.0), D3 (146.8), B3 (246.9), F#4 (369.9) - Warm Velvet
  // Chord 3: B2 (123.5), F#3 (185.0), D4 (293.6), A4 (440.0) - Reflective Muse
  // Chord 4: A2 (110.0), E3 (164.8), C#4 (277.2), G#4 (415.3) - Royal Gold
  private chordProgressions = [
    [146.83, 220.0, 369.99, 554.37],
    [97.99, 146.83, 246.94, 369.99],
    [123.47, 185.0, 293.66, 440.0],
    [110.0, 164.81, 277.18, 415.3],
  ];

  // Wind Chime notes for fast scroll swells (Pentatonic Gold)
  private chimeNotes = [554.37, 659.25, 739.99, 880.0, 1108.73, 1318.51];

  constructor() {
    // Lazy initialization on first user interaction
    if (typeof window !== 'undefined') {
      this.lastScrollY = window.scrollY;
      this.setupGlobalListeners();
    }
  }

  private initContext() {
    if (this.ctx && this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.45, this.ctx.currentTime);

      // Lowpass Filter for Scroll Reactivity
      // Normal reading = warm, muted 450Hz; Fast scroll = crisp, resonant 2800Hz
      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(480, this.ctx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      // Stereo Panner (Mouse movement reactivity)
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.setValueAtTime(0, this.ctx.currentTime);
        this.lowpassFilter.connect(this.pannerNode);
        this.pannerNode.connect(this.masterGain);
      } else {
        this.lowpassFilter.connect(this.masterGain);
      }

      // Analyser for visualizer bars
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Pre-allocate single reusable noise buffer (zero runtime allocations, zero GC stutter)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
      this.cachedNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.cachedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.isInitialized = true;
    } catch {
      // AudioContext not available or blocked
    }
  }

  private setupGlobalListeners() {
    // Window scroll velocity monitor
    let scrollTimeout: number | undefined;
    window.addEventListener(
      'scroll',
      () => {
        const currentY = window.scrollY;
        const delta = Math.abs(currentY - this.lastScrollY);
        this.scrollVelocity = Math.min(delta * 2.2, 100);
        this.lastScrollY = currentY;

        const now = Date.now();
        if (now - this.lastScrollThrottleTime > 50) {
          this.lastScrollThrottleTime = now;
          this.onScrollReact(this.scrollVelocity);
        }

        window.clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
          this.scrollVelocity = 0;
          this.onScrollReact(0);
        }, 120);
      },
      { passive: true }
    );

    // Mouse spatial panning listener
    window.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        const pan = (e.clientX / window.innerWidth - 0.5) * 0.7; // -0.35 to +0.35
        this.onMousePan(pan);
      },
      { passive: true }
    );

    // Auto-resume if context was suspended by browser autoplay policy
    const resumeOnGesture = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    };
    window.addEventListener('click', resumeOnGesture, { once: false });
    window.addEventListener('touchstart', resumeOnGesture, { once: false });
  }

  // -------------------------------------------------------------
  // Dynamic Scroll & Motion Physics
  // -------------------------------------------------------------
  private onScrollReact(velocity: number) {
    if (!this.ctx || !this.lowpassFilter) return;

    // Filter cutoff sweeps from 480Hz up to 3200Hz smoothly
    const targetFreq = 480 + Math.pow(Math.min(velocity, 80) / 80, 1.2) * 2600;
    const now = this.ctx.currentTime;
    this.lowpassFilter.frequency.cancelScheduledValues(now);
    this.lowpassFilter.frequency.setTargetAtTime(targetFreq, now, 0.12);

    // If scrolling briskly, trigger an ethereal harmonic chime
    if (velocity > 35 && this.isPlaying && !this.isMuted) {
      if (now - this.lastChimeTime > 0.35) {
        this.lastChimeTime = now;
        this.playScrollChime();
      }
    }
  }

  private onMousePan(panValue: number) {
    if (!this.ctx || !this.pannerNode) return;
    const now = this.ctx.currentTime;
    this.pannerNode.pan.setTargetAtTime(panValue, now, 0.08);
  }

  private playScrollChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const note = this.chimeNotes[Math.floor(Math.random() * this.chimeNotes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);

    // Soft chime envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.85);
  }

  // -------------------------------------------------------------
  // Ambient Soundscape Progression (Looping meditative chords)
  // -------------------------------------------------------------
  public startAmbientSound() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.playNextChord();

    // Rotate to the next chord every 6 seconds with smooth cross-fading
    if (this.chordInterval) clearInterval(this.chordInterval);
    this.chordInterval = window.setInterval(() => {
      if (this.isPlaying) {
        this.playNextChord();
      }
    }, 6200);
  }

  private playNextChord() {
    if (!this.ctx || !this.lowpassFilter) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;

    const now = this.ctx.currentTime;
    const chordDuration = 7.5; // Slightly overlaps with next chord for velvet texture

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.lowpassFilter) return;

      // Primary warm Sine Oscillator
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      // Subtle detune chorus effect
      const detuneCents = (idx % 2 === 0 ? 3 : -3) + (Math.random() - 0.5) * 2;
      osc.type = idx === 0 ? 'sine' : 'triangle'; // Bass is pure sine, higher notes have subtle harmonic triangle
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detuneCents, now);

      // Lush Breathing Envelope (Attack 2s, Sustain 3s, Release 2.5s)
      const maxGain = idx === 0 ? 0.08 : 0.04;
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(maxGain, now + 2.0);
      oscGain.gain.setValueAtTime(maxGain, now + 4.2);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(oscGain);
      oscGain.connect(this.lowpassFilter);

      osc.start(now);
      osc.stop(now + chordDuration);
    });
  }

  public stopAmbientSound() {
    this.isPlaying = false;
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
  }

  // -------------------------------------------------------------
  // Interactive Atelier Sound Effects (SFX)
  // -------------------------------------------------------------

  // 1. Water Bubble Burst (Watercolor drop pop)
  public playBubbleBurst() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Fast downward frequency glide creates realistic liquid droplet pop
    const startFreq = 750 + Math.random() * 250;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // 2. Button / Artwork Click (Refined crystal bell tap)
  public playClickSFX() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1240, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // 3. Hover SFX (Delicate parchment tick)
  public playHoverSFX() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);

    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // 4. Brush Swoosh (Realistic oil paint bristles on textured canvas)
  public playBrushStroke(intensity: number = 1) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted || !this.cachedNoiseBuffer) return;

    const now = this.ctx.currentTime;
    const dur = 0.22;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.cachedNoiseBuffer;

    // Bandpass filter to simulate bristle friction
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 350, now);
    filter.Q.setValueAtTime(2.2, now);

    const gain = this.ctx.createGain();
    const peakGain = Math.min(0.045 * intensity, 0.08);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + dur);
  }

  // -------------------------------------------------------------
  // Controls & Visualizer
  // -------------------------------------------------------------
  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.45, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume * 0.45;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(4);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const audioEngine = new AtelierAudioEngine();
