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
  
  console.log('[API Request]', config.method.toUpperCase(), config.url);
  console.log('[API] Wallet address from localStorage:', walletAddress);
  
  if (walletAddress) {
    config.headers['x-wallet-address'] = walletAddress;
    console.log('[API] Added x-wallet-address header:', walletAddress);
  } else {
    console.warn('[API] No wallet address found in localStorage!');
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.config.method.toUpperCase(), response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('[API Error]', error.config?.method?.toUpperCase(), error.config?.url, '- Status:', error.response?.status);
    console.error('[API Error] Message:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      // Wallet not connected or invalid
      localStorage.removeItem('walletAddress');
      console.error('[API] 401 Unauthorized - Clearing wallet data');
      // Don't redirect automatically, just show error
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;