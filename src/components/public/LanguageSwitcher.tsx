'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-purple-50 border border-purple-200/80 rounded-full p-1 text-xs font-semibold shadow-sm">
      <div className="flex items-center gap-1 pl-2 pr-1 text-purple-900/70">
        <Globe className="w-3.5 h-3.5 text-purple-700" />
      </div>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1 rounded-full transition-all duration-200 ${
          language === 'hi'
            ? 'bg-purple-900 text-white shadow-sm font-bold'
            : 'text-purple-900 hover:text-purple-950 font-medium'
        }`}
        title="हिन्दी में देखें"
      >
        हिन्दी
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-purple-900 text-white shadow-sm font-bold'
            : 'text-purple-900 hover:text-purple-950 font-medium'
        }`}
        title="View in English"
      >
        English
      </button>
    </div>
  );
}
