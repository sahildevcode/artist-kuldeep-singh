import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xc5a059, 3.5, 12);
    rimLight.position.set(-4, -2, 3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xe63946, 2.0, 15);
    fillLight.position.set(4, -4, 2);
    scene.add(fillLight);

    // Master Group for 3D Art Studio Elements
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // -------------------------------------------------------------
    // 1. Realistic 3D Artist Paintbrush
    // -------------------------------------------------------------
    const brushGroup = new THREE.Group();

    // Wooden Handle
    const handleGeometry = new THREE.CylinderGeometry(0.09, 0.16, 4.2, 32);
    const handleMaterial = new THREE.MeshStandardMaterial({
      color: 0x241e1b, // Dark mahogany wood
      roughness: 0.35,
      metalness: 0.1,
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -1.2;
    brushGroup.add(handle);

    // Brass/Silver Ferrule (Metallic Collar)
    const ferruleGeometry = new THREE.CylinderGeometry(0.18, 0.16, 0.9, 32);
    const ferruleMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Gilded brass / Gold
      roughness: 0.2,
      metalness: 0.85,
    });
    const ferrule = new THREE.Mesh(ferruleGeometry, ferruleMaterial);
    ferrule.position.y = 1.15;
    brushGroup.add(ferrule);

    // Brush Bristles
    const bristleGeometry = new THREE.ConeGeometry(0.22, 1.1, 32);
    const bristleMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1512, // Dark sable hair
      roughness: 0.8,
      metalness: 0.05,
    });
    const bristles = new THREE.Mesh(bristleGeometry, bristleMaterial);
    bristles.position.y = 2.0;
    brushGroup.add(bristles);

    // Glowing Wet Paint Tip on the Brush
    const paintTipGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const paintTipMat = new THREE.MeshStandardMaterial({
      color: 0xe63946, // Vibrant Cadmium Crimson
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xe63946,
      emissiveIntensity: 0.6,
    });
    const paintTip = new THREE.Mesh(paintTipGeo, paintTipMat);
    paintTip.position.y = 2.5;
    paintTip.scale.set(0.9, 1.4, 0.9);
    brushGroup.add(paintTip);

    // Initial brush pose
    brushGroup.rotation.z = Math.PI / 4.5;
    brushGroup.rotation.x = 0.25;
    brushGroup.position.set(2.4, 0.4, 0);
    masterGroup.add(brushGroup);

    // -------------------------------------------------------------
    // 2. Floating 3D Artist Palette with Pigment Dabs
    // -------------------------------------------------------------
    const paletteGroup = new THREE.Group();
    
    // Wooden Palette board (Oval disc)
    const paletteShape = new THREE.Shape();
    paletteShape.absellipse(0, 0, 1.4, 1.0, 0, Math.PI * 2, false, 0);
    const paletteGeo = new THREE.ShapeGeometry(paletteShape);
    const paletteMat = new THREE.MeshStandardMaterial({
      color: 0xdfcfb7, // Birch wood
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const paletteBoard = new THREE.Mesh(paletteGeo, paletteMat);
    paletteGroup.add(paletteBoard);

    // Thumb hole
    const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0xfdfbf7 });
    const thumbHole = new THREE.Mesh(holeGeo, holeMat);
    thumbHole.position.set(0.9, -0.3, 0.02);
    thumbHole.rotation.x = Math.PI / 2;
    paletteGroup.add(thumbHole);

    // 5 Vibrant Pigment Dabs on the Palette
    const dabColors = [0xe63946, 0x2563eb, 0xd97706, 0x059669, 0xc5a059];
    const dabPositions = [
      [-0.8, 0.5, 0.04],
      [-0.4, 0.7, 0.04],
      [0.1, 0.75, 0.04],
      [0.6, 0.5, 0.04],
      [-0.9, 0.0, 0.04],
    ];

    dabPositions.forEach((pos, idx) => {
      const dabGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const dabMat = new THREE.MeshStandardMaterial({
        color: dabColors[idx],
        roughness: 0.2,
        metalness: 0.1,
        emissive: dabColors[idx],
        emissiveIntensity: 0.2,
      });
      const dabMesh = new THREE.Mesh(dabGeo, dabMat);
      dabMesh.position.set(pos[0], pos[1], pos[2]);
      dabMesh.scale.set(1.2, 0.9, 0.5);
      paletteGroup.add(dabMesh);
    });

    paletteGroup.position.set(-2.8, -1.2, -1.0);
    paletteGroup.rotation.x = 0.5;
    paletteGroup.rotation.y = -0.3;
    paletteGroup.rotation.z = -0.2;
    masterGroup.add(paletteGroup);

    // Floating pigment dust particles in 3D space
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const paletteColorObjects = [
      new THREE.Color(0xe63946),
      new THREE.Color(0x2563eb),
      new THREE.Color(0xd97706),
      new THREE.Color(0x059669),
      new THREE.Color(0xc5a059),
    ];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const col = paletteColorObjects[Math.floor(Math.random() * paletteColorObjects.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------
    // Scroll & Mouse Interaction Listeners
    // -------------------------------------------------------------
    let targetScrollY = 0;
    let currentScrollY = 0;
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

    // Color cycle list for wet paint tip
    const cycleColors = [0xe63946, 0x2563eb, 0xd97706, 0x059669, 0xc5a059];

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp scroll and mouse
      currentScrollY += (targetScrollY - currentScrollY) * 0.05;
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const scrollFactor = currentScrollY * 0.0015;

      // Rotate brush based on scroll progression & time
      brushGroup.rotation.z = Math.PI / 4.5 + Math.sin(elapsedTime * 0.8) * 0.08 + scrollFactor * 0.8;
      brushGroup.rotation.y = Math.cos(elapsedTime * 0.6) * 0.15 + scrollFactor * 1.2;
      brushGroup.rotation.x = 0.25 + currentMouseY * 0.2;

      // Position brush dynamically
      brushGroup.position.x = 2.4 + currentMouseX * 0.4 + Math.sin(scrollFactor) * 0.3;
      brushGroup.position.y = 0.4 - Math.sin(scrollFactor * 1.5) * 0.8 + Math.cos(elapsedTime) * 0.1;
      brushGroup.position.z = Math.cos(scrollFactor) * 0.5;

      // Slowly pulse and shift paint tip color over time
      const colorIndex = Math.floor((elapsedTime * 0.2) % cycleColors.length);
      const nextColorIndex = (colorIndex + 1) % cycleColors.length;
      const blend = (elapsedTime * 0.2) % 1;
      
      const c1 = new THREE.Color(cycleColors[colorIndex]);
      const c2 = new THREE.Color(cycleColors[nextColorIndex]);
      c1.lerp(c2, blend);
      paintTipMat.color.copy(c1);
      paintTipMat.emissive.copy(c1);

      // Rotate palette board smoothly
      paletteGroup.rotation.z = -0.2 + scrollFactor * 0.5 + Math.sin(elapsedTime * 0.4) * 0.05;
      paletteGroup.rotation.x = 0.5 + currentMouseY * 0.15;
      paletteGroup.rotation.y = -0.3 + currentMouseX * 0.2;
      paletteGroup.position.y = -1.2 + Math.sin(scrollFactor * 0.9) * 0.6;

      // Rotate ambient particles
      particles.rotation.y = elapsedTime * 0.03 + scrollFactor * 0.2;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-canvas-container" ref={containerRef} aria-hidden="true" />;
};
