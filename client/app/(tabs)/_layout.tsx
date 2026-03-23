// Layout for Tabs -> client\app\(tabs)\_layout.tsx
import { Tabs } from "expo-router";
import { useState } from "react";
import { Modal, View, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BottomNavBar from "@/components/BottomNavBar";
import PostPopUp from "@/components/PostPopUp";

export default function TabsLayout() {
  const [postVisible, setPostVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <BottomNavBar {...props} onOpenPost={() => setPostVisible(true)} />
        )}
      >
        <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
        <Tabs.Screen name="diary" options={{ title: "Diary" }} />
        <Tabs.Screen
          name="post"
          options={{
            title: "",
            // Evita que se navegue a esta pantalla
            href: null,
          }}
        />
        <Tabs.Screen name="explore" options={{ title: "Explore" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>

      {/* Modal deslizable desde abajo */}
      <Modal
        visible={postVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setPostVisible(false)}
      >
        {/* Overlay oscuro — tap fuera cierra */}
        <Pressable style={styles.overlay} onPress={() => setPostVisible(false)}>
          {/* La tarjeta — stopPropagation para que tap adentro no cierre */}
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* Handle bar */}
            <View style={styles.handle} />

            <PostPopUp onClose={() => setPostVisible(false)} />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end", // tarjeta pegada abajo
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: "50%", // ocupa mitad de pantalla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E3E8",
    marginBottom: 20,
  },
});
