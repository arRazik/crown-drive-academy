import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerCandidate, fetchLicenseCategories } from './Candidatesapi';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { Alert, Button, Field, inputClass } from '../ui/ui';
import AuthLayout from './AuthLayout';

function RegisterPage({ onAuthSuccess }) {
  const { t, name } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [licenseCategories, setLicenseCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // نأتي من صفحة الدخول لأن الحساب غير موجود → رسالة توضيحية بلغة الواجهة الحالية
  const needsRegistration = Boolean(location.state?.needsRegistration);

  useEffect(() => {
    fetchLicenseCategories()
      .then(setLicenseCategories)
      .catch(() => setError(t('auth.errors.categoriesFailed')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [nationalId, setNationalId] = useState(location.state?.nationalId || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseCategoryId, setLicenseCategoryId] = useState(3);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError('');

    if (!nationalId.trim() || !fullName.trim() || !licenseCategoryId) {
      setError(t('auth.errors.registerRequired'));
      return;
    }

    // كلمة المرور اختيارية: إن تُركت فارغة تصبح رقم البطاقة الوطنية هي كلمة المرور
    if (password && password.length < 6) {
      setError(t('auth.errors.passwordShort'));
      return;
    }

    if (password && password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const data = await registerCandidate({
        national_id: nationalId.trim(),
        password: password || undefined,
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        license_category_id: licenseCategoryId,
      });
      // التخزين في sessionStorage يتم داخل registerCandidate نفسها
      if (onAuthSuccess) {
        onAuthSuccess(data.candidate);
      }
      navigate('/statistique');
    } catch (err) {
      if (err.response?.status === 409) {
        navigate('/login');
      } else {
        setError(apiErrorMessage(t, err, 'auth.errors.registerFailed'));
        console.error('register error:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      {error && <Alert className="mb-4">{error}</Alert>}
      {needsRegistration && (
        <Alert tone="primary" className="mb-4">
          {t('auth.register.noAccountInfo')}
        </Alert>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <Field label={t('auth.register.nationalId')}>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            maxLength={20}
            className={inputClass}
            placeholder={t('auth.register.nationalIdPlaceholder')}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('auth.register.fullName')}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={120}
              className={inputClass}
              placeholder={t('auth.register.fullNamePlaceholder')}
            />
          </Field>

          <Field label={t('auth.register.phone')}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={20}
              className={inputClass}
              placeholder={t('auth.register.phonePlaceholder')}
            />
          </Field>
        </div>

        <Field label={t('auth.register.license')}>
          <select
            value={licenseCategoryId}
            onChange={(e) => setLicenseCategoryId(e.target.value)}
            className={inputClass}
          >
            <option value="">{t('auth.register.licensePlaceholder')}</option>
            {licenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.code} - {name(cat.name_ar)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('auth.register.password')} hint={t('auth.register.passwordNote')}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={t('auth.register.passwordPlaceholder')}
            autoComplete="new-password"
          />
        </Field>

        <Field label={t('auth.register.confirm')}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder={t('auth.register.confirmPlaceholder')}
            autoComplete="new-password"
          />
        </Field>

        <Button type="submit" variant="success" size="lg" disabled={loading} className="w-full">
          {loading ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>

        <p className="text-center text-sm text-ink-soft">
          {t('auth.register.haveAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="cursor-pointer font-semibold text-primary hover:underline"
          >
            {t('auth.register.goLogin')}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
