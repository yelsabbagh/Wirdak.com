
import { BeadTheme } from './types';

export const SHARE_DATA = {
  url: "https://wirdak.com",
  text: `🌟 *تطبيق وردك* 🌟\n\nالسلام عليكم ورحمة الله وبركاته،\n\nيسرّنا أن نقدم لكم تطبيق *وردك* البسيط والمفيد لمساعدتكم على تتبّع الأذكار اليومية.\n\n✨ *مميزات التطبيق:*\n- سهل الاستخدام.\n- تصميم هادئ ومريح.\n- يعمل *بدون إنترنت*!\n\nقال رسول الله ﷺ: "*الدَّالُّ على الخير كفاعله*" (رواه مسلم).\n\n🔗 رابط التطبيق:\n`
};

export const BEAD_THEMES: BeadTheme[] = [
  {
    id: 'classic',
    name: 'كلاسيكي (أصلي)',
    colors: {
      bgMain: '#f4f1ea',
      bgCard: '#e8e8e8',
      bgHeader: '#d6d3cc', // Slightly darker than main for header
      textPrimary: '#2a6f6f',
      textSecondary: '#8b5a2b',
      textMuted: '#555555',
      beadPrimary: '#8b5a2b',
      beadSecondary: '#e0d6cc',
      borderColor: '#dcdcdc'
    }
  },
  {
    id: 'ocean',
    name: 'أزرق (محيطي)',
    colors: {
      bgMain: '#caf0f8',
      bgCard: '#90e0ef',
      bgHeader: '#48cae4', // Distinct blue for header
      textPrimary: '#03045e',
      textSecondary: '#0077b6',
      textMuted: '#023e8a',
      beadPrimary: '#0077b6',
      beadSecondary: '#caf0f8',
      borderColor: '#00b4d8'
    }
  },
  {
    id: 'rose',
    name: 'زهري (وردي)',
    colors: {
      bgMain: '#fce4ec',     // Very light pink
      bgCard: '#f8bbd0',     // Light pink card
      bgHeader: '#f48fb1',   // Darker pink header
      textPrimary: '#880e4f', // Deep Magenta (High Contrast)
      textSecondary: '#c2185b', // Medium Dark Pink
      textMuted: '#ad1457',  // Muted dark pink
      beadPrimary: '#c2185b', // Dark pink bead
      beadSecondary: '#fce4ec', // Light pink bead
      borderColor: '#f06292'
    }
  },
  {
    id: 'nature',
    name: 'أخضر (طبيعة)',
    colors: {
      bgMain: '#d8f3dc',
      bgCard: '#b7e4c7',
      bgHeader: '#74c69d', // Medium green header
      textPrimary: '#081c15',
      textSecondary: '#2d6a4f',
      textMuted: '#1b4332',
      beadPrimary: '#1b4332',
      beadSecondary: '#95d5b2',
      borderColor: '#52b788'
    }
  },
  {
    id: 'royal',
    name: 'بنفسجي (ملكي)',
    colors: {
      bgMain: '#e2adf2',
      bgCard: '#d0aee6', // Slightly modified for contrast
      bgHeader: '#c77dff', // Purple header
      textPrimary: '#240046', // Very dark purple
      textSecondary: '#5a189a',
      textMuted: '#7b2cbf',
      beadPrimary: '#5a189a',
      beadSecondary: '#e0aaff',
      borderColor: '#9d4edd'
    }
  }
];

export const SOUND_OPTIONS = [
  { id: 'bead', label: 'خرز' },
  { id: 'soft', label: 'هادئ' },
  { id: 'none', label: 'صامت' },
];
