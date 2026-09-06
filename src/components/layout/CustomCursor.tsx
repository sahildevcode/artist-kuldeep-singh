import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive elements
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.clickable') ||
        target?.tagName === 'BUTTON' ||
        target?.tagName === 'A'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    let animId: number;
    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailingPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision cursor dot */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full transition-transform duration-75 ease-out"
        style={{
          left: pos.x,
          top: pos.y,
          width: 8,
          height: 8,
          backgroundColor: '#1A1816',
          transform: `translate(-50%, -50%) scale(${isHovered ? 0 : 1})`,
        }}
      />

      {/* Trailing fluid ring */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full transition-all duration-300 ease-out border"
        style={{
          left: trailingPos.x,
          top: trailingPos.y,
          width: isHovered ? 56 : 32,
          height: isHovered ? 56 : 32,
          transform: 'translate(-50%, -50%)',
          borderColor: isHovered ? 'rgba(230, 57, 70, 0.6)' : 'rgba(26, 24, 22, 0.25)',
          backgroundColor: isHovered ? 'rgba(230, 57, 70, 0.08)' : 'transparent',
          backdropFilter: isHovered ? 'blur(2px)' : 'none',
        }}
      />
    </>
  );
};
