import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { Alert, Badge, Button, Card, ProgressBar } from '../ui/ui';
import ExamTimer from './ExamTimer';

// المكوّن 2/3: عمود السؤال الحالي — العدّاد، شريط التقدم، الصورة/الصوت، النص، والتنقل
function ExamQuestion({
  step,
  stepIndex,
  stepsCount,
  series,
  timeLeft,
  timeLimit,
  answeredCount,
  questionsCount,
  errorMessage,
  isSubmitting,
  timerStarted,
  onAudioEnded,
  onNext,
  onFinish,
}) {
  const { t } = useI18n();
  const isLastStep = stepIndex >= stepsCount - 1;
  const first = step[0];

  // صوت السؤال: يُشغَّل تلقائياً، وعند انتهائه يبدأ العداد. إن منع المتصفح
  // التشغيل التلقائي نعرض زر تشغيل؛ وإن تعذّر تحميل الصوت يبدأ العداد مباشرة.
  const audioRef = useRef(null);
  const [audioBlocked, setAudioBlocked] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!first.audio_url || !audio) return undefined;
    setAudioBlocked(false);
    audio.currentTime = 0;
    // NotAllowedError = المتصفح منع التشغيل التلقائي؛ AbortError (تشغيل أُلغي
    // بإعادة التحميل أو بـ StrictMode) ليس منعاً فلا نعرض الزر
    audio.play().catch((err) => {
      if (err?.name === 'NotAllowedError') setAudioBlocked(true);
    });
    return () => audio.pause();
  }, [first.id, first.audio_url]);

  useEffect(() => {
    if (isSubmitting) audioRef.current?.pause();
  }, [isSubmitting]);

  function playManually() {
    setAudioBlocked(false);
    audioRef.current?.play().catch(() => onAudioEnded());
  }

  return (
    <Card className="!p-8">
      {/* معلومات علوية: رقم السؤال + العداد الدائري */}
      <div className="mb-6 flex items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-extrabold text-ink">
            {t('exam.question.position', { current: stepIndex + 1, total: stepsCount })}
            {series && (
              <Badge tone="accent" className="ms-3 align-middle">
                {t('exam.question.series', { n: series.number })}
              </Badge>
            )}
          </p>
          <p className="mt-1 text-sm text-ink-faint">
            {t('exam.question.answered', { answered: answeredCount, total: questionsCount })}
          </p>
          <ProgressBar value={((stepIndex + 1) / stepsCount) * 100} className="mt-3 max-w-md" />
        </div>
        <ExamTimer timeLeft={timeLeft} timeLimit={timeLimit} started={timerStarted} />
      </div>

      {errorMessage && <Alert className="mb-4">{errorMessage}</Alert>}

      {first.image_url && (
        <img
          src={first.image_url}
          alt={t('exam.question.imageAlt')}
          className="mb-6 max-h-[45vh] w-full rounded-xl border border-line bg-surface-2 object-contain"
        />
      )}

      {first.audio_url && (
        <audio
          key={first.id}
          ref={audioRef}
          src={first.audio_url}
          preload="auto"
          onPlaying={() => setAudioBlocked(false)}
          onEnded={onAudioEnded}
          onError={onAudioEnded}
          hidden
        />
      )}

      {audioBlocked && !timerStarted && (
        <button
          type="button"
          onClick={playManually}
          className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primary-line bg-primary-soft py-3 font-semibold text-primary-ink hover:bg-primary-line"
        >
          {t('exam.question.listen')}
        </button>
      )}

      <div className="mb-8 space-y-6">
        {step.map((question, qIdx) => (
          <div key={question.id} className="flex items-start gap-4">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
              {stepIndex + 1}
            </span>
            <p className="pt-1 text-xl leading-9 font-semibold text-ink">
              {step.length > 1 && <span className="me-2 text-primary">{qIdx + 1}.</span>}
              {question.question_text}
            </p>
          </div>
        ))}
      </div>

      {/* أزرار التنقل */}
      <div className="flex items-center justify-between">
        {!isLastStep ? (
          <Button size="lg" onClick={onNext}>
            {t('exam.question.next')}
          </Button>
        ) : (
          <Button variant="success" size="lg" onClick={onFinish} disabled={isSubmitting}>
            {isSubmitting ? t('exam.question.finishing') : t('exam.question.finish')}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ExamQuestion;
