import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext } from './useI18n';
import { DEFAULT_LANG, LANGS, translations } from './translations';

const STORAGE_KEY = 'crown_drive_lang';

function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return LANGS[stored] ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function lookup(source, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), source);
}

function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);
  const { dir, locale } = LANGS[lang];

  // اتجاه الصفحة واللغة على مستوى المستند كله (RTL للعربية، LTR للفرنسية)
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next) => {
    if (!LANGS[next]) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // التخزين غير متاح — التغيير يبقى للجلسة الحالية فقط
    }
  }, []);

  const value = useMemo(() => {
    const dict = translations[lang];
    const fallback = translations[DEFAULT_LANG];

    function t(key, vars) {
      const text = lookup(dict, key) ?? lookup(fallback, key) ?? key;
      if (typeof text !== 'string' || !vars) return text;
      return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
    }

    // اسم قادم من قاعدة البيانات بالعربية (صنف درس / فئة رخصة) → ترجمته إن وُجدت
    function name(arabicName) {
      return dict.names?.[arabicName] ?? arabicName;
    }

    // قيمة حالة قادمة من الباك-إند (مثل green أو final_mock) → ترجمتها، وإن كانت غير معروفة تُعرض كما هي
    function enumLabel(group, key) {
      return lookup(dict, `${group}.${key}`) ?? lookup(fallback, `${group}.${key}`) ?? String(key);
    }

    // التواريخ تأتي كنص UTC بدون منطقة زمنية (dateStrings في mysql2)
    function formatDate(raw, withTime = false) {
      if (!raw) return t('common.none');
      const date = new Date(`${String(raw).replace(' ', 'T')}Z`);
      const options = withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' };
      return new Intl.DateTimeFormat(locale, options).format(date);
    }

    return { lang, dir, locale, setLang, t, name, enumLabel, formatDate };
  }, [lang, dir, locale, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export default LanguageProvider;
