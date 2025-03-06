import axios from 'axios';
import { useAuthStore } from '../../store/auth.store';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const publicApiInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApiInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateApiInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

privateApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(
      'Error interceptor:',
      error.response?.status,
    );

    if (error.response?.status === 403) {
      console.log('403 error detected, redirecting...');
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    if (error.response?.status === 401) {
      console.log('403 error detected, redirecting...');
      useAuthStore.getState().clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

publicApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      'Error interceptor:',
      error.response?.status,
    );

    if (error.response?.status === 403) {
      console.log('403 error detected, redirecting...');
      window.location.href = '/account?submenu=login';
    }
    return Promise.reject(error);
  },
);
