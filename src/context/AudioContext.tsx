import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme3DMode = 'kuldeep';

interface AudioContextType {
  // Audio state & actions (disabled per user request)
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

  // 3D Background Theme state & actions - Locked exclusively to 'kuldeep'
  activeTheme3D: Theme3DMode;
  setActiveTheme3D: (mode: Theme3DMode) => void;
  autoCycle3D: boolean;
  setAutoCycle3D: (val: boolean) => void;

  // Global Settings Modal
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (val: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // All sound permanently disabled per user request
  const [isPlaying] = useState<boolean>(false);
  const [isMuted] = useState<boolean>(true);
  const [volume] = useState<number>(0);

  // 3D Background Theme - Exclusively 'kuldeep' (Artist Kuldeep Singh signature & stardust)
  const [activeTheme3D] = useState<Theme3DMode>('kuldeep');
  const [autoCycle3D] = useState<boolean>(false);

  // Ensure localStorage is cleanly set to 'kuldeep'
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('artisan_3d_theme', 'kuldeep');
    }
  }, []);

  // Modal open state
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const setActiveTheme3D = (_mode: Theme3DMode) => {};
  const setAutoCycle3D = (_val: boolean) => {};

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
