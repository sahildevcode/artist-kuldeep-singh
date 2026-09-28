import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';

export type Theme3DMode = 'brush' | 'kuldeep' | 'celestial';

interface AudioContextType {
  // Audio state & actions
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  playClick: () => void;
  playBubbleBurst: () => void;
  playHover: () => void;
  playBrushStroke: () => void;

  // 3D Background Theme state & actions
  activeTheme3D: Theme3DMode;
  setActiveTheme3D: (mode: Theme3DMode) => void;
  autoCycle3D: boolean;
  setAutoCycle3D: (val: boolean) => void;

  // Global Settings Modal (compact popup for Theme & Sound)
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DEFAULT ON as requested by user ("song be defalut on hi rahega")
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    const saved = localStorage.getItem('artisan_sound_autoplay');
    return saved !== 'false'; // Default TRUE
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('artisan_sound_muted') === 'true';
  });
  const [volume, setVolumeState] = useState<number>(0.65);

  // 3D Background Theme (Default to 'kuldeep' or saved theme)
  const [activeTheme3D, setActiveTheme3DState] = useState<Theme3DMode>(() => {
    const saved = localStorage.getItem('artisan_3d_theme') as Theme3DMode;
    return saved === 'brush' || saved === 'kuldeep' || saved === 'celestial' ? saved : 'kuldeep';
  });
  const [autoCycle3D, setAutoCycle3D] = useState<boolean>(false);

  // Modal open state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Set theme & persist
  const setActiveTheme3D = (mode: Theme3DMode) => {
    setActiveTheme3DState(mode);
    localStorage.setItem('artisan_3d_theme', mode);
  };

  // Auto-Cycle 3D Themes if enabled (switches every 22 seconds)
  useEffect(() => {
    if (!autoCycle3D) return;
    const interval = setInterval(() => {
      setActiveTheme3DState((prev) => {
        if (prev === 'brush') return 'kuldeep';
        if (prev === 'kuldeep') return 'celestial';
        return 'brush';
      });
    }, 22000);
    return () => clearInterval(interval);
  }, [autoCycle3D]);

  // Audio start/stop handler
  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.stopAmbientSound();
      setIsPlaying(false);
      localStorage.setItem('artisan_sound_autoplay', 'false');
    } else {
      audioEngine.startAmbientSound();
      setIsPlaying(true);
      localStorage.setItem('artisan_sound_autoplay', 'true');
    }
  };

  const toggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    localStorage.setItem('artisan_sound_muted', muted ? 'true' : 'false');
  };

  const setVolume = (val: number) => {
    audioEngine.setVolume(val);
    setVolumeState(val);
  };

  // Sound effects
  const playClick = () => audioEngine.playClickSFX();
  const playBubbleBurst = () => audioEngine.playBubbleBurst();
  const playHover = () => audioEngine.playHoverSFX();
  const playBrushStroke = () => audioEngine.playBrushStroke();

  // DEFAULT ON: Start immediately or on the very first user interaction (browser policy)
  useEffect(() => {
    if (!isPlaying) return;

    // Try starting immediately
    audioEngine.startAmbientSound();

    // Browser audio policy wakeup on first user touch/scroll/click
    const handleFirstGesture = () => {
      if (isPlaying && !audioEngine.getIsPlaying()) {
        audioEngine.startAmbientSound();
      }
    };

    const events = ['click', 'pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, handleFirstGesture, { passive: true, once: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleFirstGesture));
    };
  }, [isPlaying]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        togglePlay,
        toggleMute,
        setVolume,
        playClick,
        playBubbleBurst,
        playHover,
        playBrushStroke,
        activeTheme3D,
        setActiveTheme3D,
        autoCycle3D,
        setAutoCycle3D,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
