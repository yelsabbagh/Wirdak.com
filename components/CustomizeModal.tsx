
import React from 'react';
import { X, Check } from 'lucide-react';
import { AdhkarCollection } from '../data/adhkar';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: AdhkarCollection;
  hiddenIds: string[];
  onToggle: (id: string) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  collection,
  hiddenIds,
  onToggle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--bg-main)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden h-[85vh] flex flex-col border border-[var(--border-color)]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">تخصيص الأذكار</h2>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-6">
          {collection.sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3 sticky top-0 bg-[var(--bg-main)] py-2 border-b border-[var(--border-color)]">
                  {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const isHidden = hiddenIds.includes(item.id);
                  const isChecked = !isHidden;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => onToggle(item.id)}
                      className={`
                        w-full text-right p-3 rounded-xl border transition-all flex items-start gap-3
                        ${isChecked 
                            ? 'bg-[var(--bg-card)] border-[var(--border-color)]' 
                            : 'opacity-50 border-transparent bg-gray-100 dark:bg-gray-800'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 mt-1 transition-colors
                        ${isChecked ? 'bg-[var(--text-primary)] border-[var(--text-primary)]' : 'border-gray-400 bg-transparent'}
                      `}>
                         {isChecked && <Check size={16} className="text-white" />}
                      </div>
                      
                      <div className="flex-grow">
                          <p className={`text-sm leading-relaxed ${isChecked ? 'text-[var(--text-primary)]' : 'text-gray-500'}`}>
                              {item.arabic.substring(0, 80)}...
                          </p>
                          <span className="text-xs text-[var(--text-muted)] mt-1 block">تكرار: {item.repetitionCount}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-[var(--border-color)]">
            <button 
                onClick={onClose}
                className="w-full py-3 bg-[var(--text-primary)] text-white rounded-xl font-bold shadow-md active:scale-95 transition"
            >
                حفظ وإغلاق
            </button>
        </div>

      </div>
    </div>
  );
};
