// QuickActionsMenuLayout -> client\app\(tabs)\quick-actions-menu\_layout.tsx

import { Stack } from "expo-router";

export default function QuickActionsMenuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Renderiza estas screens: */}
      <Stack.Screen name="index" />
      <Stack.Screen name="searchFoods" />
    </Stack>
  );
}
