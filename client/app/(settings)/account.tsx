// AccountScreen -> client\app\(settings)\account.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountScreen() {
  const name = useAuthStore((s) => s.name);

  return (
    <View style={styles.container}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <Text style={styles.title}>{name ?? "Account"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 24 },
  back: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800" },
});
