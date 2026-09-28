import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { audioEngine } from '../../utils/audioEngine';

export const ScrollSignatureBackground: React.FC = () => {
  const { activeTheme3D } = useAudio();

  // Direct GPU DOM references (100% Compositor Thread, Zero React re-renders, Zero Lag)
  const line1Ref = useRef<SVGGElement | null>(null);
  const line2Ref = useRef<SVGGElement | null>(null);
  const flourishRef = useRef<SVGPathElement | null>(null);
  const brushRef = useRef<SVGGElement | null>(null);

  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const lastSoundTimeRef = useRef<number>(0);
  const flourishLengthRef = useRef<number>(1200);

  // Measure flourish path length once on mount
  useEffect(() => {
    if (flourishRef.current) {
      try {
        const len = flourishRef.current.getTotalLength();
        flourishLengthRef.current = len;
        flourishRef.current.style.strokeDasharray = `${len} ${len}`;
        flourishRef.current.style.strokeDashoffset = `${len}`;
      } catch {
        flourishLengthRef.current = 1200;
      }
    }
  }, []);

  // Hardware-accelerated smooth scroll tracker
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (activeTheme3D !== 'kuldeep') return;
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Reveal signature smoothly across 1800px of page scroll
      const maxScroll = 1800;
      targetProgressRef.current = Math.min(1, Math.max(0, currentScrollY / maxScroll));

      // Throttled procedural brush friction sound (max once per 140ms)
      if (activeTheme3D === 'kuldeep' && delta > 2) {
        const now = Date.now();
        if (now - lastSoundTimeRef.current > 140) {
          lastSoundTimeRef.current = now;
          audioEngine.playBrushStroke(Math.min(delta / 18, 1.2));
        }
      }

      // Start animation loop if idle
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        requestAnimationFrame(tickAnimation);
      }
    };

    const tickAnimation = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      // Silky smooth, instantaneous fluid response (zero lag)
      if (Math.abs(diff) > 0.0005) {
        currentProgressRef.current += diff * 0.28;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;

      // -------------------------------------------------------------
      // STAGE 1: Reveal "Artist" (Progress 0.00 -> 0.35)
      // GPU accelerated CSS clipPath inset - Zero CPU layout invalidation
      // -------------------------------------------------------------
      const p1 = Math.min(1, Math.max(0, p / 0.35));
      if (line1Ref.current) {
        const hideRightPercent = Math.max(0, (1 - p1) * 100);
        line1Ref.current.style.clipPath = `inset(0 ${hideRightPercent.toFixed(1)}% 0 0)`;
      }

      // -------------------------------------------------------------
      // STAGE 2: Reveal "Kuldeep Singh" (Progress 0.35 -> 0.82)
      // GPU accelerated CSS clipPath inset
      // -------------------------------------------------------------
      const p2 = Math.min(1, Math.max(0, (p - 0.35) / 0.47));
      if (line2Ref.current) {
        const hideRightPercent = Math.max(0, (1 - p2) * 100);
        line2Ref.current.style.clipPath = `inset(0 ${hideRightPercent.toFixed(1)}% 0 0)`;
      }

      // -------------------------------------------------------------
      // STAGE 3: Reveal Grand Flourish Underline (Progress 0.82 -> 1.00)
      // Native SVG stroke-dashoffset
      // -------------------------------------------------------------
      const p3 = Math.min(1, Math.max(0, (p - 0.82) / 0.18));
      if (flourishRef.current) {
        const fLen = flourishLengthRef.current;
        flourishRef.current.style.strokeDashoffset = `${(fLen * (1 - p3)).toFixed(1)}`;
      }

      // -------------------------------------------------------------
      // BRUSH POSITION TRACKING: Glides cleanly at active writing tip
      // 100% GPU translate3d - Zero DOM reflows
      // -------------------------------------------------------------
      if (brushRef.current) {
        if (p > 0.01 && p < 0.99) {
          brushRef.current.style.opacity = '1';
          let bx = 0;
          let by = 0;
          let rot = 0;

          if (p <= 0.35) {
            // Writing "Artist"
            bx = 180 + p1 * 540;
            by = 265 + Math.sin(p1 * 16) * 16;
            rot = Math.cos(p1 * 16) * 20;
          } else if (p <= 0.82) {
            // Writing "Kuldeep Singh"
            bx = 220 + p2 * 1060;
            by = 475 + Math.sin(p2 * 24) * 20;
            rot = Math.cos(p2 * 24) * 22;
          } else {
            // Sweeping Grand Flourish (right to left sweep)
            bx = 1300 - p3 * 1060;
            by = 530 + Math.sin(p3 * 6) * 12;
            rot = -15 + p3 * 30;
          }

          brushRef.current.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0) rotate(${(rot - 45).toFixed(1)}deg)`;
        } else {
          brushRef.current.style.opacity = '0';
        }
      }

      // Continue animation loop while moving, stop when idle to save 100% CPU
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.0005) {
        requestAnimationFrame(tickAnimation);
      } else {
        isRunningRef.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeTheme3D]);

  const isVisible = activeTheme3D === 'kuldeep';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-700 select-none overflow-hidden flex items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 0 }}
    >
      <div className="relative w-full max-w-6xl px-4 sm:px-8 py-6 flex items-center justify-center">
        {/* ------------------------------------------------------------- */}
        {/* ATMOSPHERIC LUMINOUS RADIANT GLOW (Requested by user)          */}
        {/* Pure CSS Radial Gradient - Hardware Accelerated, Zero Lag     */}
        {/* ------------------------------------------------------------- */}
        <div
          className="absolute -inset-10 sm:-inset-20 pointer-events-none opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(212, 175, 55, 0.28) 0%, rgba(185, 35, 35, 0.14) 42%, transparent 74%)',
            transform: 'translate3d(0, 0, 0)',
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* Pure SVG Classical Calligraphy Handwriting Canvas             */}
        {/* Uses the Exact Clean Font Style: 'Great Vibes', 'Alex Brush'  */}
        {/* ------------------------------------------------------------- */}
        <svg
          viewBox="0 0 1440 740"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto overflow-visible relative z-1"
          style={{ willChange: 'contents', transform: 'translate3d(0, 0, 0)' }}
        >
          <defs>
            {/* Rich Venetian Crimson & Imperial Gilded Gold Oil Gradient */}
            <linearGradient id="signature-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#180A04" />
              <stop offset="14%" stopColor="#6E1010" />
              <stop offset="48%" stopColor="#8C1818" />
              <stop offset="76%" stopColor="#B8860B" />
              <stop offset="92%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#180A04" />
            </linearGradient>

            {/* Brush Ferrule & Handle Gradients */}
            <linearGradient id="brush-ferrule-gold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c5a059" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b38728" />
            </linearGradient>
            <linearGradient id="brush-handle-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1c1613" />
              <stop offset="40%" stopColor="#3d2c23" />
              <stop offset="80%" stopColor="#1c1613" />
            </linearGradient>
          </defs>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 1: Faint Charcoal/Graphite Notebook Guide Underlay      */}
          {/* Gives the authentic look of cursive handwriting in a notebook  */}
          {/* ------------------------------------------------------------- */}
          <g
            opacity="0.12"
            fill="#382C24"
            style={{
              fontFamily: "'Great Vibes', 'Alex Brush', cursive",
            }}
          >
            {/* Top Line: "Artist" */}
            <text
              x="180"
              y="275"
              className="font-normal tracking-wide"
              fontSize="180"
            >
              Artist
            </text>

            {/* Bottom Line: "Kuldeep Singh" */}
            <text
              x="230"
              y="485"
              className="font-normal tracking-wide"
              fontSize="210"
            >
              Kuldeep Singh
            </text>

            {/* Flourish Underline Guide */}
            <path
              d="M 220 540 Q 750 600 1350 510 C 1390 500, 1370 550, 1260 565 Q 650 610 180 545 C 130 535, 140 500, 190 515 Q 360 550 520 540"
              fill="none"
              stroke="#382C24"
              strokeWidth="4"
            />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 2: Wet Oil Paint Calligraphy Written on Scroll          */}
          {/* Clean, crystal-clear typography with rich museum contrast     */}
          {/* Hardware-accelerated clipPath on compositor thread            */}
          {/* ------------------------------------------------------------- */}
          <g
            fill="url(#signature-gold-gradient)"
            style={{
              fontFamily: "'Great Vibes', 'Alex Brush', cursive",
            }}
          >
            {/* Line 1: "Artist" revealed progressively on GPU */}
            <g
              ref={line1Ref}
              style={{
                clipPath: 'inset(0 100% 0 0)',
                willChange: 'clip-path',
              }}
            >
              <text
                x="180"
                y="275"
                className="font-normal tracking-wide"
                fontSize="180"
              >
                Artist
              </text>
            </g>

            {/* Line 2: "Kuldeep Singh" revealed progressively on GPU */}
            <g
              ref={line2Ref}
              style={{
                clipPath: 'inset(0 100% 0 0)',
                willChange: 'clip-path',
              }}
            >
              <text
                x="230"
                y="485"
                className="font-normal tracking-wide"
                fontSize="210"
              >
                Kuldeep Singh
              </text>
            </g>

            {/* Line 3: Grand Calligraphic Flourish Underline */}
            <path
              ref={flourishRef}
              d="M 220 540 Q 750 600 1350 510 C 1390 500, 1370 550, 1260 565 Q 650 610 180 545 C 130 535, 140 500, 190 515 Q 360 550 520 540"
              fill="none"
              stroke="url(#signature-gold-gradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                willChange: 'stroke-dashoffset',
              }}
            />
          </g>

          {/* ------------------------------------------------------------- */}
          {/* LAYER 3: 3D Artist Paintbrush Gliding at the Active Ink Tip  */}
          {/* Sub-pixel precision, Zero React re-renders, 120 FPS speed     */}
          {/* ------------------------------------------------------------- */}
          <g
            ref={brushRef}
            className="transition-opacity duration-150 pointer-events-none"
            style={{
              opacity: 0,
              transformBox: 'view-box',
              willChange: 'transform, opacity',
            }}
          >
            {/* Wet Paint Glow at the tip */}
            <ellipse
              cx="0"
              cy="0"
              rx="9"
              ry="14"
              fill="#8C1818"
              opacity="0.95"
            />
            <ellipse
              cx="0"
              cy="-2"
              rx="5"
              ry="8"
              fill="#FFD700"
              opacity="0.85"
            />

            {/* Dark Natural Sable Hair Bristles */}
            <path
              d="M -7 -4 C -9 -18, -6 -32, -4 -42 L 4 -42 C 6 -32, 9 -18, 7 -4 Z"
              fill="#211a16"
            />
            <line x1="-3" y1="-8" x2="-2" y2="-38" stroke="#382d26" strokeWidth="1" />
            <line x1="1" y1="-8" x2="1" y2="-38" stroke="#382d26" strokeWidth="1" />

            {/* Brass Gilded Collar */}
            <rect
              x="-6"
              y="-62"
              width="12"
              height="20"
              rx="1"
              fill="url(#brush-ferrule-gold)"
            />
            <line
              x1="-6"
              y1="-52"
              x2="6"
              y2="-52"
              stroke="#684a0d"
              strokeWidth="1.5"
            />

            {/* Mahogany Wooden Handle */}
            <path
              d="M -5 -62 L -3 -180 C -3 -195, 3 -195, 3 -180 L 5 -62 Z"
              fill="url(#brush-handle-wood)"
            />
            <line
              x1="-1"
              y1="-65"
              x2="-1"
              y2="-175"
              stroke="#7a5843"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Fresh Wet Paint Droplet */}
            <circle cx="1" cy="4" r="2.8" fill="#8C1818" opacity="0.95" />
          </g>
        </svg>
      </div>
    </div>
  );
};
