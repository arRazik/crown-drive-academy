import { LEVEL_KEY } from '../theme/status';

// الباك-إند يرسل next_step بنص عربي جاهز؛ نعيد بناءه من الحقول (action + الصنف +
// النسبة) حتى يظهر بلغة الواجهة. إن جاء action غير معروف نعرض نص السيرفر كما هو.
export function describeNextStep(t, name, overview) {
  const { next_step: step, category_stats: stats, latest_test: latestTest } = overview;

  if (step.action === 'lessons') {
    const category = stats.find((c) => String(c.lesson_category_id) === String(step.lesson_category_id));
    if (category) {
      const vars = { category: name(category.name_ar), score: category.current_score };
      return { label: t('nextStep.lessons.label', vars), reason: t('nextStep.lessons.reason', vars) };
    }
  }

  if (step.action === 'exam') {
    if (!latestTest) {
      return { label: t('nextStep.firstExam.label'), reason: t('nextStep.firstExam.reason') };
    }
    // نفس منطق الباك-إند: يوجد صنف ضعيف مُجاب عنه ← راجع الدروس المطلوبة
    const hasWeak = stats.some((c) => c.answered > 0 && LEVEL_KEY[c.level] === 'weak');
    return {
      label: t('nextStep.exam.label'),
      reason: t(hasWeak ? 'nextStep.exam.afterLessons' : 'nextStep.exam.allGood'),
    };
  }

  return { label: step.label, reason: step.reason };
}
