import React, { useState } from 'react';
import { useI18n } from '../../i18n/useI18n';
import { LEVEL_KEY, LEVEL_TONE, READINESS_TONE, tone } from '../../theme/status';
import { Badge, Button, Card, CardTitle } from '../ui/ui';
import ReviewModal from './ReviewModal';

// المكوّن 3/3: النتيجة + النسب حسب الصنف + التصحيح: أرقام الأسئلة من 1 إلى الأخير
// (أخضر = صحيح، أحمر = خاطئ). النقر على رقم يفتح نافذة الشرح؛ للأسئلة الخاطئة
// يبدأ الصوت مباشرة والنص يُكتب مع الصوت (ReviewModal).

function ExamResult({ result, series, testId, onRestart }) {
  const { t, name, enumLabel } = useI18n();
  const [openIndex, setOpenIndex] = useState(null);
  // النافذة تُركَّب فوراً (لتبدأ الصوت) لكنها لا تظهر حتى يبدأ الصوت فعلاً
  const [modalVisible, setModalVisible] = useState(false);

  function openQuestion(idx) {
    setModalVisible(false);
    setOpenIndex(idx);
  }

  function closeModal() {
    setOpenIndex(null);
    setModalVisible(false);
  }

  const wrongCount = result.review.filter((r) => !r.is_correct).length;
  const readinessTone = READINESS_TONE[result.readiness_status] || 'neutral';

  return (
    <div className="space-y-6">
      <Card className="grid items-center gap-8 !p-8 lg:grid-cols-[auto_1fr_auto]">
        <p className={`text-center text-7xl font-extrabold tabular-nums ${tone(readinessTone).text}`}>
          {result.score_percent}%
        </p>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">
            {t('result.title')}
            {series && (
              <Badge tone="accent" className="ms-3 align-middle">
                {t('exam.question.series', { n: series.number })}
              </Badge>
            )}
          </h1>
          <p className="mt-1 text-ink-soft">
            {t('result.correctOutOf', { correct: result.correct_count, total: result.total_questions })}
          </p>
          <Badge tone={readinessTone} className="mt-3 !px-4 !py-1.5 !text-sm">
            {enumLabel('status.readiness', result.readiness_status)}
          </Badge>
        </div>
        <Button size="lg" onClick={onRestart}>
          {t('result.restart')}
        </Button>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>{t('result.byCategory')}</CardTitle>
          <div className="space-y-3">
            {result.category_breakdown.map((cat) => {
              const thisTestRows = result.review.filter((r) => r.lesson_category_id === cat.lesson_category_id);
              const thisTestCorrect = thisTestRows.filter((r) => r.is_correct).length;
              const levelKey = LEVEL_KEY[cat.level];
              return (
                <div
                  key={cat.lesson_category_id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface-2 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-ink">{name(cat.name_ar)}</p>
                    <p className="text-xs text-ink-faint">
                      {t('result.inThisTest', { correct: thisTestCorrect, total: thisTestRows.length })}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-extrabold text-ink">{cat.current_score}%</p>
                    <Badge tone={LEVEL_TONE[levelKey] || 'neutral'}>{enumLabel('status.level', levelKey ?? cat.level)}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-ink">{t('result.correctionTitle')}</h2>
            <div className="flex items-center gap-4 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-success" />
                {t('result.legendCorrect', { n: result.correct_count })}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-danger" />
                {t('result.legendWrong', { n: wrongCount })}
              </span>
            </div>
          </div>
          <p className="mb-5 text-sm text-ink-faint">{t('result.hint')}</p>

          <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8">
            {result.review.map((item, idx) => {
              const isLoading = openIndex === idx && !modalVisible;
              return (
                <button
                  key={item.question_id}
                  type="button"
                  onClick={() => openQuestion(idx)}
                  disabled={isLoading}
                  title={item.question_text}
                  className={`relative aspect-square cursor-pointer rounded-xl text-lg font-bold text-on-primary shadow-sm transition-transform hover:scale-105 focus:ring-4 focus:outline-none ${
                    item.is_correct
                      ? 'bg-success hover:bg-success-hover focus:ring-success/25'
                      : 'bg-danger hover:bg-danger-hover focus:ring-danger/25'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary" />
                  ) : (
                    idx + 1
                  )}
                  {!item.is_correct && !isLoading && (
                    <span className="absolute start-1 top-1 text-[10px] opacity-80" aria-hidden="true">🔊</span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {openIndex !== null && (
        <ReviewModal
          items={result.review}
          index={openIndex}
          testId={testId}
          ttsEnabled={result.tts_enabled}
          visible={modalVisible}
          onReady={() => setModalVisible(true)}
          onNavigate={(idx) => setOpenIndex(idx)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default ExamResult;
