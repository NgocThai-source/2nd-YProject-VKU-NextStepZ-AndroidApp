/**
 * Comprehensive Languages Database
 * Contains world languages with proficiency levels
 */

export interface Language {
  name: string;
  nativeName: string;
  code: string;
  flag: string;
}

export interface LanguageProficiency {
  language: Language;
  level: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native/Bilingual';
  levelScore: number; // 1-5
}

export const PROFICIENCY_LEVELS = [
  { label: 'Sơ Cấp', value: 'Sơ Cấp', score: 1, description: 'Có thể hiểu cơ bản' },
  { label: 'Sử Dụng Giới Hạn', value: 'Sử Dụng Giới Hạn', score: 2, description: 'Giao tiếp cơ bản' },
  { label: 'Chuyên Môn', value: 'Chuyên Môn', score: 3, description: 'Làm việc hiệu quả' },
  { label: 'Chuyên Môn Đầy Đủ', value: 'Chuyên Môn Đầy Đủ', score: 4, description: 'Thông thạo' },
  { label: 'Bản Xứ / Song Ngữ', value: 'Bản Xứ / Song Ngữ', score: 5, description: 'Trôi chảy như người bản xứ' },
];

export const LANGUAGES: Language[] = [
  // Most Common Languages
  { name: 'English', nativeName: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'Mandarin Chinese', nativeName: '中文', code: 'zh', flag: '🇨🇳' },
  { name: 'Spanish', nativeName: 'Español', code: 'es', flag: '🇪🇸' },
  { name: 'French', nativeName: 'Français', code: 'fr', flag: '🇫🇷' },
  { name: 'German', nativeName: 'Deutsch', code: 'de', flag: '🇩🇪' },
  { name: 'Japanese', nativeName: '日本語', code: 'ja', flag: '🇯🇵' },
  { name: 'Korean', nativeName: '한국어', code: 'ko', flag: '🇰🇷' },
  { name: 'Portuguese', nativeName: 'Português', code: 'pt', flag: '🇵🇹' },
  { name: 'Russian', nativeName: 'Русский', code: 'ru', flag: '🇷🇺' },
  { name: 'Italian', nativeName: 'Italiano', code: 'it', flag: '🇮🇹' },
  { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
  { name: 'Arabic', nativeName: 'العربية', code: 'ar', flag: '🇸🇦' },
  { name: 'Vietnamese', nativeName: 'Tiếng Việt', code: 'vi', flag: '🇻🇳' },
  { name: 'Thai', nativeName: 'ไทย', code: 'th', flag: '🇹🇭' },
  { name: 'Turkish', nativeName: 'Türkçe', code: 'tr', flag: '🇹🇷' },
  { name: 'Polish', nativeName: 'Polski', code: 'pl', flag: '🇵🇱' },
  { name: 'Dutch', nativeName: 'Nederlands', code: 'nl', flag: '🇳🇱' },
  { name: 'Swedish', nativeName: 'Svenska', code: 'sv', flag: '🇸🇪' },
  { name: 'Norwegian', nativeName: 'Norsk', code: 'no', flag: '🇳🇴' },
  { name: 'Danish', nativeName: 'Dansk', code: 'da', flag: '🇩🇰' },
  
  // Additional European Languages
  { name: 'Finnish', nativeName: 'Suomi', code: 'fi', flag: '🇫🇮' },
  { name: 'Czech', nativeName: 'Čeština', code: 'cs', flag: '🇨🇿' },
  { name: 'Hungarian', nativeName: 'Magyar', code: 'hu', flag: '🇭🇺' },
  { name: 'Romanian', nativeName: 'Română', code: 'ro', flag: '🇷🇴' },
  { name: 'Greek', nativeName: 'Ελληνικά', code: 'el', flag: '🇬🇷' },
  { name: 'Bulgarian', nativeName: 'Български', code: 'bg', flag: '🇧🇬' },
  { name: 'Serbian', nativeName: 'Српски', code: 'sr', flag: '🇷🇸' },
  { name: 'Croatian', nativeName: 'Hrvatski', code: 'hr', flag: '🇭🇷' },
  { name: 'Ukrainian', nativeName: 'Українська', code: 'uk', flag: '🇺🇦' },
  { name: 'Icelandic', nativeName: 'Íslenska', code: 'is', flag: '🇮🇸' },
  
  // Asian Languages
  { name: 'Indonesian', nativeName: 'Bahasa Indonesia', code: 'id', flag: '🇮🇩' },
  { name: 'Malay', nativeName: 'Bahasa Melayu', code: 'ms', flag: '🇲🇾' },
  { name: 'Filipino', nativeName: 'Filipino', code: 'fil', flag: '🇵🇭' },
  { name: 'Bengali', nativeName: 'বাংলা', code: 'bn', flag: '🇧🇩' },
  { name: 'Burmese', nativeName: 'မြန်မာ', code: 'my', flag: '🇲🇲' },
  { name: 'Khmer', nativeName: 'ខ្មែរ', code: 'km', flag: '🇰🇭' },
  { name: 'Lao', nativeName: 'ລາວ', code: 'lo', flag: '🇱🇦' },
  { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', code: 'pa', flag: '🇮🇳' },
  { name: 'Urdu', nativeName: 'اردو', code: 'ur', flag: '🇵🇰' },
  { name: 'Farsi', nativeName: 'فارسی', code: 'fa', flag: '🇮🇷' },
  { name: 'Hebrew', nativeName: 'עברית', code: 'he', flag: '🇮🇱' },
  
  // African Languages
  { name: 'Swahili', nativeName: 'Kiswahili', code: 'sw', flag: '🇹🇿' },
  { name: 'Amharic', nativeName: 'አማርኛ', code: 'am', flag: '🇪🇹' },
  { name: 'Hausa', nativeName: 'Hausa', code: 'ha', flag: '🇳🇬' },
  { name: 'Yoruba', nativeName: 'Yorùbá', code: 'yo', flag: '🇳🇬' },
  { name: 'Zulu', nativeName: 'isiZulu', code: 'zu', flag: '🇿🇦' },
  { name: 'Afrikaans', nativeName: 'Afrikaans', code: 'af', flag: '🇿🇦' },
];

export interface LanguageSkill {
  id: string;
  language: Language;
  proficiency: (typeof PROFICIENCY_LEVELS)[number]['value'];
  levelScore: number;
}

export interface LanguagesData {
  items: LanguageSkill[];
}

export function getAllLanguages(): Language[] {
  return LANGUAGES;
}

export function searchLanguages(query: string): Language[] {
  const lowerQuery = query.toLowerCase();
  return LANGUAGES.filter((lang) =>
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.nativeName.toLowerCase().includes(lowerQuery) ||
    lang.code.toLowerCase().includes(lowerQuery)
  );
}

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.code.toLowerCase() === code.toLowerCase());
}

export function getLanguageByName(name: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.name.toLowerCase() === name.toLowerCase());
}

export function getProficiencyLabel(score: number): string {
  const level = PROFICIENCY_LEVELS.find((l) => l.score === score);
  return level?.label || 'Unknown';
}

export function getProficiencyScore(level: string): number {
  const proficiency = PROFICIENCY_LEVELS.find((l) => l.value === level);
  return proficiency?.score || 0;
}
