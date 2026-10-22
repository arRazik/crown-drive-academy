// رسائل الأخطاء بلغة الواجهة: رسائل السيرفر بلغة واحدة (وأحياناً فرنسية) فلا نعرضها
// مباشرة؛ نختار نصاً محلياً حسب حالة HTTP. overrides = { [status]: مفتاح ترجمة }
// لحالات خاصة بصفحة معيّنة (مثل 401 في تسجيل الدخول).
export function apiErrorMessage(t, err, fallbackKey, overrides = {}) {
  const status = err?.response?.status;
  if (!err?.response) return t('errors.network');
  if (overrides[status]) return t(overrides[status]);
  if (status === 429) return t('errors.tooManyAttempts');
  return t(fallbackKey);
}
