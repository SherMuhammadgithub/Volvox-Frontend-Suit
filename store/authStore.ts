import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      login: (token, user) => {
        // Store token in sessionStorage for middleware access
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth-token', token);
        }
        set({ 
          token, 
          user, 
          isAuthenticated: true, 
          error: null 
        });
      },
      
      logout: () => {
        // Clear sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth-token');
        }
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },
      
      initializeAuth: () => {
        if (typeof window !== 'undefined') {
          const token = sessionStorage.getItem('auth-token');
          if (token) {
            set({ token, isAuthenticated: true });
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not sensitive tokens
      partialize: (state) => ({ user: state.user }),
    }
  )
);