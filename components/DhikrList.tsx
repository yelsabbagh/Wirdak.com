
import React from 'react';
import { DHIKR_LIST } from '../constants';

interface DhikrListProps {
  selectedDhikrId: string;
  onSelect: (id: string) => void;
}

export const DhikrList: React.FC<DhikrListProps> = ({ selectedDhikrId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-3 p-4">
      {DHIKR_LIST.map((dhikr) => (
        <button
          key={dhikr.id}
          onClick={() => onSelect(dhikr.id)}
          className={`
            w-full text-right p-5 rounded-2xl border transition-all duration-200 flex flex-col h-full group
            ${
              selectedDhikrId === dhikr.id
                ? 'bg-[var(--text-primary)] border-[var(--text-secondary)] text-white shadow-lg transform scale-[1.01]'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--text-primary)] hover:shadow-md'
            }
          `}
        >
          <p
            className={`text-lg md:text-xl font-bold leading-relaxed mb-2 ${
              selectedDhikrId === dhikr.id ? 'text-white' : 'text-[var(--text-primary)]'
            }`}
          >
            {dhikr.text}
          </p>
          <div
            className={`mt-auto pt-3 border-t border-dashed w-full text-sm leading-relaxed ${
              selectedDhikrId === dhikr.id
                ? 'border-white/30 text-white/90'
                : 'border-[var(--border-color)] text-[var(--text-muted)]'
            }`}
          >
            {dhikr.evidence}
            <strong
              className={`block mt-1 font-normal text-xs ${
                selectedDhikrId === dhikr.id ? 'text-white/80' : 'text-[var(--text-secondary)]'
              }`}
            >
              ({dhikr.source})
            </strong>
          </div>
        </button>
      ))}
    </div>
  );
};
