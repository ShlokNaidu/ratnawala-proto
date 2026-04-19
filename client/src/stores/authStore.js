import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      isAuthenticated: () => !!get().token,

      isAdmin: () => ['admin', 'sub_admin'].includes(get().user?.role),
    }),
    {
      name: 'ratnawala-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
