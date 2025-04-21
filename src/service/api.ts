import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token-flix-wrapped');
      localStorage.removeItem('userId-flix-wrapped');
      window.location.href = '/';
    }
    console.error(error)
    return Promise.reject(error);
  }
);

export default api;
