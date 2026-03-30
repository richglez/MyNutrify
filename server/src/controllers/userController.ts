// Controller Users -> server\src\controllers\userController.ts

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// ── Iniciar sesión ────────────────────────────────────────────────────────────
// POST /api/users/login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ email no encontrado");
      res.status(401).json({ message: "email_not_found" });
      return;
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ contraseña incorrecta");
      res.status(401).json({ message: "password_wrong" });
      return;
    }

    // Generar token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    console.log("Usuario Loggeado 👤");
    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    console.error("❌ loginUser:", err.message);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// ── Registrar usuario ─────────────────────────────────────────────────────────
// POST /api/users/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("📩 Petición recibida en /register", req.body);

    const { name, email, password } = req.body;

    // Verificar si ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: "El email ya está registrado" });
      return;
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({ name, email, password: hashedPassword });

    // Generar token para autenticación con JWT
    // Para que el servidor sepa que las siguientes peticiones vienen de un usuario legítimo
    const token = jwt.sign(
      { userId: user._id }, // payload
      process.env.JWT_SECRET!, // clave secreta para firmar
      { expiresIn: "7d" }, // expira en 7 días
    );

    res.status(201).json({
      token,
      userId: user._id, // user._id viene de MongoDB, se expone como userId en la respuesta
      message: "Usuario creado exitosamente",
    });
  } catch (err: any) {
    console.error("❌ registerUser:", err.message);
    res.status(500).json({ message: "Error al registrar usuario", error: err });
  }
};

// ── Guardar datos del onboarding ──────────────────────────────────────────────
// PUT /api/users/:id/onboarding
export const saveOnboarding = async (req: Request, res: Response) => {
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
      { new: true }, // devuelve el documento actualizado
    );

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    res.json({ message: "Perfil actualizado", user });
  } catch (err: any) {
    console.error("❌ saveOnboarding:", err.message);
    res.status(500).json({ message: "Error al actualizar perfil", error: err });
  }
};
