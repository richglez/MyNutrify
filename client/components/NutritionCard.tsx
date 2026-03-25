// NutritionCard -> client\components\NutritionCard.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface NutritionData {
  calories: { current: number; goal: number };
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
}

interface Props {
  data: NutritionData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(current: number, goal: number) {
  return goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;
}

// ─── Colores de gradiente por macro ──────────────────────────────────────────
const GRADIENTS = {
  calories: {
    bar: ["#60a5fa", "#6366f1"] as const, // Azul → Índigo
    ring: ["#60a5fa", "#6366f1"] as const,
    ringId: "gradCalories",
    textColor: "#6366f1",
    trackColor: "#ede9fe",
  },
  protein: {
    bar: ["#2563eb", "#06b6d4"] as const, // Azul → Cian
    ring: ["#2563eb", "#06b6d4"] as const,
    ringId: "gradProtein",
    textColor: "#0ea5e9",
    trackColor: "#e0f2fe",
  },
  carbs: {
    bar: ["#3b82f6", "#10b981"] as const, // Azul → Verde
    ring: ["#3b82f6", "#10b981"] as const,
    ringId: "gradCarbs",
    textColor: "#10b981",
    trackColor: "#d1fae5",
  },
};

// ─── Barra de progreso animada con gradiente ──────────────────────────────────
function ProgressBar({
  percentage,
  colors,
  delay = 0,
}: {
  percentage: number;
  colors: readonly [string, string];
  delay?: number;
}) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: Math.min(percentage, 100),
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const widthInterp = animVal.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={barStyles.track}>
      <Animated.View style={[barStyles.fillWrapper, { width: widthInterp }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={barStyles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F0F2F8",
    overflow: "hidden",
    marginTop: 8,
  },
  fillWrapper: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
});

// ─── Aro individual animado con gradiente SVG ─────────────────────────────────
const RING_SIZE = 88;
const RING_RADIUS = 36;
const RING_STROKE = 7;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function MacroRing({
  label,
  current,
  goal,
  unit,
  gradientColors,
  gradientId,
  trackColor,
  textColor,
  delay = 0,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  gradientColors: readonly [string, string];
  gradientId: string;
  trackColor: string;
  textColor: string;
  delay?: number;
}) {
  const percentage = pct(current, goal);
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: percentage,
      duration: 950,
      delay,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const cx = RING_SIZE / 2;
  const cy = RING_SIZE / 2;

  const strokeDashoffset = animVal.interpolate({
    inputRange: [0, 100],
    outputRange: [
      CIRCUMFERENCE,
      CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100,
    ],
  });

  return (
    <View style={ringStyles.wrapper}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </SvgLinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          stroke={trackColor}
          strokeWidth={RING_STROKE}
          fill="none"
        />

        {/* Progreso animado con gradiente */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          stroke={`url(#${gradientId})`}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>

      {/* Texto central */}
      <View style={ringStyles.center}>
        <Text style={[ringStyles.pctText, { color: textColor }]}>
          {percentage}%
        </Text>
      </View>

      {/* Etiqueta + valores */}
      <Text style={[ringStyles.label, { color: textColor }]}>{label}</Text>
      <Text style={ringStyles.values}>
        <Text style={[ringStyles.current, { color: gradientColors[0] }]}>
          {current}
        </Text>
        <Text style={[ringStyles.goal, { color: gradientColors[1] }]}>
          /{goal}
          {unit}
        </Text>
      </Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: 6,
  },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pctText: {
    fontSize: 15,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  label: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    includeFontPadding: false,
  },
  values: {
    includeFontPadding: false,
  },
  current: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
  goal: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
});

// ─── Card principal ───────────────────────────────────────────────────────────
export default function NutritionCard({ data }: Props) {
  const calPct = pct(data.calories.current, data.calories.goal);
  const cal = GRADIENTS.calories;
  const pro = GRADIENTS.protein;
  const carb = GRADIENTS.carbs;

  return (
    <View style={styles.card}>
      {/* ── Título + badge ── */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Today's Nutrition</Text>
        <View style={[styles.badge, calPct >= 100 && styles.badgeDone]}>
          <Text
            style={[styles.badgeText, calPct >= 100 && styles.badgeTextDone]}
          >
            {calPct >= 100 ? "✓ Goal reached" : `${calPct}% of goal`}
          </Text>
        </View>
      </View>

      {/* ── Tres aros ── */}
      <View style={styles.ringsRow}>
        <MacroRing
          label="Calories"
          current={data.calories.current}
          goal={data.calories.goal}
          unit=" kcal"
          gradientColors={cal.ring}
          gradientId={cal.ringId}
          trackColor={cal.trackColor}
          textColor={cal.textColor}
          delay={0}
        />

        <View style={styles.separator} />

        <MacroRing
          label="Protein"
          current={data.protein.current}
          goal={data.protein.goal}
          unit="g"
          gradientColors={pro.ring}
          gradientId={pro.ringId}
          trackColor={pro.trackColor}
          textColor={pro.textColor}
          delay={150}
        />

        <View style={styles.separator} />

        <MacroRing
          label="Carbs"
          current={data.carbs.current}
          goal={data.carbs.goal}
          unit="g"
          gradientColors={carb.ring}
          gradientId={carb.ringId}
          trackColor={carb.trackColor}
          textColor={carb.textColor}
          delay={300}
        />
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Resumen calorías ── */}
      <View style={styles.calSummaryRow}>
        <Text style={styles.calSummaryLabel}>Calories</Text>
        <View style={styles.calSummaryRight}>
          <Text style={styles.calSummaryCurrent}>
            {data.calories.current}
            <Text style={styles.calSummaryUnit}> cal</Text>
          </Text>
          <Text style={styles.calSummaryGoal}>/ {data.calories.goal}</Text>
          <Text style={styles.calSummaryLeft}>
            {"  "}
            {data.calories.goal - data.calories.current > 0
              ? `${data.calories.goal - data.calories.current} left`
              : "Goal reached!"}
          </Text>
        </View>
      </View>

      {/* ── Barra de progreso calorías con gradiente ── */}
      <ProgressBar percentage={calPct} colors={cal.bar} delay={400} />
    </View>
  );
}

// ─── Estilos card ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fcfdff",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#7CA4FF",
    letterSpacing: -0.2,
  },

  badge: {
    backgroundColor: "#F0F7FF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeDone: {
    backgroundColor: "#EDFDF5",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#1A6BFF",
  },
  badgeTextDone: {
    color: "#22C55E",
  },

  ringsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  separator: {
    width: 1,
    height: 80,
    backgroundColor: "#E8EEFF",
  },

  divider: {
    height: 1,
    backgroundColor: "#E8EEFF",
    marginTop: 20,
    marginBottom: 16,
  },

  calSummaryRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  calSummaryLabel: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#6366f1",
    includeFontPadding: false,
  },
  calSummaryRight: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  calSummaryCurrent: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    color: "#6366f1",
    includeFontPadding: false,
  },
  calSummaryUnit: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "#a5b4fc",
  },
  calSummaryGoal: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "#a5b4fc",
    includeFontPadding: false,
  },
  calSummaryLeft: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: "#6366f1",
    includeFontPadding: false,
  },
});
