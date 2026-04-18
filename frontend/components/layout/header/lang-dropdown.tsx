'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface LangDropdownProps {
  scrolled: boolean;
}

const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function LangDropdown({ scrolled }: LangDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('vi');

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    // TODO: Implement language change logic in context/localStorage
    // localStorage.setItem('lang', code);
    // dispatch or update language context
    setIsOpen(false);
  };

  const current = LANGUAGES.find((l) => l.code === selectedLang);

  return (
    <div className="relative group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          scrolled
            ? 'text-gray-300 hover:bg-white/5 hover:text-white'
            : 'text-gray-400 hover:bg-white/5 hover:text-cyan-300'
        }`}
        aria-label="Select language"
        style={{ fontFamily: "'Exo 2 Medium', sans-serif" }}
      >
        <span>{current?.flag}</span>
        <span className="hidden sm:inline whitespace-nowrap">{current?.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-2 w-48 rounded-lg bg-slate-900 border border-white/10 shadow-xl overflow-hidden transition-all duration-200 origin-top ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors duration-200 flex items-center gap-3 ${
              selectedLang === lang.code
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
            style={{ fontFamily: "'Poppins Regular', sans-serif" }}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
            {selectedLang === lang.code && (
              <span className="ml-auto text-cyan-400">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
