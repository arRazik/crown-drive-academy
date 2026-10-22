import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchReviewAudio, fetchReviewWordsProgress } from './MockExamApi';
import { useI18n } from '../../i18n/useI18n';
import { EXPLANATION_DEPTH_TONE } from '../../theme/status';
import { Badge } from '../ui/ui';

// نافذة تصحيح سؤال واحد: الصوت يبدأ مباشرة (بث ElevenLabs بصوت المدرّب)، والنص
// يُكتب كلمة كلمة مع الصوت بدل أن يظهر دفعة واحدة. بدون ElevenLabs نستعمل صوت
// المتصفح (إن وُجد صوت عربي) ويُكتب النص حسب موضع القراءة.
// النافذة لا تظهر حتى يبدأ الصوت (onReady) — كما طُلب: لا فتح قبل وجود الصوت.

// نفس النص الذي يُقرأ بالصوت (يطابق correctionSpeechText في السيرفر) — كلمة "مثال" هنا
// جزء من النص المقروء ويجب أن تبقى عربية ليتطابق توقيت الكلمات، فليست من نصوص الواجهة
function correctionText(item) {
  const examples = item.ai_examples || [];
  return [item.ai_explanation || item.explanation, ...examples.map((e, i) => `مثال ${i + 1}: ${e}`)].join('\n');
}

function loadArabicVoice() {
  const synth = window.speechSynthesis;
  const find = () => synth.getVoices().find((v) => v.lang?.toLowerCase().startsWith('ar')) || null;
  if (synth.getVoices().length > 0) return Promise.resolve(find());
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(find()), 1500);
    synth.addEventListener('voiceschanged', () => {
      clearTimeout(timer);
      resolve(find());
    }, { once: true });
  });
}

// فهرس آخر كلمة بدأت قبل اللحظة t (أو -1)
function wordIndexAt(words, t) {
  let found = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= t) found = i;
    else break;
  }
  return found;
}

