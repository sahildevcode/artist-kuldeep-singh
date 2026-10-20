import React, { useEffect, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';

export const ScrollSignatureBackground: React.FC = () => {
  const { activeTheme3D } = useAudio();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const signatureGroupRef = useRef<SVGGElement | null>(null);
  const flourishRef = useRef<SVGPathElement | null>(null);

  // Measure flourish path length once on mount
  useEffect(() => {
    if (flourishRef.current) {
      try {
        const len = flourishRef.current.getTotalLength();
        flourishRef.current.style.strokeDasharray = `${len} ${len}`;
        flourishRef.current.style.strokeDashoffset = '0';
      } catch {
        // Fallback length
      }
    }
  }, []);

  // Silky-smooth GPU parallax scroll tracker (Zero lag, Zero CPU layout thrashing)
  useEffect(() => {
    let animationFrameId: number;
    let targetScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let currentScrollY = targetScrollY;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const updateLoop = () => {
      // Smooth lerp interpolation for buttery glide feel
      const diff = targetScrollY - currentScrollY;
      if (Math.abs(diff) > 0.1) {
        currentScrollY += diff * 0.14;
      } else {
        currentScrollY = targetScrollY;
      }

      if (signatureGroupRef.current) {
        // Parallax drift: Gently floats upward with depth as user scrolls down
        const translateY = (currentScrollY * -0.16).toFixed(2);
        // Subtle scale depth: Gently scales to 0.88 over 2000px
        const scale = (1 - Math.min(0.14, (currentScrollY / 2200) * 0.14)).toFixed(3);
        // Soft opacity transition: High radiance at top, settling into an elegant atelier watermark (0.42)
        const opacity = Math.max(0.38, 1 - (currentScrollY / 1200) * 0.62).toFixed(2);

        signatureGroupRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        signatureGroupRef.current.style.opacity = opacity;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isVisible = activeTheme3D === 'kuldeep';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-700 select-none overflow-hidden flex items-center justify-center ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 0, contain: 'strict' }}
    >
      <div className="relative w-full max-w-6xl px-4 sm:px-8 py-6 flex items-center justify-center">
        {/* ------------------------------------------------------------- */}
        {/* ATMOSPHERIC LUMINOUS RADIANT GLOW                             */}
        {/* Hardware-accelerated warm golden museum spotlight             */}
        {/* ------------------------------------------------------------- */}
        <div
          className="absolute -inset-10 sm:-inset-24 pointer-events-none opacity-70 gpu-blur-ambient"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(212, 175, 55, 0.22) 0%, rgba(185, 35, 35, 0.10) 45%, transparent 75%)',
          }}
        />

        {/* ------------------------------------------------------------- */}
        {/* Pure SVG Classical Calligraphy Handwriting Masterpiece        */}
        {/* 100% GPU Hardware Accelerated - Pure Liquid Gold Vibrancy    */}
        {/* ------------------------------------------------------------- */}
        <svg
          viewBox="0 0 1440 740"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto overflow-visible relative z-1 pointer-events-none"
          style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        >
          <defs>
            {/* Rich Imperial 24K Gilded Gold & Deep Venetian Crimson Gradient */}
            <linearGradient id="signature-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A1B0E" />
              <stop offset="12%" stopColor="#7A1818" />
              <stop offset="38%" stopColor="#9C2020" />
              <stop offset="65%" stopColor="#C5A059" />
              <stop offset="85%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            {/* Subtle soft drop glow for calligraphy */}
            <filter id="gold-calligraphy-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#D4AF37" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* ------------------------------------------------------------- */}
          {/* MASTER SIGNATURE GROUP: Parallax Drift & Depth Scaling        */}
          {/* ------------------------------------------------------------- */}
          <g
            ref={signatureGroupRef}
            style={{
              transformOrigin: '50% 50%',
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform, opacity',
            }}
          >
            {/* Faint Graphite Classical Guide Underlay */}
            <g
              opacity="0.10"
              fill="#382C24"
              style={{
                fontFamily: "'Great Vibes', 'Alex Brush', cursive",
              }}
            >
              <text x="180" y="275" fontSize="180" className="font-normal tracking-wide">
                Artist
              </text>
              <text x="230" y="485" fontSize="210" className="font-normal tracking-wide">
                Kuldeep Singh
              </text>
              <path
                d="M 220 540 Q 750 600 1350 510 C 1390 500, 1370 550, 1260 565 Q 650 610 180 545 C 130 535, 140 500, 190 515 Q 360 550 520 540"
                fill="none"
                stroke="#382C24"
                strokeWidth="4"
              />
            </g>

            {/* Master Gilded Calligraphy Script */}
            <g
              fill="url(#signature-gold-gradient)"
              filter="url(#gold-calligraphy-glow)"
              style={{
                fontFamily: "'Great Vibes', 'Alex Brush', cursive",
              }}
            >
              {/* Line 1: "Artist" */}
              <text
                x="180"
                y="275"
                className="font-normal tracking-wide"
                fontSize="180"
              >
                Artist
              </text>

              {/* Line 2: "Kuldeep Singh" */}
              <text
                x="230"
                y="485"
                className="font-normal tracking-wide"
                fontSize="210"
              >
                Kuldeep Singh
              </text>

              {/* Line 3: Royal Flourish Underline */}
              <path
                ref={flourishRef}
                d="M 220 540 Q 750 600 1350 510 C 1390 500, 1370 550, 1260 565 Q 650 610 180 545 C 130 535, 140 500, 190 515 Q 360 550 520 540"
                fill="none"
                stroke="url(#signature-gold-gradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
