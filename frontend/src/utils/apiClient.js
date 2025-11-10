import axios from 'axios';

// Use relative path when deployed on Vercel (same domain), or env var for local/dev
const getBaseURL = () => {
  // In production on Vercel, API is on same domain, so use relative path
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    return '/api';
  }
  // Use env var if set (for local dev or custom API URL)
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

