import axios from 'axios';
import { attachAuth } from './auth';
import { API_BASE_URL } from './config';

const activityApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

attachAuth(activityApi);

// active = هل تفاعل المترشح فعلاً خلال الفترة الماضية (السيرفر يحسب الزمن الفعلي بنفسه)
export async function sendHeartbeat(active) {
  await activityApi.post('/activity/heartbeat', { active });
}
