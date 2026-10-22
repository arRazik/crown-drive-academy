import React from 'react';
import { tone as toneOf } from '../../theme/status';
import { useI18n } from '../../i18n/useI18n';
import Icon from './Icon';

// مكوّنات الواجهة المشتركة. الألوان تأتي من src/theme.css عبر الأسماء الدلالية فقط.

const BUTTON_VARIANTS = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  success: 'bg-success text-on-primary hover:bg-success-hover',
  accent: 'bg-accent text-ink hover:bg-accent-hover',
  soft: 'bg-primary-soft text-primary-ink hover:bg-primary-line',
  outline: 'bg-surface text-ink border border-line hover:bg-surface-2',
  ghost: 'text-ink-soft hover:bg-surface-2',
};

const BUTTON_SIZES = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...props}
    />
  );
}

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-6 shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, hint }) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-3">
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </div>
  );
}

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneOf(tone).soft} ${className}`}
    >
      {children}
    </span>
  );
}

export function Alert({ tone = 'danger', className = '', children }) {
  return (
    <div role="alert" className={`rounded-xl border px-4 py-3 text-sm ${toneOf(tone).soft} ${className}`}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, tone = 'primary', className = '' }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-line ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${toneOf(tone).bar}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1.5 text-ink-soft">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function StatCard({ icon, label, value, tone = 'primary' }) {
  return (
    <Card className="flex items-center gap-4 !p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneOf(tone).soft}`}>
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm text-ink-soft">{label}</p>
        <p className="truncate text-2xl font-extrabold text-ink">{value}</p>
      </div>
    </Card>
  );
}

export function Spinner({ className = 'h-6 w-6' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-line-strong border-t-primary ${className}`}
      aria-hidden="true"
    />
  );
}

export function LoadingState({ label }) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-ink-soft">
      <Spinner className="h-9 w-9" />
      <p>{label || t('common.loading')}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  const { t } = useI18n();
  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <Alert className="mb-5">{message}</Alert>
      {onRetry && <Button onClick={onRetry}>{t('common.retry')}</Button>}
    </Card>
  );
}

export const inputClass =
  'w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15';

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}
