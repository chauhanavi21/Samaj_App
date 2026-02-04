import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add JWT token to requests
api.interceptors.request.use(
  async (config) => {
    // Get JWT token from SecureStore
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    // Log request for debugging
    console.log('📤 Making request to:', config.method?.toUpperCase(), config.url);
    console.log('📤 Full URL:', config.baseURL + config.url);
    console.log('📤 Has Auth Token:', !!config.headers.Authorization);
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
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('   Request URL:', error.config?.url);
    } else if (error.request) {
      console.error('   Request was made but no response received');
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error('⏱️ Network Timeout Error');
      } else if (error.code === 'ERR_NETWORK') {
        console.error('🌐 Network Connection Error');
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Signup
  signup: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    memberId: string;
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user
  getMe: async (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get('/auth/me', config);
    return response.data;
  },

  // Update profile
  updateProfile: async (data: { memberId?: string; phone?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string, memberId: string) => {
    const response = await api.post('/auth/forgot-password', { email, memberId });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetToken: string, password: string, confirmPassword: string) => {
    const response = await api.post(`/auth/reset-password/${resetToken}`, {
      password,
      confirmPassword,
    });
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

// Admin API functions
export const adminAPI = {
  // Dashboard & Stats
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStatsOverview: async () => {
    const response = await api.get('/admin/stats/overview');
    return response.data;
  },

  // User Management
  getUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  getUserFamilyTree: async (id: string) => {
    const response = await api.get(`/admin/users/${id}/family-tree`);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  updateUserRole: async (id: string, role: 'user' | 'admin') => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  changeUserPassword: async (id: string, currentPassword: string, newPassword: string) => {
    const response = await api.put(`/admin/users/${id}/password`, { currentPassword, newPassword });
    return response.data;
  },

  deleteUser: async (id: string, deleteFamilyTree?: boolean) => {
    const params = deleteFamilyTree ? { deleteFamilyTree: 'true' } : {};
    const response = await api.delete(`/admin/users/${id}`, { params });
    return response.data;
  },

  // Page Content Management (CMS)
  getPages: async () => {
    const response = await api.get('/admin/pages');
    return response.data;
  },

  getPageByName: async (pageName: string) => {
    const response = await api.get(`/admin/pages/${pageName}`);
    return response.data;
  },

  createPage: async (data: any) => {
    const response = await api.post('/admin/pages', data);
    return response.data;
  },

  updatePage: async (pageName: string, data: any) => {
    const response = await api.put(`/admin/pages/${pageName}`, data);
    return response.data;
  },

  deletePage: async (pageName: string) => {
    const response = await api.delete(`/admin/pages/${pageName}`);
    return response.data;
  },

  // Image Upload
  uploadImage: async (imageUri: string, filename: string) => {
    const formData = new FormData();
    
    // Create file object for upload
    const file = {
      uri: imageUri,
      type: 'image/jpeg', // or detect from file
      name: filename,
    } as any;
    
    formData.append('image', file);

    const response = await api.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
