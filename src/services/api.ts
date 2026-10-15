import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const normalizedApiUrl = rawApiUrl
  ? rawApiUrl.replace(/\/$/, '')
  : '';

const api = axios.create({
  baseURL: normalizedApiUrl ? `${normalizedApiUrl}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ka_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && localStorage.getItem('ka_token')) {
      // Token expired, cleanup local auth state
      localStorage.removeItem('ka_token');
      localStorage.removeItem('ka_refreshToken');
      localStorage.removeItem('ka_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
