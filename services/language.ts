import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { type LangCode, type TranslationKey, t as translate, LANGUAGES } from '../constants/i18n';

// Перевіряємо що збережена мова валідна
function isValidLang(l: string): l is LangCode {
  return LANGUAGES.some((lang) => lang.code === l);
}

const STORAGE_KEY = 'bloombook_lang';

// Глобальна змінна — одна для всього додатку
let currentLang: LangCode = (() => {
  if (Platform.OS === 'web') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isValidLang(saved)) return saved;
    } catch {}
  }
  return 'uk';
})();

// Список компонентів що слухають зміни
const listeners = new Set<() => void>();

function persistLang(lang: LangCode) {
  if (Platform.OS === 'web') {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }
}

export function setGlobalLang(lang: LangCode) {
  currentLang = lang;
  persistLang(lang);
  listeners.forEach((fn) => fn());
}

export function useLanguage() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const fn = () => forceUpdate((n) => n + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  return {
    lang: currentLang,
    setLang: setGlobalLang,
    t: (key: TranslationKey) => translate(currentLang, key),
  };
}

// Залишаємо для сумісності зі старим кодом
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return children as any;
}
