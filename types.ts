
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
  targetMode: number; // Kept for backwards compatibility
  beadTheme: string;
  hiddenAdhkarIds: string[];
  
  // Notification Settings
  notificationsEnabled: boolean;
  morningReminderTime: string; // Format "HH:mm"
  eveningReminderTime: string; // Format "HH:mm"
}

export interface Dhikr {
  id: string;
  text: string;
  evidence: string;
  source: string;
  defaultTarget: number;
}

// Re-export for compatibility
export type { AdhkarItem };
