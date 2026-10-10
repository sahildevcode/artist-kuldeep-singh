import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, X, Volume2, VolumeX, ChevronLeft, ChevronRight, Film, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useStudioData } from '../../context/StudioDataContext';

export interface StudioReel {
  id: string;
  title: string;
  category: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
}

const DEFAULT_REELS: StudioReel[] = [
  {
    id: 'reel-1',
    title: 'Master Oil Glazing & Luminous Flesh Tones',
    category: 'Oil Glazing',
    duration: '0:58',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-2',
    title: 'Impasto Palette Knife Sculptural Textures',
    category: 'Palette Knife',
    duration: '0:45',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-3',
    title: 'Sight-Size Charcoal Portrait Anatomy',
    category: 'Charcoal Study',
    duration: '1:12',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-4',
    title: 'Raw Mineral Pigment & Walnut Oil Prep',
    category: 'Atelier Secrets',
    duration: '0:52',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.360p.vp9.webm',
    thumbnail: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=900&auto=format&fit=crop',
  },
];

export const StudioVideoReels: React.FC = () => {
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Default muted so all browsers permit instant autoplay
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { playClick } = useAudio();
  const { artistProfile } = useStudioData();

  // Safely clean custom video url (ignore outdated broken google sample URLs)
  const customVideoUrl = artistProfile?.studioVideoUrl && !artistProfile.studioVideoUrl.includes('commondatastorage.googleapis.com')
    ? artistProfile.studioVideoUrl
    : null;

  // Build exactly 4 reels in the frame (prioritizing custom studioReels from Admin)
  const customReels = artistProfile?.studioReels && Array.isArray(artistProfile.studioReels) ? artistProfile.studioReels : [];
  const reelsList: StudioReel[] = [0, 1, 2, 3].map((idx) => {
    if (customReels[idx]?.videoUrl) {
      return customReels[idx];
    }
    if (idx === 0 && customVideoUrl) {
      return {
        id: 'custom-admin-reel',
        title: artistProfile?.studioVideoTitle || 'Artist Kuldeep Singh • Atelier Demonstration',
        category: 'Featured Reel',
        duration: '0:55',
        videoUrl: customVideoUrl,
        thumbnail: artistProfile?.studioVideoPoster || DEFAULT_REELS[0].thumbnail,
      };
    }
    return DEFAULT_REELS[idx];
  });

  const activeReel = activeReelIndex !== null ? reelsList[activeReelIndex] : null;

  // Auto-play and reset whenever active reel changes
  useEffect(() => {
    if (activeReelIndex !== null && videoRef.current) {
      setProgress(0);
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // If browser blocked unmuted playback, force mute and play
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    }
  }, [activeReelIndex, isMuted]);

  // Handle keyboard navigation in reel player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeReelIndex === null) return;
      if (e.key === 'Escape') setActiveReelIndex(null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setActiveReelIndex((prev) => (prev !== null && prev < reelsList.length - 1 ? prev + 1 : 0));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setActiveReelIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : reelsList.length - 1));
      }
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, reelsList.length, isPlaying]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const isEmbedPlayer = (url: string) => {
    return (
      url.includes('mediadelivery.net') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('vimeo.com')
    );
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('mediadelivery.net') || url.includes('vimeo.com')) {
      return url;
    }
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('shorts/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&controls=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&controls=1`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&controls=1`;
    }
    return url;
  };

  return (
    <section className="py-16 sm:py-20 relative bg-stone-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-artisan-crimson animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-artisan-crimson">
                Atelier 9:16 Shorts & Reels
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Behind the Canvas • Studio Reels
            </h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mt-2 md:mt-0 leading-relaxed font-sans">
            Vertical 9:16 portrait shorts showing raw pigment preparation, classical glazing, and palette knife demonstrations.
          </p>
        </div>

        {/* 4 REELS IN ONE FRAME GRID (Portrait 9:16) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {reelsList.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => {
                playClick();
                setActiveReelIndex(idx);
              }}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-stone-950 border border-stone-200/60 shadow-xl group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-artisan-gold/60"
            >
              {/* Vertical Poster Image */}
              <img
                src={reel.thumbnail}
                alt={reel.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 group-hover:from-black/95 group-hover:via-black/20 transition-colors" />

              {/* Top Badges: Category & Duration */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <span className="text-[10px] uppercase font-bold text-artisan-gold tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {reel.category}
                </span>
                <span className="text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
                  <Film className="w-2.5 h-2.5 text-artisan-gold" />
                  {reel.duration}
                </span>
              </div>

              {/* Center Floating Red Play Button */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-artisan-crimson text-white flex items-center justify-center shadow-2xl group-hover:scale-115 group-hover:bg-red-600 transition-all duration-300">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-3.5 right-3.5 z-10 text-white space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-artisan-gold/90 font-medium tracking-wide">
                  <Sparkles className="w-3 h-3 text-artisan-gold" />
                  <span>@artist.kuldeepsingh</span>
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md text-white group-hover:text-artisan-gold transition-colors">
                  {reel.title}
                </h3>
                <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400">
                  <span className="group-hover:text-white transition-colors">Tap to Play Reel</span>
                  <span className="font-mono text-stone-500">9:16 HD</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* IMMERSIVE 9:16 VERTICAL REEL PLAYER MODAL                     */}
      {/* Rendered via Portal directly into document.body with z-[999999]*/}
      {/* ============================================================== */}
      {activeReel !== null && activeReelIndex !== null && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-black/95 backdrop-blur-md animate-in fade-in">
          {/* Previous Reel Navigation Button (Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setActiveReelIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : reelsList.length - 1));
            }}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-50 hover:scale-110"
            title="Previous Reel (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Reel Navigation Button (Desktop) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setActiveReelIndex((prev) => (prev !== null && prev < reelsList.length - 1 ? prev + 1 : 0));
            }}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-50 hover:scale-110"
            title="Next Reel (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 9:16 Vertical Reel Player Card (Guaranteed screen-contained) */}
          <div className="relative h-[78vh] max-h-[620px] aspect-[9/16] w-auto max-w-[92vw] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col justify-between my-auto select-none">
            {/* Reel Header (Top Controls - Always visible) */}
            <div className="absolute top-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSound();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 text-xs font-semibold cursor-pointer transition-colors"
                  title={isMuted ? 'Click for Sound' : 'Mute'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] text-amber-300">Tap for Sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-300">Sound On</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] font-mono font-bold text-white/80 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                  {activeReelIndex + 1}/{reelsList.length}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveReelIndex(null);
                }}
                className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title="Close Reel (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div
              onClick={togglePlayPause}
              className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {isEmbedPlayer(activeReel.videoUrl) ? (
                <iframe
                  src={getEmbedUrl(activeReel.videoUrl)}
                  title={activeReel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={activeReel.videoUrl}
                  src={activeReel.videoUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover bg-black"
                />
              )}

              {/* Pause / Play Tap Overlay Indicator */}
              {!isPlaying && !isEmbedPlayer(activeReel.videoUrl) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-black/70 text-white flex items-center justify-center border border-white/20 shadow-2xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Reel Footer (Overlay Details + Progress Bar) */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white space-y-1.5 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-artisan-gold tracking-wider bg-black/60 px-2 py-0.5 rounded-full border border-artisan-gold/30">
                  {activeReel.category}
                </span>
                <span className="text-xs text-stone-300 font-medium">@artist.kuldeepsingh</span>
              </div>
              <h4 className="font-serif font-bold text-sm sm:text-base leading-snug drop-shadow-md">
                {activeReel.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-0.5">
                <span>{isPlaying ? 'Tap to pause' : 'Tap to resume'} • Arrow keys to switch</span>
                <span className="font-mono text-artisan-gold">{activeReel.duration}</span>
              </div>

              {/* Sleek Custom Progress Bar (Instagram / TikTok timeline) */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-artisan-crimson transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
