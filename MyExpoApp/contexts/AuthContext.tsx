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
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  memberId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (storedToken) {
        setToken(storedToken);
        // Fetch user data with role from /api/auth/me
        try {
          const response = await authAPI.getMe(storedToken);
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            // Invalid token, clear it
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setToken(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          // Invalid token, clear it
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.token) {
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
        
        // Fetch complete user profile with role
        const meResponse = await authAPI.getMe(response.token);
        if (meResponse.success && meResponse.user) {
          setUser(meResponse.user);
          return meResponse.user;
        } else {
          setUser(response.user);
          return response.user;
        }
      } else {: Promise<User> => {
    try {
      const response = await authAPI.signup(data);
      
      if (response.success && response.token) {
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
        
        // Fetch complete user profile with role
        const meResponse = await authAPI.getMe(response.token);
        if (meResponse.success && meResponse.user) {
          setUser(meResponse.user);
          return meResponse.user;
        } else {
          setUser(response.user);
          return response.user;
        }

  const signup = async (data: SignupData) => {
    try {
      const response = await authAPI.signup(data);
      
      if (response.success && response.token) {
        await SecureStore.setItemAsync(TOKEN_KEY, response.token);
        setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }refreshUser = async () => {
    try {
      if (token) {
        const response = await authAPI.getMe(token);
        if (response.success && response.user) {
          setUser(response.user);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    updateUser,
    refresh
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
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
