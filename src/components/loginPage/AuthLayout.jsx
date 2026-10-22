import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import Icon from '../ui/Icon';
import Logo from '../layout/Logo';
import LanguageSwitch from '../layout/LanguageSwitch';
import { useAppVersion } from '../../useAppVersion';

const FEATURES = ['exams', 'lessons', 'stats'];

// تخطيط صفحتي الدخول والتسجيل: لوحة العلامة (يمين/يسار حسب اللغة) + النموذج
function AuthLayout({ title, subtitle, children }) {
  const { t } = useI18n();
  const version = useAppVersion();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-hero-from to-hero-to p-14 text-on-dark lg:flex">
        <div className="pointer-events-none absolute -end-24 -top-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -start-24 -bottom-32 h-96 w-96 rounded-full bg-on-dark/5 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <Logo size="lg" />
          <div>
            <p className="text-2xl font-extrabold tracking-wide">{t('brand.name')}</p>
            <p className="text-side-ink">{t('brand.tagline')}</p>
          </div>
        </div>

        <div className="relative max-w-xl">
          <h2 className="text-4xl leading-tight font-extrabold">{t('auth.heroTitle')}</h2>
          <p className="mt-4 text-lg text-side-ink">{t('auth.heroText')}</p>
          <ul className="mt-9 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-lg">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-side">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {t(`auth.features.${feature}`)}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-side-ink">
          © {new Date().getFullYear()} {t('brand.name')}
          {version && (
            <>
              {' · '}
              {t('brand.version')} <bdi>{version}</bdi>
            </>
          )}
        </p>
      </section>

      <section className="flex flex-col bg-surface">
        <div className="flex justify-end p-6">
          <div className="w-56">
            <LanguageSwitch />
          </div>
        </div>

        <div className="m-auto w-full max-w-md px-8 pb-16">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo />
            <p className="text-lg font-extrabold tracking-wide text-ink">{t('brand.name')}</p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-2 mb-8 text-ink-soft">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthLayout;
