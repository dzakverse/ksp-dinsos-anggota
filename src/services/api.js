import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // dari .env -> VITE_API_URL=http://127.0.0.1:8000/api
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getUserRole() {
  return localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
}

export function getUserName() {
  return localStorage.getItem('userName') || sessionStorage.getItem('userName');
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userName');
}

// Tempel token otomatis ke setiap request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;