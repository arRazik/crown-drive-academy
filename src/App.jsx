import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LanguageProvider from './i18n/LanguageProvider';
// ===== components =======
import LoginPage from './components/loginPage/LoginPage';
import RegisterPage from './components/loginPage/RegisterPage';
import Statistique from './components/statistique/statistique';
import MockExam from './components/Mock Exam/MockExam';
import LessonsBoard from './components/Lessons/LessonsBoard';
import LessonDetail from './components/Lessons/LessonDetail';
import AppShell from './components/layout/AppShell';
// ===== componnents final =======
import { isSessionValid, clearSession, isPublicPath } from './auth';

// ✅ Protection des routes privées - redirection vers login si non authentifié | حماية الصفحات الخاصة - إعادة توجيه لتسجيل الدخول | Private route protection - redirect to login if not authenticated
// تلفّ كل الصفحات المحمية بغلاف التطبيق (الشريط الجانبي + المحتوى)
const PrivateLayout = () => {
  if (!isSessionValid()) {
    clearSession();
    return <Navigate to="/login" replace />;
  }
  return <AppShell />;
};

// ✅ Protection des pages d'authentification - empêche l'accès si déjà connecté | حماية صفحات تسجيل الدخول - يمنع الوصول للمسجلين | Auth route protection - prevent access if already logged in
const AuthRoute = ({ children }) => {
  if (isSessionValid()) {
    return <Navigate to="/statistique" replace />;
  }
  return children;
};

// يراقب الجلسة باستمرار: عند تغيير المسار، كل 15 ثانية، وعند الرجوع للنافذة.
// إن مُسحت الجلسة (أو انتهت صلاحية التوكن) وأنت في صفحة محمية → تسجيل الدخول فوراً.
const SESSION_CHECK_INTERVAL_MS = 15000;

function SessionWatcher() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      if (!isPublicPath(location.pathname) && !isSessionValid()) {
        clearSession();
        navigate('/login', { replace: true });
      }
    };

    check();
    const intervalId = setInterval(check, SESSION_CHECK_INTERVAL_MS);
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <SessionWatcher />
        <Routes>
          {/* ✅ Pages d'authentification - protégées contre l'accès des utilisateurs connectés | صفحات تسجيل الدخول - محمية من الوصول للمسجلين | Authentication pages - protected from logged-in users */}
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

          {/* الصفحات المحمية داخل غلاف التطبيق */}
          <Route element={<PrivateLayout />}>
            <Route path="/statistique" element={<Statistique />} />
            <Route path="/mock-exam" element={<MockExam />} />
            <Route path="/lessons" element={<LessonsBoard />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
          </Route>

          <Route path="/" element={<Navigate to={isSessionValid() ? '/statistique' : '/login'} replace />} />
          <Route path="*" element={<Navigate to={isSessionValid() ? '/statistique' : '/login'} replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
