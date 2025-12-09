
import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { AdhkarItem } from '../data/adhkar';

interface VirtueModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AdhkarItem | null;
}

export const VirtueModal: React.FC<VirtueModalProps> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-[var(--bg-main)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-color)] animate-smooth-appear"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Icon Area */}
        <div className="flex flex-col items-center pt-8 pb-4 bg-[var(--bg-card)]/50">
             <div className="w-16 h-16 rounded-full bg-[var(--text-primary)] flex items-center justify-center shadow-lg text-white mb-3">
                 <BookOpen size={32} />
             </div>
             <h3 className="text-xl font-bold text-[var(--text-primary)]">فضل الذكر</h3>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
            <div className="w-full h-px bg-[var(--border-color)] my-4 opacity-50" />
            
            <p className="text-lg text-[var(--text-secondary)] leading-loose text-center font-medium">
                {item.evidence || "لا يوجد نص للفضل متاح حالياً."}
            </p>

            {/* Source Box */}
            {item.reference && (
                <div className="mt-6 flex justify-center">
                    <span className="bg-gray-100 dark:bg-white/10 text-[var(--text-muted)] text-sm px-4 py-1.5 rounded-lg border border-[var(--border-color)] font-medium">
                        {item.reference}
                    </span>
                </div>
            )}
        </div>

        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-[var(--text-muted)] hover:bg-black/5 rounded-full transition"
        >
            <X size={20} />
        </button>

      </div>
    </div>
  );
};
