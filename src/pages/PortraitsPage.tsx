import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowLeft, MessageSquare } from 'lucide-react';
import type { Artwork } from '../types';
import { useStudioData } from '../context/StudioDataContext';
import { PortraitStackDeck } from '../components/portraits/PortraitStackDeck';
import { InquiryModal } from '../components/modals/InquiryModal';

interface PortraitsPageProps {
  onBackToHome: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
}

export const PortraitsPage: React.FC<PortraitsPageProps> = ({
  onBackToHome,
  onSelectArtwork,
}) => {
  const { artworks } = useStudioData();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'oil' | 'charcoal'>('all');

  // Filter artworks that represent portraits or figurative studies
  const portraitArtworks = useMemo(() => {
    const list = artworks.filter((a) => {
      const matchText = (a.title + ' ' + a.subtitle + ' ' + a.description + ' ' + a.medium).toLowerCase();
      const isPortrait =
        matchText.includes('portrait') ||
        matchText.includes('florentine') ||
        matchText.includes('solitary') ||
        matchText.includes('anatomy') ||
        matchText.includes('figure') ||
        matchText.includes('face') ||
        matchText.includes('charcoal') ||
        a.medium.toLowerCase().includes('oil');

      if (!isPortrait) return false;

      if (activeCategory === 'oil') return a.medium.toLowerCase().includes('oil');
      if (activeCategory === 'charcoal') return a.medium.toLowerCase().includes('charcoal') || a.medium.toLowerCase().includes('graphite');
      return true;
    });

    // Ensure we have at least 3-4 portrait pieces for smooth stacking
    if (list.length === 0) return artworks;
    return list;
  }, [artworks, activeCategory]);

  return (
    <div className="min-h-screen bg-[#070708] text-[#F3EFE6] pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ------------------------------------------------------------- */}
        {/* 1. TOP NAVIGATION / BACK BUTTON                               */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier Home</span>
          </button>

          <button
            onClick={() => setIsInquiryOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-xs font-medium text-[#D4AF37] tracking-wider uppercase transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Commission a Custom Portrait</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. PAGE HERO HEADER                                           */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/40 shadow-sm text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Official Portrait Gallery • Master Stacking Showcase</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
            The Portrait <span className="italic font-normal text-gradient-gold">Collection</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl mx-auto">
            Scroll down to explore each portrait painting. Each canvas glides and stacks gracefully over the previous work. Hover with your cursor or drag on mobile to activate the circular magnifying bubble loupe and inspect hand-ground pigments and brush textures.
          </p>

          {/* Category filter pills */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-white/5 text-stone-300 border border-white/10 hover:border-[#D4AF37]/40'
              }`}
            >
              All Masterworks ({artworks.length})
            </button>
            <button
              onClick={() => setActiveCategory('oil')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'oil'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-white/5 text-stone-300 border border-white/10 hover:border-[#D4AF37]/40'
              }`}
            >
              Classical Oils
            </button>
            <button
              onClick={() => setActiveCategory('charcoal')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === 'charcoal'
                  ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                  : 'bg-white/5 text-stone-300 border border-white/10 hover:border-[#D4AF37]/40'
              }`}
            >
              Charcoal & Anatomy
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. STACKING CARDS SCROLL SHOWCASE                             */}
        {/* ------------------------------------------------------------- */}
        <PortraitStackDeck
          portraits={portraitArtworks}
          onSelectArtwork={onSelectArtwork}
          onInquire={() => setIsInquiryOpen(true)}
        />
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        defaultSubject="Bespoke Classical Portrait Commission"
      />
    </div>
  );
};
