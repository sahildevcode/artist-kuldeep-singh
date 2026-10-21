import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper to create soft, glowing, circular golden stardust particles (zero pixelated square boxes)
const createSoftStardustTexture = (): THREE.Texture | null => {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 250, 210, 1)');      // Pure radiant gold center
  gradient.addColorStop(0.2, 'rgba(255, 215, 64, 0.9)');    // Golden luminous core
  gradient.addColorStop(0.5, 'rgba(218, 165, 32, 0.35)');   // Soft ambient warm aura
  gradient.addColorStop(1, 'rgba(218, 165, 32, 0)');        // Completely transparent silky edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera Setup
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    container.appendChild(renderer.domElement);

    // Soft glowing circular particle texture
    const stardustTexture = createSoftStardustTexture();

    // =============================================================
    // Artist Kuldeep Singh Theme: 24K Soft Glowing Gold Stardust
    // =============================================================
    const goldFlakeCount = 75;
    const goldFlakeGeo = new THREE.BufferGeometry();
    const goldFlakePositions = new Float32Array(goldFlakeCount * 3);
    for (let i = 0; i < goldFlakeCount; i++) {
      goldFlakePositions[i * 3] = (Math.random() - 0.5) * 16;
      goldFlakePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      goldFlakePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    goldFlakeGeo.setAttribute('position', new THREE.BufferAttribute(goldFlakePositions, 3));
    const goldFlakeMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.28,
      map: stardustTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const goldFlakes = new THREE.Points(goldFlakeGeo, goldFlakeMat);
    scene.add(goldFlakes);

    // Ambient Warm Stardust Depth Layer
    const dustCount = 50;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xe6ca7d,
      size: 0.18,
      map: stardustTexture || undefined,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ambientDust = new THREE.Points(dustGeo, dustMat);
    scene.add(ambientDust);

    // Mouse & Scroll Interaction Listeners
    let targetScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let currentScrollY = targetScrollY;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let stardustAngleY = 0;
    let ambientAngleY = 0;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (typeof document !== 'undefined' && document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Fluid scroll response
      const scrollDiff = targetScrollY - currentScrollY;
      currentScrollY += scrollDiff * 0.25;

      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      // Constant serene drift - unbroken speed
      stardustAngleY += delta * 0.12;
      ambientAngleY += delta * 0.04;

      // Primary gold stardust rotation & gentle drift
      goldFlakes.rotation.y = stardustAngleY + currentMouseX * 0.1;
      goldFlakes.rotation.x = Math.sin(elapsedTime * 0.35) * 0.08 + currentMouseY * 0.06;
      goldFlakes.position.y = -currentScrollY * 0.0003;

      // Ambient dust rotation
      ambientDust.rotation.y = ambientAngleY;
      ambientDust.rotation.x = Math.cos(elapsedTime * 0.25) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      goldFlakeGeo.dispose();
      goldFlakeMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      stardustTexture?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-canvas-container" ref={containerRef} aria-hidden="true" />;
};
