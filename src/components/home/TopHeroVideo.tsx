import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, ArrowDown, Sparkles, ShieldCheck, Compass } from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import { MagneticButton } from '../ui/MagneticButton';

interface TopHeroVideoProps {
  onExplorePortraits: () => void;
  onExploreStore: () => void;
  onExploreCourses: () => void;
}

export const TopHeroVideo: React.FC<TopHeroVideoProps> = ({
  onExplorePortraits,
  onExploreStore,
  onExploreCourses,
}) => {
  const { artistProfile } = useStudioData();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Dynamic video URL priority:
  // 1. heroTopVideoUrl (explicitly configured for top hero)
  // 2. heroShowcaseVideoUrl (hero tab in admin)
  // 3. studioVideoUrl (atelier video in admin)
  // 4. Default high-end classical fine art atelier stream
  const rawVideoUrl =
    artistProfile.heroTopVideoUrl ||
    artistProfile.heroShowcaseVideoUrl ||
    artistProfile.studioVideoUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const posterImage =
    artistProfile.heroTopVideoPoster ||
    artistProfile.heroShowcaseImage ||
    artistProfile.studioVideoPoster ||
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop';

  const title = artistProfile.heroTopVideoTitle || 'ARTIST KULDEEP SINGH';
  const subtitle =
    artistProfile.heroTopVideoSubtitle ||
    'Master of Classical Realism, Chiaroscuro & Figurative Oil Canvases';

  const isEmbed =
    rawVideoUrl.includes('iframe') ||
    rawVideoUrl.includes('player.bunny.net') ||
    rawVideoUrl.includes('youtube.com') ||
    rawVideoUrl.includes('vimeo.com');

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const scrollToNextSection = () => {
    const nextElem = document.getElementById('world-of-kuldeep') || document.getElementById('portrait-stack-section');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-[90vh] sm:h-screen min-h-[580px] max-h-[1050px] overflow-hidden bg-black flex items-center justify-center">
      {/* ------------------------------------------------------------- */}
      {/* 1. BACKGROUND VIDEO LAYER                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
        {isEmbed ? (
          <iframe
            src={rawVideoUrl}
            title={title}
            className="w-full h-full object-cover scale-[1.08] pointer-events-none"
            allow="autoplay; fullscreen; picture-in-picture"
            loading="eager"
          />
        ) : (
          <video
            ref={videoRef}
            src={rawVideoUrl}
            poster={posterImage}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover object-center scale-[1.04] transition-opacity duration-1000"
          />
        )}

        {/* Cinematic Film Vignette & Royal Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-black/45 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TOP ROYAL CREST & TITLE OVERLAY                            */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center space-y-6 pt-16">
        {/* Royal Archival Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.15)] text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E5C07B]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>The Official Atelier & Fine Art Archive</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
          <span className="text-stone-300 font-mono">EST. 2007</span>
        </div>

        {/* Master Name Headline */}
        <div className="space-y-3">
          <h1 className="font-serif text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] leading-[1.02]">
            <span className="block text-[#FBF8F1]">{title}</span>
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-xs sm:text-sm font-serif italic text-[#D4AF37] tracking-widest">
              L'ATELIER D'ART
            </span>
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent" />
          </div>

          {/* Subtitle / Tagline */}
          <p className="text-sm sm:text-lg md:text-xl text-stone-200/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <MagneticButton
            onClick={onExplorePortraits}
            variant="primary"
            size="lg"
            className="shadow-[0_0_30px_rgba(212,175,55,0.25)] bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-black font-semibold tracking-wide border border-[#F3E8D2]/40"
          >
            <Sparkles className="w-4 h-4 mr-2 text-black" />
            <span>Explore Portrait Paintings</span>
          </MagneticButton>

          <MagneticButton
            onClick={onExploreStore}
            variant="glass"
            size="lg"
            className="border-[#D4AF37]/40 text-[#F5F2EB] hover:bg-white/10 backdrop-blur-xl"
          >
            <Compass className="w-4 h-4 mr-2 text-[#D4AF37]" />
            <span>Acquire Original Canvases</span>
          </MagneticButton>

          <MagneticButton
            onClick={onExploreCourses}
            variant="glass"
            size="lg"
            className="border-white/20 text-stone-300 hover:text-white hover:bg-white/10 backdrop-blur-xl"
          >
            <span>Atelier Masterclasses</span>
          </MagneticButton>
        </div>

        {/* Trust credentials strip */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono uppercase tracking-wider text-stone-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Museum-Grade Provenance
          </span>
          <span className="text-stone-600">•</span>
          <span>Archival Belgian Linen</span>
          <span className="text-stone-600">•</span>
          <span>Worldwide Armored Shipping</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FLOATING MEDIA CONTROLS (Bottom Right)                     */}
      {/* ------------------------------------------------------------- */}
      {!isEmbed && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/30 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#D4AF37]" /> : <Play className="w-4 h-4 text-[#D4AF37] ml-0.5" />}
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-[#D4AF37]/30 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-[#D4AF37]" />}
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SCROLL DOWN INDICATOR (Bottom Center)                      */}
      {/* ------------------------------------------------------------- */}
      <button
        onClick={scrollToNextSection}
        aria-label="Scroll Down to Explore Atelier"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] hover:text-white transition-colors cursor-pointer group"
      >
        <span className="opacity-80 group-hover:opacity-100">EXPLORE ATELIER</span>
        <ArrowDown className="w-4 h-4 animate-bounce text-[#D4AF37]" />
      </button>
    </section>
  );
};
