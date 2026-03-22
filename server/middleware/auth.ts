// server\middleware\auth.ts
// const token = req.headers.authorization?.split(' ')[1];
// const decoded = jwt.verify(token, process.env.JWT_SECRET!);
// si es válido → continúa, si no → 401 Unauthorized



// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No autorizado" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // info del usuario
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Token inválido" });
//   }
// };



// app.get("/perfil", authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });


// 📱 ¿Entonces qué hace el cliente?

// El cliente (React Native):

// Guarda el token (AsyncStorage / SecureStore)
// Lo envía en cada request:
// Authorization: Bearer <token>

// 👉 Pero NO valida seguridad real, solo ayuda con UX.

// ⚖️ Resumen claro
// Parte	Responsabilidad
// Cliente (App móvil)	Enviar token
// Servidor (Backend)	🔥 Validar token (middleware)
// Middleware	Proteger rutas
