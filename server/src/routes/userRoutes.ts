// Rutas Users -> server\src\routes\userRoutes.ts
// Configuracion de rutas relacionadas con usuarios (registro, login, onboarding)

import { Router } from "express";
import {
  loginUser,
  registerUser,
  saveOnboarding,
} from "../controllers/userController";

// Inicializacion de router
const router = Router();

// POST /api/users/login            → iniciar sesión
router.post("/login", loginUser);

// POST /api/users/register         → registrar nuevo usuario
router.post("/register", registerUser);

// PUT  /api/users/:id/onboarding   → guardar datos del onboarding
router.put("/:id/onboarding", saveOnboarding);

export default router;
