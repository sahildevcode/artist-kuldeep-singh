import React, { useEffect, useState } from 'react';

interface WaterSplashDrop {
  id: number;
  size: number;
  angle: number;
  distance: number;
  delay: number;
  opacity: number;
}

interface WaterSplashBurst {
  id: number;
  x: number;
  y: number;
  droplets: WaterSplashDrop[];
}

export const ClickBubbleBurst: React.FC = () => {
  const [bursts, setBursts] = useState<WaterSplashBurst[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger if clicked on an input, button, link, or navigation bar
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.isContentEditable ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('nav') ||
        target.closest('header')
      ) {
        return;
      }

      const burstId = Date.now() + Math.random();
      const dropCount = Math.floor(Math.random() * 4) + 8; // 8-11 water droplets
      const newDroplets: WaterSplashDrop[] = [];

      for (let i = 0; i < dropCount; i++) {
        const angle = (Math.PI * 2 * i) / dropCount + (Math.random() - 0.5) * 0.4;
        const distance = Math.random() * 50 + 30; // 30px to 80px splash distance
        const size = Math.random() * 8 + 7; // 7px to 15px circular water drop
        const delay = Math.random() * 30;

        newDroplets.push({
          id: i,
          size,
          angle,
          distance,
          delay,
          opacity: 0.95,
        });
      }

      setBursts((prev) => [
        ...(Array.isArray(prev) ? prev.slice(-3) : []),
        { id: burstId, x: e.clientX, y: e.clientY, droplets: newDroplets },
      ]);

      // Clean up after ripple/droplets finish
      setTimeout(() => {
        setBursts((prev) => (Array.isArray(prev) ? prev.filter((b) => b && b.id !== burstId) : []));
      }, 750);
    };

    window.addEventListener('pointerdown', handleClick);
    return () => {
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {(bursts || []).map((burst) => {
        if (!burst || !burst.id) return null;
        return (
          <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
            {/* Primary Outer Liquid Water Ripple with soft shadow and white crest */}
            <div
              className="absolute rounded-full border border-black/15"
              style={{
                width: 130,
                height: 130,
                left: -65,
                top: -65,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.08), inset 0 0 10px rgba(255, 255, 255, 0.7)',
                animation: 'waterRippleWave 680ms cubic-bezier(0.1, 0.8, 0.25, 1) forwards',
              }}
            />

            {/* Secondary Concentric Wavelet */}
            <div
              className="absolute rounded-full border border-white/90"
              style={{
                width: 85,
                height: 85,
                left: -42.5,
                top: -42.5,
                animation: 'waterRippleWave 580ms cubic-bezier(0.12, 0.85, 0.3, 1) 70ms forwards',
              }}
            />

            {/* Epicenter Water Drop Impact Crown with realistic 3D shadow */}
            <div
              className="absolute rounded-full"
              style={{
                width: 14,
                height: 14,
                left: -7,
                top: -7,
                background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, rgba(245, 245, 245, 0.8) 45%, rgba(40, 40, 40, 0.4) 100%)',
                boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.35), inset 0 1.5px 3px #ffffff',
                border: '0.8px solid rgba(255, 255, 255, 0.9)',
                animation: 'waterCenterPop 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            />

            {/* Circular Clear Splashing Water Droplets with Deep Realistic Drop Shadow */}
            {(burst.droplets || []).map((drop) => {
              if (!drop) return null;
              const destX = Math.cos(drop.angle) * drop.distance;
              const destY = Math.sin(drop.angle) * drop.distance;

              return (
                <span
                  key={drop.id}
                  className="absolute rounded-full"
                  style={{
                    width: drop.size,
                    height: drop.size,
                    background:
                      'radial-gradient(circle at 32% 30%, #ffffff 0%, rgba(255, 255, 255, 0.85) 28%, rgba(240, 240, 240, 0.15) 60%, rgba(45, 45, 45, 0.3) 90%, rgba(15, 15, 15, 0.5) 100%)',
                    boxShadow:
                      'inset 0 1.5px 3px rgba(255, 255, 255, 0.95), inset 0 -1.5px 3px rgba(0, 0, 0, 0.3), 3px 5px 10px rgba(0, 0, 0, 0.4)',
                    border: '0.8px solid rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(0.5px)',
                    opacity: drop.opacity,
                    transform: 'translate(-50%, -50%)',
                    animation: `waterDropFlyOut ${520 + drop.id * 15}ms cubic-bezier(0.12, 0.85, 0.25, 1) ${drop.delay}ms forwards`,
                    // @ts-ignore
                    '--tx': `${destX}px`,
                    '--ty': `${destY}px`,
                  }}
                >
                  {/* Specular White Glint inside Droplet */}
                  <span
                    className="absolute rounded-full bg-white block"
                    style={{
                      width: Math.max(2, drop.size * 0.35),
                      height: Math.max(1.5, drop.size * 0.22),
                      top: '16%',
                      left: '18%',
                      opacity: 0.98,
                      transform: 'rotate(-45deg)',
                    }}
                  />
                </span>
              );
            })}
          </div>
        );
      })}

      <style>{`
        @keyframes waterDropFlyOut {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.95;
          }
          50% {
            opacity: 0.9;
            transform: translate(calc(-50% + var(--tx) * 0.85), calc(-50% + var(--ty) * 0.85)) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.2);
          }
        }

        @keyframes waterRippleWave {
          0% {
            transform: scale(0.05);
            opacity: 0.8;
          }
          65% {
            opacity: 0.35;
          }
          100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }

        @keyframes waterCenterPop {
          0% {
            transform: scale(0.2);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};


