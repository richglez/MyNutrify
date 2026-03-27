// Servicio para food -> client\services\foodService.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ── Tipado (importante nivel pro) ─────────────────────────
export interface Food {
  _id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  isVerified?: boolean;
}

// ── Helper para manejar errores ───────────────────────────
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }
  return res.json();
};

// ── Buscar alimentos ──────────────────────────────────────
export const searchFoods = async (query: string): Promise<Food[]> => {
  if (!query.trim()) return [];

  const res = await fetch(
    `${API_URL}/api/foods/search?q=${encodeURIComponent(query)}`,
  );

  const data = await handleResponse(res);
  return Array.isArray(data) ? data : [];
};

// ── Obtener sugerencias ───────────────────────────────────
export const getSuggestions = async (): Promise<Food[]> => {
  const res = await fetch(`${API_URL}/api/foods/suggestions`);
  const data = await handleResponse(res);

  return Array.isArray(data) ? data : [];
};
