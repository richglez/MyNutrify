// client\app\(onboarding)\step1-goal.tsx

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import GoalIllustration from "@/assets/images/onboarding_goal_illustration.svg";

type Goal = "lose_weight" | "maintain" | "gain_muscle" | "eat_healthy";

interface GoalOption {
  id: Goal;
  title: string;
  subtitle: string;
  icon: string;
}

const GOALS: GoalOption[] = [
  {
    id: "lose_weight",
    title: "Perder peso",
    subtitle: "Reducir grasa corporal de forma saludable",
    icon: "📉",
  },
  {
    id: "maintain",
    title: "Mantener peso",
    subtitle: "Equilibrar calorías y nutrición",
    icon: "⚖️",
  },
  {
    id: "gain_muscle",
    title: "Ganar músculo",
    subtitle: "Aumentar masa muscular y fuerza",
    icon: "💪",
  },
  {
    id: "eat_healthy",
    title: "Comer saludable",
    subtitle: "Mejorar hábitos y bienestar general",
    icon: "🥗",
  },
];

export default function Step1Goal() {
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    // Guarda el goal y navega al siguiente paso
    router.push({
      pathname: "/(onboarding)/step2-body",
      params: { goal: selected },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header row: flecha + progress */}
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => router.replace("/(auth)/register")}>
          <Ionicons name="arrow-back" size={18} color="#2E90FE" />
        </Pressable>
        <View style={styles.progressRow}>
          <View style={[styles.progressBar, styles.progressActive]} />
          <View style={styles.progressBar} />
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Header */}
      <Text style={styles.step}>Paso 1 de 3</Text>
      <Text style={styles.title}>¿Cuál es tu objetivo?</Text>
      <Text style={styles.subtitle}>
        Esto nos ayuda a personalizar tu experiencia nutricional.
      </Text>

      <GoalIllustration height={180} style={styles.illustrationContainer} />

      {/* Opciones */}
      {GOALS.map((goal) => {
        const isSelected = selected === goal.id;
        return (
          <TouchableOpacity
            key={goal.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => setSelected(goal.id)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
            >
              <Text style={styles.icon}>{goal.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text
                style={[
                  styles.cardTitle,
                  isSelected && styles.cardTitleSelected,
                ]}
              >
                {goal.title}
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  isSelected && styles.cardSubtitleSelected,
                ]}
              >
                {goal.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Botón continuar */}
      <TouchableOpacity
        style={[styles.btn, !selected && styles.btnDisabled]}
        onPress={handleContinue}
        disabled={!selected}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Continuar</Text>
      </TouchableOpacity>

      {/* Skip */}
      <TouchableOpacity onPress={() => router.push("/(onboarding)/step2-body")}>
        <Text style={styles.skip}>Omitir por ahora</Text>
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = "#2E90FE";
const PRIMARY_LIGHT = "#E6F1FB";
const PRIMARY_DARK = "#0C447C";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },

  // Progress
  progressRow: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    marginLeft: 12, // gap entre botón y barras
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: PRIMARY_LIGHT,
  },
  progressActive: {
    backgroundColor: PRIMARY,
  },

  // Header
  step: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#111",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    lineHeight: 22,
    marginBottom: 4,
  },

  // Cards
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: PRIMARY,
    backgroundColor: PRIMARY_LIGHT,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: {
    backgroundColor: "#B5D4F4",
  },
  icon: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
    marginBottom: 2,
  },
  cardTitleSelected: {
    color: PRIMARY_DARK,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#888",
  },
  cardSubtitleSelected: {
    color: PRIMARY,
  },

  // Botón
  btn: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  // Skip
  skip: {
    textAlign: "center",
    fontSize: 13,
    color: "#888",
    marginTop: 14,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: PRIMARY_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    // ← sin position: absolute
  },

  illustrationContainer: {
    top: -10,
    alignSelf: "center",
    marginBottom: 4, // ← controla gap con las cards
  },
});
