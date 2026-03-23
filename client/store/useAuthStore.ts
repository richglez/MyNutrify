// client/store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  userId: string | null;
  token: string | null;
  name: string | null;
  setAuth: (userId: string, token: string, name: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  token: null,
  name: null,
  setAuth: (userId, token, name) => set({ userId, token, name }),
  clearAuth: () => set({ userId: null, token: null, name: null }),
}));
