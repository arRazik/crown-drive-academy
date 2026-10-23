// ============================================================================
// auth.js — جلسة المترشح في الواجهة: التحقق من التوكن (موجود + غير منتهي
// الصلاحية)، مسح الجلسة، والتحويل لصفحة تسجيل الدخول عند انتهائها أو عند
// رفض السيرفر (401). تستعمله الحماية في App.jsx وكل عملاء axios المحميّين.
// ============================================================================

const PUBLIC_PATHS = ['/login', '/register'];

// يقرأ payload الـ JWT بدون التحقق من التوقيع (التحقق الحقيقي في السيرفر)
function decodeTokenPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  } catch {
    return null;
  }
}

export function getToken() {
  return sessionStorage.getItem('token');
}

// جلسة صالحة = توكن + بيانات مترشح صالحة + التوكن لم تنته صلاحيته
export function isSessionValid() {
  const token = getToken();
  const user = sessionStorage.getItem('user');
  if (!token || !user) return false;

  try {
    JSON.parse(user);
  } catch {
    return false;
  }

  const payload = decodeTokenPayload(token);
  if (!payload) return false;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return false;
  return true;
}

// بيانات المترشح المخزّنة عند الدخول (أو null)
export function getStoredUser() {
  try {
    return JSON.parse(sessionStorage.getItem('user'));
  } catch {
    return null;
  }
}

// فتح الاختبار المعيَّن مباشرة يحدث مرة لكل دخول: نربط العلامة بتوكن الجلسة، فيتكرر عند دخول جديد
function autoExamKey(assignmentId) {
  const token = sessionStorage.getItem('token') || '';
  return `${token.slice(-16)}:${assignmentId}`;
}

export function wasAutoExamShown(assignmentId) {
  return sessionStorage.getItem('auto_exam_shown') === autoExamKey(assignmentId);
}

export function markAutoExamShown(assignmentId) {
  sessionStorage.setItem('auto_exam_shown', autoExamKey(assignmentId));
}

export function clearSession() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('auto_exam_shown');
}

export function isPublicPath(pathname) {
  return PUBLIC_PATHS.includes(pathname);
}

// يمسح الجلسة ويحوّل لتسجيل الدخول (HashRouter) إن لم نكن فيه بالفعل
export function redirectToLogin() {
  clearSession();
  const currentPath = window.location.hash.replace(/^#/, '').split('?')[0] || '/';
  if (!isPublicPath(currentPath)) {
    window.location.hash = '#/login';
  }
}

// يضيف التوكن لكل طلب، ويحوّل لتسجيل الدخول عند 401 (توكن منتهٍ، جلسة
// أُلغيت من جهاز آخر...). لا يُستعمل مع طلبات الدخول نفسها.
export function attachAuth(instance) {
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) redirectToLogin();
      return Promise.reject(error);
    }
  );
  return instance;
}
