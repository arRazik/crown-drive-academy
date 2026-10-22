import axios from 'axios';


// Adaptez cette URL à votre backend (ex: process.env.REACT_APP_API_URL en CRA,
// ou import.meta.env.VITE_API_URL en Vite).
const API_BASE_URL = 'http://localhost:3001';


const candidatesApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // pour que le cookie "candidate_token" soit envoyé/reçu
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attache le token stocké localement (en plus du cookie httpOnly) si présent
candidatesApi.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('candidate_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Tente une connexion avec { national_id, password }.
 * En cas de 404 avec needsRegistration:true, l'appelant doit basculer
 * vers le formulaire d'inscription (le composant LoginPage le fait déjà).
 */
 
export async function loginCandidate({ national_id, password }) {
  const response = await candidatesApi.post(
    'http://localhost:3001/alogin/login',
    { national_id, password }
  );

  console.log('Login response:', response.data);

  const { token, candidate } = response.data;

  // تخزين token
  sessionStorage.setItem('token', token);

  // تخزين بيانات candidate
  sessionStorage.setItem('user', JSON.stringify(candidate));

  

  return response.data;
}

/**
 * Inscrit un nouveau candidat puis le connecte automatiquement.
 */
export async function registerCandidate({ national_id, password, full_name, phone, license_category_id }) {
  const response = await candidatesApi.post('http://localhost:3001/alogin/register', {
    national_id,
    password,
    full_name,
    phone,
    license_category_id,
  });

  // نفس تخزين الدخول — وإلا حماية المسارات تُرجع المترشح الجديد لصفحة الدخول
  const { token, candidate } = response.data;
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(candidate));

  return response.data;
}

export async function logoutCandidate() {
  const response = await candidatesApi.post('http://localhost:3001/alogin/logout');
  return response.data;
}

export async function fetchCurrentCandidate() {
  const response = await candidatesApi.get('http://localhost:3001/alogin/candidates/me');
  return response.data;
}

export async function fetchLicenseCategories() {
  const response = await candidatesApi.get('http://localhost:3001/alogin/license-categories');
  return response.data.license_categories;
}

export default candidatesApi;