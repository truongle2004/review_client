import axios from 'axios';
import { ToastWarning } from './toastify';
import { refreshToken } from '@/services/auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 1000 * 60 * 5, // 5 minutes
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Check for status 401 first
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');

      try {
        const { data } = await refreshToken();
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        localStorage.setItem('token', data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        // ToastWarning('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        window.location.href = '/review/login';
        return Promise.reject(err);
      }
    }
    //Then check for a more specific error message
    if (error.response?.data?.message?.includes('Refresh token is required')) {
      ToastWarning('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      localStorage.removeItem('token');
      window.location.href = '/review/login';
      return Promise.reject(error); //Reject the promise so the original request fails
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
