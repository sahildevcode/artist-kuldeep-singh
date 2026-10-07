import React, { useState, useEffect } from 'react';
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
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-2',
    title: 'Impasto Palette Knife Sculptural Textures',
    category: 'Palette Knife',
    duration: '0:45',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-3',
    title: 'Sight-Size Charcoal Portrait Anatomy',
    category: 'Charcoal Study',
    duration: '1:12',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'reel-4',
    title: 'Raw Mineral Pigment & Walnut Oil Prep',
    category: 'Atelier Secrets',
    duration: '0:52',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=900&auto=format&fit=crop',
  },
];

export const StudioVideoReels: React.FC = () => {
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const { playClick } = useAudio();
  const { artistProfile } = useStudioData();

  // Combine custom admin video (as featured Reel 1) + default reels to maintain exactly 4 in one frame
  const reelsList: StudioReel[] = [
    ...(artistProfile?.studioVideoUrl
      ? [
          {
            id: 'custom-admin-reel',
            title: artistProfile.studioVideoTitle || 'Artist Kuldeep Singh • Atelier Demonstration',
            category: 'Featured Reel',
            duration: '0:55',
            videoUrl: artistProfile.studioVideoUrl,
            thumbnail: artistProfile.studioVideoPoster || DEFAULT_REELS[0].thumbnail,
          },
        ]
      : []),
    ...DEFAULT_REELS.filter((r) => r.videoUrl !== artistProfile?.studioVideoUrl),
  ].slice(0, 4);

  const activeReel = activeReelIndex !== null ? reelsList[activeReelIndex] : null;

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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex, reelsList.length]);

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
      {/* ============================================================== */}
      {activeReel !== null && activeReelIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          {/* Previous Reel Navigation Button (Desktop) */}
          <button
            onClick={() => {
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
            onClick={() => {
              playClick();
              setActiveReelIndex((prev) => (prev !== null && prev < reelsList.length - 1 ? prev + 1 : 0));
            }}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer z-50 hover:scale-110"
            title="Next Reel (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 9:16 Vertical Reel Player Card */}
          <div className="relative w-full max-w-[360px] sm:max-w-[390px] aspect-[9/16] max-h-[92vh] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col justify-between">
            {/* Reel Header (Top Controls) */}
            <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <span className="text-[10px] font-mono font-bold text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  Reel {activeReelIndex + 1} of {reelsList.length}
                </span>
              </div>

              <button
                onClick={() => setActiveReelIndex(null)}
                className="p-2 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title="Close Reel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
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
                  src={activeReel.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover bg-black"
                />
              )}
            </div>

            {/* Reel Footer (Overlay Details) */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white space-y-2 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-artisan-gold tracking-wider bg-black/60 px-2 py-0.5 rounded-full border border-artisan-gold/30">
                  {activeReel.category}
                </span>
                <span className="text-xs text-stone-300 font-medium">@artist.kuldeepsingh</span>
              </div>
              <h4 className="font-serif font-bold text-base sm:text-lg leading-snug drop-shadow-md">
                {activeReel.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Swipe / arrow keys for next reel</span>
                <span className="font-mono text-artisan-gold">{activeReel.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
