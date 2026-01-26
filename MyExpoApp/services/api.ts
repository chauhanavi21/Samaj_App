import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@/config/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Note: ngrok-skip-browser-warning header kept for compatibility (harmless if not using ngrok)
  },
  timeout: 30000, // 30 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request for debugging
    console.log('📤 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('📤 Full URL:', config.baseURL + config.url);
    console.log('📤 Headers:', JSON.stringify(config.headers, null, 2));
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    // Log detailed error for debugging
    console.error('❌ API Error Details:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Error name:', error.name);
    
    if (error.response) {
      // Server responded with error status
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('   Request URL:', error.config?.url);
    } else if (error.request) {
      // Request was made but no response received
      console.error('   Request was made but no response received');
      console.error('   Request details:', JSON.stringify(error.request, null, 2));
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('⏱️ Network Timeout Error:');
        console.error('   - Request timed out after 30 seconds');
        console.error('   - Backend might be slow or not responding');
        console.error('   - Check backend is running: cd backend && npm run dev');
        console.error('   - If using a tunnel, verify it is running (cloudflared/ngrok)');
      } else if (error.code === 'ERR_NETWORK') {
        console.error('🌐 Network Connection Error:');
        console.error('   - Cannot establish connection to:', API_BASE_URL);
        console.error('   - This might be an SSL/certificate issue in React Native');
        console.error('   - Try: Check your tunnel logs to see if request reached backend');
        console.error('   - Try: Use HTTP URL instead of HTTPS (temporary test)');
        console.error('   - Try: Restart the Expo app');
      } else {
        console.error('🌐 Network Error:', error.message);
        console.error('   - Cannot reach backend server at:', API_BASE_URL);
        console.error('   - Check backend is running: cd backend && npm run dev');
        console.error('   - If using a tunnel, restart it (cloudflared/ngrok) and re-copy the URL');
      }
    } else {
      // Error setting up request
      console.error('❌ Request Setup Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signup: async (name: string, email: string, password: string, phone?: string, memberId?: string) => {
    const response = await api.post('/auth/signup', {
      name,
      email,
      password,
      phone,
      memberId,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { memberId?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Family Tree API functions
export const familyTreeAPI = {
  // Get all family tree entries
  getAll: async () => {
    const response = await api.get('/family-tree');
    return response.data;
  },

  // Get single family tree entry
  getById: async (id: string) => {
    const response = await api.get(`/family-tree/${id}`);
    return response.data;
  },

  // Create new family tree entry
  create: async (data: any) => {
    const response = await api.post('/family-tree', data);
    return response.data;
  },

  // Update family tree entry
  update: async (id: string, data: any) => {
    const response = await api.put(`/family-tree/${id}`, data);
    return response.data;
  },

  // Delete family tree entry
  delete: async (id: string) => {
    const response = await api.delete(`/family-tree/${id}`);
    return response.data;
  },
};

export default api;
