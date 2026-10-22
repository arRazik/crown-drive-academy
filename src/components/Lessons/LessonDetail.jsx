import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLessonDetail, markLessonReviewed } from './LessonsApi';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { Alert, Button, Card, CardTitle, ErrorState, LoadingState } from '../ui/ui';
import Icon from '../ui/Icon';
import LessonBlocks from './LessonBlocks';

function LessonDetail() {
  const { t } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();

  const [phase, setPhase] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [lesson, setLesson] = useState(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setPhase('loading');
    setReviewed(false);
    setActionError('');
    try {
      const data = await fetchLessonDetail(id);
      setLesson(data.lesson);
      setPhase('ready');
    } catch (err) {
      setErrorMessage(apiErrorMessage(t, err, 'errors.lesson'));
      setPhase('error');
    }
  }

  async function handleMarkReviewed() {
    setActionError('');
    try {
      await markLessonReviewed(id);
      setReviewed(true);
    } catch (err) {
      setActionError(apiErrorMessage(t, err, 'errors.markReviewed'));
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/lessons')}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Icon name="chevron" className="h-4 w-4 -scale-x-100 rtl:scale-x-100" />
        {t('lessons.back')}
      </button>

      {phase === 'loading' && <LoadingState />}
      {phase === 'error' && <ErrorState message={errorMessage} onRetry={load} />}

      {phase === 'ready' && lesson && (
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_320px]">
          <Card className="!p-8">
            <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-ink">{lesson.title}</h1>

            {lesson.media_url && (
              <img
                src={lesson.media_url}
                alt={lesson.title}
                className="mb-6 max-h-[420px] w-full rounded-xl bg-surface-2 object-contain"
              />
            )}

            {/* درس مبني بالبلوكات في لوحة الإدارة → يُعرض كما صُمّم؛ وإلا النص العادي */}
            {Array.isArray(lesson.blocks) && lesson.blocks.length > 0 ? (
              <LessonBlocks blocks={lesson.blocks} />
            ) : (
              <p className="leading-8 whitespace-pre-line text-ink-soft">{lesson.content}</p>
            )}
          </Card>

          <Card className="xl:sticky xl:top-0">
            <CardTitle>{t('lessons.sideTitle')}</CardTitle>
            {lesson.times_reviewed > 0 && (
              <p className="mb-4 text-sm text-ink-soft">{t('lessons.reviewedCount', { count: lesson.times_reviewed })}</p>
            )}
            {actionError && <Alert className="mb-4">{actionError}</Alert>}
            <Button variant="success" size="lg" onClick={handleMarkReviewed} disabled={reviewed} className="w-full">
              {reviewed ? t('lessons.reviewedDone') : t('lessons.markReviewed')}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default LessonDetail;
