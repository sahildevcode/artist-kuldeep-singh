import React from 'react';
import { ShieldCheck, Sparkles, Eye, ShoppingBag } from 'lucide-react';
import type { Artwork } from '../../types';
import { MagnifyingLoupe } from '../ui/MagnifyingLoupe';
import { useCart } from '../../context/CartContext';

interface PortraitStackDeckProps {
  portraits: Artwork[];
  onSelectArtwork: (artwork: Artwork) => void;
  onInquire?: (artwork: Artwork) => void;
}

export const PortraitStackDeck: React.FC<PortraitStackDeckProps> = ({
  portraits,
  onSelectArtwork,
  onInquire,
}) => {
  const { addToCart } = useCart();

  // If artworks list is empty or small, provide default curated portrait artworks
  const displayPortraits = portraits.length > 0 ? portraits : [
    {
      id: 'portrait-florentine',
      title: 'Echoes of the Florentine Dusk',
      subtitle: 'Classical Portrait & Chiaroscuro Exploration',
      year: 2024,
      medium: 'Oil on Canvas',
      dimensions: '30 x 42 in (76 x 106 cm)',
      price: 390000,
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1400&auto=format&fit=crop',
      description: 'A deeply emotive exploration of human contemplation, illuminated by a single warm candle source reflecting Rembrandt and Caravaggio chiaroscuro principles.',
      story: 'Created using hand-ground earth pigments mixed with cold-pressed linseed oil. The golden flesh tones emerge from deep umber shadows over eleven glaze layers.',
      framed: true,
      status: 'available',
      paletteColors: ['#3A1F1D', '#C5A059', '#E63946', '#F5E6CC'],
      weight: '10.5 lbs (4.8 kg)',
      varnishType: 'Gamvar Gloss Archival',
    } as Artwork,
  ];

  return (
    <div className="relative w-full space-y-12 pb-32">
      {displayPortraits.map((artwork, idx) => {
        // Compute staggered sticky offset
        const topOffset = `calc(10vh + ${Math.min(idx * 20, 80)}px)`;

        return (
          <div
            key={artwork.id || `portrait-stack-${idx}`}
            style={{
              position: 'sticky',
              top: topOffset,
              zIndex: 10 + idx,
            }}
            className="transition-transform duration-300"
          >
            {/* STACKED LUXURY CANVAS CARD */}
            <div className="max-w-6xl mx-auto rounded-3xl bg-[#0B0C10] border border-[#D4AF37]/35 shadow-[0_-10px_50px_rgba(0,0,0,0.95)] overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/60">
              {/* Card Top Gold Foil Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
                {/* --------------------------------------------------------- */}
                {/* LEFT: PORTRAIT CANVAS WITH CIRCULAR LOUPE ZOOM            */}
                {/* --------------------------------------------------------- */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="w-full max-w-md relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#161820]">
                    {/* The Circular Loupe Lens Inspector */}
                    <MagnifyingLoupe
                      src={artwork.image}
                      highResSrc={artwork.detailImages?.[0] || artwork.image}
                      alt={artwork.title}
                      aspectRatio="aspect-[3/4]"
                      zoomLevel={2.8}
                      loupeSize={190}
                      badgeText="Hover / Drag: Loupe Zoom"
                      className="rounded-xl"
                    />

                    {/* Frame corner embellishment */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />
                  </div>

                  <p className="text-[11px] font-mono text-[#D4AF37]/80 mt-3 text-center flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Circular bubble magnifier reveals hand-ground pigment & canvas weave</span>
                  </p>
                </div>

                {/* --------------------------------------------------------- */}
                {/* RIGHT: ROYAL CURATORIAL DETAILS                           */}
                {/* --------------------------------------------------------- */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Top Header & Serial */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="font-mono text-xs uppercase tracking-widest text-[#D4AF37]">
                        PORTRAIT MASTERWORK № 0{idx + 1}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-stone-400">
                      YEAR {artwork.year || '2024'}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                      {artwork.title}
                    </h3>
                    <p className="text-sm font-light text-[#E5C07B] italic">
                      {artwork.subtitle || 'Master Oil Portrait on Archival Linen'}
                    </p>
                  </div>

                  {/* Artwork Technical Specs */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Medium</span>
                      <span className="text-stone-200 font-medium">{artwork.medium}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Dimensions</span>
                      <span className="text-stone-200 font-medium">{artwork.dimensions}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Framing</span>
                      <span className="text-stone-200 font-medium">{artwork.framed ? 'Museum Wood Frame Included' : 'Gallery Stretched'}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase">Authenticity</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Signed & Certified
                      </span>
                    </div>
                  </div>

                  {/* Narrative Story */}
                  <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                    {artwork.description || artwork.story}
                  </p>

                  {/* Primary Pigment Palette */}
                  {artwork.paletteColors && artwork.paletteColors.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        Primary Palette Pigments
                      </span>
                      <div className="flex items-center gap-2">
                        {artwork.paletteColors.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Action Buttons */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-400 block">
                        Acquisition Value
                      </span>
                      <span className="font-serif text-2xl font-bold text-[#F3EFE6]">
                        {artwork.price ? `₹${artwork.price.toLocaleString('en-IN')}` : 'Price on Request'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {onInquire && (
                        <button
                          onClick={() => onInquire(artwork)}
                          className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-medium tracking-wide transition-all cursor-pointer"
                        >
                          Inquire
                        </button>
                      )}

                      <button
                        onClick={() => onSelectArtwork(artwork)}
                        className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 border border-[#D4AF37]/30 text-xs font-medium tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Inspect Provenance</span>
                      </button>

                      <button
                        onClick={() => {
                          addToCart({
                            id: artwork.id,
                            type: 'artwork',
                            title: artwork.title,
                            subtitle: artwork.subtitle,
                            price: artwork.price >= 10000 ? artwork.price : Math.round(artwork.price * 85),
                            image: artwork.image,
                            mediumOrCategory: artwork.medium,
                          });
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:brightness-110 text-black text-xs font-bold tracking-wide transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire Original</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
