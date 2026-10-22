import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLessonsBoard } from './LessonsApi';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { LESSON_STATUS_TONE } from '../../theme/status';
import { Badge, Card, ErrorState, LoadingState, PageHeader, ProgressBar } from '../ui/ui';
import Icon from '../ui/Icon';

function LessonsBoard() {
  const { t, name, enumLabel } = useI18n();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setPhase('loading');
    try {
      const data = await fetchLessonsBoard();
      setCategories(data.categories);
      setPhase('ready');
    } catch (err) {
      setErrorMessage(apiErrorMessage(t, err, 'errors.lessons'));
      setPhase('error');
    }
  }

  return (
    <div>
      <PageHeader title={t('lessons.title')} subtitle={t('lessons.subtitle')} />

      {phase === 'loading' && <LoadingState />}
      {phase === 'error' && <ErrorState message={errorMessage} onRetry={load} />}

      {phase === 'ready' && (
        <div className="grid items-start gap-6 xl:grid-cols-2">
          {categories.map((category) => {
            const total = category.lessons.length;
            const mastered = category.lessons.filter((l) => l.status === 'locked_mastered').length;
            return (
              <Card key={category.lesson_category_id}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-ink">{name(category.name_ar)}</h2>
                  <span className="text-xs text-ink-faint">{t('lessons.progress', { done: mastered, total })}</span>
                </div>
                <ProgressBar value={total ? (mastered / total) * 100 : 0} tone="success" className="mb-5" />

                {total === 0 ? (
                  <p className="text-sm text-ink-faint">{t('lessons.empty')}</p>
                ) : (
                  <div className="space-y-2">
                    {category.lessons.map((lesson) => {
                      const status = LESSON_STATUS_TONE[lesson.status] ? lesson.status : 'open_normal';
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => navigate(`/lessons/${lesson.id}`)}
                          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-start transition-colors hover:border-primary-line hover:bg-primary-soft"
                        >
                          <span className="flex items-center gap-2 font-medium text-ink">
                            {status === 'locked_mastered' && <Icon name="lock" className="h-4 w-4 text-success" />}
                            {lesson.title}
                          </span>
                          <Badge tone={LESSON_STATUS_TONE[status]}>{enumLabel('status.lesson', status)}</Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LessonsBoard;
