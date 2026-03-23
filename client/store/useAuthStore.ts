// client/store/useAuthStore.ts
import { create } from "zustand";

// Autenticación global con Zustand
interface AuthState {
  userId: string | null; // estados posibles | null es el estado vacío correcto
  token: string | null; // estados posibles | null es el estado vacío correcto
  name: string | null; // estados posibles | null es el estado vacío correcto
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
