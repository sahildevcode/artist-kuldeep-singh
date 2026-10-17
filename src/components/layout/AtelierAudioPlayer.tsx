import React from 'react';
import { Sparkles, Layers, X, Check } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const AtelierAudioPlayer: React.FC = () => {
  const {
    activeTheme3D,
    setActiveTheme3D,
    autoCycle3D,
    setAutoCycle3D,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
  } = useAudio();

  return (
    <>
      {/* Backdrop overlay when modal is open */}
      {isSettingsModalOpen && (
        <div
          onClick={() => setIsSettingsModalOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* 3D Theme Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed bottom-20 left-6 sm:bottom-24 sm:left-8 z-50 w-[92vw] max-w-md glass-panel bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-stone-800">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-artisan-ochre/15 text-artisan-ochre flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base tracking-wide text-stone-900">
                  3D Visual Atmosphere
                </h4>
                <p className="text-[11px] text-stone-500">
                  Switch interactive 3D background canvases
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Theme Switcher Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-artisan-crimson" /> Select Theme
              </span>
              <button
                onClick={() => setAutoCycle3D(!autoCycle3D)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex items-center gap-1 ${
                  autoCycle3D
                    ? 'bg-artisan-crimson text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{autoCycle3D ? 'Auto-Cycle ON' : 'Auto-Cycle (20s)'}</span>
                {autoCycle3D && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              {/* Theme 1: Brush */}
              <button
                type="button"
                onClick={() => setActiveTheme3D('brush')}
                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer relative ${
                  activeTheme3D === 'brush'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-artisan-gold/40'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-2xl mb-1.5">🎨</div>
                <div className="text-[11px] font-bold leading-tight">Brush & Palette</div>
                <div className="text-[9px] opacity-70 mt-0.5 hidden sm:block">Fluid Cursor Trail</div>
                {activeTheme3D === 'brush' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Theme 2: Kuldeep */}
              <button
                type="button"
                onClick={() => setActiveTheme3D('kuldeep')}
                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer relative ${
                  activeTheme3D === 'kuldeep'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-artisan-gold/40'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-2xl mb-1.5">🏛️</div>
                <div className="text-[11px] font-bold leading-tight">Artist Kuldeep</div>
                <div className="text-[9px] opacity-70 mt-0.5 hidden sm:block">Gold Signature 3D</div>
                {activeTheme3D === 'kuldeep' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>

              {/* Theme 3: Celestial */}
              <button
                type="button"
                onClick={() => setActiveTheme3D('celestial')}
                className={`p-3 rounded-2xl text-center border transition-all cursor-pointer relative ${
                  activeTheme3D === 'celestial'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-artisan-gold/40'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-2xl mb-1.5">🌌</div>
                <div className="text-[11px] font-bold leading-tight">Celestial Easel</div>
                <div className="text-[9px] opacity-70 mt-0.5 hidden sm:block">Starlight Studio</div>
                {activeTheme3D === 'celestial' && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition shadow-sm cursor-pointer"
            >
              Done & Return to Atelier
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="flex items-center gap-2 bg-stone-950/90 text-white backdrop-blur-xl border border-white/20 rounded-full py-2 px-3.5 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:border-artisan-gold/60"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-serif font-medium text-stone-200 group-hover:text-white transition">
            3D Theme:
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-stone-100 font-sans font-semibold">
            {activeTheme3D === 'brush' ? '🎨 Brush' : activeTheme3D === 'kuldeep' ? '🏛️ Kuldeep' : '🌌 Celestial'}
          </span>
          <Layers className="w-3.5 h-3.5 text-artisan-gold group-hover:scale-110 transition-transform ml-0.5" />
        </button>
      </div>
    </>
  );
};
