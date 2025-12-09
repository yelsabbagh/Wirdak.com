
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Settings, Share2, Sun, Moon, AlertTriangle, ListChecks } from 'lucide-react';
import { SHARE_DATA, BEAD_THEMES } from './constants';
import { AppSettings, AdhkarItem } from './types';
import { MORNING_ADHKAR, EVENING_ADHKAR } from './data/adhkar';
import { SettingsModal } from './components/SettingsModal';
import { CounterView } from './components/CounterView';
import { CustomizeModal } from './components/CustomizeModal';
import { VerticalProgress } from './components/VerticalProgress';
import { Celebration } from './components/Celebration';
import { InstallGuideModal } from './components/InstallGuideModal';
import { VirtueModal } from './components/VirtueModal';

function App() {
  // --- 1. SETTINGS & STATE ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings_v2');
    const parsed = saved ? JSON.parse(saved) : {};
    
    // Migration/Defaults
    let soundValue = 'bead';
    if (parsed.sound) {
      if (['click', 'beep'].includes(parsed.sound)) {
         soundValue = 'bead';
      } else {
         soundValue = parsed.sound;
      }
    }

    return {
      darkMode: parsed.darkMode || false,
      vibration: parsed.vibration !== undefined ? parsed.vibration : true,
      sound: soundValue,
      targetMode: 0, 
      beadTheme: parsed.beadTheme || 'classic',
      hiddenAdhkarIds: parsed.hiddenAdhkarIds || [],
      
      // Default Notification Settings
      notificationsEnabled: parsed.notificationsEnabled || false,
      morningReminderTime: parsed.morningReminderTime || "05:00",
      eveningReminderTime: parsed.eveningReminderTime || "17:00"
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [mainScreenVirtueItem, setMainScreenVirtueItem] = useState<AdhkarItem | null>(null);
  const [isInstalled, setIsInstalled] = useState(true); // Default true to avoid flash
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };
    
    checkInstalled();
    window.addEventListener('resize', checkInstalled);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If the event fires, we are definitely not installed
      setIsInstalled(false);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', checkInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
        // No system prompt available, just show instructions
        setIsInstallModalOpen(true);
        return;
    }
    
    // Try system prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    }
  };
  
  // --- 2. TIME & COLLECTION LOGIC ---
  const [isMorning, setIsMorning] = useState<boolean>(true);

  // Check time on mount and setup interval for Morning/Evening detection
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Morning: 3:00 AM (3) to 11:59 AM (11)
      const morning = hour >= 3 && hour < 12;
      setIsMorning(morning);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // --- 3. NOTIFICATION SCHEDULER ---
  const lastNotificationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!settings.notificationsEnabled) return;

    const checkNotifications = () => {
        if (!("Notification" in window)) return;
        if (Notification.permission !== "granted") return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTimeString = `${hours}:${minutes}`;

        // Prevent duplicate notifications in the same minute
        if (lastNotificationRef.current === currentTimeString) return;

        let title = "";
        let body = "";

        if (currentTimeString === settings.morningReminderTime) {
            title = "أذكار الصباح";
            body = "حان الآن موعد أذكار الصباح. ألا بذكر الله تطمئن القلوب.";
        } else if (currentTimeString === settings.eveningReminderTime) {
            title = "أذكار المساء";
            body = "حان الآن موعد أذكار المساء. حافظ على وردك اليومي.";
        }

        if (title) {
            try {
                new Notification(title, {
                    body: body,
                    icon: './icon-192x192.png', // Use relative path to PNG
                    tag: 'adhkar-reminder'
                });
                lastNotificationRef.current = currentTimeString;
            } catch (e) {
                console.error("Notification failed", e);
            }
        }
    };

    const interval = setInterval(checkNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [settings.notificationsEnabled, settings.morningReminderTime, settings.eveningReminderTime]);


  const currentCollection = isMorning ? MORNING_ADHKAR : EVENING_ADHKAR;

  // Flatten the collection items for sequential navigation
  const allItems = useMemo(() => {
    return currentCollection.sections.flatMap(section => section.items);
  }, [currentCollection]);

  // Filter out hidden items
  const activeItems = useMemo(() => {
    return allItems.filter(item => !settings.hiddenAdhkarIds.includes(item.id));
  }, [allItems, settings.hiddenAdhkarIds]);

  // --- 4. PROGRESS LOGIC ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Reset when collection changes (Morning <-> Evening)
  useEffect(() => {
    setCurrentIndex(0);
    setCurrentCount(0);
    setIsFinished(false);
  }, [isMorning]);

  // Ensure index is valid if items are hidden dynamically
  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
        setCurrentIndex(activeItems.length - 1);
    }
  }, [activeItems.length, currentIndex]);

  const currentItem = activeItems[currentIndex];

  // Save Settings
  useEffect(() => {
    localStorage.setItem('appSettings_v2', JSON.stringify(settings));
  }, [settings]);


  // --- 5. THEME STYLES ---
  const currentTheme = useMemo(() => 
    BEAD_THEMES.find(t => t.id === settings.beadTheme) || BEAD_THEMES[0]
  , [settings.beadTheme]);

  const themeStyle = {
    '--bg-main': currentTheme.colors.bgMain,
    '--bg-card': currentTheme.colors.bgCard,
    '--bg-header': currentTheme.colors.bgHeader,
    '--text-primary': currentTheme.colors.textPrimary,
    '--text-secondary': currentTheme.colors.textSecondary,
    '--text-muted': currentTheme.colors.textMuted,
    '--bead-primary': currentTheme.colors.beadPrimary,
    '--bead-secondary': currentTheme.colors.beadSecondary,
    '--border-color': currentTheme.colors.borderColor,
  } as React.CSSProperties;


  // --- 6. AUDIO & HAPTICS ---
  const playSound = useCallback((type: string) => {
    if (type === 'none') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === 'soft') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.connect(gain);
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start();
        osc.stop(now + 0.15);
    } else if (type === 'bead') {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        osc.type = 'sawtooth';
        osc.connect(filter);
        filter.connect(gain);
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start();
        osc.stop(now + 0.08);
    }
  }, []);

  const playCompletionSound = useCallback(() => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext || settings.sound === 'none') return;
      
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      
      // A pleasant major chord arpeggio
      [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = freq;
          osc.connect(gain);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.3);
      });
      
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
  }, [settings.sound]);


  // --- 7. ACTIONS ---
  const handleIncrement = () => {
    if (!currentItem || isFinished) return;

    // Feedback
    if (settings.vibration && navigator.vibrate) navigator.vibrate(15);
    playSound(settings.sound);

    const target = currentItem.repetitionCount;
    const nextCount = currentCount + 1;
    setCurrentCount(nextCount);

    if (nextCount >= target) {
        // Card Complete
        if (settings.vibration && navigator.vibrate) navigator.vibrate([30, 30]);
        
        if (currentIndex < activeItems.length - 1) {
            // Move to next
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                setCurrentCount(0);
            }, 500); // Increased delay slightly for better "completion" feel before transition
        } else {
            // All Done
            playCompletionSound();
            setTimeout(() => setIsFinished(true), 500);
        }
    }
  };

  const handleResetCurrent = () => {
      setCurrentCount(0);
  };

  const handleRestart = () => {
      setIsFinished(false);
      setCurrentIndex(0);
      setCurrentCount(0);
  };

  const toggleHiddenId = (id: string) => {
      setSettings(prev => {
          const current = prev.hiddenAdhkarIds;
          const exists = current.includes(id);
          return {
              ...prev,
              hiddenAdhkarIds: exists ? current.filter(x => x !== id) : [...current, id]
          };
      });
  };

  // Share logic
  const shareGeneric = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'المسبحة الإلكترونية',
                  text: `شاركوني قراءة ${currentCollection.title} عبر تطبيق المسبحة الإلكترونية.\n${SHARE_DATA.url}`,
                  url: SHARE_DATA.url
              });
          } catch (err) { console.log(err); }
      } else {
          navigator.clipboard.writeText(SHARE_DATA.url);
          alert('تم نسخ الرابط!');
      }
  };

  return (
    <div 
        className="fixed inset-0 flex flex-col overflow-hidden bg-[var(--bg-main)] transition-colors duration-500"
        style={themeStyle}
    >
      
      {/* --- INSTALL WARNING BANNER --- */}
      {!isInstalled && (
        <div 
          onClick={() => setIsInstallModalOpen(true)}
          className="bg-red-100 text-red-800 text-xs md:text-sm p-2 text-center cursor-pointer flex items-center justify-center gap-2 font-bold z-50 shadow-sm border-b border-red-200"
        >
          <AlertTriangle size={14} className="shrink-0 animate-pulse" />
          <span>التطبيق غير مثبت. اضغط هنا لتثبيته للعمل بدون إنترنت</span>
        </div>
      )}

      {/* HEADER */}
      <header className="px-4 py-3 flex justify-between items-center z-30 bg-[var(--bg-header)]/80 backdrop-blur-md shadow-sm transition-colors duration-500">
        <div className="flex items-center gap-3">
            <img 
              src="./icon-192x192.png" 
              alt="المسبحة" 
              className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-sm" 
            />
            <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm px-2 py-1 rounded-full bg-white/20">
                {isMorning ? <Sun size={14} /> : <Moon size={14} />}
                <span>{isMorning ? 'الصباح' : 'المساء'}</span>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsCustomizeOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl hover:bg-[var(--bg-main)] hover:border-[var(--text-primary)] transition shadow-sm whitespace-nowrap"
            >
                <ListChecks size={18} />
                <span>اختر أذكارك</span>
            </button>
            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-[var(--text-primary)] hover:bg-black/5 rounded-lg transition"
                title="الإعدادات"
            >
                <Settings size={22} />
            </button>
            <button onClick={shareGeneric} className="p-2 text-[var(--text-primary)] hover:bg-black/5 rounded-lg transition">
                <Share2 size={22} />
            </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex relative w-full max-w-5xl mx-auto overflow-hidden">
        
        {/* Right Sidebar: Vertical Progress (RTL) */}
        <div className="flex-shrink-0 z-20 h-full overflow-y-auto no-scrollbar">
            {!isFinished && (
                <VerticalProgress items={activeItems} currentIndex={currentIndex} />
            )}
        </div>

        {/* Center: Card Area - Removed padding to allow full fill */}
        <div className="flex-grow relative flex items-center justify-center overflow-hidden">
            {isFinished ? (
                <Celebration 
                    onRestart={handleRestart} 
                    onShare={shareGeneric}
                    title={currentCollection.title} 
                />
            ) : (
                currentItem ? (
                    <CounterView 
                        key={currentItem.id} // Key forces re-render on change => animation
                        item={currentItem}
                        count={currentCount}
                        onIncrement={handleIncrement}
                        onReset={handleResetCurrent}
                        onShowVirtue={(item) => setMainScreenVirtueItem(item)}
                        themeId={settings.beadTheme}
                    />
                ) : (
                    <div className="text-center text-[var(--text-muted)]">
                        <p>لا توجد أذكار مختارة.</p>
                        <button onClick={() => setIsCustomizeOpen(true)} className="mt-4 underline">تعديل القائمة</button>
                    </div>
                )
            )}
        </div>

      </main>

      {/* Footer / Copyright */}
      <footer className="text-center py-2 text-[10px] md:text-xs text-[var(--text-muted)] opacity-60">
        © المسبحة الإلكترونية
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={(k, v) => {
            setSettings(p => ({...p, [k]: v}));
            if (k === 'sound' && v !== 'none') playSound(v);
        }}
      />

      <CustomizeModal 
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        collection={currentCollection}
        hiddenIds={settings.hiddenAdhkarIds}
        onToggle={toggleHiddenId}
      />
      
      <InstallGuideModal 
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallClick={handleInstallClick}
      />

      <VirtueModal 
         isOpen={!!mainScreenVirtueItem}
         onClose={() => setMainScreenVirtueItem(null)}
         item={mainScreenVirtueItem}
      />
    </div>
  );
}

export default App;
