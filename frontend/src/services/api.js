// frontend/src/services/api.js
// Configuración central de Axios — todas las llamadas al backend pasan por aquí

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // usa el proxy de Vite en desarrollo
});

// Interceptor: agrega el token JWT automáticamente en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el token expiró, redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
