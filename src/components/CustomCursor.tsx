import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFinePointer, setIsFinePointer] = useState<boolean>(true);

  useEffect(() => {
    // Only enable custom cursor for devices with fine pointer (mouse/trackpad)
    if (typeof window !== 'undefined') {
      const matchFine = window.matchMedia('(pointer: fine)').matches;
      setIsFinePointer(matchFine);
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const checkHoverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        setIsHovered(false);
        return;
      }
      const isInteractive = target.closest(
        'button, a, input, select, textarea, [role="button"], label, .interactive-cursor'
      );
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', checkHoverInteractive);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', checkHoverInteractive);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Smooth trailing spring effect for the outer circle
  useEffect(() => {
    let animationFrameId: number;

    const smoothTrail = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Smooth interpolation factor
        return {
          x: prev.x + dx * 0.35,
          y: prev.y + dy * 0.35,
        };
      });
      animationFrameId = requestAnimationFrame(smoothTrail);
    };

    animationFrameId = requestAnimationFrame(smoothTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isFinePointer || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Outer Circle Ring centered on mouse pointer */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-150 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-10 h-10 border-amber-500 bg-amber-500/10 dark:border-amber-400 dark:bg-amber-400/15 shadow-[0_0_12px_rgba(245,158,11,0.35)] scale-110'
              : isClicked
              ? 'w-7 h-7 border-amber-600 bg-amber-600/20 dark:border-amber-300 scale-90'
              : 'w-8 h-8 border-stone-800/60 dark:border-amber-400/70 bg-stone-900/5 dark:bg-amber-400/5'
          }`}
        >
          {/* Subtle inner concentric guide ring */}
          <div
            className={`rounded-full border transition-all duration-150 ${
              isHovered
                ? 'w-6 h-6 border-amber-500/30 dark:border-amber-400/40'
                : 'w-4 h-4 border-stone-400/20 dark:border-amber-400/20'
            }`}
          />
        </div>
      </div>

      {/* Inner Center Dot precisely locked to mouse pointer */}
      <div
        className="fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div
          className={`rounded-full transition-all duration-100 ease-out shadow-xs ${
            isHovered
              ? 'w-2 h-2 bg-amber-600 dark:bg-amber-300 ring-2 ring-white/60 dark:ring-stone-900/80 scale-125'
              : isClicked
              ? 'w-2.5 h-2.5 bg-amber-700 dark:bg-amber-200'
              : 'w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400'
          }`}
        />
      </div>
    </>
  );
};
