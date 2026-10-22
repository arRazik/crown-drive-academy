import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCandidate } from './Candidatesapi';
import { useI18n } from '../../i18n/useI18n';
import { apiErrorMessage } from '../../i18n/apiErrors';
import { Alert, Button, Field, inputClass } from '../ui/ui';
import AuthLayout from './AuthLayout';

// أخطاء خاصة بتسجيل الدخول حسب حالة HTTP
const LOGIN_ERROR_BY_STATUS = {
  400: 'auth.errors.invalidCredentials',
  401: 'auth.errors.invalidCredentials',
  403: 'auth.errors.accountDisabled',
};

function LoginPage({ onAuthSuccess }) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError('');

    if (!nationalId.trim() || !password) {
      setError(t('auth.errors.loginRequired'));
      return;
    }

    setLoading(true);
    try {
      const data = await loginCandidate({ national_id: nationalId.trim(), password });
      // التخزين في sessionStorage يتم داخل loginCandidate نفسها
      if (onAuthSuccess) {
        onAuthSuccess(data.candidate);
      }
      navigate('/statistique');
    } catch (err) {
      const response = err.response;
      if (response && response.status === 404 && response.data?.needsRegistration) {
        // الحساب غير موجود -> الانتقال مباشرة إلى صفحة التسجيل
        navigate('/register', { state: { nationalId: nationalId.trim(), needsRegistration: true } });
      } else {
        setError(apiErrorMessage(t, err, 'auth.errors.loginFailed', LOGIN_ERROR_BY_STATUS));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      {error && <Alert className="mb-5">{error}</Alert>}

      <form onSubmit={handleLoginSubmit} className="space-y-5">
        <Field label={t('auth.login.nationalId')}>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            maxLength={20}
            className={inputClass}
            placeholder={t('auth.login.nationalIdPlaceholder')}
            autoComplete="username"
          />
        </Field>

        <Field label={t('auth.login.password')}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder={t('auth.login.passwordPlaceholder')}
            autoComplete="current-password"
          />
        </Field>

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>

        <p className="text-center text-sm text-ink-soft">
          {t('auth.login.noAccount')}{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="cursor-pointer font-semibold text-primary hover:underline"
          >
            {t('auth.login.createAccount')}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
