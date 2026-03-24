// AccountScreen -> client\app\(settings)\account.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";

export default function AccountScreen() {
  const name = useAuthStore((s) => s.name);
  const email = useAuthStore((s) => s.email);

  return (
    <LinearGradient
      colors={["#0A1628", "#0D2F6E", "#1255B8", "#2E90FE", "#7EC8FF"]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        {/* Botón para volver atrás */}
        <Pressable style={styles.back} onPress={router.back}>
          <Ionicons name="arrow-back" size={24} color="#dfedff" />
        </Pressable>
        {/* Título del header */}
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      {/* Contenido */}
      <Text style={styles.title}>Account details</Text>

      {/* Card contenedor */}
      <View style={styles.card}>
        {/* Name */}
        <View style={styles.fieldRow}>
          <Ionicons
            name="person-outline"
            size={18}
            color="#5ea9ff"
            style={styles.fieldIcon}
          />
          <View>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.userDataStyles}>{name ?? "Account"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Email */}
        <View style={styles.fieldRow}>
          <Ionicons
            name="mail-outline"
            size={18}
            color="#5ea9ff"
            style={styles.fieldIcon}
          />
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.userDataStyles}>{email ?? "Email"}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  back: {
    padding: 8,
    marginLeft: -8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },

  headerTitle: {
    position: "absolute",
    left: 80, // recortar el ancho del contenedor del lado izquierdo
    right: 80, // recortar el ancho del contenedor del lado d
    fontFamily: "DMSans_600SemiBold",
    fontSize: 20,
    textAlign: "center",
    color: "#e7f2ff",
  },

  title: {
    fontFamily: "DMSans_900Black",
    fontSize: 26,
    letterSpacing: -1.5,
    color: "#FFFFFF",
    marginBottom: 24,
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },

  fieldIcon: {
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: -4,
  },

  label: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#b7d9ff",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  userDataStyles: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "#FFFFFF",
  },
});
