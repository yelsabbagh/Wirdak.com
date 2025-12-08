
import React, { useState, useEffect } from 'react';
import { X, Volume2, Smartphone, Bell, Palette, Clock, AlertCircle } from 'lucide-react';
import { AppSettings } from '../types';
import { BEAD_THEMES, SOUND_OPTIONS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (key: keyof AppSettings, value: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
        setPermissionState(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleNotifications = async () => {
      if (!('Notification' in window)) {
          alert("المتصفح لا يدعم التنبيهات");
          return;
      }

      if (settings.notificationsEnabled) {
          // Turning off
          updateSettings('notificationsEnabled', false);
      } else {
          // Turning on - Request Permission if needed
          if (Notification.permission === 'granted') {
              updateSettings('notificationsEnabled', true);
              setPermissionState('granted');
          } else if (Notification.permission !== 'denied') {
              const permission = await Notification.requestPermission();
              setPermissionState(permission);
              if (permission === 'granted') {
                  updateSettings('notificationsEnabled', true);
              }
          } else {
              setPermissionState('denied');
              // Permission previously denied
          }
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[var(--bg-main)] rounded-2xl w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh] border border-[var(--border-color)] transition-colors duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)] sticky top-0 z-10">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">الإعدادات</h2>
          <button onClick={onClose} className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card)] rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">

          {/* Bead Colors */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
              <Palette size={16} /> لون المسبحة
            </label>
            <div className="grid grid-cols-5 gap-3">
              {BEAD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings('beadTheme', theme.id)}
                  title={theme.name}
                  style={{ backgroundColor: theme.colors.textSecondary }}
                  className={`
                    w-10 h-10 rounded-full border-2 transition-all shadow-sm flex items-center justify-center
                    ${settings.beadTheme === theme.id ? 'border-[var(--text-muted)] scale-110 shadow-md ring-2 ring-[var(--bg-card)]' : 'border-transparent'}
                  `}
                >
                  {settings.beadTheme === theme.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Options */}
          <div className="space-y-3">
             <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
                 <Volume2 size={16} /> الصوت
             </label>
             <div className="grid grid-cols-3 gap-2">
                 {SOUND_OPTIONS.map((opt) => (
                     <button
                        key={opt.id}
                        onClick={() => updateSettings('sound', opt.id)}
                        className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                            settings.sound === opt.id
                              ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-white shadow-md'
                              : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-[var(--text-primary)]'
                        }`}
                     >
                         {opt.label}
                     </button>
                 ))}
             </div>
          </div>

          {/* Haptics */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--text-secondary)]">اهتزاز</label>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => updateSettings('vibration', !settings.vibration)}
                className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:brightness-95 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-[var(--text-primary)]" />
                  <span className="text-[var(--text-muted)] font-medium">اهتزاز عند التسبيح</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.vibration ? 'bg-[var(--text-primary)]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${settings.vibration ? 'right-1' : 'right-6'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Notifications / Reminders */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-color)]">
             <label className="text-sm font-bold text-[var(--text-secondary)] flex items-center gap-2">
                 <Bell size={16} /> التذكير اليومي
             </label>
             
             {/* Main Toggle */}
             <button
                onClick={toggleNotifications}
                className="flex items-center justify-between w-full p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:brightness-95 transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[var(--text-primary)]" />
                  <span className="text-[var(--text-muted)] font-medium">تفعيل التنبيهات</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${settings.notificationsEnabled && permissionState === 'granted' ? 'bg-[var(--text-primary)]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${settings.notificationsEnabled && permissionState === 'granted' ? 'right-1' : 'right-6'}`} />
                </div>
              </button>
             
             {/* Blocked Warning */}
             {permissionState === 'denied' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p>تم حظر الإشعارات من المتصفح. يرجى السماح بها من إعدادات الموقع للاستفادة من التذكير.</p>
                </div>
             )}

             {/* Time Pickers (Only show if enabled) */}
             {settings.notificationsEnabled && permissionState === 'granted' && (
                 <div className="space-y-3 mt-2 animate-slide-up">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-sm text-[var(--text-secondary)] font-bold">وقت أذكار الصباح</span>
                        <input 
                            type="time" 
                            value={settings.morningReminderTime}
                            onChange={(e) => updateSettings('morningReminderTime', e.target.value)}
                            className="bg-transparent text-[var(--text-primary)] font-bold outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)]">
                        <span className="text-sm text-[var(--text-secondary)] font-bold">وقت أذكار المساء</span>
                        <input 
                            type="time" 
                            value={settings.eveningReminderTime}
                            onChange={(e) => updateSettings('eveningReminderTime', e.target.value)}
                            className="bg-transparent text-[var(--text-primary)] font-bold outline-none"
                        />
                    </div>
                 </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
