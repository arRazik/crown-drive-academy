import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { startMockExam, submitMockExam } from './MockExamApi';
import { getStoredUser } from '../../auth';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { useShellFocus } from '../layout/shellContext';
import { Button, Card, ErrorState, LoadingState } from '../ui/ui';
import Icon from '../ui/Icon';
import ExamAnswerPanel from './ExamAnswerPanel';
import ExamQuestion from './ExamQuestion';
import ExamResult from './ExamResult';

// مدة الإجابة المسموح بها لكل سؤال (بالثواني) قبل الانتقال التلقائي للسؤال التالي
const QUESTION_TIME_LIMIT = 30;
const EXAM_QUESTION_COUNT = 40;

// يجمع الأسئلة المتتالية التي تشارك نفس question_group_id في خطوة واحدة
function buildSteps(questions) {
  const steps = [];
  let i = 0;
  while (i < questions.length) {
    const q = questions[i];
    if (q.question_group_id) {
      const group = [q];
      let j = i + 1;
      while (j < questions.length && questions[j].question_group_id === q.question_group_id) {
        group.push(questions[j]);
        j++;
      }
      steps.push(group);
      i = j;
    } else {
      steps.push([q]);
      i++;
    }
  }
  return steps;
}

function MockExam() {
  const { t } = useI18n();
  const [candidate] = useState(getStoredUser);
  const location = useLocation();
  const navigate = useNavigate();
  const autoStartedRef = useRef(false);
  const [series, setSeries] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  // العداد لا يبدأ حتى ينتهي تسجيل السؤال الصوتي (كما في الامتحان الحقيقي)
  const [timerStarted, setTimerStarted] = useState(false);

  const timerRef = useRef(null);
  const steps = useMemo(() => buildSteps(questions), [questions]);
  const currentStep = steps[currentStepIndex] || [];

  // أثناء الاختبار يختفي الشريط الجانبي حتى لا يغادر المترشح الاختبار بالخطأ
  useShellFocus(phase === 'running' || phase === 'submitting');

  // اختبار عيّنه المدرّب: يُفتح مباشرة عند الدخول (الانتقال يحمل state.autoStart مرة واحدة)
  useEffect(() => {
    if (!location.state?.autoStart || autoStartedRef.current) return;
    autoStartedRef.current = true;
    navigate(location.pathname, { replace: true, state: null });
    handleStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // سؤال جديد: الوقت كامل، والعداد ينتظر نهاية الصوت (يبدأ فوراً إن لم يكن للسؤال صوت)
  useEffect(() => {
    if (phase !== 'running' || currentStep.length === 0) return;
    setTimeLeft(QUESTION_TIME_LIMIT);
    setTimerStarted(!currentStep[0].audio_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentStepIndex, questions]);

  // عداد الوقت — يشتغل فقط بعد انتهاء الصوت
  useEffect(() => {
    if (phase !== 'running' || currentStep.length === 0 || !timerStarted) return undefined;

    timerRef.current = setInterval(() => {
      setQuestionTimes((prev) => {
        const next = { ...prev };
        for (const q of currentStep) {
          next[q.id] = (next[q.id] || 0) + 1;
        }
        return next;
      });

      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentStepIndex, questions, timerStarted]);

  // عند انتهاء الوقت
  useEffect(() => {
    if (phase !== 'running' || currentStep.length === 0 || !timerStarted) return;
    if (timeLeft !== 0) return;

    if (currentStepIndex < steps.length - 1) {
      goTo(currentStepIndex + 1);
    } else {
      handleFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  async function handleStart() {
    setPhase('loading');
    setErrorMessage('');
    try {
      const data = await startMockExam({ testType: 'final_mock', count: EXAM_QUESTION_COUNT });
      setTestId(data.test_id);
      setSeries(data.series || null);
      setQuestions(data.questions);
      setAnswers({});
      setQuestionTimes({});
      setCurrentStepIndex(0);
      setResult(null);
      setPhase('running');
    } catch (err) {
      setErrorMessage(apiErrorMessage(t, err, 'errors.examStart'));
      setPhase('error');
    }
  }

  function handleSelectOption(question, optionKey) {
    setAnswers((prev) => {
      if (question.is_multi_select) {
        const current = Array.isArray(prev[question.id]) ? prev[question.id] : [];
        const next = current.includes(optionKey)
          ? current.filter((k) => k !== optionKey)
          : [...current, optionKey];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: optionKey };
    });
  }

  function goTo(index) {
    if (index < 0 || index >= steps.length) return;
    setCurrentStepIndex(index);
  }

  async function handleFinish() {
    setPhase('submitting');
    setErrorMessage('');
    try {
      const payload = questions.map((q) => ({
        question_id: q.id,
        selected_option: answers[q.id] || null,
        time_taken_seconds: questionTimes[q.id] || 0,
      }));

      const data = await submitMockExam(testId, payload);
      setResult(data);
      setPhase('finished');
    } catch (err) {
      setErrorMessage(apiErrorMessage(t, err, 'errors.examSubmit'));
      setPhase('running');
    }
  }

  const answeredCount = Object.keys(answers).length;

  if (!candidate) {
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <p className="text-ink-soft">{t('exam.needLogin')}</p>
      </Card>
    );
  }

  const intro = [
    { icon: 'exam', text: t('exam.intro.tileQuestions') },
    { icon: 'clock', text: t('exam.intro.tileTime', { seconds: QUESTION_TIME_LIMIT }) },
    { icon: 'trophy', text: t('exam.intro.tileResult') },
  ];

  return (
    <div>
      {phase === 'idle' && (
        <Card className="grid gap-10 !p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink">{t('exam.intro.title')}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-soft">
              {t('exam.intro.text', { name: candidate.full_name })}
            </p>
            <Button size="lg" onClick={handleStart} className="mt-8">
              {t('exam.intro.start')}
              <Icon name="chevron" flip />
            </Button>
          </div>

          <div className="space-y-3">
            {intro.map((item) => (
              <div key={item.icon} className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
                <p className="font-semibold text-ink">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {phase === 'loading' && <LoadingState label={t('exam.preparing')} />}

      {phase === 'error' && <ErrorState message={errorMessage} onRetry={handleStart} />}

      {(phase === 'running' || phase === 'submitting') && currentStep.length > 0 && (
        <div className="grid min-h-screen content-start gap-6 p-8 lg:grid-cols-[340px_1fr]">
          <ExamAnswerPanel step={currentStep} answers={answers} onSelectOption={handleSelectOption} />
          <ExamQuestion
            step={currentStep}
            stepIndex={currentStepIndex}
            stepsCount={steps.length}
            series={series}
            timeLeft={timeLeft}
            timeLimit={QUESTION_TIME_LIMIT}
            answeredCount={answeredCount}
            questionsCount={questions.length}
            errorMessage={errorMessage}
            isSubmitting={phase === 'submitting'}
            timerStarted={timerStarted}
            onAudioEnded={() => setTimerStarted(true)}
            onNext={() => goTo(currentStepIndex + 1)}
            onFinish={handleFinish}
          />
        </div>
      )}

      {phase === 'finished' && result && <ExamResult result={result} series={result.series || series} testId={testId} onRestart={handleStart} />}
    </div>
  );
}

export default MockExam;
