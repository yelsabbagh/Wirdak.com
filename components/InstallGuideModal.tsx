
import React from 'react';
import { X, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallClick: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallClick,
}) => {
  if (!isOpen) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--bg-main)] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-[var(--border-color)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">تثبيت التطبيق</h2>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-28 h-28 bg-[var(--bg-card)] rounded-3xl flex items-center justify-center mb-5 shadow-lg border border-[var(--border-color)]">
              <img src="/icon-192x192.png" alt="App Icon" className="w-24 h-24 rounded-2xl drop-shadow-sm" />
            </div>
            <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
              للحصول على أفضل تجربة، العمل بدون إنترنت، وضمان وصول الإشعارات، يرجى تثبيت التطبيق.
            </p>
          </div>

          {/* Automatic Install Button (Android/Chrome) */}
          {deferredPrompt && (
             <button
                onClick={onInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--text-primary)] text-white rounded-xl font-bold shadow-md active:scale-95 transition"
             >
                <Download size={20} />
                تثبيت الآن
             </button>
          )}

          {/* Manual Instructions */}
          <div className="bg-[var(--bg-card)] rounded-xl p-4 border border-[var(--border-color)] text-sm space-y-4">
             <h3 className="font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2 mb-2">
                خطوات التثبيت اليدوي:
             </h3>

             {isIOS ? (
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="bg-[var(--bg-main)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-[var(--border-color)]">1</span>
                        <p className="text-[var(--text-muted)]">
                           اضغط على زر المشاركة <Share size={14} className="inline mx-1" /> في شريط المتصفح بالأسفل.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-[var(--bg-main)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-[var(--border-color)]">2</span>
                        <p className="text-[var(--text-muted)]">
                           اختر <strong>"إضافة إلى الصفحة الرئيسية"</strong> <PlusSquare size={14} className="inline mx-1" /> من القائمة.
                        </p>
                    </div>
                 </div>
             ) : (
                 <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="bg-[var(--bg-main)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-[var(--border-color)]">1</span>
                        <p className="text-[var(--text-muted)]">
                           اضغط على قائمة المتصفح <MoreVertical size={14} className="inline mx-1" /> (الثلاث نقاط) في الأعلى.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-[var(--bg-main)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-[var(--border-color)]">2</span>
                        <p className="text-[var(--text-muted)]">
                           اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.
                        </p>
                    </div>
                 </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};
