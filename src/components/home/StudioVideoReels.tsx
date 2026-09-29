import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useStudioData } from '../../context/StudioDataContext';

export interface StudioVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
}

const DEFAULT_VIDEOS: StudioVideo[] = [
  {
    id: 'vid-1',
    title: 'Oil Painting Process • Atelier Demonstration',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'vid-2',
    title: 'Floral Impasto Brushwork',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'vid-3',
    title: 'Charcoal Anatomical Sketch',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1577720643272-265f09367456?q=80&w=1200&auto=format&fit=crop',
  },
];

export const StudioVideoReels: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playClick } = useAudio();
  const { artistProfile } = useStudioData();

  // Custom video updated via Admin takes highest priority
  const videoList = artistProfile?.studioVideoUrl
    ? [
        {
          id: 'custom-admin-vid',
          title: artistProfile.studioVideoTitle || 'Artist Kuldeep Singh • Master Oil Painting in Atelier',
          videoUrl: artistProfile.studioVideoUrl,
          thumbnail: artistProfile.studioVideoPoster || DEFAULT_VIDEOS[0].thumbnail,
        },
        ...DEFAULT_VIDEOS.filter((v) => v.videoUrl !== artistProfile.studioVideoUrl),
      ]
    : DEFAULT_VIDEOS;

  const currentVideo = videoList[currentIdx] || videoList[0];

  const isEmbedPlayer = (url: string) => {
    return url.includes('mediadelivery.net') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('mediadelivery.net') || url.includes('vimeo.com')) {
      return url;
    }
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
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Direct Cinema Video Player (Zero Clutter, 100% Video) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-stone-200/80 aspect-video group">
          {isPlaying ? (
            isEmbedPlayer(currentVideo.videoUrl) ? (
              <iframe
                src={getEmbedUrl(currentVideo.videoUrl)}
                title={currentVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={currentVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              >
                Your browser does not support HTML5 video.
              </video>
            )
          ) : (
            /* Lightweight Poster Façade - Zero lag before click */
            <div
              onClick={() => {
                playClick();
                setIsPlaying(true);
              }}
              className="relative w-full h-full cursor-pointer overflow-hidden flex items-center justify-center"
            >
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

              {/* Central Glowing Play Button */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 text-artisan-crimson flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-artisan-crimson group-hover:text-white transition-all duration-300">
                <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current ml-1" />
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white/90">
                <span className="font-serif font-bold text-sm sm:text-lg drop-shadow-md">
                  {currentVideo.title}
                </span>
                <span className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white/90 font-sans border border-white/20">
                  Click to Play
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Video Switcher (If multiple videos available) */}
        {videoList.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {videoList.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => {
                  playClick();
                  setCurrentIdx(idx);
                  setIsPlaying(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-serif transition-all duration-200 cursor-pointer ${
                  currentIdx === idx
                    ? 'bg-artisan-charcoal text-white shadow-sm font-bold'
                    : 'bg-white/80 hover:bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
                }`}
              >
                Video {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
