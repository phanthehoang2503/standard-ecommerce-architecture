import axios from 'axios';

const api = axios.create({
  // Vite proxy routes it to http://localhost:8080 if not starting with http
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add jwt token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to clear token on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optionally could reload page here, but wiping token usually fixes the immediate error loops
    }
    return Promise.reject(error);
  }
);

export default api;
