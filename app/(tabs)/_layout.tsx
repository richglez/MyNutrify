// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import BottomNavBar from "../../components/BottomNavBar";
import {SafeAreaProvider} from "react-native-safe-area-context"

export default function TabsLayout() {
  return (
    <SafeAreaProvider>
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavBar {...props} />}
    >
      {/* El orden aquí define el orden visual en la barra */}
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="diary" options={{ title: "Diary" }} />
      <Tabs.Screen name="post" options={{ title: "" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
    </SafeAreaProvider>
  );
}
