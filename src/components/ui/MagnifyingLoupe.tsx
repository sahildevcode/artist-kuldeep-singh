import React, { useState, useRef, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface MagnifyingLoupeProps {
  src: string;
  highResSrc?: string;
  alt: string;
  aspectRatio?: string; // e.g. 'aspect-[3/4]' or 'aspect-[4/5]'
  zoomLevel?: number; // e.g. 2.8
  loupeSize?: number; // pixel diameter e.g. 190
  className?: string;
  badgeText?: string;
  onImageClick?: () => void;
}

export const MagnifyingLoupe: React.FC<MagnifyingLoupeProps> = ({
  src,
  highResSrc,
  alt,
  aspectRatio = 'aspect-[3/4]',
  zoomLevel = 2.8,
  loupeSize = 190,
  className = '',
  badgeText = 'Inspect Fine Brushwork',
  onImageClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number; pctX: number; pctY: number }>({
    x: 0,
    y: 0,
    pctX: 50,
    pctY: 50,
  });
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const updatePosition = useCallback((clientX: number, clientY: number, isTouch = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Raw coordinates inside the image container
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Offset lens upward on touch so finger doesn't cover the bubble
    if (isTouch) {
      y = y - 50;
    }

    // Clamped coordinates
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    const pctX = (clampedX / rect.width) * 100;
    const pctY = (clampedY / rect.height) * 100;

    setCoords({ x, y, pctX, pctY });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsTouchDevice(false);
    updatePosition(e.clientX, e.clientY, false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsTouchDevice(true);
    if (e.touches.length > 0) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const activeLoupeSize = isTouchDevice ? Math.min(loupeSize, 150) : loupeSize;
  const zoomImageSrc = highResSrc || src;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => {
        setIsHovering(true);
        setIsTouchDevice(true);
        if (e.touches.length > 0) {
          updatePosition(e.touches[0].clientX, e.touches[0].clientY, true);
        }
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsHovering(false)}
      onClick={onImageClick}
      className={`relative overflow-hidden select-none cursor-crosshair group ${aspectRatio} ${className}`}
    >
      {/* Base Canvas Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        loading="lazy"
        draggable={false}
      />

      {/* Subtle Luxury Linen Texture / Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

      {/* Royal Gold Frame Hairline */}
      <div className="absolute inset-0 border border-[#D4AF37]/25 pointer-events-none rounded-2xl" />

      {/* Default Hint Badge (Fades out when inspecting) */}
      <div
        className={`absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none transition-all duration-300 ${
          isHovering ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF37]/30 text-[11px] text-[#F3EFE6] font-medium tracking-wide shadow-lg">
          <Search className="w-3 h-3 text-[#D4AF37]" />
          <span>{badgeText}</span>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] bg-black/60 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
          {zoomLevel}x Loupe
        </span>
      </div>

      {/* ============================================================= */}
      {/* CIRCULAR BUBBLE LOUPE (Magnifying Glass Lens)                 */}
      {/* ============================================================= */}
      {isHovering && (
        <div
          className="pointer-events-none absolute rounded-full border-2 border-[#D4AF37] shadow-[0_0_35px_rgba(0,0,0,0.9),0_0_15px_rgba(212,175,55,0.45)] overflow-hidden z-30 transition-opacity duration-150 animate-fade-in"
          style={{
            width: `${activeLoupeSize}px`,
            height: `${activeLoupeSize}px`,
            left: `${coords.x - activeLoupeSize / 2}px`,
            top: `${coords.y - activeLoupeSize / 2}px`,
            backgroundColor: '#0a0a0c',
          }}
        >
          {/* Magnified Image Projection */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${zoomImageSrc})`,
              backgroundPosition: `${coords.pctX}% ${coords.pctY}%`,
              backgroundSize: `${zoomLevel * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Internal Royal Glass Lens Flare & Reflection */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Golden Precision Crosshair / Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/60" />
            <div className="absolute w-2 h-0.5 bg-[#D4AF37]" />
            <div className="absolute w-0.5 h-2 bg-[#D4AF37]" />
          </div>

          {/* Loupe HUD Tag */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-[#D4AF37]/40 text-[9px] font-mono text-[#D4AF37] font-semibold tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{zoomLevel}x CANVAS DETAIL</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
