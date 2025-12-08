
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { AdhkarItem } from '../data/adhkar';
import { BeadSlider } from './BeadSlider';

interface CounterViewProps {
  item: AdhkarItem;
  count: number;
  onIncrement: () => void;
  onReset: () => void;
  themeId: string;
}

export const CounterView: React.FC<CounterViewProps> = ({
  item,
  count,
  onIncrement,
  onReset,
  themeId
}) => {
  const target = item.repetitionCount;
  const progressPercent = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  // Granular font size logic to fit text within the available vertical space
  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len < 50) return "text-4xl md:text-5xl lg:text-6xl leading-normal";
    if (len < 100) return "text-3xl md:text-4xl lg:text-5xl leading-relaxed";
    if (len < 200) return "text-2xl md:text-3xl lg:text-4xl leading-relaxed";
    if (len < 300) return "text-xl md:text-2xl lg:text-3xl leading-relaxed";
    if (len < 500) return "text-lg md:text-xl lg:text-2xl leading-relaxed";
    // For very long texts
    return "text-base md:text-lg lg:text-xl leading-relaxed"; 
  };

  const fontSizeClass = getFontSizeClass(item.arabic);

  return (
    // Increased vertical padding (py-4 md:py-8) to make the card look shorter
    <div className="flex flex-col items-center justify-center h-full w-full max-w-3xl mx-auto px-4 py-4 md:py-8">
      
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
            <div className="w-full flex-grow flex items-center justify-center overflow-y-auto no-scrollbar relative min-h-0">
                <div className="w-full flex flex-col justify-center py-2">
                    <h2 className={`${fontSizeClass} font-bold text-[var(--text-primary)] text-center drop-shadow-sm font-arabic transition-all duration-300`}>
                       {item.arabic}
                    </h2>
                    {item.notes && (
                        <p className="mt-3 text-xs md:text-sm text-[var(--text-muted)] opacity-80 text-center">
                            {item.notes}
                        </p>
                    )}
                </div>
            </div>

            {/* Count Display & Progress */}
            <div className="flex flex-col items-center shrink-0 py-4 md:py-6">
                <span className={`
                    text-6xl md:text-7xl font-bold tracking-tighter drop-shadow-sm leading-none transition-all duration-300
                    ${isComplete ? 'text-green-600 scale-110' : 'text-[var(--text-secondary)]'}
                `}>
                    {count}
                </span>
                
                {/* Target Progress Bar */}
                <div className="mt-4 w-40 h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden shadow-inner">
                    <div 
                        className={`h-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-[var(--text-primary)]'}`} 
                        style={{ width: `${progressPercent}%` }} 
                    />
                </div>

                {/* Reset Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onReset();
                    }}
                    className="mt-2 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] rounded-full transition pointer-events-auto opacity-50 hover:opacity-100"
                    title="إعادة العد للبطاقة الحالية"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>

        {/* BEADS LAYER */}
        <div className="h-24 md:h-32 w-full flex items-center justify-center z-0 opacity-100 pointer-events-none overflow-hidden shrink-0 border-t border-[var(--border-color)]/10">
           <BeadSlider count={count} themeId={themeId} />
        </div>

      </div>
    </div>
  );
};
