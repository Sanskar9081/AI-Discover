import axios from 'axios';

const isProd = import.meta.env.PROD;
const defaultUrl = isProd ? '' : 'http://localhost:3001';
const baseURL = (import.meta.env.VITE_API_URL || defaultUrl).replace(/\/$/, '') + '/api';

const client = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Centralized error handling
    if (error.response?.status === 401) {
      // Optional: Handle unauthorized
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default client;
