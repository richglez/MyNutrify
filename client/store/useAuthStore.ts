// client/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  userId: string | null;
  token: string | null;
  setAuth: (userId: string, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  token: null,
  setAuth: (userId, token) => set({ userId, token }),
  clearAuth: () => set({ userId: null, token: null }),
}));
