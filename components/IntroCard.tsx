import React from 'react';
import { RollingBeadIcon } from './RollingBeadIcon';

interface IntroCardProps {
  onStartAdhkar: () => void;
  onStartFreeMode: () => void;
  themeId?: string;
}

export const IntroCard: React.FC<IntroCardProps> = ({ onStartAdhkar, onStartFreeMode, themeId = 'classic' }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-4 py-4 md:py-8 z-50">
      
      {/* Main Card */}
      <div 
        className={`
            relative w-full h-full
            bg-[var(--bg-card)] 
            rounded-3xl border border-[var(--border-color)]
            flex flex-col
            overflow-hidden
            shadow-sm
            animate-fade-in
        `}
      >
        
        {/* TOP HALF - Free Counter Mode */}
        <div 
          className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group hover:bg-[var(--bg-main)]/30 transition-all duration-300"
          onClick={onStartFreeMode}
          role="button"
          tabIndex={0}
        >
          {/* Large Rolling Bead Icon */}
          <div className="transform group-hover:scale-110 transition-transform duration-300">
            <RollingBeadIcon themeId={themeId} size={120} />
          </div>
          
          {/* Title */}
          <h2 className="mt-6 text-2xl md:text-3xl font-bold text-[var(--text-primary)] text-center animate-pulse">
            المسبحة الحرة
          </h2>
          
          {/* Subtitle */}
          <p className="mt-2 text-[var(--text-secondary)] text-sm md:text-base text-center px-4">
            للعد الحر بدون حد
          </p>
        </div>

        {/* CENTRAL DIVIDER with "أو" */}
        <div className="relative h-12 flex items-center justify-center">
          {/* Horizontal Line */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[var(--border-color)]"></div>
          </div>
          
          {/* "أو" Badge */}
          <div className="relative bg-[var(--bg-card)] px-4 z-10">
            <span className="text-lg md:text-xl font-bold text-[var(--text-muted)]">أو</span>
          </div>
        </div>

        {/* BOTTOM HALF - Adhkar Mode */}
        <div 
          className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group hover:bg-[var(--bg-main)]/30 transition-all duration-300"
          onClick={onStartAdhkar}
          role="button"
          tabIndex={0}
        >
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] text-center animate-pulse">
            أذكار الصباح والمساء
          </h2>
          
          {/* Subtitle */}
          <p className="mt-2 text-[var(--text-secondary)] text-sm md:text-base text-center px-4">
            اضغط للبدء في الأذكار اليومية
          </p>
          
          {/* Visual Indicator */}
          <div className="mt-4 flex gap-2 opacity-60">
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--text-primary)] animate-pulse delay-150"></div>
          </div>
        </div>

      </div>

    </div>
  );
};
