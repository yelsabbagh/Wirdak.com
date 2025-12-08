
import React, { useMemo } from 'react';

interface BeadSliderProps {
  count: number;
  themeId: string;
}

export const BeadSlider: React.FC<BeadSliderProps> = ({ count }) => {
  // Configuration
  const beadSize = 50; 
  const gap = 12; 
  const beadUnit = beadSize + gap;
  const visibleBeads = 9; 
  const buffer = Math.ceil(visibleBeads / 2) + 2;

  // Generate range of beads to render based on current count
  const beadsToRender = useMemo(() => {
    const start = count - buffer;
    const end = count + buffer;
    const indices = [];
    for (let i = start; i <= end; i++) {
      indices.push(i);
    }
    return indices;
  }, [count, buffer]);

  return (
    <div className="w-full h-full relative flex items-center justify-center select-none pointer-events-none overflow-visible" dir="ltr">
      
      {/* The Moving Track */}
      <div 
        className="absolute h-full w-full transition-transform duration-300 ease-out will-change-transform flex items-center justify-center"
        style={{ 
          transform: `translateX(-${count * beadUnit}px)` 
        }}
      >
        {beadsToRender.map((index) => {
          // Alternating colors logic: Even = Primary, Odd = Secondary
          const isPrimary = Math.abs(index) % 2 === 0;
          
          return (
            <div
              key={index}
              className={`
                absolute rounded-full shadow-md
                flex items-center justify-center
                transition-all duration-300
                ${index === count ? 'scale-125 z-10 brightness-110' : 'scale-95 opacity-80'}
              `}
              style={{
                width: `${beadSize}px`,
                height: `${beadSize}px`,
                left: `50%`, 
                marginLeft: `${(index * beadUnit) - (beadSize/2)}px`,
                backgroundColor: isPrimary ? 'var(--bead-primary)' : 'var(--bead-secondary)'
              }}
            >
              {/* Shine effect */}
              <div className="w-1/3 h-1/3 bg-white/30 rounded-full absolute top-2 right-2" />
            </div>
          );
        })}
      </div>
      
      {/* Soft Fades - using bg-main variable */}
      <div 
        className="absolute left-0 top-0 h-full w-24 z-20" 
        style={{ background: 'linear-gradient(to right, var(--bg-card), transparent)' }} 
      />
      <div 
        className="absolute right-0 top-0 h-full w-24 z-20" 
        style={{ background: 'linear-gradient(to left, var(--bg-card), transparent)' }} 
      />
    </div>
  );
};
