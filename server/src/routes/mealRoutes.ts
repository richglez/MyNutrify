// Rutas Meals -> server\src\routes\mealRoutes.ts

import { Router } from "express";
import {
  createMeal,
  getDayMeals,
  removeMealItem,
  deleteMeal,
} from "../controllers/mealController";

const router = Router();

// POST   /api/meals                          → registrar comida
router.post("/", createMeal);

// GET    /api/meals/day?userId=x&date=x      → diario del día
router.get("/day", getDayMeals);

// DELETE /api/meals/:mealId/items/:itemIndex → eliminar un alimento
router.delete("/:mealId/items/:itemIndex", removeMealItem);

// DELETE /api/meals/:mealId                  → eliminar comida completa
router.delete("/:mealId", deleteMeal);

export default router;
