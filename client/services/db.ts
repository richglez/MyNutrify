// Servicio para usuario/foods/... (Esto luego se va a cambiar para evitar archivo monolítico) ->  client\services\db.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log("🌐 API_URL:", API_URL);

if (!API_URL) {
  throw new Error("❌ EXPO_PUBLIC_API_URL no está definida");
}



// Registrar usuario
export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, message: data.message }; // ← igual que loginUser
  }

  return data;
};

// Guardar datos del onboarding
export const saveOnboarding = async (
  userId: string,
  data: {
    goal: string;
    sex: string;
    age: number;
    weight: number;
    height: number;
  },
) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/onboarding`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Iniciar sesión
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, message: data.message };
  }

  return data; // { token, userId }
};
