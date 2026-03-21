// server/src/routes/userRoutes.ts

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// ─── POST /api/users/register ──────────────────────
router.post('/register', async (req: Request, res: Response) => {
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

    // Generar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      userId: user._id,
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
});

// ─── PUT /api/users/:id/onboarding ─────────────────
router.put('/:id/onboarding', async (req: Request, res: Response) => {
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
});

export default router;
