
import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle, RotateCcw, Share2 } from 'lucide-react';

interface CelebrationProps {
  onRestart: () => void;
  onShare: () => void;
  title: string;
}

export const Celebration: React.FC<CelebrationProps> = ({ onRestart, onShare, title }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={`
        flex flex-col items-center justify-center h-full w-full p-6 text-center animate-fade-in
        ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        transition-all duration-700
    `}>
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[var(--text-secondary)] blur-2xl opacity-20 rounded-full animate-pulse" />
        <CheckCircle size={100} className="text-[var(--text-primary)] relative z-10 drop-shadow-md" />
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
        تقبل الله طاعتكم!
      </h2>
      
      <p className="text-xl text-[var(--text-muted)] mb-10 max-w-md">
        أتممتم {title} بنجاح. جعلها الله في ميزان حسناتكم وحفظكم بها.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onRestart}
            className="
                flex items-center justify-center gap-2 px-8 py-4 
                bg-[var(--text-primary)] text-white 
                rounded-2xl shadow-lg hover:shadow-xl hover:brightness-110 
                transition-all active:scale-95 font-bold text-lg w-full
            "
          >
            <RotateCcw size={24} />
            قراءة مرة أخرى
          </button>
          
          <button
            onClick={onShare}
            className="
                flex items-center justify-center gap-2 px-8 py-3
                bg-transparent text-[var(--text-primary)] border-2 border-[var(--text-primary)]
                rounded-2xl hover:bg-[var(--text-primary)] hover:text-white
                transition-all active:scale-95 font-bold text-lg w-full
            "
          >
            <Share2 size={24} />
            مشاركة الأجر
          </button>
      </div>
    </div>
  );
};
