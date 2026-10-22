import { createContext, useContext } from 'react';

export const I18nContext = createContext(null);

// يعيد { lang, dir, locale, setLang, t, name, enumLabel, formatDate }
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <LanguageProvider>');
  return value;
}
