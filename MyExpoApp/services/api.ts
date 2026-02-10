import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

let inMemoryToken: string | null = null;
let tokenLoadPromise: Promise<string | null> | null = null;

export function setApiAuthToken(token: string | null) {
  inMemoryToken = token || null;
}

async function getAuthToken(): Promise<string | null> {
  if (inMemoryToken) return inMemoryToken;

  if (!tokenLoadPromise) {
    tokenLoadPromise = SecureStore.getItemAsync(TOKEN_KEY)
      .then((token) => {
        inMemoryToken = token || null;
        return inMemoryToken;
      })
      .catch((error) => {
        console.error('Error getting token:', error);
        return null;
      })
      .finally(() => {
        tokenLoadPromise = null;
      });
  }

  return tokenLoadPromise;
}

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
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    // Log request for debugging
    console.log('📤 Making request to:', config.method?.toUpperCase(), config.url);
    const baseUrl = config.baseURL ?? '';
    const url = config.url ?? '';
    console.log('📤 Full URL:', baseUrl + url);
    console.log('📤 Has Auth Token:', !!(config.headers && (config.headers as any).Authorization));
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
    const config = error.config as any;

    // Retry timed-out GET requests once (Render cold start / transient network)
    const isTimeout =
      error?.code === 'ECONNABORTED' ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'));
    const method = (config?.method || 'get').toLowerCase();

    if (config && method === 'get' && isTimeout && !config.__retried) {
      config.__retried = true;
      config.timeout = Math.max(Number(config.timeout) || 0, 60000);
      try {
        return await api.request(config);
      } catch (retryError) {
        // fall through to normal logging
        error = retryError;
      }
    }

    // Log detailed error for debugging
    console.error('❌ API Error Details:');
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    console.error('   Error name:', error.name);
    
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('   Request URL:', error.config?.url);

      // If token is stale (e.g., user deleted in backend), clear it so app can recover.
      if (error.response.status === 401) {
        try {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch (e) {
          // ignore
        }
        inMemoryToken = null;
      }
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
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
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

// Information API functions
export const informationAPI = {
  // Search users by name
  search: async (name: string) => {
    const response = await api.get('/information/search', {
      params: { name },
    });
    return response.data;
  },

  // Get single information record by id
  getById: async (id: string) => {
    const response = await api.get(`/information/${id}`);
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

// Public dynamic content API functions
export const contentAPI = {
  getCommittee: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/content/committee', { params });
    return response.data;
  },
  getSponsors: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/content/sponsors', { params });
    return response.data;
  },
  getOffers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/content/offers', { params });
    return response.data;
  },
  getEvents: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/content/events', { params });
    return response.data;
  },
  getPlaces: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/content/places', { params });
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

  // Pending Approvals
  getApprovals: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/approvals', { params });
    return response.data;
  },

  approveUser: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/approve`);
    return response.data;
  },

  rejectUser: async (id: string, reason?: string) => {
    const response = await api.put(`/admin/users/${id}/reject`, { reason: reason || '' });
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

  // Dedicated dynamic content management
  getCommittee: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/content/committee', { params });
    return response.data;
  },
  createCommitteeMember: async (data: any) => {
    const response = await api.post('/admin/content/committee', data);
    return response.data;
  },
  updateCommitteeMember: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/committee/${id}`, data);
    return response.data;
  },
  deleteCommitteeMember: async (id: string) => {
    const response = await api.delete(`/admin/content/committee/${id}`);
    return response.data;
  },

  getSponsors: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/content/sponsors', { params });
    return response.data;
  },
  createSponsor: async (data: any) => {
    const response = await api.post('/admin/content/sponsors', data);
    return response.data;
  },
  updateSponsor: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/sponsors/${id}`, data);
    return response.data;
  },
  deleteSponsor: async (id: string) => {
    const response = await api.delete(`/admin/content/sponsors/${id}`);
    return response.data;
  },

  getOffers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/content/offers', { params });
    return response.data;
  },
  createOffer: async (data: any) => {
    const response = await api.post('/admin/content/offers', data);
    return response.data;
  },
  updateOffer: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/offers/${id}`, data);
    return response.data;
  },
  deleteOffer: async (id: string) => {
    const response = await api.delete(`/admin/content/offers/${id}`);
    return response.data;
  },

  getEvents: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/content/events', { params });
    return response.data;
  },
  createEvent: async (data: any) => {
    const response = await api.post('/admin/content/events', data);
    return response.data;
  },
  updateEvent: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/events/${id}`, data);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await api.delete(`/admin/content/events/${id}`);
    return response.data;
  },

  getPlaces: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/admin/content/places', { params });
    return response.data;
  },
  createPlace: async (data: any) => {
    const response = await api.post('/admin/content/places', data);
    return response.data;
  },
  updatePlace: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/places/${id}`, data);
    return response.data;
  },
  deletePlace: async (id: string) => {
    const response = await api.delete(`/admin/content/places/${id}`);
    return response.data;
  },

  // Image Upload
  uploadImage: async (formData: FormData) => {
    const response = await api.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};


export default api;
