// Controller Meals -> server\src\controllers\mealController.ts

import { Request, Response } from "express";
import Meal from "../models/Meal";
import Food from "../models/Food";

// ── Registrar una comida ──────────────────────────────────────────────────────
// POST /api/meals
export const createMeal = async (req: Request, res: Response) => {
  try {
    const { userId, date, mealType, items, notes } = req.body;

    // Validaciones básicas
    if (!userId || !date || !mealType || !items?.length) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Calcular snapshot de macros por cada item
    const resolvedItems = await Promise.all(
      items.map(async (item: { foodId: string; quantity: number }) => {
        const food = await Food.findById(item.foodId);

        if (!food) {
          throw new Error(`Alimento no encontrado: ${item.foodId}`);
        }

        // ratio = cuántas porciones base consume el usuario
        // Ejemplo: 150g / 100g (portionSize) = 1.5
        const ratio = item.quantity / food.portionSize;

        return {
          food: food._id,
          quantity: item.quantity,
          calories: parseFloat((food.calories * ratio).toFixed(2)),
          protein: parseFloat((food.protein * ratio).toFixed(2)),
          carbs: parseFloat((food.carbs * ratio).toFixed(2)),
          fat: parseFloat((food.fat * ratio).toFixed(2)),
        };
      }),
    );

    // Calcular totales de la meal completa
    const totalCalories = resolvedItems.reduce((sum, i) => sum + i.calories, 0);
    const totalProtein = resolvedItems.reduce((sum, i) => sum + i.protein, 0);
    const totalCarbs = resolvedItems.reduce((sum, i) => sum + i.carbs, 0);
    const totalFat = resolvedItems.reduce((sum, i) => sum + i.fat, 0);

    const meal = await Meal.create({
      user: userId,
      date: new Date(date),
      mealType,
      items: resolvedItems,
      totalCalories: parseFloat(totalCalories.toFixed(2)),
      totalProtein: parseFloat(totalProtein.toFixed(2)),
      totalCarbs: parseFloat(totalCarbs.toFixed(2)),
      totalFat: parseFloat(totalFat.toFixed(2)),
      notes,
    });

    res.status(201).json(meal);
  } catch (err: any) {
    console.error("❌ createMeal:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── Obtener diario de un día ──────────────────────────────────────────────────
// GET /api/meals/day?userId=xxx&date=2025-01-20
export const getDayMeals = async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;

    if (!userId || !date) {
      return res
        .status(400)
        .json({ message: "userId y date son obligatorios" });
    }

    // Rango del día completo: 00:00:00 → 23:59:59
    const start = new Date(date as string);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date as string);
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: userId,
      date: { $gte: start, $lte: end },
    })
      .populate("items.food", "name brand portionSize unit") // trae nombre y marca del alimento
      .sort({ mealType: 1 }); // breakfast → lunch → dinner → snack

    // Totales del día (suma de todas las meals)
    const dayTotals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.totalProtein,
        carbs: acc.carbs + meal.totalCarbs,
        fat: acc.fat + meal.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    res.json({ meals, dayTotals });
  } catch (err: any) {
    console.error("❌ getDayMeals:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── Eliminar un alimento de una comida ────────────────────────────────────────
// DELETE /api/meals/:mealId/items/:itemIndex
export const removeMealItem = async (req: Request, res: Response) => {
  try {
    const { mealId, itemIndex } = req.params;
    const index = parseInt(itemIndex as string);

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Comida no encontrada" });

    if (index < 0 || index >= meal.items.length) {
      return res.status(400).json({ message: "Índice de item inválido" });
    }

    // Eliminar el item del array
    meal.items.splice(index, 1);

    // Recalcular totales
    meal.totalCalories = parseFloat(
      meal.items.reduce((s, i) => s + i.calories, 0).toFixed(2),
    );
    meal.totalProtein = parseFloat(
      meal.items.reduce((s, i) => s + i.protein, 0).toFixed(2),
    );
    meal.totalCarbs = parseFloat(
      meal.items.reduce((s, i) => s + i.carbs, 0).toFixed(2),
    );
    meal.totalFat = parseFloat(
      meal.items.reduce((s, i) => s + i.fat, 0).toFixed(2),
    );

    await meal.save();
    res.json(meal);
  } catch (err: any) {
    console.error("❌ removeMealItem:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── Eliminar una comida completa ──────────────────────────────────────────────
// DELETE /api/meals/:mealId
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;

    const meal = await Meal.findByIdAndDelete(mealId);
    if (!meal) return res.status(404).json({ message: "Comida no encontrada" });

    res.json({ message: "Comida eliminada correctamente" });
  } catch (err: any) {
    console.error("❌ deleteMeal:", err.message);
    res.status(500).json({ message: err.message });
  }
};
