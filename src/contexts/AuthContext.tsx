import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/auth';

interface AuthContextType {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: 'student' | 'teacher';
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  } | null;
  profile: {
    id: string;
    email: string;
    full_name: string;
    role: 'student' | 'teacher';
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, error, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value = {
    user,
    profile: user, // Since we're using the same user object as profile
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 