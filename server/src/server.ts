// Server -> server/src/server.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI!;

// ─── Middlewares ───────────────────────────────────
app.use(express.json());      // permite recibir JSON en el body
app.use(cors());              // permite peticiones desde el cliente Expo

// ─── Rutas ───────────────────────────────────
app.use('/api/users', userRoutes);  // usar las rutas de usuarios

// ─── Conexión a MongoDB ────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión:', err));

// ─── Rutas ─────────────────────────────────────────
// app.use('/api/users', userRoutes);    <- las irás agregando aquí
// app.use('/api/meals', mealRoutes);
// app.use('/api/diary', diaryRoutes);

// ─── Ruta de prueba ────────────────────────────────
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    connected: state === 1,
    status: ['disconnected', 'connected', 'connecting', 'disconnecting'][state]
  });
});

// ─── Iniciar servidor ──────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
