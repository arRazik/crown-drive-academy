import axios from 'axios';
import { attachAuth } from '../../auth';

const API_BASE_URL = 'http://localhost:3001';

const lessonsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// التوكن + التحويل لتسجيل الدخول عند 401
attachAuth(lessonsApi);

export async function fetchLessonsBoard() {
  const response = await lessonsApi.get('/lessons');
  return response.data;
}

export async function fetchLessonDetail(lessonId) {
  const response = await lessonsApi.get(`/lessons/${lessonId}`);
  return response.data;
}

export async function markLessonReviewed(lessonId) {
  const response = await lessonsApi.post(`/lessons/${lessonId}/reviewed`);
  return response.data;
}

export default lessonsApi;
