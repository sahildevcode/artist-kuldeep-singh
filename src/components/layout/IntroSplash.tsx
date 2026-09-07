import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IntroSplashProps {
  onFinish: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Automatically transition into main site after 2.6 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 700); // 700ms smooth fadeout transition
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0E0D0C] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow & particles */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-artisan-crimson/15 via-artisan-gold/15 to-transparent blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Center Cinematic Typography Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
        {/* Top Fine Art Monogram / Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-artisan-gold text-[11px] font-semibold tracking-[0.25em] uppercase mb-6 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-artisan-gold animate-spin-slow" />
          <span>Atelier & Academy</span>
        </div>

        {/* Main Artist Name with Zoom-In & Fade-In Keyframe */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight animate-zoomFade">
          Artist{' '}
          <span className="bg-gradient-to-r from-[#F5E6CC] via-[#C5A059] to-[#E63946] bg-clip-text text-transparent italic font-normal">
            Kuldeep Singh
          </span>
        </h1>

        {/* Subtitle with slight delay */}
        <p className="text-xs sm:text-sm text-stone-400 font-light tracking-[0.2em] uppercase mt-4 max-w-md animate-fadeInDelay">
          12 Years of Fine Art Mastery • Original Works & Masterclasses
        </p>

        {/* Golden accent brush line */}
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-artisan-gold to-transparent my-6 animate-scaleX" />

        {/* Interactive Enter / Skip Button */}
        <button
          onClick={handleComplete}
          className="mt-2 text-xs font-semibold tracking-wider text-stone-400 hover:text-white flex items-center gap-1.5 transition-all duration-300 hover:scale-105 group"
        >
          <span>Enter Atelier</span>
          <ArrowRight className="w-3.5 h-3.5 text-artisan-gold group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <style>{`
        @keyframes zoomFade {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(15px);
            filter: blur(8px);
          }
          60% {
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDelay {
          0% { opacity: 0; transform: translateY(10px); }
          40% { opacity: 0; }
          100% { opacity: 0.9; transform: translateY(0); }
        }
        @keyframes scaleX {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .animate-zoomFade {
          animation: zoomFade 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fadeInDelay {
          animation: fadeInDelay 1.8s ease-out forwards;
        }
        .animate-scaleX {
          animation: scaleX 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
