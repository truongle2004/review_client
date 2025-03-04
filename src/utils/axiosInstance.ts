import axios from 'axios';

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

    if (data.accesstoken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accesstoken}`;
    }

    return data;
  },
  (error) => {
    // if (error.response.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
