import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAudio } from '../../context/AudioContext';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTheme3D } = useAudio();
  const themeRef = useRef(activeTheme3D);

  useEffect(() => {
    themeRef.current = activeTheme3D;
  }, [activeTheme3D]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // -------------------------------------------------------------
    // Scene & Camera Setup
    // -------------------------------------------------------------
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
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const goldRimLight = new THREE.PointLight(0xd4af37, 3.8, 14);
    goldRimLight.position.set(-4, -2, 3);
    scene.add(goldRimLight);

    const crimsonFillLight = new THREE.PointLight(0xe63946, 2.2, 16);
    crimsonFillLight.position.set(4, -4, 2);
    scene.add(crimsonFillLight);

    // =============================================================
    // THEME 1: Master Paintbrush & Palette (Classical Atelier)
    // =============================================================
    const theme1Group = new THREE.Group();
    scene.add(theme1Group);

    // 1.1 Realistic Paintbrush
    const brushGroup = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.09, 0.16, 4.2, 32);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x241e1b,
      roughness: 0.35,
      metalness: 0.1,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -1.2;
    brushGroup.add(handle);

    const ferruleGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.9, 32);
    const ferruleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.85,
    });
    const ferrule = new THREE.Mesh(ferruleGeo, ferruleMat);
    ferrule.position.y = 1.15;
    brushGroup.add(ferrule);

    const bristleGeo = new THREE.ConeGeometry(0.22, 1.1, 32);
    const bristleMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512,
      roughness: 0.8,
      metalness: 0.05,
    });
    const bristles = new THREE.Mesh(bristleGeo, bristleMat);
    bristles.position.y = 2.0;
    brushGroup.add(bristles);

    const paintTipGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const paintTipMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xe63946,
      emissiveIntensity: 0.6,
    });
    const paintTip = new THREE.Mesh(paintTipGeo, paintTipMat);
    paintTip.position.y = 2.5;
    paintTip.scale.set(0.9, 1.4, 0.9);
    brushGroup.add(paintTip);

    brushGroup.rotation.z = Math.PI / 4.5;
    brushGroup.rotation.x = 0.25;
    brushGroup.position.set(2.4, 0.4, 0);
    theme1Group.add(brushGroup);

    // 1.2 Floating Wooden Palette
    const paletteGroup = new THREE.Group();
    const paletteShape = new THREE.Shape();
    paletteShape.absellipse(0, 0, 1.4, 1.0, 0, Math.PI * 2, false, 0);
    const paletteGeo = new THREE.ShapeGeometry(paletteShape);
    const paletteMat = new THREE.MeshStandardMaterial({
      color: 0xdfcfb7,
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const paletteBoard = new THREE.Mesh(paletteGeo, paletteMat);
    paletteGroup.add(paletteBoard);

    const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0xfdfbf7 });
    const thumbHole = new THREE.Mesh(holeGeo, holeMat);
    thumbHole.position.set(0.9, -0.3, 0.02);
    thumbHole.rotation.x = Math.PI / 2;
    paletteGroup.add(thumbHole);

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
      const dabM = new THREE.MeshStandardMaterial({
        color: dabColors[idx],
        roughness: 0.2,
        metalness: 0.1,
        emissive: dabColors[idx],
        emissiveIntensity: 0.25,
      });
      const dabMesh = new THREE.Mesh(dabGeo, dabM);
      dabMesh.position.set(pos[0], pos[1], pos[2]);
      dabMesh.scale.set(1.2, 0.9, 0.5);
      paletteGroup.add(dabMesh);
    });

    paletteGroup.position.set(-2.8, -1.2, -1.0);
    paletteGroup.rotation.x = 0.5;
    paletteGroup.rotation.y = -0.3;
    paletteGroup.rotation.z = -0.2;
    theme1Group.add(paletteGroup);

    // =============================================================
    // THEME 2: Artist Kuldeep Singh Signature Atelier
    // Clean & atmospheric: Floating 24K gold leaf embers (Calligraphy scroll in ScrollSignatureBackground)
    // =============================================================
    const theme2Group = new THREE.Group();
    scene.add(theme2Group);

    // Floating 24K Gold Leaf Embers
    const goldFlakeCount = 65;
    const goldFlakeGeo = new THREE.BufferGeometry();
    const goldFlakePositions = new Float32Array(goldFlakeCount * 3);
    for (let i = 0; i < goldFlakeCount; i++) {
      goldFlakePositions[i * 3] = (Math.random() - 0.5) * 14;
      goldFlakePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      goldFlakePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    goldFlakeGeo.setAttribute('position', new THREE.BufferAttribute(goldFlakePositions, 3));
    const goldFlakeMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const goldFlakes = new THREE.Points(goldFlakeGeo, goldFlakeMat);
    theme2Group.add(goldFlakes);

    // =============================================================
    // THEME 3: Celestial Studio Easel & Cosmic Pigment Nebula
    // =============================================================
    const theme3Group = new THREE.Group();
    scene.add(theme3Group);

    // 3.1 3D Studio Studio Wooden Easel
    const easelGroup = new THREE.Group();
    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x3d2817,
      roughness: 0.45,
      metalness: 0.1,
    });

    // Left & Right A-frame legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 4.4, 16);
    const leftLeg = new THREE.Mesh(legGeo, walnutMat);
    leftLeg.position.set(-0.7, 0, 0);
    leftLeg.rotation.z = -0.18;
    const rightLeg = new THREE.Mesh(legGeo, walnutMat);
    rightLeg.position.set(0.7, 0, 0);
    rightLeg.rotation.z = 0.18;

    // Center vertical mast
    const mastGeo = new THREE.CylinderGeometry(0.07, 0.07, 4.6, 16);
    const mast = new THREE.Mesh(mastGeo, walnutMat);
    mast.position.set(0, 0.2, -0.05);

    // Cross brace tray (where canvas rests)
    const shelfGeo = new THREE.BoxGeometry(2.4, 0.12, 0.35);
    const shelf = new THREE.Mesh(shelfGeo, walnutMat);
    shelf.position.set(0, -0.4, 0.12);

    // Blank Belgian Linen Canvas mounted on easel
    const canvasBoardGeo = new THREE.BoxGeometry(1.9, 2.5, 0.08);
    const linenMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f1,
      roughness: 0.85,
      metalness: 0.02,
    });
    const canvasBoard = new THREE.Mesh(canvasBoardGeo, linenMat);
    canvasBoard.position.set(0, 0.8, 0.15);

    // Top Clamp
    const clampGeo = new THREE.BoxGeometry(0.6, 0.1, 0.2);
    const topClamp = new THREE.Mesh(clampGeo, walnutMat);
    topClamp.position.set(0, 2.08, 0.16);

    easelGroup.add(leftLeg, rightLeg, mast, shelf, canvasBoard, topClamp);
    easelGroup.position.set(2.4, -0.2, -0.5);
    easelGroup.rotation.y = -0.3;
    easelGroup.rotation.x = 0.1;
    theme3Group.add(easelGroup);

    // 3.2 Swirling Pigment Galaxy Nebula (Lightweight, elegant orbiting spheres)
    const nebulaGroup = new THREE.Group();
    const nebulaColors = [0xe63946, 0x2563eb, 0xf59e0b, 0x10b981, 0x8b5cf6, 0xffd700];
    const sphereCount = 22;
    const nebulaSpheres: { mesh: THREE.Mesh; radius: number; angle: number; speed: number; yOffset: number }[] = [];

    // Shared geometries and materials for instant WebGL batching & zero overhead
    const sphereGeos = [
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.SphereGeometry(0.13, 12, 12),
      new THREE.SphereGeometry(0.17, 12, 12),
    ];
    const sharedNebulaMaterials = nebulaColors.map((col) =>
      new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.3,
      })
    );

    for (let i = 0; i < sphereCount; i++) {
      const radius = 1.8 + (i % 7) * 0.42;
      const angle = (Math.PI * 2 * i) / sphereCount;
      const speed = (0.22 + (i % 5) * 0.08) * (i % 2 === 0 ? 1 : -0.85);
      const yOffset = ((i % 6) - 2.5) * 0.55;

      const sphGeo = sphereGeos[i % sphereGeos.length];
      const sphMat = sharedNebulaMaterials[i % sharedNebulaMaterials.length];
      const sphMesh = new THREE.Mesh(sphGeo, sphMat);
      nebulaGroup.add(sphMesh);

      nebulaSpheres.push({
        mesh: sphMesh,
        radius,
        angle,
        speed,
        yOffset,
      });
    }

    nebulaGroup.position.set(-1.2, 0.2, -0.5);
    theme3Group.add(nebulaGroup);

    // 3.3 Light Refracting Crystal Prisms
    const crystalGeo = new THREE.OctahedronGeometry(0.45, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.9,
      emissive: 0x4a90e2,
      emissiveIntensity: 0.2,
    });
    const crystal1 = new THREE.Mesh(crystalGeo, crystalMat);
    crystal1.position.set(-3.2, 1.4, -1.0);
    const crystal2 = new THREE.Mesh(crystalGeo, crystalMat);
    crystal2.position.set(-2.2, -1.8, 0.5);
    crystal2.scale.set(0.7, 0.7, 0.7);
    theme3Group.add(crystal1, crystal2);

    // =============================================================
    // Ambient Background Stardust (Shared across themes)
    // =============================================================
    const dustCount = 50;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 14;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc5a059,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
    });
    const ambientDust = new THREE.Points(dustGeo, dustMat);
    scene.add(ambientDust);

    // -------------------------------------------------------------
    // Mouse & Scroll Interaction Listeners
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

    // Initial scale values for theme transitions
    let theme1Scale = activeTheme3D === 'brush' ? 1 : 0.001;
    let theme2Scale = activeTheme3D === 'kuldeep' ? 1 : 0.001;
    let theme3Scale = activeTheme3D === 'celestial' ? 1 : 0.001;

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const cycleColors = [0xe63946, 0x2563eb, 0xd97706, 0x059669, 0xc5a059];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Snappy, instant response to user scroll & mouse motion (zero lag)
      currentScrollY += (targetScrollY - currentScrollY) * 0.28;
      currentMouseX += (targetMouseX - currentMouseX) * 0.22;
      currentMouseY += (targetMouseY - currentMouseY) * 0.22;

      const scrollFactor = currentScrollY * 0.0015;

      // Smooth Theme Cross-Fade / Scale Transitions
      const active = themeRef.current;
      const targetT1 = active === 'brush' ? 1 : 0.001;
      const targetT2 = active === 'kuldeep' ? 1 : 0.001;
      const targetT3 = active === 'celestial' ? 1 : 0.001;

      theme1Scale += (targetT1 - theme1Scale) * 0.08;
      theme2Scale += (targetT2 - theme2Scale) * 0.08;
      theme3Scale += (targetT3 - theme3Scale) * 0.08;

      theme1Group.scale.set(theme1Scale, theme1Scale, theme1Scale);
      theme1Group.visible = theme1Scale > 0.01;

      theme2Group.scale.set(theme2Scale, theme2Scale, theme2Scale);
      theme2Group.visible = theme2Scale > 0.01;

      theme3Group.scale.set(theme3Scale, theme3Scale, theme3Scale);
      theme3Group.visible = theme3Scale > 0.01;

      // -----------------------------------------------------------
      // Animate Theme 1 (Brush & Palette)
      // -----------------------------------------------------------
      if (theme1Group.visible) {
        brushGroup.rotation.z = Math.PI / 4.5 + Math.sin(elapsedTime * 0.8) * 0.08 + scrollFactor * 0.8;
        brushGroup.rotation.y = Math.cos(elapsedTime * 0.6) * 0.15 + scrollFactor * 1.2;
        brushGroup.rotation.x = 0.25 + currentMouseY * 0.2;
        brushGroup.position.x = 2.4 + currentMouseX * 0.4 + Math.sin(scrollFactor) * 0.3;
        brushGroup.position.y = 0.4 - Math.sin(scrollFactor * 1.5) * 0.8 + Math.cos(elapsedTime) * 0.1;

        // Paint tip color shift
        const colorIndex = Math.floor((elapsedTime * 0.2) % cycleColors.length);
        const nextColorIndex = (colorIndex + 1) % cycleColors.length;
        const blend = (elapsedTime * 0.2) % 1;
        const c1 = new THREE.Color(cycleColors[colorIndex]);
        const c2 = new THREE.Color(cycleColors[nextColorIndex]);
        c1.lerp(c2, blend);
        paintTipMat.color.copy(c1);
        paintTipMat.emissive.copy(c1);

        paletteGroup.rotation.z = -0.2 + scrollFactor * 0.5 + Math.sin(elapsedTime * 0.4) * 0.05;
        paletteGroup.rotation.x = 0.5 + currentMouseY * 0.15;
        paletteGroup.rotation.y = -0.3 + currentMouseX * 0.2;
        paletteGroup.position.y = -1.2 + Math.sin(scrollFactor * 0.9) * 0.6;
      }

      // -----------------------------------------------------------
      // Animate Theme 2 (Kuldeep Singh Seal & Gilded Frames)
      // -----------------------------------------------------------
      if (theme2Group.visible) {
        goldFlakes.rotation.y = elapsedTime * 0.08 + scrollFactor * 0.4;
        goldFlakes.rotation.x = Math.sin(elapsedTime * 0.04) * 0.1;
      }

      // -----------------------------------------------------------
      // Animate Theme 3 (Celestial Easel & Pigment Nebula)
      // -----------------------------------------------------------
      if (theme3Group.visible) {
        easelGroup.rotation.y = -0.3 + Math.sin(elapsedTime * 0.5) * 0.15 + currentMouseX * 0.3 + scrollFactor * 0.35;
        easelGroup.rotation.x = 0.1 + Math.cos(elapsedTime * 0.4) * 0.08 - currentMouseY * 0.2;
        easelGroup.position.y = -0.2 + Math.sin(elapsedTime * 0.7) * 0.15 - scrollFactor * 0.2;

        // Continuous fluid orbital motion: completely unbroken and continuous (never freezes or stops on scroll)
        const sLen = nebulaSpheres.length;
        for (let i = 0; i < sLen; i++) {
          const item = nebulaSpheres[i];
          const currentAngle = item.angle + elapsedTime * item.speed * 0.85;
          item.mesh.position.set(
            Math.cos(currentAngle) * item.radius,
            item.yOffset + Math.sin(elapsedTime * 1.2 + item.angle) * 0.3,
            Math.sin(currentAngle) * item.radius
          );
        }

        // Gentle smooth 3D depth parallax for the entire nebula cluster
        nebulaGroup.position.y = 0.2 - scrollFactor * 0.3;
        nebulaGroup.rotation.x = currentMouseY * 0.2;
        nebulaGroup.rotation.y = currentMouseX * 0.2;

        crystal1.rotation.x = elapsedTime * 0.5;
        crystal1.rotation.y = elapsedTime * 0.7;
        crystal2.rotation.x = -elapsedTime * 0.4;
        crystal2.rotation.z = elapsedTime * 0.6;
      }

      // Ambient dust rotation
      ambientDust.rotation.y = elapsedTime * 0.02 + scrollFactor * 0.15;

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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="three-canvas-container" ref={containerRef} aria-hidden="true" />;
};
