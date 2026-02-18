import React, { createContext, useState, useEffect, useContext } from 'react';
import { onIdTokenChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { authAPI, setApiAuthToken } from '@/services/api';
import { auth as firebaseAuth } from '@/firebaseConfig';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  memberId?: string;
  accountStatus?: 'pending' | 'approved' | 'rejected';
  verificationStatus?: 'verified' | 'unverified' | 'pending_admin';
}

// Custom error class for pending approval
export class PendingApprovalError extends Error {
  constructor(message: string, public user?: any) {
    super(message);
    this.name = 'PendingApprovalError';
  }
}

// Custom error class for rejected account
export class AccountRejectedError extends Error {
  constructor(message: string, public rejectionReason?: string) {
    super(message);
    this.name = 'AccountRejectedError';
  }
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async (fbUser) => {
      try {
        if (!fbUser) {
          setApiAuthToken(null);
          setToken(null);
          setUser(null);
          return;
        }

        const idToken = await fbUser.getIdToken();
        setApiAuthToken(idToken);
        setToken(idToken);

        const response = await authAPI.getMe();
        if (response?.success && response?.user) {
          // If the account isn't approved, keep Firebase signed out so the app doesn't treat it as logged in.
          if (response.user.accountStatus === 'pending') {
            await signOut(firebaseAuth);
            setApiAuthToken(null);
            setToken(null);
            setUser(null);
            return;
          }

          if (response.user.accountStatus === 'rejected') {
            await signOut(firebaseAuth);
            setApiAuthToken(null);
            setToken(null);
            setUser(null);
            return;
          }

          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error syncing auth state:', error);
        setApiAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const normalizedEmail = String(email ?? '').trim().toLowerCase();

      try {
        await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
      } catch (err: any) {
        const code = String(err?.code || '');

        // Migration path: if Firebase user doesn't exist yet, ask backend to migrate
        // the legacy Firestore account (bcrypt) into Firebase Auth, then retry.
        if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
          const migrate = await authAPI.login(normalizedEmail, password);
          if (!migrate?.success) {
            if (migrate?.accountStatus === 'pending' || migrate?.requiresApproval) {
              throw new PendingApprovalError(
                migrate?.message || 'Your account is pending admin approval. You will be notified within 48 hours.'
              );
            }

            if (migrate?.accountStatus === 'rejected') {
              throw new AccountRejectedError(
                migrate?.message || 'Your account registration was not approved.',
                migrate?.rejectionReason
              );
            }

            throw new Error(migrate?.message || 'Login failed');
          }

          await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
        } else {
          throw err;
        }
      }

      const meResponse = await authAPI.getMe();
      if (meResponse?.success && meResponse?.user) {
        if (meResponse.user.accountStatus === 'pending') {
          await signOut(firebaseAuth);
          throw new PendingApprovalError(
            'Your account is pending admin approval. You will be notified within 48 hours.',
            meResponse.user
          );
        }

        if (meResponse.user.accountStatus === 'rejected') {
          await signOut(firebaseAuth);
          throw new AccountRejectedError(
            'Your account registration was not approved.',
            (meResponse.user as any)?.rejectionReason
          );
        }

        setUser(meResponse.user);
        return meResponse.user;
      }

      await signOut(firebaseAuth);
      throw new Error(meResponse?.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (data: SignupData): Promise<User> => {
    try {
      const response = await authAPI.signup(data);

      // Pending approval: backend returns success but no token
      if (response?.success && (response.requiresAdminApproval || response.requiresApproval || response.user?.accountStatus === 'pending')) {
        throw new PendingApprovalError(
          response.message || 'Your signup request has been received. Our admin team will review your application. You will be notified once approved.',
          response.user
        );
      }
      
      // Approved signup: Firebase user was created server-side; sign in client-side.
      const normalizedEmail = String(data.email ?? '').trim().toLowerCase();
      await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, data.password);

      const meResponse = await authAPI.getMe();
      if (meResponse?.success && meResponse?.user) {
        if (meResponse.user.accountStatus === 'pending') {
          await signOut(firebaseAuth);
          throw new PendingApprovalError(
            meResponse?.message || 'Your signup request has been received. Our admin team will review your application. You will be notified once approved.',
            meResponse.user
          );
        }

        if (meResponse.user.accountStatus === 'rejected') {
          await signOut(firebaseAuth);
          throw new AccountRejectedError(
            meResponse?.message || 'Your account registration was not approved.',
            (meResponse.user as any)?.rejectionReason
          );
        }

        setUser(meResponse.user);
        return meResponse.user;
      }

      await signOut(firebaseAuth);
      throw new Error(meResponse?.message || response?.message || 'Signup failed');
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      setApiAuthToken(null);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  const refreshUser = async () => {
    try {
      if (!firebaseAuth.currentUser) return;
      const response = await authAPI.getMe();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error: any) {
      console.error('Error refreshing user:', error);

      if (error?.response?.status === 401) {
        await logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token && user.accountStatus === 'approved',
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
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
