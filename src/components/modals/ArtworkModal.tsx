import React, { useState } from 'react';
import { X, ShoppingBag, Eye, ShieldCheck, Sparkles, Palette } from 'lucide-react';
import type { Artwork } from '../../types';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const { addToCart } = useCart();
  const [viewOnWall, setViewOnWall] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!artwork) return null;

  const currentImage = selectedImage || artwork.image;

  const handleAddToCart = () => {
    addToCart({
      id: artwork.id,
      type: 'artwork',
      title: artwork.title,
      subtitle: artwork.subtitle,
      price: artwork.price,
      image: artwork.image,
      mediumOrCategory: artwork.medium,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-black shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
          {/* Left Column: Visual Showcase (or View on Wall Simulator) */}
          <div className="lg:col-span-7 bg-[#EFECE6] relative flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden">
            {viewOnWall ? (
              /* Living Room Wall Preview Simulation */
              <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end items-center bg-stone-300">
                {/* Modern luxury interior background */}
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop"
                  alt="Living Room Wall"
                  className="absolute inset-0 w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[1px]" />

                {/* Framed Canvas Mockup hanging on wall */}
                <div className="relative z-10 mb-20 shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="p-2 sm:p-3 bg-[#1A1816] rounded-sm shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-stone-800">
                    <img
                      src={currentImage}
                      alt={artwork.title}
                      className="w-48 sm:w-64 max-h-56 object-cover"
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-stone-800 shadow-sm">
                  Simulated Scale • Living Room View
                </div>
              </div>
            ) : (
              /* Direct Art Zoom Showcase */
              <div className="relative w-full flex flex-col items-center">
                <div className="relative group max-w-md w-full">
                  <div className="p-2 sm:p-3.5 bg-white rounded-xl shadow-2xl border border-stone-200/80 transition-all duration-300">
                    <img
                      src={currentImage}
                      alt={artwork.title}
                      className="w-full max-h-[380px] object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </div>

                {/* Detail Thumbnails if available */}
                {artwork.detailImages && artwork.detailImages.length > 0 && (
                  <div className="flex gap-2.5 mt-5">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === null
                          ? 'border-artisan-crimson scale-105'
                          : 'border-white opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={artwork.image} alt="Main" className="w-full h-full object-cover" />
                    </button>
                    {artwork.detailImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
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

            {/* Toggle Button: View On Wall */}
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

          {/* Right Column: Narrative, Details & Buy */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stone-200/70 text-stone-800">
                  {artwork.medium}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    artwork.status === 'available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : artwork.status === 'reserved'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {artwork.status}
                </span>
              </div>

              <div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1816] tracking-tight">
                  {artwork.title}
                </h2>
                <p className="text-xs text-stone-500 font-medium mt-1 italic">
                  {artwork.subtitle} ({artwork.year})
                </p>
              </div>

              {/* Price */}
              <div className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                    Acquisition Price
                  </span>
                  <span className="font-serif font-bold text-2xl text-artisan-crimson">
                    ${artwork.price.toLocaleString()}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500">
                  * Custom Frame Included
                </span>
              </div>

              {/* Description & Story */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {artwork.description}
              </p>

              <div className="p-3.5 bg-white rounded-2xl border border-stone-200/80 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
                  <span>Artist Insight & Studio Notes</span>
                </div>
                <p className="text-[11px] leading-relaxed italic text-stone-500">
                  "{artwork.story}"
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Dimensions</span>
                  <span className="font-semibold text-stone-800">{artwork.dimensions}</span>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-xl">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Framing</span>
                  <span className="font-semibold text-stone-800">
                    {artwork.framed ? 'Bespoke Solid Hardwood' : 'Gallery Stretched Wrap'}
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
                  {artwork.paletteColors.map((col, idx) => (
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

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-artisan-gold flex-shrink-0" />
                <span>Accompanied by Hand-Embossed Certificate of Authenticity</span>
              </div>

              <div className="flex gap-3">
                <MagneticButton
                  onClick={handleAddToCart}
                  disabled={artwork.status === 'sold'}
                  variant="primary"
                  className="flex-1 py-3.5"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {artwork.status === 'sold'
                    ? 'Acquired by Collector'
                    : 'Add to Collector Cart'}
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
