// Layout for Diary/ -> client\app\(tabs)\diary\_layout.tsx

import { Stack } from "expo-router";

export default function DiaryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Renderiza estas screens: */}
      <Stack.Screen name="index" />
      <Stack.Screen name="add-food" />
    </Stack>
  );
}

// Convierte diary en navegación interna:
// 👉 PERO en el bottom bar solo aparece: Diary ✅
