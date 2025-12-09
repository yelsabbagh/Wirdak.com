import React from 'react';
import { RotateCcw, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { AdhkarItem } from '../data/adhkar';
import { ObliqueBeadLoop } from './ObliqueBeadLoop';

interface CounterViewProps {
  item: AdhkarItem;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  onBack?: () => void; // Optional back button
  onShowVirtue: (item: AdhkarItem) => void;
  themeId: string;
  canGoBack?: boolean; // Whether back button should be shown
}

export const CounterView: React.FC<CounterViewProps> = ({
  item,
  count,
  onIncrement,
  onReset,
  onBack,
  onShowVirtue,
  themeId,
  canGoBack = false
}) => {
  const target = item.repetitionCount;
  const progressPercent = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  // Balanced font size logic - not too big for short text
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    // Cap at text-3xl to avoid giant text for short adhkar
    if (len < 80) return "text-2xl md:text-3xl";
    if (len < 150) return "text-xl md:text-2xl lg:text-3xl";
    if (len < 250) return "text-lg md:text-xl lg:text-2xl";
    if (len < 400) return "text-base md:text-lg lg:text-xl";
    if (len < 600) return "text-sm md:text-base lg:text-lg";
    // For very long texts
    return "text-sm md:text-base"; 
  };

  const fontSizeClass = getFontSizeClass(item.arabic);

  return (
    // Increased vertical padding (py-4 md:py-8) to make the card look shorter
    <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-2 md:px-4 py-4 md:py-8">
      
      {/* Main Counter Card - Shadow removed */}
      <div 
        className={`
            relative w-full h-full
            bg-[var(--bg-card)] 
            rounded-3xl border border-[var(--border-color)]
            flex flex-col
            overflow-hidden
            cursor-pointer outline-none select-none
            transition-colors duration-500
            animate-smooth-appear
        `}
        style={{ opacity: 0.2 }}
        onClick={(e) => {
             if((e.target as HTMLElement).closest('button')) return;
             onIncrement();
        }}
        role="button"
        tabIndex={0}
      >
        
        {/* TOP INFO BAR */}
        <div 
            className="w-full h-14 px-4 flex justify-between items-center z-10 border-b border-[var(--border-color)]/30 shrink-0"
        >
             {/* Back Button - Top Right (RTL) - Always visible on mobile, conditional on desktop */}
             <button
               onClick={(e) => {
                 e.stopPropagation();
                 if (onBack) onBack();
               }}
               className={`flex md:${canGoBack ? 'flex' : 'hidden'} p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] rounded-full transition`}
               title="رجوع للذكر السابق"
             >
               <ChevronRight size={20} />
             </button>
             
             <div className="text-sm font-bold text-[var(--text-secondary)] truncate max-w-[70%]">
                {item.source || 'ذكر'}
             </div>

             <div className="px-3 py-1 rounded-full bg-[var(--bg-main)] text-[var(--text-muted)] text-xs font-medium border border-[var(--border-color)] shrink-0">
                الهدف: {target}
             </div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 w-full flex-grow flex flex-col items-center px-4 pt-4 pb-0 pointer-events-none overflow-hidden">
            
            {/* Adhkar Text Container */}
            {/* Fix: Use pointer-events-auto to allow scrolling */}
            {/* Fix: Use flex-grow with inner min-h-full to prevent clipping when centering overflowed content */}
            <div className="w-full flex-grow overflow-y-auto no-scrollbar relative min-h-0 pointer-events-auto">
                <div className="w-full flex flex-col items-center justify-start py-4">
                    <div className={`${fontSizeClass} font-bold text-[var(--text-primary)] text-center drop-shadow-sm transition-all duration-300 w-full ${item.isQuran ? 'quran-text' : 'arabic-text'}`}>
                       <span>{item.arabic}</span>
                       
                       {/* Virtue Button (Inline with text) */}
                       {item.evidence && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowVirtue(item);
                            }}
                            className="mr-2 pointer-events-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-main)]/50 hover:bg-[var(--text-primary)] hover:text-white text-[var(--text-muted)] text-[10px] md:text-xs transition-all opacity-80 hover:opacity-100 border border-[var(--border-color)]/50 align-middle"
                          >
                            <Info size={12} />
                            <span>الفضل</span>
                          </button>
                       )}
                    </div>

                    {item.notes && (
                        <p className="mt-3 text-xs md:text-sm text-[var(--text-muted)] opacity-80 text-center shrink-0">
                            {item.notes}
                        </p>
                    )}
                </div>
            </div>

            {/* Count Display & Progress - Layered above beads - Elevated */}
            {/* Increased bottom margin for even more elevation, adjusted for desktop */}
            <div className="relative z-20 flex flex-col items-center shrink-0 py-4 md:py-6 mb-40 md:mb-48 w-full">
                <span className={`
                    text-6xl md:text-7xl font-bold tracking-tighter drop-shadow-sm leading-none transition-all duration-300
                    ${isComplete ? 'text-green-600 scale-110' : 'text-[var(--text-secondary)]'}
                `}>
                    {count}
                </span>
                
                {/* Target Progress Bar */}
                <div className="mt-4 w-40 h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-[var(--text-primary)]'}`} 
                        style={{ width: `${progressPercent}%` }} 
                    />
                </div>


            </div>
        </div>

        {/* BEADS LAYER - Absolute Floating Position */}
        <div className="absolute bottom-20 left-0 w-full h-[220px] flex items-center justify-center z-10 opacity-100 pointer-events-none overflow-visible">
           <ObliqueBeadLoop count={count} themeId={themeId} xRadius={260} beadSize={48} />
        </div>

      </div>
    </div>
  );
};