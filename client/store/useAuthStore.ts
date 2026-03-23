//  AuthStoreZustand client\store\useAuthStore.ts
import { create } from "zustand";

// Autenticación global con Zustand
interface AuthState {
  userId: string | null; // estados posibles | null es el estado vacío correcto
  token: string | null; // estados posibles | null es el estado vacío correcto
  name: string | null; // estados posibles | null es el estado vacío correcto
  email: string | null; // estados posibles | null es el estado vacío correcto
  setAuth: (userId: string, token: string, name: string, email: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null, // Al principio se declara como nulo porque no hay sesion activa
  token: null, // Al principio se declara como nulo porque no hay sesion activa
  name: null, // Al principio se declara como nulo porque no hay sesion activa
  email: null, // Al principio se declara como nulo porque no hay sesion activa
  setAuth: (userId, token, name, email) => set({ userId, token, name, email }),
  clearAuth: () => set({ userId: null, token: null, name: null, email: null }),
}));
