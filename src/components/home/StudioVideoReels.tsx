import React, { useState } from 'react';
import { Play, X, Film, Clock, Sparkles, Eye } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export interface StudioVideo {
  id: string;
  title: string;
  category: 'all' | 'oil' | 'charcoal' | 'masterclass' | 'timelapse';
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  badge?: string;
}

const DEFAULT_VIDEOS: StudioVideo[] = [
  {
    id: 'vid-1',
    title: 'Venetian Glazing: Symphony of the Solitary Tide',
    category: 'oil',
    duration: '1:45 min',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Watch 14 layers of translucent oil glazes bring deep aquatic luminosity to the custom Belgian linen canvas.',
    badge: 'Featured Masterwork',
  },
  {
    id: 'vid-2',
    title: 'Alla Prima Botanical Realism: Wet-on-Wet Impasto',
    category: 'oil',
    duration: '2:10 min',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Spontaneous brushwork capturing delicate floral petals under pure natural north daylight in the atelier.',
    badge: 'Studio Process',
  },
  {
    id: 'vid-3',
    title: 'Renaissance Figurative Study: Raw Charcoal & Chalk',
    category: 'charcoal',
    duration: '1:15 min',
    thumbnail: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Energetic gesture lines evolving into precise classical chiaroscuro anatomical sketches on tinted paper.',
    badge: 'Anatomical Sketch',
  },
  {
    id: 'vid-4',
    title: 'Pigment Alchemy: Grinding Pure Lapis & Linseed Oil',
    category: 'masterclass',
    duration: '1:35 min',
    thumbnail: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'Demonstration of historical paint preparation methods practiced by Old Masters of the Florentine Academy.',
    badge: 'Masterclass Demo',
  },
];

export const StudioVideoReels: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<StudioVideo | null>(null);
  const { playClick } = useAudio();

  const categories = [
    { id: 'all', label: 'All Studio Reels' },
    { id: 'oil', label: '🎨 Oil Painting Process' },
    { id: 'charcoal', label: '✏️ Charcoal & Sketching' },
    { id: 'masterclass', label: '🎓 Masterclass Demos' },
  ];

  const filteredVideos =
    selectedCategory === 'all'
      ? DEFAULT_VIDEOS
      : DEFAULT_VIDEOS.filter((v) => v.category === selectedCategory);

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    }
    return url;
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-white/80 to-[#FDFBF7] border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-ochre/15 border border-artisan-ochre/30 text-artisan-ochre text-xs font-semibold uppercase tracking-widest mb-3">
              <Film className="w-3.5 h-3.5 text-artisan-ochre animate-pulse" />
              <span>Studio Reels • 1–2 Min Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
              Behind the Canvas: Master at Work
            </h2>
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl mt-3 font-sans leading-relaxed">
              Experience the raw craftsmanship of Artist Kuldeep Singh. Watch virgin Belgian linen transform into museum-grade art through quick, high-definition studio captures.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-serif font-medium transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-artisan-charcoal text-white shadow-md shadow-stone-900/10'
                    : 'bg-white/80 text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid (Zero initial video download = Zero Lag) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                playClick();
                setActiveVideo(video);
              }}
              className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                {/* Duration Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold text-white/90 flex items-center gap-1.5 border border-white/10">
                  <Clock className="w-3 h-3 text-artisan-gold" />
                  <span>{video.duration}</span>
                </div>

                {/* Optional Category / Badge */}
                {video.badge && (
                  <div className="absolute top-3 right-3 bg-artisan-crimson/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-sans font-bold text-white shadow-sm uppercase tracking-wider">
                    {video.badge}
                  </div>
                )}

                {/* Big Glowing Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-artisan-crimson group-hover:text-white transition-all duration-300 border border-white/60 text-stone-900">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Hover Quick Tip */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 font-sans">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-artisan-gold" />
                    <span>Watch creation</span>
                  </span>
                  <span className="text-[10px] text-white/60 font-medium">Click to Play</span>
                </div>
              </div>

              {/* Text Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 group-hover:text-artisan-crimson transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2 leading-relaxed font-sans">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-sans font-medium text-artisan-ochre uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Atelier 4K Capture
                  </span>
                  <span className="text-xs font-bold text-stone-800 group-hover:text-artisan-crimson transition-colors flex items-center gap-1">
                    Play Video →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Studio Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-500 font-sans">
            Need a full length painting masterclass? Explore our interactive curriculum in the{' '}
            <a href="#courses" className="text-artisan-crimson font-bold underline hover:text-artisan-charcoal">
              Masterclasses Académie
            </a>
            .
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CINEMATIC THEATRE MODAL (On-Demand Streaming, Zero Preload)   */}
      {/* ------------------------------------------------------------- */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-stone-900/60">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-artisan-crimson animate-pulse" />
                <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate max-w-md sm:max-w-xl">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Frame (Streams on demand) */}
            <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
              {isYouTube(activeVideo.videoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              )}
            </div>

            {/* Modal Footer Description */}
            <div className="p-4 sm:p-6 bg-stone-900/90 text-stone-300 text-xs sm:text-sm font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-xl">
                <span className="text-[11px] font-bold text-artisan-gold uppercase tracking-wider block mb-1">
                  Atelier Archive • {activeVideo.duration}
                </span>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-serif font-bold transition-all shrink-0 cursor-pointer"
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
