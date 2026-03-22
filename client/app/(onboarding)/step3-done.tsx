// client/app/(onboarding)/step3-done.tsx

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { saveOnboarding } from "@/services/db";
import { useAuthStore } from "@/store/useAuthStore";




export default function Step3Done() {
  const userId = useAuthStore((s) => s.userId); // ← lee del store
  const { goal, sex, age, weight, height } = useLocalSearchParams();

  // Animaciones
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Círculo aparece
      Animated.parallel([
        Animated.spring(circleScale, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // 2. Check aparece con bounce
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      // 3. Texto aparece
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // 4. Botón aparece
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = async () => {
    await saveOnboarding(userId!, {
      goal: goal as string,
      sex: sex as string,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
    });
    router.replace("/(tabs)"); // Entra al dashboard
  };

  return (
    <View style={styles.container}>
      {/* Progress bar completo */}
      <View style={styles.progressRow}>
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={[styles.progressBar, styles.progressActive]} />
        <View style={[styles.progressBar, styles.progressActive]} />
      </View>

      <View style={styles.content}>
        {/* Círculo con check animado */}
        <Animated.View
          style={[
            styles.circle,
            {
              opacity: circleOpacity,
              transform: [{ scale: circleScale }],
            },
          ]}
        >
          <Animated.Text
            style={[styles.checkmark, { transform: [{ scale: checkScale }] }]}
          >
            ✓
          </Animated.Text>
        </Animated.View>

        {/* Texto */}
        <Animated.View style={{ opacity: textOpacity, alignItems: "center" }}>
          <Text style={styles.title}>¡Todo listo!</Text>
          <Text style={styles.subtitle}>
            Tu perfil está configurado. Ahora podemos personalizar tu
            experiencia nutricional.
          </Text>

          {/* Resumen de datos */}
          <View style={styles.summary}>
            <SummaryRow
              label="Objetivo"
              value={GOAL_LABELS[goal as string] ?? (goal as string)}
            />
            <SummaryRow
              label="Sexo"
              value={sex === "male" ? "Masculino" : "Femenino"}
            />
            <SummaryRow label="Edad" value={`${age} años`} />
            <SummaryRow label="Peso" value={`${weight} kg`} />
            <SummaryRow label="Altura" value={`${height} cm`} isLast />
          </View>
        </Animated.View>

        {/* Botón */}
        <Animated.View style={[styles.btnWrap, { opacity: btnOpacity }]}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Empezar 🚀</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}


// Componente fila del resumen
function SummaryRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
}

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Perder peso",
  maintain: "Mantener peso",
  gain_muscle: "Ganar músculo",
  eat_healthy: "Comer saludable",
};

const PRIMARY = "#2E90FE";
const PRIMARY_LIGHT = "#E6F1FB";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  // Progress
  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 32,
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

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },

  // Check animado
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  checkmark: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "500",
    lineHeight: 56,
  },

  // Texto
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  // Resumen
  summary: {
    width: "100%",
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4, // ← agrega esto

  },
  divider: {
    height: 0.5,
    backgroundColor: "#B5D4F4",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#888",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0C447C",
    paddingLeft: 19,
  },

  // Botón
  btnWrap: {
    width: "100%",
  },
  btn: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
