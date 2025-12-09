
import React, { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { BeadSlider } from './BeadSlider';

interface FreeCounterModeProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  themeId: string;
}

export const FreeCounterMode: React.FC<FreeCounterModeProps> = ({
  isOpen,
  onClose,
  count,
  onIncrement,
  onReset,
  themeId,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Double requestAnimationFrame ensures the browser paints the "closed" state first
      // before switching to "open", forcing the transition to play.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 700); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[var(--bg-main)] text-[var(--text-primary)] transition-all duration-700 ease-in-out overflow-hidden"
      style={{
        // Circular Reveal Animation
        // Origin is set to top-right (approx 85% 5% to match button position in RTL header)
        clipPath: isVisible
          ? 'circle(150% at 85% 5%)' 
          : 'circle(0% at 85% 5%)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      {/* Click Area for Counting */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none touch-manipulation pb-20"
        onClick={onIncrement}
      >
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--text-secondary)] rounded-full blur-[100px] animate-pulse" />
        </div>

        {/* The Counter */}
        <div className={`
            relative z-10 text-[8rem] md:text-[12rem] font-bold tracking-tighter leading-none 
            transition-all duration-500 delay-100
            ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10'}
        `}>
          {count}
        </div>

        {/* Beads Container - Positioned directly under the number */}
        <div className={`
            relative w-full h-32 md:h-40 transition-all duration-500 delay-200 mt-[-20px] md:mt-[-40px] z-0
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
             <BeadSlider count={count} themeId={themeId} />
        </div>
      </div>

      {/* Controls */}
      
      {/* Close Button (Top Left) */}
      <button
        onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}
        className="absolute top-6 left-6 z-50 p-4 bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-red-500 rounded-full shadow-lg border border-[var(--border-color)] transition-transform hover:scale-110 active:scale-95"
      >
        <X size={28} />
      </button>

      {/* Reset Button (Top Right) */}
      <button
        onClick={(e) => {
            e.stopPropagation();
            onReset();
        }}
        className="absolute top-6 right-6 z-50 p-4 bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full shadow-lg border border-[var(--border-color)] transition-transform hover:scale-110 active:scale-95"
        title="تصفير العداد"
      >
        <RotateCcw size={28} />
      </button>

    </div>
  );
};
