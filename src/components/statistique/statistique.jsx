import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardOverview } from './DashboardApi';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { describeNextStep } from '../../i18n/nextStep';
import { LEVEL_KEY, LEVEL_TONE, READINESS_TONE } from '../../theme/status';
import { Badge, Button, Card, CardTitle, ErrorState, LoadingState, PageHeader, ProgressBar, StatCard } from '../ui/ui';
import Icon from '../ui/Icon';

function Statistique() {
  const { t, name, enumLabel, formatDate } = useI18n();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setPhase('loading');
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
      setPhase('ready');
    } catch (err) {
      setErrorMessage(apiErrorMessage(t, err, 'errors.dashboard'));
      setPhase('error');
    }
  }

  if (phase === 'loading') return <LoadingState />;
  if (phase === 'error') return <ErrorState message={errorMessage} onRetry={load} />;

  const { candidate, attempts, category_stats, latest_test, recent_tests, next_step } = overview;
  const nextStep = describeNextStep(t, name, overview);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.welcome', { name: candidate.full_name })}
        subtitle={t('dashboard.subtitle')}
      />

      {/* ===== الخطوة التالية ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-hero-from to-hero-to p-8 text-on-dark shadow-card">
        <div className="pointer-events-none absolute -end-16 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold tracking-wide text-accent">{t('dashboard.nextStep')}</p>
            <h2 className="mt-1 text-2xl font-extrabold">{nextStep.label}</h2>
            <p className="mt-2 max-w-3xl text-side-ink">{nextStep.reason}</p>
            <div className="mt-4">
              {latest_test ? (
                <Badge tone={READINESS_TONE[latest_test.readiness_status]}>
                  {enumLabel('status.readiness', latest_test.readiness_status)}
                </Badge>
              ) : (
                <span className="text-sm text-side-ink">{t('dashboard.noTests')}</span>
              )}
            </div>
          </div>
          <Button variant="accent" size="lg" onClick={() => navigate(next_step.path)}>
            {t('dashboard.go')}
            <Icon name="chevron" flip />
          </Button>
        </div>
      </section>

      {/* ===== أرقام سريعة ===== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="trophy"
          tone={latest_test ? READINESS_TONE[latest_test.readiness_status] : 'neutral'}
          label={t('dashboard.kpi.lastScore')}
          value={latest_test ? `${latest_test.score_percent}%` : t('common.none')}
        />
        <StatCard icon="exam" label={t('dashboard.kpi.finished')} value={attempts.finished} />
        <StatCard
          icon="clock"
          tone="accent"
          label={t('dashboard.kpi.attempts')}
          value={attempts.final_mock + attempts.practice}
        />
        <StatCard
          icon="user"
          tone="neutral"
          label={t('dashboard.kpi.license')}
          value={candidate.license_category_code}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ===== النسبة لكل صنف + عدد الإجابات ===== */}
        <Card className="xl:col-span-2">
          <CardTitle hint={t('dashboard.levelHint')}>{t('dashboard.levelTitle')}</CardTitle>
          <div className="space-y-5">
            {category_stats.map((cat) => {
              const levelKey = LEVEL_KEY[cat.level];
              const levelTone = LEVEL_TONE[levelKey] || 'neutral';
              return (
                <div key={cat.lesson_category_id}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{name(cat.name_ar)}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-ink-faint" title={t('dashboard.levelHint')}>
                        {cat.correct}/{cat.answered}
                      </span>
                      <span className="w-14 text-end font-extrabold text-ink">{cat.current_score}%</span>
                      <Badge tone={levelTone} className="w-16 justify-center">
                        {enumLabel('status.level', levelKey ?? cat.level)}
                      </Badge>
                    </div>
                  </div>
                  <ProgressBar value={cat.current_score} tone={levelTone} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* ===== معلومات المترشح ===== */}
        <Card>
          <CardTitle>{t('dashboard.infoTitle')}</CardTitle>
          <dl className="space-y-4">
            <InfoItem label={t('dashboard.fullName')} value={candidate.full_name} />
            <InfoItem label={t('dashboard.nationalId')} value={candidate.national_id} />
            <InfoItem
              label={t('dashboard.license')}
              value={`${candidate.license_category_code} — ${name(candidate.license_category_name)}`}
            />
            <InfoItem label={t('dashboard.registeredAt')} value={formatDate(candidate.created_at)} />
          </dl>
        </Card>
      </div>

      {/* ===== آخر الاختبارات مع النتيجة حسب الصنف ===== */}
      <Card>
        <CardTitle>{t('dashboard.recentTitle')}</CardTitle>
        {recent_tests.length === 0 ? (
          <p className="text-ink-faint">{t('dashboard.noRecent')}</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {recent_tests.map((test) => (
              <div key={test.id} className="rounded-xl border border-line bg-surface-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink">{enumLabel('status.testType', test.test_type)}</p>
                    <p className="text-xs text-ink-faint">{formatDate(test.finished_at, true)}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-extrabold text-ink">
                      {test.correct_count}/{test.total_questions}
                      <span className="ms-2 text-sm font-medium text-ink-soft">({test.score_percent}%)</span>
                    </p>
                    <Badge tone={READINESS_TONE[test.readiness_status]} className="mt-1">
                      {enumLabel('status.readiness', test.readiness_status)}
                    </Badge>
                  </div>
                </div>
                {test.categories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {test.categories.map((c) => (
                      <span
                        key={c.lesson_category_id}
                        className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-ink-soft"
                      >
                        {name(c.name_ar)}: <span className="font-bold text-ink">{c.correct}/{c.total}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default Statistique;
