import React from 'react';
import { useI18n } from '../../i18n/useI18n';
import { Card } from '../ui/ui';

// ===== دالة مساعدة: تحويل key إلى رقم =====
function getAnswerNumber(question, key) {
  const keys = Object.keys(question.options || {});
  const idx = keys.indexOf(key);
  return idx >= 0 ? idx + 1 : null;
}

// المكوّن 1/3: اللوحة الجانبية لاختيار رقم الجواب لكل سؤال في الخطوة الحالية
function ExamAnswerPanel({ step, answers, onSelectOption }) {
  const { t } = useI18n();

  // نص "إجابتك"
  function getAnswerLabel(question, selectedValue) {
    if (question.is_multi_select && Array.isArray(selectedValue)) {
      if (selectedValue.length === 0) return t('exam.answerPanel.none');
      return selectedValue.map((key) => getAnswerNumber(question, key)).join(t('common.listSeparator'));
    }

    if (!selectedValue) return t('exam.answerPanel.none');
    return getAnswerNumber(question, selectedValue);
  }

  return (
    <aside className="h-fit lg:sticky lg:top-8">
      <Card>
        <h3 className="mb-4 text-sm font-bold tracking-wide text-ink-soft uppercase">{t('exam.answerPanel.title')}</h3>

        <div className="space-y-6">
          {step.map((question) => {
            const selectedValue = answers[question.id];

            return (
              <div key={question.id} className="rounded-xl border border-primary-line bg-primary-soft p-4">
                <p className="mb-4 text-sm font-semibold text-ink">
                  {question.is_multi_select ? t('exam.answerPanel.pickMany') : t('exam.answerPanel.pickOne')}
                </p>

                <div className="flex flex-wrap gap-3">
                  {Object.keys(question.options || {}).map((key, optionIndex) => {
                    const answerNumber = optionIndex + 1;
                    const selected = question.is_multi_select
                      ? Array.isArray(selectedValue) && selectedValue.includes(key)
                      : selectedValue === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onSelectOption(question, key)}
                        title={t('exam.answerPanel.pickTitle', { n: answerNumber })}
                        className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-xl border-2 text-xl font-extrabold transition-all ${
                          selected
                            ? 'scale-105 border-primary bg-primary text-on-primary shadow-md'
                            : 'border-line-strong bg-surface text-ink hover:border-primary hover:bg-primary-soft'
                        }`}
                      >
                        {answerNumber}
                      </button>
                    );
                  })}
                </div>

                {/* الإجابة المختارة */}
                <div className="mt-4 text-sm">
                  <span className="text-ink-soft">{t('exam.answerPanel.yourAnswer')}</span>
                  <span className="ms-2 font-extrabold text-primary">{getAnswerLabel(question, selectedValue)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}

export default ExamAnswerPanel;
