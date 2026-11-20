'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';
import { translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('hi'); // Default to Hindi as on poster

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('satyendra_lang') as Language;
      if (savedLang === 'en' || savedLang === 'hi') {
        setLangState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.lang = 'hi';
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    try {
      localStorage.setItem('satyendra_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {}
  };

  const t = translations[language] || translations['en'];
  const isHindi = language === 'hi';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHindi }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
