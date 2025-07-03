// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      setLoading: (loading) => set({ isLoading: loading }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setTokens: (accessToken, refreshToken) => set({ 
        accessToken, 
        refreshToken: refreshToken || null 
      }),
      login: (user, accessToken, refreshToken) => set({ 
        user, 
        isAuthenticated: true, 
        accessToken, 
        refreshToken: refreshToken || null 
      }),
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          accessToken: null, 
          refreshToken: null 
        });
      },
      initializeAuth: async () => {
        const { accessToken, isInitialized } = get();
        
        // Prevent multiple initializations
        if (isInitialized) {
          return;
        }
        
        if (!accessToken) {
          set({ isInitialized: true });
          return;
        }

        try {
          set({ isLoading: true });
          
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Auth initialization - user data:", data.user);
            console.log("User role:", data.user.role);
            set({ 
              user: data.user, 
              isAuthenticated: true, 
              isInitialized: true,
              isLoading: false 
            });
          } else {
            // Token is invalid, clear it
            set({ 
              user: null, 
              isAuthenticated: false, 
              isInitialized: true,
              isLoading: false,
              accessToken: null,
              refreshToken: null
            });
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isInitialized: true,
            isLoading: false,
            accessToken: null,
            refreshToken: null
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }),
    }
  )
);
