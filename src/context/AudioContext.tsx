import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // All sound permanently disabled per user request
  const [isPlaying] = useState<boolean>(false);
  const [isMuted] = useState<boolean>(true);
  const [volume] = useState<number>(0);

  // 3D Background Theme (Default to 'kuldeep' or saved theme)
  const [activeTheme3D, setActiveTheme3DState] = useState<Theme3DMode>(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('artisan_3d_theme') as Theme3DMode) : 'kuldeep';
    return saved === 'brush' || saved === 'kuldeep' || saved === 'celestial' ? saved : 'kuldeep';
  });
  const [autoCycle3D, setAutoCycle3D] = useState<boolean>(false);

  // Modal open state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Set theme & persist
  const setActiveTheme3D = (mode: Theme3DMode) => {
    setActiveTheme3DState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('artisan_3d_theme', mode);
    }
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

  // Audio start/stop handler - disabled
  const togglePlay = () => {};
  const toggleMute = () => {};
  const setVolume = (_val: number) => {};

  // Sound effects - disabled
  const playClick = () => {};
  const playBubbleBurst = () => {};
  const playHover = () => {};
  const playBrushStroke = () => {};

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
