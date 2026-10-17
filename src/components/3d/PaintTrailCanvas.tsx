import React, { useEffect, useRef } from 'react';

interface WaterDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
}

export const PaintTrailCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    let drops: WaterDrop[] = [];
    let ripples: WaterRipple[] = [];
    let lastX = -1;
    let lastY = -1;
    let distanceTraveled = 0;

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);

    const spawnDroplets = (x: number, y: number, speed: number) => {
      // Spawn clear circular water beads with distinct shadows along mouse path
      const count = Math.min(Math.floor(speed * 0.15) + 1, 3);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (Math.random() * 0.8 + 0.2) * (speed > 10 ? 1.2 : 0.7);
        const radius = Math.random() * 4.5 + 3.5; // 3.5px to 8px water drop

        drops.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity + 0.08,
          radius,
          maxRadius: radius + Math.random() * 1.5,
          alpha: 0.95,
          decay: Math.random() * 0.009 + 0.007, // stays visible ~1.5 to 2 seconds
        });
      }

      // Add gentle water ripple occasionally
      if (distanceTraveled > 50 || (speed > 10 && Math.random() > 0.7)) {
        ripples.push({
          x,
          y,
          radius: 3,
          maxRadius: Math.random() * 16 + 14,
          alpha: 0.55,
          decay: 0.018,
        });
        distanceTraveled = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastX < 0) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      distanceTraveled += dist;

      lastX = x;
      lastY = y;

      spawnDroplets(x, y, dist);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // 1. Render delicate water surface ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += (r.maxRadius - r.radius) * 0.07 + 0.35;
        r.alpha -= r.decay;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Soft outer shadow of ripple wave
        ctx.beginPath();
        ctx.arc(r.x, r.y + 0.5, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.max(0, r.alpha * 0.16)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // White crest wave
        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0.1, r.radius - 1), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, r.alpha * 0.65)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 2. Render realistic 3D clear circular water droplets with distinct shadow
      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.alpha -= p.decay;

        if (p.radius < p.maxRadius) {
          p.radius += 0.05;
        }

        if (p.alpha <= 0) {
          drops.splice(i, 1);
          continue;
        }

        const r = p.radius;
        const a = Math.max(0, p.alpha);

        // a) PROMINENT REALISTIC DROP SHADOW UNDER THE WATER BEAD
        // Offset downwards & to the right as if illuminated from top-left
        const shadowOffsetX = r * 0.28;
        const shadowOffsetY = r * 0.38;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          p.x + shadowOffsetX,
          p.y + shadowOffsetY,
          r * 1.05,
          r * 0.85,
          Math.PI / 12,
          0,
          Math.PI * 2
        );
        const sGrad = ctx.createRadialGradient(
          p.x + shadowOffsetX,
          p.y + shadowOffsetY,
          r * 0.1,
          p.x + shadowOffsetX,
          p.y + shadowOffsetY,
          r * 1.15
        );
        sGrad.addColorStop(0, `rgba(15, 15, 15, ${a * 0.42})`);
        sGrad.addColorStop(0.55, `rgba(25, 25, 25, ${a * 0.22})`);
        sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sGrad;
        ctx.fill();
        ctx.restore();

        // b) CLEAR TRANSPARENT WATER DROPLET BODY (No blue tint, 100% natural water)
        const bodyGrad = ctx.createRadialGradient(
          p.x - r * 0.3,
          p.y - r * 0.3,
          r * 0.1,
          p.x,
          p.y,
          r
        );
        bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${a * 0.85})`);
        bodyGrad.addColorStop(0.28, `rgba(255, 255, 255, ${a * 0.3})`);
        bodyGrad.addColorStop(0.65, `rgba(240, 240, 240, ${a * 0.08})`);
        bodyGrad.addColorStop(0.88, `rgba(35, 35, 35, ${a * 0.22})`);
        bodyGrad.addColorStop(1, `rgba(10, 10, 10, ${a * 0.45})`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // c) CRISP SURFACE TENSION MENISCUS (Thin white light catch along perimeter)
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.85})`;
        ctx.lineWidth = Math.max(0.75, r * 0.11);
        ctx.stroke();

        // d) PRIMARY SPECULAR HIGHLIGHT (Bright overhead white light glint)
        ctx.beginPath();
        ctx.ellipse(
          p.x - r * 0.35,
          p.y - r * 0.35,
          Math.max(0.8, r * 0.38),
          Math.max(0.5, r * 0.22),
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.98})`;
        ctx.fill();

        // e) SECONDARY INTERNAL BOUNCE GLOW (Light concentrated at bottom-right inside drop)
        ctx.beginPath();
        ctx.ellipse(
          p.x + r * 0.28,
          p.y + r * 0.28,
          Math.max(0.6, r * 0.28),
          Math.max(0.4, r * 0.16),
          -Math.PI / 4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.6})`;
        ctx.fill();
      }

      // Keep droplet array bounded for optimal FPS
      if (drops.length > 55) {
        drops.splice(0, drops.length - 55);
      }
      if (ripples.length > 25) {
        ripples.splice(0, ripples.length - 25);
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


