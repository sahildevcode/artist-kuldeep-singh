import React, { useState } from 'react';
import { Eye, ShoppingBag, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import type { Artwork } from '../types';
import { useCart } from '../context/CartContext';
import { useStudioData } from '../context/StudioDataContext';

interface StorePageProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onSelectArtwork }) => {
  const { addToCart } = useCart();
  const { artworks } = useStudioData();
  const [selectedMedium, setSelectedMedium] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const mediums = [
    'All',
    'Oil on Canvas',
    'Charcoal & Graphite',
    'Watercolor & Ink',
    'Acrylic & Mixed Media',
    'Limited Edition Print',
  ];

  const filteredArtworks = artworks.filter((art) => {
    const matchesMedium = selectedMedium === 'All' || art.medium === selectedMedium;
    const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
    return matchesMedium && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // featured default
  });

  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-xs font-bold text-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>Artist Kuldeep Singh Original Fine Art Collection</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1816] leading-[1.1]">
            Acquire Original Masterpieces for Your Collection.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Every piece is an original, museum-grade painting or drawing hand-crafted in the artist’s Chelsea studio. 
            Delivered worldwide in custom bespoke wooden crates with certified provenance.
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="mt-12 p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200 shadow-soft-lux flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Mediums */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {mediums.map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMedium(med)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  selectedMedium === med
                    ? 'bg-[#1A1816] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {med}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Status & Sorting */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 rounded-xl px-3 py-2 focus:outline-none focus:border-stone-800"
            >
              <option value="all">All Availability</option>
              <option value="available">Available Only</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold Pieces</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 rounded-xl px-3 py-2 focus:outline-none focus:border-stone-800"
            >
              <option value="featured">Featured Curation</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. ARTWORKS GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredArtworks.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-800">No artworks match your criteria</h3>
            <p className="text-xs text-stone-500">Try broadening your medium or availability filters.</p>
            <button
              onClick={() => {
                setSelectedMedium('All');
                setStatusFilter('all');
              }}
              className="text-xs font-bold text-artisan-crimson underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2"
              >
                {/* Artwork Canvas Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <button
                      onClick={() => onSelectArtwork(art)}
                      className="w-full py-3 bg-white/95 backdrop-blur-md rounded-2xl text-xs font-bold text-stone-900 shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
                    >
                      <Eye className="w-4 h-4 text-artisan-crimson" />
                      View on Wall & Full Zoom
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-wider shadow-xs">
                      {art.medium}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                        art.status === 'available'
                          ? 'bg-emerald-500/90 text-white'
                          : art.status === 'reserved'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-stone-800/90 text-white'
                      }`}
                    >
                      {art.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-artisan-crimson transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 italic">
                      {art.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-600 pt-1">
                      <span>{art.dimensions}</span>
                      <span>•</span>
                      <span>{art.year}</span>
                      <span>•</span>
                      <span>{art.framed ? 'Bespoke Framed' : 'Unframed'}</span>
                    </div>
                  </div>

                  {/* Pigment Swatches & Price */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">
                        Acquisition
                      </span>
                      <span className="font-serif font-bold text-2xl text-stone-900">
                        ${art.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectArtwork(art)}
                        className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          addToCart({
                            id: art.id,
                            type: 'artwork',
                            title: art.title,
                            subtitle: art.subtitle,
                            price: art.price,
                            image: art.image,
                            mediumOrCategory: art.medium,
                          })
                        }
                        disabled={art.status === 'sold'}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                          art.status === 'sold'
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-artisan-crimson text-white active:scale-95'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{art.status === 'sold' ? 'Acquired' : 'Acquire'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. COLLECTOR PROVENANCE & CRATING PROTOCOL */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-soft-lux">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                Official Provenance & Certificate
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Every original oil and drawing is accompanied by an embossed Certificate of Authenticity with artist signature, archival wax seal, and unique serial catalog entry.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                Museum Wooden Crating
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Paintings are suspended inside custom climate-sealed foam and reinforced plywood travel crates, fully insured for 100% replacement valuation during transit.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                Bespoke Hardwood Framing
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Framed selections feature hand-milled American Walnut or Florentine 22k gold-leaf moulding with museum-grade non-reflective UV70 anti-glare glass.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
