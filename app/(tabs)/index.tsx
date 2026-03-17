// app/(tabs)/index.tsx — Dashboard
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Ícono campana ────────────────────────────────────────────────────────────
const BellIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const userName = "Ricardo Gonzalez";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <View style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Saludo + nombre */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        {/* Botón campana */}
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
          <BellIcon />
          {/* Punto rojo de notificación */}
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* ── Contenido futuro ── */}
      <View style={styles.body}>
        <Text style={styles.placeholder}>Dashboard content goes here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F5F7FA",
  },

  greetingBlock: {
    gap: 2,
  },

  greeting: {
    fontSize: 13,
    color: "#8A94A6",
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  userName: {
    fontSize: 22,
    color: "#1A1F36",
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  // ── Campana ────────────────────────────────────────────────────────────────
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3090FE", // verde teal como en la imagen
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0045FD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  badge: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4757",
    borderWidth: 1.5,
    borderColor: "#F5F7FA",
  },

  // ── Body ───────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholder: {
    color: "#C0C7D4",
    fontSize: 14,
  },
});
