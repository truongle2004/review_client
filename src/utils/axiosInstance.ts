import axios from 'axios';
import Router from 'next/router';
import { ToastWarning } from './toastify';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data.accessToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
      localStorage.setItem('token', data.accessToken);
    }

    return data;
  },
  (error) => {
    // TODO: handle refresh token
    if (error.response.status === 401) {
      Router.push('/review/login');

      ToastWarning(
        error.response?.message ? error.response?.message : 'Ban khong co quyen truy cap'
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
