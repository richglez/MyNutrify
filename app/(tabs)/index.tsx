// app/(tabs)/index.tsx — Dashboard
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WeekCalendar from "../../components/Weekcalendar";
import NutritionCard from "../../components/NutritionCard";


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

  const nutritionData = {
    calories: { current: 1420, goal: 2000 },
    protein: { current: 85, goal: 150 },
    carbs: { current: 160, goal: 250 },
    vitaminC: { current: 55, goal: 90 },
    iron: { current: 8, goal: 18 },
    calcium: { current: 620, goal: 1000 },
    fiber: { current: 18, goal: 30 },
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* ────────────── Header ────────────── */}
      <View style={styles.header}>
        {/* Picture + Saludo + nombre */}
        <View style={styles.greetingBlock}>
          <Image
            source={require("../../assets/profile-picture-rich.png")}
            style={styles.profileImage}
            resizeMode="cover"
          />
          {/* Textos apilados a la derecha */}
          <View style={styles.greetingTexts}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>

        {/* Botón campana */}
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.8}>
          <BellIcon />
          {/* Punto rojo de notificación */}
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* ────────────── Contenido ────────────── */}
      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={[styles.titles, { paddingTop: 4 }]}>Today</Text>
          <WeekCalendar
            onDayPress={(date) => console.log("Día seleccionado:", date)}
            markedDates={[
              new Date(), // hoy tiene dot
              new Date(new Date().setDate(new Date().getDate() + 2)), // en 2 días
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.titles}>Your progression</Text>
          <NutritionCard data={nutritionData} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  titles: {
    fontFamily: "DMSans_900Black", // títulos
    fontSize: 24,
    color: "#3090FE",
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 16,
  },

  section: {
    marginBottom: 8,
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
    flexDirection: "row", // ← imagen y textos lado a lado
    alignItems: "center", // ← centrado vertical
    gap: 16, // ← espacio entre foto y texto
  },

  // Nuevo: contenedor solo para los textos
  greetingTexts: {
    flexDirection: "column",
    gap: 2,
  },

  greeting: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A94A6",
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  userName: {
    fontFamily: "DMSans_700Bold",
    fontSize: 20,
    color: "#1A1F36",
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
    alignItems: "stretch", // ← era "center", esto comprimía el calendario
    justifyContent: "flex-start", // ← era "center", lo mandaba al medio
  },

  placeholder: {
    color: "#C0C7D4",
    fontSize: 14,
  },

  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32, // ← círculo perfecto
  },
});
