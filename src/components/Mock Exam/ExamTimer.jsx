import React from 'react';
import { useI18n } from '../../i18n/useI18n';

// عدّاد دائري: حلقة تتناقص مع الوقت والثواني في الوسط. اللون يتغير حسب الوقت
// المتبقي (أساسي → برتقالي → أحمر)، ويُنبض في آخر 10 ثوانٍ. قبل انتهاء صوت
// السؤال يعرض حالة "استمع للسؤال" والحلقة ممتلئة (العداد لم يبدأ بعد).

const SIZE = 104;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const WARNING_RATIO = 0.5;
const DANGER_SECONDS = 10;

function formatTime(seconds) {
  if (seconds < 60) return String(seconds);
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function SoundBars() {
  return (
    <span className="flex h-5 items-end gap-0.5" aria-hidden="true">
      {[0, 150, 300, 450].map((delay) => (
        <span
          key={delay}
          className="w-1 animate-[soundbar_0.9s_ease-in-out_infinite] rounded-full bg-primary"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}

function ExamTimer({ timeLeft, timeLimit, started }) {
  const { t } = useI18n();
  const ratio = started ? Math.max(0, timeLeft / timeLimit) : 1;
  const danger = started && timeLeft <= DANGER_SECONDS;
  const warning = started && !danger && ratio <= WARNING_RATIO;

  const color = !started ? 'text-line-strong' : danger ? 'text-danger' : warning ? 'text-warning' : 'text-primary';
  const label = !started ? t('exam.timer.listen') : danger ? t('exam.timer.danger') : t('exam.timer.remaining');

  return (
    <div className="flex items-center gap-4" role="timer" aria-live="polite">
      <div className={`relative ${danger ? 'animate-pulse' : ''}`} style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-line"
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
            className={`${color} transition-[stroke-dashoffset,color] duration-1000 ease-linear`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {started ? (
            <>
              <span className={`text-3xl leading-none font-extrabold tabular-nums ${danger ? 'text-danger-ink' : 'text-ink'}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="mt-1 text-[10px] text-ink-faint">
                {timeLeft < 60 ? t('exam.timer.seconds') : t('exam.timer.minutes')}
              </span>
            </>
          ) : (
            <SoundBars />
          )}
        </div>
      </div>
      <div className="hidden sm:block">
        <p className={`text-sm font-bold ${danger ? 'text-danger-ink' : started ? 'text-ink' : 'text-primary'}`}>{label}</p>
        <p className="text-xs text-ink-faint">
          {started ? t('exam.timer.outOf', { time: formatTime(timeLimit) }) : t('exam.timer.startsAfterAudio')}
        </p>
      </div>
    </div>
  );
}

export default ExamTimer;
