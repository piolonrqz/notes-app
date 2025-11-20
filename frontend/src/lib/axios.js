// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add wallet address to every request
api.interceptors.request.use((config) => {
  const walletAddress = localStorage.getItem('walletAddress');
  
  if (walletAddress) {
    config.headers['x-wallet-address'] = walletAddress;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Wallet not connected or invalid
      localStorage.removeItem('walletAddress');
      window.location.href = '/'; // Redirect to connect wallet
    }
    return Promise.reject(error);
  }
);

export default api;