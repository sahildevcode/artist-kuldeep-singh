import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;
    let isHovered = false;
    let isVisible = false;
    let isMoving = false;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      // Move the precision dot directly on GPU with zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0) scale(${isHovered ? 0 : 1})`;
      }

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      const hoverState = Boolean(
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.clickable') ||
        target?.tagName === 'BUTTON' ||
        target?.tagName === 'A'
      );

      if (hoverState !== isHovered) {
        isHovered = hoverState;
        if (ringRef.current) {
          ringRef.current.style.width = isHovered ? '52px' : '30px';
          ringRef.current.style.height = isHovered ? '52px' : '30px';
          ringRef.current.style.borderColor = isHovered ? 'rgba(230, 57, 70, 0.7)' : 'rgba(26, 24, 22, 0.25)';
          ringRef.current.style.backgroundColor = isHovered ? 'rgba(230, 57, 70, 0.08)' : 'transparent';
        }
      }

      if (!isMoving) {
        isMoving = true;
        animId = requestAnimationFrame(loop);
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const loop = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.22;
      currentY += dy * 0.22;

      if (ringRef.current) {
        const offset = isHovered ? 26 : 15;
        ringRef.current.style.transform = `translate3d(${currentX - offset}px, ${currentY - offset}px, 0)`;
      }

      // Stop loop when close to target to save 100% CPU
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        animId = requestAnimationFrame(loop);
      } else {
        isMoving = false;
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Precision cursor dot (Zero React re-render, 100% GPU translate3d) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full opacity-0 transition-opacity duration-150"
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#1A1816',
          willChange: 'transform',
        }}
      />

      {/* Trailing fluid ring (Zero React re-render, 100% GPU translate3d) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border opacity-0 transition-[opacity,width,height,border-color,background-color] duration-200"
        style={{
          width: 30,
          height: 30,
          borderColor: 'rgba(26, 24, 22, 0.25)',
          willChange: 'transform',
        }}
      />
    </>
  );
};
