
import React, { useState, useMemo } from 'react';
import { X, Check, Info, CheckCheck } from 'lucide-react';
import { AdhkarCollection, AdhkarItem } from '../data/adhkar';
import { VirtueModal } from './VirtueModal';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: AdhkarCollection;
  hiddenIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], show: boolean) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  collection,
  hiddenIds,
  onToggle,
  onToggleAll
}) => {
  const [viewingVirtue, setViewingVirtue] = useState<AdhkarItem | null>(null);

  const allIds = useMemo(() => {
    return collection.sections.flatMap(s => s.items.map(i => i.id));
  }, [collection]);

  const isAllSelected = useMemo(() => {
    // Check if ALL ids are NOT in hiddenIds (meaning all are visible)
    return allIds.every(id => !hiddenIds.includes(id));
  }, [allIds, hiddenIds]);

  if (!isOpen) return null;

  return (
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-[var(--bg-main)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden h-[85vh] flex flex-col border border-[var(--border-color)]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)] shrink-0">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">اختر أذكارك</h2>
            
            <div className="flex items-center gap-2">
                 <button 
                  onClick={() => onToggleAll(allIds, !isAllSelected)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--text-primary)] hover:text-white transition-colors"
                 >
                   {isAllSelected ? (
                     <>
                        <span>إلغاء تحديد الكل</span>
                     </>
                   ) : (
                     <>
                       <CheckCheck size={14} />
                       <span>تحديد الكل</span>
                     </>
                   )}
                 </button>

                 <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-full transition">
                    <X size={20} />
                 </button>
            </div>
            </div>

            {/* List - Added no-scrollbar class here */}
            <div className="flex-grow overflow-y-auto px-4 pb-4 pt-0 space-y-0 no-scrollbar">
            {collection.sections.map((section, idx) => (
                <div key={idx}>
                <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3 sticky top-0 bg-[var(--bg-main)] py-2 border-b border-[var(--border-color)] z-10">
                    {section.title}
                </h3>
                <div className="space-y-3">
                    {section.items.map((item) => {
                    const isHidden = hiddenIds.includes(item.id);
                    const isChecked = !isHidden;
                    
                    return (
                        <button
                        key={item.id}
                        onClick={() => onToggle(item.id)}
                        className={`
                            w-full text-right p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 group relative overflow-hidden
                            ${isChecked 
                                ? 'bg-[var(--bg-card)] border-[var(--border-color)] shadow-md opacity-100' 
                                : 'bg-gray-100/50 dark:bg-gray-800/30 border-transparent opacity-60 hover:opacity-80'
                            }
                        `}
                        >
                        {/* Checkbox */}
                        <div className={`
                            shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-1
                            ${isChecked ? 'bg-[var(--text-primary)] border-[var(--text-primary)]' : 'border-[var(--text-muted)]/40'}
                        `}>
                            {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                            <p className={`text-base font-medium leading-relaxed whitespace-normal ${isChecked ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                {item.arabic}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className="text-xs text-[var(--text-muted)] opacity-80">
                                    تكرار: {item.repetitionCount}
                                </span>
                                
                                {/* Virtue Pill */}
                                {(item.evidence) && (
                                    <div 
                                    role="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewingVirtue(item);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--text-muted)]/30 text-[var(--text-muted)] text-xs hover:bg-[var(--text-primary)] hover:text-white hover:border-[var(--text-primary)] transition-colors cursor-pointer"
                                    >
                                    <Info size={14} />
                                    <span className="font-bold">الفضل</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        </button>
                    );
                    })}
                </div>
                </div>
            ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)] shrink-0">
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-[var(--text-primary)] text-white rounded-xl font-bold shadow-md active:scale-95 transition text-lg"
                >
                    حفظ
                </button>
            </div>

        </div>
        </div>

        {/* Virtue Modal */}
        <VirtueModal 
            isOpen={!!viewingVirtue}
            onClose={() => setViewingVirtue(null)}
            item={viewingVirtue}
        />
    </>
  );
};
