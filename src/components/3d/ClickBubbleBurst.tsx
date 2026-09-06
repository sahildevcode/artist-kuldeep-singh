import React, { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  speed: number;
}

interface BurstEvent {
  id: number;
  x: number;
  y: number;
  bubbles: Bubble[];
}

const BUBBLE_COLORS = [
  '#E63946', // Cadmium Crimson
  '#2563EB', // Ultramarine
  '#D97706', // Golden Ochre
  '#059669', // Emerald
  '#C5A059', // Gold
  '#8B5CF6', // Purple
];

export const ClickBubbleBurst: React.FC = () => {
  const [bursts, setBursts] = useState<BurstEvent[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger if clicked on an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const burstId = Date.now() + Math.random();
      const bubbleCount = Math.floor(Math.random() * 6) + 12; // 12-18 bubbles
      const newBubbles: Bubble[] = [];

      for (let i = 0; i < bubbleCount; i++) {
        const angle = (Math.PI * 2 * i) / bubbleCount + (Math.random() - 0.5) * 0.4;
        const distance = Math.random() * 60 + 30; // expand 30px to 90px
        const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
        const size = Math.random() * 18 + 8; // 8px to 26px

        newBubbles.push({
          id: i,
          x: e.clientX,
          y: e.clientY,
          color,
          size,
          angle,
          distance,
          speed: Math.random() * 0.3 + 0.5,
        });
      }

      setBursts((prev) => [...prev.slice(-4), { id: burstId, x: e.clientX, y: e.clientY, bubbles: newBubbles }]);

      // Remove after animation completes
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 750);
    };

    window.addEventListener('pointerdown', handleClick);
    return () => {
      window.removeEventListener('pointerdown', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {bursts.map((burst) => (
        <div key={burst.id} className="absolute" style={{ left: burst.x, top: burst.y }}>
          {/* Expanding central watercolor ripple wave */}
          <div
            className="absolute rounded-full border border-artisan-gold/40 animate-ping opacity-60"
            style={{
              width: 80,
              height: 80,
              left: -40,
              top: -40,
              animationDuration: '650ms',
            }}
          />
          <div
            className="absolute rounded-full bg-gradient-to-r from-artisan-crimson/20 via-artisan-ochre/20 to-artisan-ultramarine/20 blur-sm"
            style={{
              width: 50,
              height: 50,
              left: -25,
              top: -25,
              animation: 'bubblePop 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />

          {/* Individual flying paint bubbles */}
          {burst.bubbles.map((bubble) => {
            const destX = Math.cos(bubble.angle) * bubble.distance;
            const destY = Math.sin(bubble.angle) * bubble.distance;

            return (
              <span
                key={bubble.id}
                className="absolute rounded-full transition-all"
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  backgroundColor: bubble.color,
                  boxShadow: `0 0 10px ${bubble.color}88, inset 0 2px 4px rgba(255,255,255,0.8)`,
                  opacity: 0.85,
                  transform: 'translate(-50%, -50%)',
                  animation: `flyOut ${550 + bubble.id * 10}ms cubic-bezier(0.2, 0.9, 0.3, 1) forwards`,
                  // @ts-ignore
                  '--tx': `${destX}px`,
                  '--ty': `${destY}px`,
                }}
              />
            );
          })}
        </div>
      ))}

      <style>{`
        @keyframes flyOut {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
          }
          60% {
            opacity: 0.9;
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--tx) * 1.25), calc(-50% + var(--ty) * 1.25)) scale(0.1);
          }
        }
        @keyframes bubblePop {
          0% { transform: scale(0.2); opacity: 0.9; }
          70% { transform: scale(1.8); opacity: 0.4; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
