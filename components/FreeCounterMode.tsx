
import React, { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ObliqueBeadLoop } from './ObliqueBeadLoop';

interface FreeCounterModeProps {
  isOpen: boolean;
  onClose: () => void;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  themeId: string;
  skipAnimation?: boolean;
  goal: number | null;
  onGoalChange: (goal: number | null) => void;
}

export const FreeCounterMode: React.FC<FreeCounterModeProps> = ({
  isOpen,
  onClose,
  count,
  onIncrement,
  onReset,
  themeId,
  skipAnimation = false,
  goal,
  onGoalChange,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const GOAL_OPTIONS = [33, 100, 1000];
  const progressPercent = goal ? Math.min((count / goal) * 100, 100) : 0;
  const isComplete = goal ? count >= goal : false;

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
        // Circular Reveal Animation (only if not skipping)
        clipPath: skipAnimation 
          ? 'circle(150% at 85% 5%)'
          : (isVisible ? 'circle(150% at 85% 5%)' : 'circle(0% at 85% 5%)'),
        opacity: skipAnimation ? 1 : (isVisible ? 1 : 0),
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
            ${isComplete ? 'text-green-500' : ''}
        `}>
          {count}
        </div>
        
        {/* Goal Progress Bar */}
        {goal && (
          <div className="mt-8 w-64 md:w-80">
            <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-[var(--text-primary)]'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-center text-sm text-[var(--text-secondary)]">
              الهدف: {goal} {isComplete && '✓'}
            </div>
          </div>
        )}

        {/* Beads Container - Positioned directly under the number */}
        <div className={`
            relative w-full h-64 md:h-[300px] transition-all duration-500 delay-200 mt-[-40px] md:mt-[-60px] z-0 overflow-visible
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
             <ObliqueBeadLoop count={count} themeId={themeId} xRadius={260} beadSize={48} />
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
      
      {/* Goal Selection - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {GOAL_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={(e) => {
              e.stopPropagation();
              onGoalChange(option);
            }}
            className={`px-4 py-2 rounded-full border transition-all ${
              goal === option
                ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border-color)] hover:border-[var(--text-primary)]'
            }`}
            title={`الهدف: ${option}`}
          >
            {option}
          </button>
        ))}
      </div>

    </div>
  );
};
