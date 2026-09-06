import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  grow: boolean;
}

const PIGMENT_PALETTE = [
  'rgba(230, 57, 70, ',   // Cadmium Crimson
  'rgba(37, 99, 235, ',   // Ultramarine Cobalt
  'rgba(217, 119, 6, ',   // Golden Ochre
  'rgba(5, 150, 105, ',   // Viridian Emerald
  'rgba(197, 160, 89, ',  // Gilded Gold
  'rgba(124, 58, 237, ',  // Deep Violet Pigment
];

export const PaintTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: Particle[] = [];
    let lastX = 0;
    let lastY = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const spawnParticles = (x: number, y: number, speed: number) => {
      const count = Math.min(Math.floor(speed * 0.4) + 2, 7);
      const baseColor = PIGMENT_PALETTE[Math.floor(Math.random() * PIGMENT_PALETTE.length)];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (Math.random() * 2 + 0.5) * (speed > 10 ? 1.5 : 1);
        const radius = Math.random() * 4 + 2;

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 0.3, // slight upward float
          radius,
          color: baseColor,
          alpha: Math.random() * 0.4 + 0.4,
          decay: Math.random() * 0.018 + 0.012,
          grow: Math.random() > 0.6,
        });
      }

      // Add a soft brush dab behind cursor
      if (Math.random() > 0.4) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 8 + 6,
          color: baseColor,
          alpha: 0.25,
          decay: 0.02,
          grow: true,
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      lastX = x;
      lastY = y;

      spawnParticles(x, y, speed);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.grow && p.radius < 14) {
          p.radius += 0.15;
        }

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.shadowColor = `${p.color}0.4)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Limit particle array size for rock-solid 60 FPS
      if (particles.length > 180) {
        particles.splice(0, particles.length - 180);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return <canvas id="paint-trail-container" ref={canvasRef} aria-hidden="true" />;
};
