// Servicio para meals -> client\services\mealService.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ── Tipado ────────────────────────────────────────────────────────────────────

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealItem {
  food: {
    _id: string;
    name: string;
    brand?: string;
    portionSize: number;
    unit: string;
  };
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  _id: string;
  user: string;
  date: string;
  mealType: MealType;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayMealsResponse {
  meals: Meal[];
  dayTotals: DayTotals;
}

// Item que se envia al crear una meal
export interface CreateMealItemInput {
  foodId: string;
  quantity: number;
}

// Body que se envia al crear una meal
export interface CreateMealInput {
  userId: string;
  date: string; // formato ISO: "2025-01-20"
  mealType: MealType;
  items: CreateMealItemInput[];
  notes?: string;
}

// ── Helper para manejar errores ───────────────────────────────────────────────
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error en la petición");
  }
  return res.json();
};

// ── Registrar una comida ──────────────────────────────────────────────────────
// POST /api/meals
export const createMeal = async (data: CreateMealInput): Promise<Meal> => {
  const res = await fetch(`${API_URL}/api/meals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

// ── Obtener diario de un día ──────────────────────────────────────────────────
// GET /api/meals/day?userId=xxx&date=2025-01-20
export const getDayMeals = async (
  userId: string,
  date: string, // formato ISO: "2025-01-20"
): Promise<DayMealsResponse> => {
  const res = await fetch(
    `${API_URL}/api/meals/day?userId=${userId}&date=${encodeURIComponent(date)}`,
  );

  return handleResponse(res);
};

// ── Eliminar un alimento de una comida ────────────────────────────────────────
// DELETE /api/meals/:mealId/items/:itemIndex
export const removeMealItem = async (
  mealId: string,
  itemIndex: number,
): Promise<Meal> => {
  const res = await fetch(`${API_URL}/api/meals/${mealId}/items/${itemIndex}`, {
    method: "DELETE",
  });

  return handleResponse(res);
};

// ── Eliminar una comida completa ──────────────────────────────────────────────
// DELETE /api/meals/:mealId
export const deleteMeal = async (mealId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/meals/${mealId}`, {
    method: "DELETE",
  });

  await handleResponse(res);
};
