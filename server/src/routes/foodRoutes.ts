// Rutas Foods -> server\src\routes\foodRoutes.ts
// Configuracion de rutas relacionadas con comidas

import { Router } from "express";
import { searchFoods, getSuggestions } from "../controllers/foodController";

// Inicializacion de router
const router = Router();

// GET /api/foods/search?q={text}  → buscar alimentos por nombre
router.get("/search", searchFoods);

// GET /api/foods/suggestions      → sugerencias al cargar la pantalla
router.get("/suggestions", getSuggestions);

export default router;
