import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/useI18n';
import { clearSession, getStoredUser } from '../../auth';
import { logoutCandidate } from '../loginPage/Candidatesapi';
import Icon from '../ui/Icon';
import Logo from './Logo';
import LanguageSwitch from './LanguageSwitch';
import { useAppVersion } from '../../useAppVersion';

const NAV_ITEMS = [
  { to: '/statistique', icon: 'chart', labelKey: 'nav.dashboard' },
  { to: '/lessons', icon: 'book', labelKey: 'nav.lessons' },
  { to: '/mock-exam', icon: 'exam', labelKey: 'nav.exam' },
];

function Sidebar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const user = getStoredUser();
  const version = useAppVersion();

  async function handleLogout() {
    try {
      await logoutCandidate();
    } catch {
      // نتابع تسجيل الخروج محلياً حتى لو فشل الطلب
    } finally {
      clearSession();
      navigate('/login');
    }
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-side text-side-ink">
      <div className="flex items-center gap-3 border-b border-side-line px-5 py-6">
        <Logo />
        <div className="min-w-0">
          <p className="text-[15px] leading-tight font-extrabold tracking-wide text-on-dark">{t('brand.name')}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                isActive ? 'bg-side-active text-on-dark' : 'hover:bg-side-hover hover:text-on-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} className={`h-5 w-5 ${isActive ? 'text-accent' : ''}`} />
                {t(item.labelKey)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-3 border-t border-side-line p-4">
        <LanguageSwitch dark />

        <div className="flex items-center gap-3 rounded-xl bg-side-hover px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-extrabold text-side">
            {(user?.full_name || '?').trim().charAt(0).toUpperCase()}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-on-dark">{user?.full_name}</p>
          <button
            type="button"
            onClick={handleLogout}
            title={t('nav.logout')}
            aria-label={t('nav.logout')}
            className="cursor-pointer rounded-lg p-2 text-side-ink transition-colors hover:bg-side-active hover:text-on-dark"
          >
            <Icon name="logout" className="h-5 w-5 rtl:-scale-x-100" />
          </button>
        </div>

        {version && (
          <p className="text-center text-xs text-side-ink">
            {t('brand.version')} <bdi>{version}</bdi>
          </p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
