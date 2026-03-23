// Server -> server\src\server.ts
// Configuracion del servidor Express

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI!;

app.use(express.json());
app.use(cors());


// Ruta Usuarios
app.use('/api/users', userRoutes);
console.log('✅ Rutas de usuarios registradas');




// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión:', err));

// Status del servidor
app.get('/health', (req, res) => {
  const state = mongoose.connection.readyState;
  res.json({
    connected: state === 1,
    status: ['disconnected', 'connected', 'connecting', 'disconnecting'][state]
  });
});

// Manejador de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ message: err.message });
});

// Informacion del servidor activo
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