// الشرح (السطر 0) والأمثلة (الأسطر 1..) كلمة كلمة: المقروء ظاهر، الحالي ملوَّن،
// والباقي مخفي مع حجز مكانه حتى لا يقفز النص أثناء الكتابة.
function RevealedWords({ words, revealIndex }) {
  const { t } = useI18n();
  const lines = [];
  words.forEach((word, i) => {
    (lines[word.line] ||= []).push({ ...word, i });
  });

  const renderLine = (lineWords = []) =>
    lineWords.map((w) => (
      <span
        key={w.i}
        className={`rounded px-0.5 transition-opacity duration-200 ${
          w.i > revealIndex ? 'opacity-0' : w.i === revealIndex ? 'bg-accent-line text-ink' : 'opacity-100'
        }`}
      >
        {w.text}{' '}
      </span>
    ));

  const [explanationLine, ...exampleLines] = lines;
  const examplesStarted = exampleLines.some((line) => line?.some((w) => w.i <= revealIndex));

  return (
    <>
      <p className="text-ink leading-9 text-[15px]">{renderLine(explanationLine)}</p>
      {exampleLines.length > 0 && (
        <div className={`transition-opacity duration-300 ${examplesStarted ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-semibold text-ink-soft mb-1">{t('review.examples')}</p>
          <ul className="list-disc ps-5 space-y-1 leading-8">
            {exampleLines.map((line, i) => (
              <li key={i}>{renderLine(line)}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

// نص كامل (سؤال صحيح، أو بعد "عرض النص كاملاً")
function FullText({ item }) {
  const { t } = useI18n();
  const examples = item.ai_examples || [];
  return (
    <>
      <p className="text-ink leading-9 text-[15px]">{item.ai_explanation || item.explanation}</p>
      {examples.length > 0 && (
        <div>
          <p className="font-semibold text-ink-soft mb-1">{t('review.examples')}</p>
          <ul className="list-disc ps-5 space-y-1 leading-8">
            {examples.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function TypingDots() {
  const { t } = useI18n();
  return (
    <span className="inline-flex gap-1 py-3" aria-label={t('review.typing')}>
      {[0, 150, 300].map((d) => (
        <span key={d} className="w-2 h-2 rounded-full bg-ink-faint animate-bounce" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}

// كل كم مللي ثانية نسأل السيرفر عن الكلمات الجديدة أثناء التوليد
const WORDS_POLL_MS = 400;

function ReviewModal({ items, index, testId, ttsEnabled, visible, onNavigate, onClose, onReady }) {
  const { t, dir, enumLabel } = useI18n();
  const item = items[index];
  const [status, setStatus] = useState('loading'); // loading | playing | ended | error | no_voice | silent
  const [words, setWords] = useState(null); // توقيت الكلمات (ElevenLabs)
  const [revealIndex, setRevealIndex] = useState(-1);
  const [browserChars, setBrowserChars] = useState(null); // موضع القراءة بصوت المتصفح
  const [showAll, setShowAll] = useState(false);

  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const requestRef = useRef(0);
  const wordsCache = useRef(new Map());

  const stop = useCallback(() => {
    requestRef.current += 1;
    audioRef.current?.pause();
    cancelAnimationFrame(rafRef.current);
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => stop, [stop]);

  // getWords تعيد أحدث كلمات معروفة (تتزايد أثناء التوليد)
  function followAudio(audio, getWords, requestId) {
    const tick = () => {
      if (requestId !== requestRef.current) return;
      setRevealIndex(wordIndexAt(getWords(), audio.currentTime));
      if (!audio.paused && !audio.ended) rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  async function playElevenLabs(requestId) {
    const questionId = item.question_id;
    const streamUrl = await fetchReviewAudio(testId, questionId);
    if (requestId !== requestRef.current) return;

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.src = streamUrl;
    audio.onended = () => {
      if (requestId !== requestRef.current) return;
      cancelAnimationFrame(rafRef.current);
      setStatus('ended');
    };

    // الكلمات تُستطلع تدريجياً بالتوازي مع البث: تظهر الكلمات مع الصوت حتى لو احتاج
    // التوليد ثوانيَ طويلة (النماذج الأعلى جودة)، بدل انتظار اكتماله لعرض أول كلمة
    const cached = wordsCache.current.get(questionId);
    const latest = { words: cached || [] };
    if (cached) setWords(cached);
    let cancelled = false;

    const pollWords = async () => {
      for (;;) {
        let progress;
        try {
          progress = await fetchReviewWordsProgress(testId, questionId);
        } catch {
          return false;
        }
        if (cancelled || requestId !== requestRef.current) return true;
        if (progress.words.length > latest.words.length) {
          latest.words = progress.words;
          setWords(progress.words);
        }
        if (progress.done) {
          if (progress.failed) return false;
          wordsCache.current.set(questionId, progress.words);
          return true;
        }
        await new Promise((resolve) => setTimeout(resolve, WORDS_POLL_MS));
        if (cancelled || requestId !== requestRef.current) return true;
      }
    };
    const polling = cached ? Promise.resolve(true) : pollWords();

    try {
      await audio.play();
    } catch (err) {
      cancelled = true; // فشل البث → نوقف الاستطلاع قبل الرجوع لصوت المتصفح
      throw err;
    }
    if (requestId !== requestRef.current) return;
    setStatus('playing');
    onReady();
    followAudio(audio, () => latest.words, requestId);

    const ok = await polling;
    if (requestId !== requestRef.current) return;
    if (!ok && latest.words.length === 0) setShowAll(true); // بدون توقيت: نعرض النص كاملاً مع الصوت
  }

  async function playBrowser(requestId) {
    const synth = window.speechSynthesis;
    if (!synth) throw new Error('no speechSynthesis');
    const voice = await loadArabicVoice();
    if (requestId !== requestRef.current) return;
    if (!voice) {
      // بدون صوت عربي يقرأ المتصفح الأرقام فقط — نعرض النص كاملاً مع تنبيه
      setStatus('no_voice');
      setShowAll(true);
      onReady();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(correctionText(item));
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.onboundary = (e) => {
      if (requestId === requestRef.current) setBrowserChars(e.charIndex + (e.charLength || 0));
    };
    utterance.onend = () => {
      if (requestId === requestRef.current) setStatus('ended');
    };
    utterance.onerror = () => {
      if (requestId === requestRef.current) {
        setStatus('error');
        setShowAll(true);
      }
    };
    synth.cancel();
    setBrowserChars(0);
    synth.speak(utterance);
    setStatus('playing');
    onReady();
  }

  async function start() {
    stop();
    const requestId = requestRef.current;
    setWords(null);
    setRevealIndex(-1);
    setBrowserChars(null);
    setShowAll(false);

    // سؤال صحيح: لا صوت، النص كاملاً
    if (item.is_correct) {
      setStatus('silent');
      setShowAll(true);
      onReady();
      return;
    }

    setStatus('loading');
    if (ttsEnabled) {
      try {
        await playElevenLabs(requestId);
        return;
      } catch {
        if (requestId !== requestRef.current) return;
        // ElevenLabs فشل — صوت المتصفح بدله
      }
    }
    try {
      await playBrowser(requestId);
    } catch {
      if (requestId === requestRef.current) {
        setStatus('error');
        setShowAll(true);
        onReady();
      }
    }
  }

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // لوحة المفاتيح: Esc يغلق، الأسهم تنتقل (RTL: السهم الأيمن = السابق، وLTR العكس)
  useEffect(() => {
    const prevKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const nextKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === prevKey && index > 0) onNavigate(index - 1);
      if (e.key === nextKey && index < items.length - 1) onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dir, index, items.length, onClose, onNavigate]);

  const depthTone = EXPLANATION_DEPTH_TONE[item.explanation_depth];
  const fullText = correctionText(item);
  const isTyping = !showAll && status !== 'ended';
  const correctAnswer = item.is_multi_select ? (item.correct_options || []).join(t('common.listSeparator')) : item.correct_option;

  let body;
  if (showAll || status === 'silent') {
    body = <FullText item={item} />;
  } else if (words) {
    body = <RevealedWords words={words} revealIndex={status === 'ended' ? words.length : revealIndex} />;
  } else if (browserChars !== null) {
    const shown = status === 'ended' ? fullText : fullText.slice(0, browserChars);
    body = (
      <p className="text-ink leading-9 text-[15px] whitespace-pre-line">
        {shown}
        <span className="opacity-0">{fullText.slice(shown.length)}</span>
      </p>
    );
  } else {
    body = <TypingDots />;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* الرأس */}
        <div className="flex items-center gap-3 border-b border-line px-6 py-4">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-on-primary ${
              item.is_correct ? 'bg-success' : 'bg-danger'
            }`}
          >
            {index + 1}
          </span>
          <p className="flex-1 text-sm leading-6 font-semibold text-ink">{item.question_text}</p>
          <button
            onClick={onClose}
            className="h-9 w-9 cursor-pointer rounded-lg text-ink-faint hover:bg-surface-2 hover:text-ink"
            aria-label={t('review.close')}
          >
            ✕
          </button>
        </div>

        {/* المحتوى */}
        <div className="space-y-4 overflow-y-auto px-6 py-5">
          {item.image_url && (
            <img
              src={item.image_url}
              alt={t('exam.question.imageAlt')}
              className="max-h-56 w-full rounded-xl border border-line bg-surface-2 object-contain"
            />
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div
              className={`rounded-xl px-3 py-2 ${
                item.is_correct ? 'bg-success-soft text-success-ink' : 'bg-danger-soft text-danger-ink'
              }`}
            >
              <p className="text-xs opacity-70">{t('review.yourAnswer')}</p>
              <p className="font-bold">{item.candidate_answer || t('review.noAnswer')}</p>
            </div>
            <div className="rounded-xl bg-success-soft px-3 py-2 text-success-ink">
              <p className="text-xs opacity-70">{t('review.correctAnswer')}</p>
              <p className="font-bold">{correctAnswer}</p>
            </div>
          </div>

          <div className="rounded-xl border border-line p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-ink">{t('review.explanation')}</span>
              {depthTone && <Badge tone={depthTone}>{enumLabel('status.depth', item.explanation_depth)}</Badge>}
              {status === 'playing' && (
                <span className="ms-auto flex items-center gap-1 text-xs text-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> {t('review.reading')}
                </span>
              )}
            </div>
            {body}
          </div>

          {item.ai_images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {item.ai_images.map((img) => (
                <figure key={img.id} className="rounded-lg border border-line p-1">
                  <img src={img.url} alt={img.title} className="h-24 w-full object-contain" />
                  <figcaption className="mt-1 text-center text-xs text-ink-faint">{img.title}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {status === 'no_voice' && <p className="text-xs text-danger-ink">{t('review.noVoice')}</p>}
          {status === 'error' && <p className="text-xs text-danger-ink">{t('review.audioError')}</p>}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-2 border-t border-line px-6 py-3">
          {!item.is_correct && (
            <>
              {status === 'playing' ? (
                <button
                  onClick={() => { stop(); setStatus('ended'); }}
                  className="cursor-pointer rounded-lg bg-surface-2 px-3 py-1.5 text-sm hover:bg-line"
                >
                  {t('review.stop')}
                </button>
              ) : (
                <button
                  onClick={start}
                  disabled={status === 'loading'}
                  className="cursor-pointer rounded-lg bg-primary-soft px-3 py-1.5 text-sm text-primary-ink hover:bg-primary-line disabled:opacity-50"
                >
                  {t('review.replay')}
                </button>
              )}
              {isTyping && (
                <button
                  onClick={() => setShowAll(true)}
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-ink-soft hover:bg-surface-2"
                >
                  {t('review.showAll')}
                </button>
              )}
            </>
          )}
          <div className="ms-auto flex gap-2">
            <button
              onClick={() => onNavigate(index - 1)}
              disabled={index === 0}
              className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2 disabled:opacity-40"
            >
              {t('review.prev')}
            </button>
            <button
              onClick={() => onNavigate(index + 1)}
              disabled={index === items.length - 1}
              className="cursor-pointer rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2 disabled:opacity-40"
            >
              {t('review.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
