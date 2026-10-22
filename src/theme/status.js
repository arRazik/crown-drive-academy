// ربط الحالات القادمة من الباك-إند بنبرة لونية واحدة (tone)، وربط كل نبرة بأصناف
// Tailwind. الألوان نفسها معرّفة في src/theme.css فقط.

export const TONES = {
  primary: {
    soft: 'bg-primary-soft text-primary-ink border-primary-line',
    solid: 'bg-primary text-on-primary',
    bar: 'bg-primary',
    text: 'text-primary',
  },
  accent: {
    soft: 'bg-accent-soft text-accent-ink border-accent-line',
    solid: 'bg-accent text-ink',
    bar: 'bg-accent',
    text: 'text-accent-ink',
  },
  success: {
    soft: 'bg-success-soft text-success-ink border-success-line',
    solid: 'bg-success text-on-primary',
    bar: 'bg-success',
    text: 'text-success',
  },
  warning: {
    soft: 'bg-warning-soft text-warning-ink border-warning-line',
    solid: 'bg-warning text-on-primary',
    bar: 'bg-warning',
    text: 'text-warning',
  },
  danger: {
    soft: 'bg-danger-soft text-danger-ink border-danger-line',
    solid: 'bg-danger text-on-primary',
    bar: 'bg-danger',
    text: 'text-danger',
  },
  neutral: {
    soft: 'bg-surface-2 text-ink-soft border-line',
    solid: 'bg-ink-soft text-on-primary',
    bar: 'bg-line-strong',
    text: 'text-ink-soft',
  },
};

export function tone(name) {
  return TONES[name] || TONES.neutral;
}

// readiness_status: green | orange | red
export const READINESS_TONE = { green: 'success', orange: 'warning', red: 'danger' };

// level يصل من الباك-إند بالعربية (جيد / متوسط / ضعيف) — نحوّله لمفتاح ثابت
export const LEVEL_KEY = { 'جيد': 'good', 'متوسط': 'medium', 'ضعيف': 'weak' };
export const LEVEL_TONE = { good: 'success', medium: 'warning', weak: 'danger' };

export const LESSON_STATUS_TONE = {
  open_priority: 'danger',
  open_normal: 'primary',
  locked_mastered: 'success',
};

export const EXPLANATION_DEPTH_TONE = { normal: 'primary', deep: 'accent' };
