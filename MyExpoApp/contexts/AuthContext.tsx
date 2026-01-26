import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  memberId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string, memberId?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await SecureStore.getItemAsync('userData');

      if (token && userData) {
        // Verify token is still valid by fetching user data
        try {
          const response = await authAPI.getMe();
          if (response.success) {
            setUser(response.user);
            // Update stored user data
            await SecureStore.setItemAsync('userData', JSON.stringify(response.user));
          } else {
            // Token invalid, clear storage
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('userData');
            setUser(null);
          }
        } catch (error) {
          // Token invalid or expired
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('userData');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Store token and user data
        await SecureStore.setItemAsync('authToken', response.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(response.user));
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string, memberId?: string) => {
    try {
      console.log('🔄 Starting signup process...');
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('Member ID:', memberId);
      
      const response = await authAPI.signup(name, email, password, phone, memberId);
      
      console.log('✅ Signup API response:', response);
      
      if (response.success) {
        // Store token and user data
        await SecureStore.setItemAsync('authToken', response.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(response.user));
        setUser(response.user);
        console.log('✅ User stored successfully');
      } else {
        console.error('❌ Signup failed:', response.message);
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('❌ Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });
      
      // Provide more detailed error messages
      let errorMessage = 'Signup failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage =
          'Connection timeout. Please check:\n- Backend server is running\n- Correct API URL (tunnel or local IP)\n- If using local IP, phone and PC are on same Wi‑Fi\n- If using a tunnel, verify it is running';
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        errorMessage =
          'Cannot connect to server. Please check:\n- Backend is running on port 3001\n- Firewall allows Node.js/port 3001\n- Correct API URL (tunnel or local IP)\n- If using a tunnel, copy the latest trycloudflare/ngrok URL into config or EXPO_PUBLIC_API_ORIGIN';
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage regardless of API call success
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
