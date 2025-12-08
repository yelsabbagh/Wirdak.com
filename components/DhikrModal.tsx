
import React from 'react';
import { X } from 'lucide-react';
import { DhikrList } from './DhikrList';

interface DhikrModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDhikrId: string;
  onSelect: (id: string) => void;
}

export const DhikrModal: React.FC<DhikrModalProps> = ({
  isOpen,
  onClose,
  selectedDhikrId,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="
          bg-[var(--bg-main)] w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl 
          shadow-2xl border-t md:border border-[var(--border-color)] 
          h-[85vh] flex flex-col overflow-hidden animate-slide-up transition-colors duration-500
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">اختر الذكر</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto p-2 no-scrollbar bg-[var(--bg-main)]">
          <DhikrList 
            selectedDhikrId={selectedDhikrId} 
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
};
