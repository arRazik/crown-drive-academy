import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import { LANGS } from '../../i18n/translations';

// مبدّل اللغة: العربية | Français. `dark` للخلفيات الداكنة (الشريط الجانبي).
function LanguageSwitch({ dark = false }) {
  const { lang, setLang, t } = useI18n();

  const track = dark ? 'bg-side-hover' : 'bg-surface-2 border border-line';
  const active = dark ? 'bg-accent text-side' : 'bg-primary text-on-primary';
  const idle = dark ? 'text-side-ink hover:text-on-dark' : 'text-ink-soft hover:text-ink';

  return (
    <div className={`flex rounded-xl p-1 ${track}`} role="group" aria-label={t('lang.label')}>
      {Object.keys(LANGS).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`flex-1 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            lang === code ? active : idle
          }`}
        >
          {t(`lang.${code}`)}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitch;
