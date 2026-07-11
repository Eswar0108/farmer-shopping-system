import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach correct auth token
api.interceptors.request.use((config) => {
  const isAdminPath = window.location.pathname.startsWith('/admin');
  const tokenKey = isAdminPath ? 'admin_token' : 'customer_token';
  const token = localStorage.getItem(tokenKey);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    
    // Skip redirect for login endpoints (401 here means invalid credentials, not expired token)
    const isLoginEndpoint = url.includes('/auth/login') || url.includes('/customer/auth/login') || url.includes('/customer/auth/register') || url.includes('/auth/seed');
    
    if (error.response?.status === 401 && !isLoginEndpoint) {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      if (isAdminPath) {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;