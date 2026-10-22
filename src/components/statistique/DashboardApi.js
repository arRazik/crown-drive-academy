import axios from 'axios';
import { attachAuth } from '../../auth';

const API_BASE_URL = 'http://localhost:3001';

const dashboardApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// التوكن + التحويل لتسجيل الدخول عند 401
attachAuth(dashboardApi);

export async function fetchDashboardOverview() {
  const response = await dashboardApi.get('/dashboard/overview');
  return response.data;
}

export default dashboardApi;
