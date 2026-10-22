import axios from 'axios';
import { attachAuth } from '../../auth';

const API_BASE_URL = 'http://localhost:3001';

const mockExamApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// التوكن + التحويل لتسجيل الدخول عند 401
attachAuth(mockExamApi);

export async function startMockExam({ testType = 'final_mock', count } = {}) {
  const response = await mockExamApi.post('/mockexam/start', {
    test_type: testType,
    count,
  });
  return response.data;
}

export async function submitMockExam(testId, answers) {
  const response = await mockExamApi.post(`/mockexam/${testId}/submit`, { answers });
  return response.data;
}

// رابط البث المباشر لصوت تصحيح سؤال خاطئ (ElevenLabs) — يرجع فوراً، والصوت
// يبدأ مع أول قطعة تصل. الرابط صالح 10 دقائق فقط.
export async function fetchReviewAudio(testId, questionId) {
  const response = await mockExamApi.post(`/mockexam/${testId}/review/${questionId}/audio`);
  return response.data.stream_url;
}

// الكلمات المعروفة حتى الآن { words: [{ text, start, end, line }], done, failed } — تُستطلع
// تدريجياً أثناء التوليد فتُكتب الكلمات مع الصوت بدل انتظار نهاية التوليد.
// سيرفر قديم بلا دعم progress يرد { words } كاملة بدون done، فنعتبرها منتهية.
export async function fetchReviewWordsProgress(testId, questionId) {
  const response = await mockExamApi.post(`/mockexam/${testId}/review/${questionId}/words`, null, {
    params: { progress: 1 },
  });
  const { words, done, failed } = response.data;
  return { words: words || [], done: done ?? true, failed: Boolean(failed) };
}

export default mockExamApi;
