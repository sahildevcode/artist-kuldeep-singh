import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ShoppingBag, Eye, ShieldCheck, Sparkles, Palette, 
  Share2, ZoomIn, ZoomOut, RotateCcw, Copy, Check, MessageCircle, Phone 
} from 'lucide-react';
import type { Artwork } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStudioData } from '../../context/StudioDataContext';
import { MagneticButton } from '../ui/MagneticButton';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork: initialArtwork, onClose }) => {
  const { addToCart } = useCart();
  const { artworks } = useStudioData();

  // Active artwork being viewed in the modal (allows browsing related artworks)
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(initialArtwork);
  const [viewOnWall, setViewOnWall] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Zoom and Texture Inspector States
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Share Popover States
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync when initialArtwork prop changes
  useEffect(() => {
    setActiveArtwork(initialArtwork);
    setSelectedImage(null);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setIsShareOpen(false);
  }, [initialArtwork]);

  if (!activeArtwork) return null;

  const currentImage = selectedImage || activeArtwork.image;
  const inrPrice = Math.round(activeArtwork.price * 85);

  // Commission message URL for WhatsApp
  const commissionWhatsAppUrl = `https://wa.me/919810088231?text=${encodeURIComponent(
    `Hello Artist Kuldeep Singh, I saw your artwork "${activeArtwork.title}" (${activeArtwork.medium}, ${activeArtwork.dimensions}) on your studio website.\n\nSince this piece is ${activeArtwork.status.toUpperCase()}, I would love to enquire about commissioning a similar bespoke canvas for my collection. Could you please share the timeframe, pricing, and process?`
  )}`;

  // Related Artworks (exclude current artwork)
  const relatedArtworks = artworks
    .filter((a) => a.id !== activeArtwork.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart({
      id: activeArtwork.id,
      type: 'artwork',
      title: activeArtwork.title,
      subtitle: activeArtwork.subtitle,
      price: inrPrice, // Standard INR pricing for checkout
      image: activeArtwork.image,
      mediumOrCategory: activeArtwork.medium,
    });
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Drag-to-pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Share handlers
  const getShareUrl = () => {
    return `${window.location.origin}/#store?artwork=${activeArtwork.id}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `Take a look at this masterwork "${activeArtwork.title}" by Artist Kuldeep Singh:\n${getShareUrl()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopiedLink(true);
    alert('Artwork link copied to clipboard! Share it in your Instagram Stories or DM @artistkuldeepsingh.');
    window.open('https://instagram.com/artistkuldeepsingh', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Top Header Controls (Share & Close) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Share Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Share Painting"
            >
              <Share2 className="w-4 h-4 text-stone-700" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {isShareOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-30 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">Share Painting</span>
                  <button onClick={() => setIsShareOpen(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-800 text-xs font-medium transition-colors text-left"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Share on WhatsApp</span>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={handleInstagramShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-pink-50 text-pink-800 text-xs font-medium transition-colors text-left"
                  >
                    <svg className="w-4 h-4 fill-pink-600" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Share to Instagram</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-100 text-stone-800 text-xs font-medium transition-colors text-left"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                    <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Direct Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-black shadow-md transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
            {/* Left Column: Visual Showcase & Interactive Zoom */}
            <div className="lg:col-span-7 bg-[#EFECE6] relative flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden select-none">
              {viewOnWall ? (
                /* Living Room Wall Preview Simulation */
                <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end items-center bg-stone-300">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
                    alt="Living Room Wall"
                    className="absolute inset-0 w-full h-full object-cover brightness-95"
                  />
                  <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px]" />

                  {/* Framed Canvas Mockup */}
                  <div className="relative z-10 mb-20 shadow-2xl transition-all duration-500 hover:scale-105">
                    <div className="p-2 sm:p-3 bg-[#1A1816] rounded-sm shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-stone-800">
                      <img
                        src={currentImage}
                        alt={activeArtwork.title}
                        className="w-48 sm:w-64 max-h-56 object-cover"
                      />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-stone-800 shadow-sm">
                    Simulated Scale • Living Room Collector View
                  </div>
                </div>
              ) : (
                /* Interactive Art Zoom Showcase */
                <div className="relative w-full flex flex-col items-center">
                  <div 
                    className="relative max-w-md w-full bg-white rounded-xl shadow-2xl border border-stone-200/80 p-2 sm:p-3.5 overflow-hidden group"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                  >
                    <div className="overflow-hidden rounded-lg flex items-center justify-center min-h-[300px] max-h-[380px]">
                      <img
                        src={currentImage}
                        alt={activeArtwork.title}
                        className="max-h-[380px] w-auto object-contain transition-transform duration-200 select-none pointer-events-none"
                        style={{
                          transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                          transformOrigin: 'center center'
                        }}
                      />
                    </div>

                    {/* Interactive Zoom Toolbar Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white shadow-xl z-20">
                      <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 1}
                        className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono font-bold px-1 min-w-[28px] text-center">
                        {zoomLevel.toFixed(1)}x
                      </span>
                      <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 3}
                        className="p-1 rounded-full hover:bg-white/20 disabled:opacity-30 transition-all"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      {zoomLevel > 1 && (
                        <button
                          onClick={handleZoomReset}
                          className="ml-1 p-1 rounded-full hover:bg-white/20 text-artisan-gold transition-all"
                          title="Reset Zoom"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {zoomLevel > 1 && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium pointer-events-none">
                        Drag to explore canvas texture
                      </div>
                    )}
                  </div>

                  {/* Detail Thumbnails */}
                  {activeArtwork.detailImages && activeArtwork.detailImages.length > 0 && (
                    <div className="flex gap-2.5 mt-4">
                      <button
                        onClick={() => { setSelectedImage(null); handleZoomReset(); }}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === null
                            ? 'border-artisan-crimson scale-105'
                            : 'border-white opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={activeArtwork.image} alt="Main" className="w-full h-full object-cover" />
                      </button>
                      {activeArtwork.detailImages.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setSelectedImage(imgUrl); handleZoomReset(); }}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === imgUrl
                              ? 'border-artisan-crimson scale-105'
                              : 'border-white opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Detail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* View On Wall Switcher */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setViewOnWall(!viewOnWall)}
                  className="px-4 py-2 rounded-full glass-panel text-xs font-semibold text-stone-800 hover:bg-white shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-artisan-crimson" />
                  <span>{viewOnWall ? 'Switch to Artwork Zoom' : 'View on Collector Wall'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Narrative, Details, Commission & Buy */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Medium & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-200/70 text-stone-800">
                    {activeArtwork.medium}
                  </span>
                  
                  {/* Status Feature: Available / Sold / Reserved */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                      activeArtwork.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : activeArtwork.status === 'reserved'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-stone-200 text-stone-700 border border-stone-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      activeArtwork.status === 'available' ? 'bg-emerald-600' : activeArtwork.status === 'reserved' ? 'bg-amber-600' : 'bg-stone-500'
                    }`} />
                    {activeArtwork.status === 'available' && 'Available'}
                    {activeArtwork.status === 'reserved' && 'Reserved'}
                    {activeArtwork.status === 'sold' && 'Sold'}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1816] tracking-tight">
                    {activeArtwork.title}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium mt-1 italic">
                    {activeArtwork.subtitle} ({activeArtwork.year})
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                      Acquisition Value
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif font-bold text-2xl text-artisan-crimson">
                        ₹{inrPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500">
                        (${activeArtwork.price.toLocaleString()} USD)
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-500 text-right">
                    * Museum Frame Included<br />& Global Shipping
                  </span>
                </div>

                {/* Description & Story */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {activeArtwork.description}
                </p>

                <div className="p-3.5 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
                    <span>Artist Insight & Studio Notes</span>
                  </div>
                  <p className="text-[11px] leading-relaxed italic text-stone-500">
                    "{activeArtwork.story}"
                  </p>
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Dimensions</span>
                    <span className="font-semibold text-stone-800">{activeArtwork.dimensions}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Framing</span>
                    <span className="font-semibold text-stone-800">
                      {activeArtwork.framed ? 'Bespoke Solid Hardwood' : 'Gallery Stretched Wrap'}
                    </span>
                  </div>
                </div>

                {/* Pigments Used */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
                    <Palette className="w-3.5 h-3.5 text-stone-500" />
                    <span>Primary Pigment Signature:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeArtwork.paletteColors.map((col, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full border border-stone-300 shadow-xs"
                        style={{ backgroundColor: col }}
                        title={`Pigment ${col}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add To Cart & "Enquire and Commission Similar" */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-artisan-gold flex-shrink-0" />
                  <span>Accompanied by Hand-Embossed Certificate of Authenticity</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  {/* Cart Action (If Available) */}
                  {activeArtwork.status === 'available' ? (
                    <MagneticButton
                      onClick={handleAddToCart}
                      variant="primary"
                      className="flex-1 py-3.5"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Collector Cart
                    </MagneticButton>
                  ) : null}

                  {/* "Enquire and Commission Similar" Button (Client's explicit requirement) */}
                  <a
                    href={commissionWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-serif font-semibold text-xs transition-all shadow-md ${
                      activeArtwork.status !== 'available'
                        ? 'flex-1 bg-[#1A1816] hover:bg-black text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Enquire & Commission Similar</span>
                  </a>
                </div>

                {/* Direct Studio Phone Call */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Questions about this canvas?</span>
                  <a 
                    href="tel:+919810088231" 
                    className="flex items-center gap-1 font-semibold text-stone-800 hover:text-artisan-crimson"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Studio: +91 98100 88231</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Artworks Section (Client requirement) */}
          {relatedArtworks.length > 0 && (
            <div className="p-6 sm:p-8 bg-stone-100/60 border-t border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Related Artworks by Kuldeep Singh
                  </h3>
                  <p className="text-xs text-stone-500">
                    Other collector pieces sharing similar medium or brushwork discipline
                  </p>
                </div>
                <span className="text-xs font-semibold text-artisan-crimson hidden sm:inline">
                  Click to view details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArtworks.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => {
                      setActiveArtwork(rel);
                      setSelectedImage(null);
                      handleZoomReset();
                    }}
                    className="group bg-white p-3 rounded-2xl border border-stone-200 hover:border-stone-400 shadow-sm transition-all text-left flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">
                        {rel.medium}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-stone-900 truncate group-hover:text-artisan-crimson transition-colors">
                        {rel.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-serif font-bold text-xs text-artisan-crimson">
                          ₹{Math.round(rel.price * 85).toLocaleString()}
                        </span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase ${
                          rel.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {rel.status}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
