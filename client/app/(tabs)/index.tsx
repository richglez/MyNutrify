// Dashboard -> app/(tabs)/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WeekCalendar from "@/components/Weekcalendar";
import NutritionCard from "@/components/NutritionCard";
import { DailyMacro } from "@/types/calendar";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/useAuthStore";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

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
  const name = useAuthStore((s) => s.name);
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

  const today = new Date();

  const macroDailyData: DailyMacro[] = [
    {
      date: new Date(new Date().setDate(today.getDate() - 4)),
      status: "completed",
    },
    {
      date: new Date(new Date().setDate(today.getDate() - 3)),
      status: "completed",
    },
    {
      date: new Date(new Date().setDate(today.getDate() - 2)),
      status: "partial",
    },
    {
      date: new Date(new Date().setDate(today.getDate() - 1)),
      status: "missed",
    },
  ];

    // StatusBar en tabs con Expo Router .- Fuerza el estilo cada vez que esta tab recibe el foco
    useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle("dark-content"); // ← método correcto
      }, []),
    );

  return (
    <LinearGradient
      colors={["#F7FAFD", "#F7FAFD", "#d6e5ff", "#bad2ff"]}
      locations={[0, 0.3, 0.7, 1]}
      start={{ x: 0.5, y: 0 }} // ← empieza arriba al centro
      end={{ x: 0.5, y: 1 }} // ← termina abajo al centro
      style={[styles.safe]}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]}
      >
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
              <Text style={styles.nameStyles}>{name}</Text>
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
              dailyMacros={macroDailyData} // estatus de macros para cada día (completado, parcial, perdido)
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.titles}>Progression</Text>
            <NutritionCard data={nutritionData} />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // backgroundColor: "#F5F7FA",
    paddingBottom: 100, // ← espacio para la BottomNavBar flotante
  },

  titles: {
    fontFamily: "DMSans_600SemiBold", // títulos
    fontSize: 24,
    letterSpacing: -0.5,
    color: "#000000",
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 16,
  },

  section: {
    marginBottom: 30,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 30,
    // backgroundColor: "#D6E9FF",
  },

  greetingBlock: {
    flexDirection: "row", // ← imagen y textos lado a lado
    alignItems: "center", // ← centrado vertical
    gap: 16, // ← espacio entre foto y texto
  },
  scroll: {
    flex: 1,
    width: "100%",
  },

  // Nuevo: contenedor solo para los textos
  greetingTexts: {
    flexDirection: "column",
    gap: 2,
  },

  greeting: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#6c727f",
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  nameStyles: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 20,
    color: "#000000",
    letterSpacing: -0.3,
  },

  // ── Campana ────────────────────────────────────────────────────────────────
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2E90FE", // verde teal como en la imagen
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
