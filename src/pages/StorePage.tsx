import React, { useState } from 'react';
import { Eye, ShoppingBag, ShieldCheck, Sparkles, Truck, MessageCircle, Layers, Palette, Star, ArrowRight } from 'lucide-react';
import type { Artwork } from '../types';
import { useCart } from '../context/CartContext';
import { useStudioData } from '../context/StudioDataContext';

interface StorePageProps {
  onSelectArtwork: (artwork: Artwork) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onSelectArtwork }) => {
  const { addToCart } = useCart();
  const { artworks, siteSettings } = useStudioData();
  
  // Top-level category: All vs Paintings vs Prints (Client handwritten requirement)
  const [topCategory, setTopCategory] = useState<'all' | 'paintings' | 'prints'>('all');
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

  const filteredArtworks = artworks
    .filter((art) => {
      // 1. Top Category Filter
      if (topCategory === 'paintings' && art.medium === 'Limited Edition Print') return false;
      if (topCategory === 'prints' && art.medium !== 'Limited Edition Print') return false;

      // 2. Specific Medium Filter
      const matchesMedium = selectedMedium === 'All' || art.medium === selectedMedium;

      // 3. Status Filter (Available / Sold / Reserved)
      const matchesStatus = statusFilter === 'all' || art.status === statusFilter;

      return matchesMedium && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      const orderA = typeof a.order === 'number' ? a.order : 999;
      const orderB = typeof b.order === 'number' ? b.order : 999;
      if (orderA !== orderB) return orderA - orderB;
      return 0;
    });

  // Highlighted / Selected Main Artwork logic (Client requirement)
  const mainArtwork = artworks.find((a) => a.isMain) || filteredArtworks.find((a) => a.isMain) || filteredArtworks[0];
  const gridArtworks = filteredArtworks.filter((a) => a.id !== mainArtwork?.id);

  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-artisan-gold/10 dark:bg-artisan-gold/20 border border-artisan-gold/30 text-xs font-bold text-stone-800 dark:text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>Artist Kuldeep Singh Atelier & Fine Art Store</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1816] dark:text-stone-50 leading-[1.1]">
            {siteSettings?.galleryHeading || 'Acquire Original Paintings & Limited Edition Prints.'}
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed">
            {siteSettings?.gallerySubheading || 'Explore authentic museum-grade masterworks hand-crafted with archival minerals, oils, and charcoals. Delivered worldwide with hand-embossed Certificates of Authenticity.'}
          </p>
        </div>

        {/* Top-Level Category Switcher (Paintings | Prints) */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-stone-200/80 dark:bg-stone-900 backdrop-blur-md border border-stone-300 dark:border-stone-800 shadow-inner">
            <button
              onClick={() => {
                setTopCategory('all');
                setSelectedMedium('All');
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                topCategory === 'all'
                  ? 'bg-[#1A1816] dark:bg-stone-100 text-white dark:text-stone-900 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
              }`}
            >
              All Artworks ({artworks.length})
            </button>
            <button
              onClick={() => {
                setTopCategory('paintings');
                setSelectedMedium('All');
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                topCategory === 'paintings'
                  ? 'bg-[#1A1816] dark:bg-stone-100 text-white dark:text-stone-900 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Original Paintings</span>
            </button>
            <button
              onClick={() => {
                setTopCategory('prints');
                setSelectedMedium('All');
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                topCategory === 'prints'
                  ? 'bg-[#1A1816] dark:bg-stone-100 text-white dark:text-stone-900 shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Fine Art Prints</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters & Controls */}
        <div className="mt-8 p-4 rounded-3xl bg-white/80 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-soft-lux flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Mediums (shown when not filtered exclusively to prints) */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {mediums.map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMedium(med)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  selectedMedium === med
                    ? 'bg-artisan-crimson text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
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
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-stone-800 dark:focus:border-stone-600"
            >
              <option value="all">All Availability</option>
              <option value="available">Available Only</option>
              <option value="reserved">Reserved Pieces</option>
              <option value="sold">Sold / Private Collection</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:border-stone-800 dark:focus:border-stone-600"
            >
              <option value="featured">Featured Curation</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 1.5 HIGHLIGHTED / MAIN FEATURED PAINTING (LARGE SHOWCASE) */}
      {/* Client Requirement: Website par ek main painting badi dikhe, baki niche se start ho */}
      {/* ------------------------------------------------------------- */}
      {mainArtwork && topCategory !== 'prints' && selectedMedium === 'All' && statusFilter === 'all' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-fade-in">
          <div className="bg-[#121110] rounded-3xl sm:rounded-[36px] overflow-hidden border border-amber-900/40 shadow-2xl relative text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-artisan-gold/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
              
              {/* Left / Top: Master Large Canvas */}
              <div className="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl bg-black aspect-[4/3] sm:aspect-[16/10] border border-white/10 shadow-2xl" onClick={() => onSelectArtwork(mainArtwork)}>
                <img
                  src={mainArtwork.image}
                  alt={mainArtwork.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-black" />
                    Highlighted Centerpiece Masterwork
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-lg group-hover:bg-amber-400 transition-colors">
                    <Eye className="w-4 h-4 text-artisan-crimson" />
                    Inspect Details
                  </span>
                </div>
              </div>

              {/* Right: Masterwork Narrative & Quick Acquisition */}
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curator's Primary Spotlight</span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                    {mainArtwork.title}
                  </h2>
                  <p className="text-amber-200/80 text-sm italic font-serif">
                    {mainArtwork.subtitle || 'Classical Atelier Museum Oil on Hand-Stretched Linen'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Medium</span>
                    <span className="text-stone-100 font-semibold">{mainArtwork.medium}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Dimensions</span>
                    <span className="text-stone-100 font-semibold">{mainArtwork.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Status</span>
                    <span className={`font-bold uppercase tracking-wider ${
                      mainArtwork.status === 'available' ? 'text-emerald-400' : mainArtwork.status === 'reserved' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {mainArtwork.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Acquisition</span>
                    <span className="text-amber-300 font-serif font-bold text-base">₹{mainArtwork.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <p className="text-stone-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {mainArtwork.description || 'A timeless original masterpiece crafted with traditional mineral pigments and layering glazes that capture authentic natural luminescence.'}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => onSelectArtwork(mainArtwork)}
                    className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>View Primary Masterpiece</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {mainArtwork.status === 'available' && (
                    <button
                      onClick={() => addToCart({
                        id: mainArtwork.id,
                        type: 'artwork',
                        title: mainArtwork.title,
                        subtitle: mainArtwork.subtitle,
                        price: mainArtwork.price,
                        image: mainArtwork.image,
                        mediumOrCategory: mainArtwork.medium
                      })}
                      className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors cursor-pointer"
                      title="Add to Collection Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ARTWORKS GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredArtworks.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">No artworks match your selected criteria</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Try broadening your category or availability filters.</p>
            <button
              onClick={() => {
                setTopCategory('all');
                setSelectedMedium('All');
                setStatusFilter('all');
              }}
              className="text-xs font-bold text-artisan-crimson dark:text-red-400 underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Atelier Gallery Collection</span>
                <span className="text-xs font-sans font-normal text-stone-500 dark:text-stone-400">({(mainArtwork && topCategory !== 'prints' && selectedMedium === 'All' && statusFilter === 'all') ? gridArtworks.length : filteredArtworks.length} Artworks)</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {((mainArtwork && topCategory !== 'prints' && selectedMedium === 'All' && statusFilter === 'all') ? gridArtworks : filteredArtworks).map((art) => {
              const inrPrice = art.price;
              const commissionWhatsAppUrl = `https://wa.me/918858060101?text=${encodeURIComponent(
                `Hello Artist Kuldeep Singh, I saw your artwork "${art.title}" (${art.medium}) on your store. Since it is ${art.status.toUpperCase()}, I would love to enquire about commissioning a similar custom piece. Please share details.`
              )}`;

              return (
                <div
                  key={art.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group hover:-translate-y-2"
                >
                  {/* Artwork Canvas Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={art.image} alt={art.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Hover Quick Action */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <button
                        onClick={() => onSelectArtwork(art)}
                        className="w-full py-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl text-xs font-bold text-stone-900 dark:text-stone-100 shadow-lg flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-stone-850 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-artisan-crimson" />
                        Explore & Inspect Zoom Details
                      </button>
                    </div>

                    {/* Medium Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider shadow-xs border border-stone-200/50 dark:border-stone-700/50">
                        {art.medium}
                      </span>
                    </div>

                    {/* Status Badge: Available / Sold / Reserved */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                          art.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : art.status === 'reserved'
                            ? 'bg-amber-600 text-white'
                            : 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        }`}
                      >
                        {art.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 group-hover:text-artisan-crimson dark:group-hover:text-red-400 transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic line-clamp-1">
                        {art.subtitle}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 pt-1">
                        <span>{art.dimensions}</span>
                        <span>•</span>
                        <span>{art.year}</span>
                        <span>•</span>
                        <span>{art.framed ? 'Framed' : 'Unframed'}</span>
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-stone-400 dark:text-stone-400 block uppercase font-bold">
                          Acquisition Value
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                            <span className="font-sans font-semibold mr-0.5">₹</span>{inrPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectArtwork(art)}
                          className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                          title="Quick View & Zoom"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {art.status === 'available' ? (
                          <button
                            onClick={() =>
                              addToCart({
                                id: art.id,
                                type: 'artwork',
                                title: art.title,
                                subtitle: art.subtitle,
                                price: inrPrice,
                                image: art.image,
                                mediumOrCategory: art.medium,
                              })
                            }
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1A1816] hover:bg-artisan-crimson dark:bg-stone-800 dark:hover:bg-artisan-crimson text-white active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Acquire</span>
                          </button>
                        ) : (
                          <a
                            href={commissionWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2.5 rounded-xl text-[11px] font-serif font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700 hover:border-artisan-gold transition-all shadow-xs flex items-center gap-1.5"
                            title="Enquire & Commission similar custom artwork"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                            <span>Commission</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
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
