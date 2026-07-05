import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const result = await authService.refreshToken();
        if (result?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        authService.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
