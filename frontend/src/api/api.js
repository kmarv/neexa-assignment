import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // Make sure to update with the actual Laravel backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, you can add an interceptor to handle authentication
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage if stored
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;
