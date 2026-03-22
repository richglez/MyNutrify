// userRoutes -> server\src\routes\userRoutes.ts
// Configuracion de rutas relacionadas con usuarios (registro, onboarding, etc.)
import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─── POST /api/users/register ──────────────────────
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  console.log('📩 Petición recibida en /register', req.body); // ← agrega esto
  try {
    const { name, email, password } = req.body;

    // Verificar si ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'El email ya está registrado' });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generar token para autenticación con JWT
    const token = jwt.sign(  //para que tu servidor sepa que las siguientes peticiones vienen de un usuario legítimo que ya se registró o inició sesión.
      { userId: user._id }, // ← esto va en el payload
      process.env.JWT_SECRET!, // ← clave secreta para firmar
      { expiresIn: '7d' } //  // ← expira en 7 días
    );

    res.status(201).json({
      token,
      userId: user._id, // ← user._id viene de MongoDB, tú solo lo expones como userId en el token y la respuesta
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
}));

// ─── PUT /api/users/:id/onboarding ─────────────────
router.put('/:id/onboarding', asyncHandler (async (req: Request, res: Response) => {
  try {
    const { goal, sex, age, weight, height } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        goal,
        sex,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        isOnboardingComplete: true,
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: 'Perfil actualizado', user });

  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error });
  }
}));

export default router;
