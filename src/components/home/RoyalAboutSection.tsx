import React from 'react';
import { ArrowUpRight, Feather, Palette, Sparkles } from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';

interface RoyalAboutSectionProps {
  onNavigate: (page: 'about' | 'store' | 'courses' | 'portraits') => void;
}

export const RoyalAboutSection: React.FC<RoyalAboutSectionProps> = ({ onNavigate }) => {
  const { artistProfile } = useStudioData();

  // World pillars inspired by artbysehgal.com, designed with image slots ready for artist's uploads
  const worldCards = [
    {
      id: 'card-originals',
      title: 'Original Oil Masterworks',
      subtitle: 'Monumental Canvases on Archival Belgian Linen',
      tag: 'Originals',
      image:
        artistProfile.studioImage ||
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      action: () => onNavigate('store'),
    },
    {
      id: 'card-portraits',
      title: 'The Portrait Collection',
      subtitle: 'Classical Realism & Expressive Human Anatomy',
      tag: 'Portraits',
      image:
        artistProfile.portraitImage ||
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1200&auto=format&fit=crop',
      action: () => onNavigate('portraits'),
    },
    {
      id: 'card-commissions',
      title: 'Bespoke Private Commissions',
      subtitle: 'Custom Masterpieces for International Collectors',
      tag: 'Commissions',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
      action: () => onNavigate('about'),
    },
    {
      id: 'card-masterclasses',
      title: 'Atelier Masterclasses',
      subtitle: 'Classical Painting Pedagogy & Master Apprentice Training',
      tag: 'Education',
      image: 'https://images.unsplash.com/photo-1579783923665-35632f426dd8?q=80&w=1200&auto=format&fit=crop',
      action: () => onNavigate('courses'),
    },
  ];

  return (
    <section id="world-of-kuldeep" className="relative py-24 sm:py-32 bg-[#070708] text-[#F3EFE6] overflow-hidden">
      {/* Subtle royal background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#D4AF37]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ------------------------------------------------------------- */}
        {/* 1. SECTION HEADER                                             */}
        {/* ------------------------------------------------------------- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/70 border border-[#D4AF37]/30 text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>The Atelier & Creative World</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Explore the World of{' '}
            <span className="italic font-normal text-gradient-gold">Kuldeep Singh</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed max-w-2xl mx-auto">
            Step inside a sanctuary where classical academic realism, anatomical draughtsmanship, and hand-ground mineral pigments converge to create enduring fine art.
          </p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. ART BY SEHGAL STYLE 4-CARD SHOWCASE GRID                   */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {worldCards.map((card, idx) => (
            <div
              key={card.id}
              onClick={card.action}
              className="group relative h-[420px] sm:h-[460px] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 shadow-2xl bg-[#0F1014] flex flex-col justify-end"
            >
              {/* Background Image with Scale Zoom Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />

              {/* Royal Dark Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-black group-hover:via-black/50 transition-all duration-300" />

              {/* Top Tag Pill */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#D4AF37]/40 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                  {card.tag}
                </span>
              </div>

              {/* Number Stamp */}
              <div className="absolute top-4 right-4 z-10 text-white/40 font-mono text-xs">
                № 0{idx + 1}
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-6 space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-[#E5C07B] transition-colors leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs text-stone-300/80 font-light line-clamp-2">
                  {card.subtitle}
                </p>

                <div className="pt-3 flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase border-t border-white/10 group-hover:border-[#D4AF37]/30 transition-all">
                  <span>Enter Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. ARTIST PHILOSOPHY BANNER                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0C0D11] via-[#121318] to-[#0C0D11] border border-[#D4AF37]/30 shadow-2xl overflow-hidden">
          {/* Subtle gold emblem decoration */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border border-[#D4AF37]/10 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                <Feather className="w-4 h-4 text-[#D4AF37]" />
                <span>The Master's Credo</span>
              </div>

              <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-stone-100 font-normal italic leading-relaxed">
                "{artistProfile.philosophyQuote ||
                  'Each canvas is an anatomical journey   light, shadow, and mineral pigment layered over weeks of quiet meditation until breath emerges from the linen.'}"
              </blockquote>

              <p className="text-xs font-mono uppercase tracking-wider text-stone-400">
                — Kuldeep Singh, Master Academic Realist & Atelier Founder
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Read Full Biography & Legacy</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('portraits')}
                className="px-6 py-3.5 rounded-xl bg-black/60 hover:bg-black/90 border border-[#D4AF37]/40 text-stone-200 hover:text-white font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-[#D4AF37]" />
                <span>View Portrait Paintings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
