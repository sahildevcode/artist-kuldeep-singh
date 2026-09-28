import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Layers, Sliders, X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { audioEngine } from '../../utils/audioEngine';

export const AtelierAudioPlayer: React.FC = () => {
  const {
    isPlaying,
    isMuted,
    volume,
    togglePlay,
    toggleMute,
    setVolume,
    activeTheme3D,
    setActiveTheme3D,
    autoCycle3D,
    setAutoCycle3D,
    playClick,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
  } = useAudio();

  const [visualizerHeights, setVisualizerHeights] = useState<number[]>([40, 65, 30, 80]);

  // Animate mini visualizer bars when music is playing
  useEffect(() => {
    if (!isPlaying || isMuted) {
      setVisualizerHeights([20, 20, 20, 20]);
      return;
    }

    const interval = setInterval(() => {
      const data = audioEngine.getVisualizerData();
      if (data && data.length >= 4) {
        const h0 = Math.max(15, Math.min(100, (data[2] / 255) * 100));
        const h1 = Math.max(20, Math.min(100, (data[4] / 255) * 100));
        const h2 = Math.max(15, Math.min(100, (data[6] / 255) * 100));
        const h3 = Math.max(25, Math.min(100, (data[8] / 255) * 100));
        setVisualizerHeights([h0, h1, h2, h3]);
      } else {
        setVisualizerHeights([
          30 + Math.random() * 50,
          45 + Math.random() * 45,
          25 + Math.random() * 60,
          50 + Math.random() * 40,
        ]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isMuted]);

  return (
    <>
      {/* Backdrop overlay when modal is open */}
      {isSettingsModalOpen && (
        <div
          onClick={() => setIsSettingsModalOpen(false)}
          className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Settings Modal (Center/Bottom Modal) */}
      {isSettingsModalOpen && (
        <div className="fixed bottom-20 left-6 sm:bottom-24 sm:left-8 z-50 w-[90vw] max-w-sm glass-panel bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-stone-800">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-artisan-ochre" />
              <span className="font-serif font-bold text-base tracking-wide text-stone-900">
                Atelier 3D & Acoustics
              </span>
            </div>
            <button
              onClick={() => {
                playClick();
                setIsSettingsModalOpen(false);
              }}
              className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Theme Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-artisan-crimson" /> 3D Background Theme
              </span>
              <button
                onClick={() => {
                  playClick();
                  setAutoCycle3D(!autoCycle3D);
                }}
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium transition cursor-pointer ${
                  autoCycle3D
                    ? 'bg-artisan-crimson text-white font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {autoCycle3D ? 'Auto-Cycle ON' : 'Auto-Cycle (20s)'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  playClick();
                  setActiveTheme3D('brush');
                }}
                className={`p-2.5 rounded-2xl text-center border transition cursor-pointer ${
                  activeTheme3D === 'brush'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-xl mb-1">🎨</div>
                <div className="text-[11px] leading-tight font-medium">Brush & Palette</div>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setActiveTheme3D('kuldeep');
                }}
                className={`p-2.5 rounded-2xl text-center border transition cursor-pointer ${
                  activeTheme3D === 'kuldeep'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-xl mb-1">🏛️</div>
                <div className="text-[11px] leading-tight font-medium">Artist Kuldeep</div>
              </button>

              <button
                onClick={() => {
                  playClick();
                  setActiveTheme3D('celestial');
                }}
                className={`p-2.5 rounded-2xl text-center border transition cursor-pointer ${
                  activeTheme3D === 'celestial'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md font-bold'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="text-xl mb-1">🌌</div>
                <div className="text-[11px] leading-tight font-medium">Celestial Easel</div>
              </button>
            </div>
          </div>

          {/* Sound Controls */}
          <div className="space-y-2.5 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-artisan-ochre" /> Atelier Music (Neo-Classical)
              </span>
              <button
                onClick={() => {
                  playClick();
                  togglePlay();
                }}
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition cursor-pointer flex items-center gap-1 ${
                  isPlaying && !isMuted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {isPlaying && !isMuted ? 'Playing' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Volume</span>
              <span className="font-mono font-semibold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-artisan-crimson h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-stone-600 leading-tight">
              ✨ <b>Scroll & Motion Reactive:</b> Fast scrolling swells filter harmonics and triggers subtle chimes; mouse movement pans audio left & right.
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => {
                playClick();
                setIsSettingsModalOpen(false);
              }}
              className="w-full py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition shadow-sm cursor-pointer"
            >
              Done & Return to Atelier
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <div className="flex items-center gap-2 bg-stone-950/90 text-white backdrop-blur-xl border border-white/20 rounded-full py-1.5 px-3 shadow-xl hover:shadow-2xl transition-all duration-300 group">
          {/* Play/Pause Button */}
          <button
            onClick={() => {
              playClick();
              togglePlay();
            }}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition cursor-pointer"
          >
            {isPlaying && !isMuted ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Animated Sound Equalizer Bars */}
          <div
            onClick={() => {
              playClick();
              togglePlay();
            }}
            className="flex items-end gap-0.5 h-4 cursor-pointer px-1"
            title="Sound Reactive Equalizer"
          >
            {visualizerHeights.map((h, i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all duration-100 ${
                  isPlaying && !isMuted ? 'bg-artisan-ochre' : 'bg-stone-500'
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Label & Status */}
          <div
            onClick={() => {
              playClick();
              setIsSettingsModalOpen(true);
            }}
            className="cursor-pointer pr-1 flex items-center gap-1.5 text-xs font-serif"
          >
            <span className="font-semibold text-stone-200 group-hover:text-white transition">
              {isPlaying && !isMuted ? 'Atelier Sound' : 'Muted'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-stone-300 font-sans hidden sm:inline-block">
              {activeTheme3D === 'brush' ? '🎨 Brush' : activeTheme3D === 'kuldeep' ? '🏛️ Kuldeep' : '🌌 Celestial'}
            </span>
          </div>

          {/* Mute/Unmute Quick Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              toggleMute();
            }}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="w-6 h-6 rounded-full hover:bg-white/15 flex items-center justify-center text-stone-300 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Open Settings Modal */}
          <button
            onClick={() => {
              playClick();
              setIsSettingsModalOpen(true);
            }}
            title="Open 3D & Audio Controls"
            className="w-6 h-6 rounded-full hover:bg-white/15 flex items-center justify-center text-artisan-ochre hover:text-white transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
