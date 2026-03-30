// Controller Foods -> server\src\controllers\foodController.ts

import { Request, Response } from "express";
import Food from "../models/Food";

// ── Buscar alimentos ──────────────────────────────────────────────────────────
// GET /api/foods/search?q={text}
export const searchFoods = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string; // obtener lo que el usuario escribe en input

    if (!q) {
      res.status(400).json({ message: "Query vacia" });
      return;
    }

    // Buscar alimentos por nombre (autocomplete básico)
    const foods = await Food.find({
      $or: [
        { name: { $regex: `^${q}`, $options: "i" } }, // empieza con
        { name: { $regex: q, $options: "i" } }, // contiene
      ], // $regex -> búsqueda parcial
      // "i"    -> ignore case
    })
      .limit(10) // limita los resultados, evitar sobrecargar la app
      .sort({ isVerified: -1 }); // ordenar por alimentos verificados primero

    res.json(foods); // envía al frontend
  } catch (err: any) {
    console.error("❌ searchFoods:", err.message);
    res.status(500).json({ message: "Error al buscar alimentos" });
  }
};

// ── Obtener sugerencias ───────────────────────────────────────────────────────
// GET /api/foods/suggestions
// Devuelve alimentos verificados para mostrar como sugerencias al cargar la pantalla
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const foods = await Food.find({ isVerified: true }).limit(10);

    // Fallback: si no hay alimentos verificados, devolver los primeros 10
    if (foods.length === 0) {
      const fallback = await Food.find({}).limit(10);
      res.json(fallback);
      return;
    }

    res.json(foods);
  } catch (err: any) {
    console.error("❌ getSuggestions:", err.message);
    res.status(500).json({ message: "Error al obtener sugerencias" });
  }
};
