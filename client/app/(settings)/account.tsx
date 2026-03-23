// AccountScreen -> client\app\(settings)\account.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";

export default function AccountScreen() {
  const name = useAuthStore((s) => s.name);
  const email = useAuthStore((s) => s.email);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {/* Botón para volver atrás */}
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        {/* Título del header */}
        <Text style={styles.headerTitle}>Account</Text>
      </View>
      {/* Contenido */}
      <Text style={styles.title}>Account details</Text>
      {/* Name Label */}
      <Text style={styles.label}>Name</Text>
      <Text style={styles.userDataStyles}>{name ?? "Account"}</Text>
      {/* Name Email */}
      <Text style={styles.label}>Email</Text>
      <Text style={styles.userDataStyles}>{email ?? "Email"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  back: {
    marginBottom: 20,
  },
  userDataStyles: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "#8C9CB4",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 32,
    // backgroundColor: "#dfe7ef",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    fontFamily: "DMSans_600SemiBold",
    fontSize: 20,
    textAlign: "center",
  },

  label: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
  },

  title: {
    fontFamily: "DMSans_900Black",
    fontSize: 22,
    letterSpacing: -1.5,
    color: "#1A2117",
    marginBottom: 8,
  },
});
