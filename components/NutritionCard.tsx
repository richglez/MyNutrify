// components/NutritionCard.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle } from "react-native-svg";


// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface NutritionData {
  calories: { current: number; goal: number };
  protein: { current: number; goal: number }; // gramos
  carbs: { current: number; goal: number }; // gramos
}

interface Props {
  data: NutritionData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(current: number, goal: number) {
  return goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;
}

// ─── Barra de progreso animada ────────────────────────────────────────────────
function ProgressBar({
  percentage,
  color,
  delay = 0,
}: {
  percentage: number;
  color: string;
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
      <Animated.View
        style={[barStyles.fill, { width: widthInterp, backgroundColor: color }]}
      />
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
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});

// ─── Aro individual animado ───────────────────────────────────────────────────
const RING_SIZE = 88;
const RING_RADIUS = 36;
const RING_STROKE = 7;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function MacroRing({
  label,
  current,
  goal,
  unit,
  color,
  trackColor,
  delay = 0,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
  trackColor: string;
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
      {/* SVG aro */}
      <Svg width={RING_SIZE} height={RING_SIZE}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          stroke={trackColor}
          strokeWidth={RING_STROKE}
          fill="none"
        />
        {/* Progreso animado */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={RING_RADIUS}
          stroke={color}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>

      {/* Texto central dentro del aro */}
      <View style={ringStyles.center}>
        <Text style={[ringStyles.pctText, { color }]}>{percentage}%</Text>
      </View>

      {/* Etiqueta + valores debajo del aro */}
      <Text style={ringStyles.label}>{label}</Text>
      <Text style={ringStyles.values}>
        <Text style={ringStyles.current}>{current}</Text>
        <Text style={ringStyles.goal}>
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
    color: "#0053D3",
    includeFontPadding: false,
  },
  values: {
    includeFontPadding: false,
  },
  current: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    color: "#3f78ff",
  },
  goal: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    color: "#7CA4FF",
  },
});

// ─── Card principal ───────────────────────────────────────────────────────────
export default function NutritionCard({ data }: Props) {
  const calPct = pct(data.calories.current, data.calories.goal);

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
          color="#2E90FE"
          trackColor="#e7f2ff"
          delay={0}
        />

        <View style={styles.separator} />

        <MacroRing
          label="Protein"
          current={data.protein.current}
          goal={data.protein.goal}
          unit="g"
          color="#2E90FE"
          trackColor="#e7f2ff"
          delay={150}
        />

        <View style={styles.separator} />

        <MacroRing
          label="Carbs"
          current={data.carbs.current}
          goal={data.carbs.goal}
          unit="g"
          color="#2E90FE"
          trackColor="#e7f2ff"
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

      {/* Barra de progreso calorías */}
      <ProgressBar percentage={calPct} color="#3090FE" delay={400} />
    </View>
  );
}

// ─── Estilos card ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fafcff",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 16,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    // Android
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
    fontFamily: "DMSans_600SemiBold", // títulos
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
    backgroundColor: "#7CA4FF",
  },

  divider: {
    height: 1,
    backgroundColor: "#7CA4FF",
    marginTop: 20,
    marginBottom: 16,
  },

  // ── Resumen calorías ────────────────────────────────────────────────────────
  calSummaryRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  calSummaryLabel: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    color: "#3f78ff",
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
    color: "#3f78ff",
    includeFontPadding: false,
  },
  calSummaryUnit: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "#7CA4FF",
  },
  calSummaryGoal: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "#7CA4FF",
    includeFontPadding: false,
  },
  calSummaryLeft: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: "#3471ff",
    includeFontPadding: false,
  },
});
