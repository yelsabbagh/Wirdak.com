
import React from 'react';
import { AdhkarItem } from '../data/adhkar';
import { Check } from 'lucide-react';

interface VerticalProgressProps {
  items: AdhkarItem[];
  currentIndex: number;
}

export const VerticalProgress: React.FC<VerticalProgressProps> = ({ items, currentIndex }) => {
  return (
    <div className="h-full flex flex-col items-center py-8 w-12 md:w-16">
      <div className="flex-grow flex flex-col items-center justify-between w-full relative">
        {/* The line connecting the dots */}
        <div className="absolute top-2 bottom-2 w-0.5 bg-[var(--border-color)] z-0" />

        {items.map((item, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div 
                key={item.id} 
                className="relative z-10 flex-shrink-0 flex items-center justify-center bg-[var(--bg-main)]"
                title={item.id}
            >
              {isCompleted && (
                <div className="w-5 h-5 rounded-full bg-[var(--text-primary)] text-white flex items-center justify-center shadow-sm animate-fade-in ring-4 ring-[var(--bg-main)]">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              
              {isCurrent && (
                <div className="w-6 h-6 rounded-full border-4 border-[var(--text-secondary)] bg-[var(--bg-main)] shadow-md ring-4 ring-[var(--bg-main)] animate-pulse" />
              )}
              
              {isPending && (
                <div className="w-3 h-3 rounded-full bg-[var(--border-color)] ring-4 ring-[var(--bg-main)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
