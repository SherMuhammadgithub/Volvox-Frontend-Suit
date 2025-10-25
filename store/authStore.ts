import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  fullName?: string;
  email: string;
  name?: string;
  createdAt?: string;
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
  setAuthFromApiResponse: (res: any) => void;
  getAuthToken: () => string | null;
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
        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      getAuthToken: () => {
        return get().token;
      },

      setAuthFromApiResponse: (res) => {
        if (!res || !res.access_token || !res.user) return;

        const user = {
          id: res.user._id,
          email: res.user.email,
          createdAt: res.user.created_at,
        };
        set({
          token: res.access_token,
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        // Clear localStorage and remove token from localStorage (via Zustand persist)
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-token");
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      initializeAuth: () => {
        if (typeof window !== "undefined") {
          let token = null;
          let user = null;
          try {
            const persisted = localStorage.getItem("auth-storage");
            if (persisted) {
              const parsed = JSON.parse(persisted);
              user = parsed.state?.user || parsed.user || null;
              // Also restore token from Zustand persist if not in sessionStorage
              if (!token) {
                token = parsed.state?.token || parsed.token || null;
              }
            }
          } catch {}
          if (token) {
            set({ token, isAuthenticated: true, user });
          } else if (user) {
            set({ user });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      // Persist both user and token for persistent login
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
