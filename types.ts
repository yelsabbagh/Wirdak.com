
import { AdhkarItem } from "./data/adhkar";

export interface BeadTheme {
  id: string;
  name: string;
  colors: {
    bgMain: string;
    bgCard: string;
    bgHeader: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    beadPrimary: string;
    beadSecondary: string;
    borderColor: string;
  }
}

export interface AppSettings {
  darkMode: boolean;
  vibration: boolean;
  sound: string; 
  targetMode: number;
  beadTheme: string;
  hiddenAdhkarIds: string[];
  sessionsCompleted: number; // Track how many times user completed all adhkar
  
  // Notification Settings
  notificationsEnabled: boolean;
  morningReminderTime: string; // Format "HH:mm"
  eveningReminderTime: string; // Format "HH:mm"
  
  // Optional 3rd Reminder
  thirdReminderEnabled?: boolean;
  thirdReminderTime?: string;
  thirdReminderLabel?: string;
}

// Re-export for compatibility
export type { AdhkarItem };
