// Layout for Settings/ -> client\app\(tabs)\settings\_layout.tsx
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_left", // 👈 animación tipo iOS push
      }}
    >
      {/* Pantalla principal */}
      <Stack.Screen name="index" />

      {/* Subpantallas */}
      <Stack.Screen name="account"options={{
        animation: "slide_from_right",
      }}/>
    </Stack>
  );
}
