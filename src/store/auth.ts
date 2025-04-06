import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: 'student' | 'teacher') => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      
      // For testing purposes, use hardcoded credentials
      if (email === 'student@test.com' && password === 'test123') {
        const mockUser: UserProfile = {
          id: 'test-student-id',
          email: 'student@test.com',
          full_name: 'Test Student',
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        set({ user: mockUser, loading: false });
        return { error: null };
      }

      if (email === 'teacher@test.com' && password === 'test123') {
        const mockUser: UserProfile = {
          id: 'test-teacher-id',
          email: 'teacher@test.com',
          full_name: 'Test Teacher',
          role: 'teacher',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        set({ user: mockUser, loading: false });
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          set({ user: profile, loading: false });
    } else {
          throw new Error('Profile not found');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to sign in', loading: false });
      return { error: error instanceof Error ? error.message : 'Failed to sign in' };
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: 'student' | 'teacher') => {
    try {
      set({ loading: true, error: null });
      
      // For testing/development, create a mock user without Supabase
      const mockUser: UserProfile = {
        id: `mock-${role}-${Date.now()}`,
        email: email,
        full_name: fullName,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Set the user immediately without waiting for email confirmation
      set({ user: mockUser, loading: false });
      
      // Try to register with Supabase but don't wait for it
      try {
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role
            },
            emailRedirectTo: window.location.origin,
          }
        });
      } catch (supabaseError) {
        console.error('Supabase registration attempted but failed:', supabaseError);
        // Continue anyway with mock user
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to sign up', loading: false });
      return { error: error instanceof Error ? error.message : 'Failed to sign up' };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to sign out', loading: false });
    }
  },

  logout: async () => {
    console.log('Logout initiated');
    await get().signOut();
  },

  checkSession: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          set({ user: profile, loading: false });
        } else {
          throw new Error('Profile not found');
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Check session error:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to check session', loading: false });
    }
  }
}));