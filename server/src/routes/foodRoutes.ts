//  foodRoutes -> server\src\routes\foodRoutes.ts
// Configuracion de rutas relacionadas con comidas

import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import Food from "../models/Food";

// Inicializacion de router
const router = Router();

const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  ): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// ────────────────────────────────────────* RUTAS *────────────────────────────────────────
// ─── GET /api/foods/search?q={text} ──────────────────────
router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    // Variables
    const q = req.query.q as string; // obtiener lo que el usuario escribe en input

    if (!q) {
      res.status(400).json({
        message: "Query vacia",
      });
      return;
    }

    // Buscar alimentos por nombre (autocomplete básico)
    const foods = await Food.find({ //istanciar objeto
      $or: [
        // or es la condicion de la consulta a db
        { name: { $regex: `^${q}`, $options: "i" } }, // empieza con
        { name: { $regex: q, $options: "i" } }, // contiene
      ], // $regex -> búsqueda parcial
      // "i" -> ignore case
    })
      .limit(10) // limita los resultados, evitar sobrecargar la app
      .sort({
        isVerified: -1,
      }); // ordernar por alimentos verificados, -1 false, 1 true

    res.json(foods); // 👉 envía al frontend
  }),
);


// ── GET /api/foods/suggestions ────────────────────────────────────────────────
// Devuelve alimentos verificados para mostrar como sugerencias al cargar la pantalla
router.get("/suggestions", async (req: Request, res: Response) => {
  try {
    const foods = await Food.find({ isVerified: true }).limit(10);

    // Fallback: si no hay alimentos verificados, devolver los primeros 10
    if (foods.length === 0) {
      const fallback = await Food.find({}).limit(10);
      return res.json(fallback);
    }

    res.json(foods);
  } catch (err) {
    console.error("❌ Error en /suggestions:", err);
    res.status(500).json({ message: "Error al obtener sugerencias" });
  }
});




export default router;
