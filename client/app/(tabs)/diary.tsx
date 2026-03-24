// DiaryScreen → client\app\(tabs)\diary.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg"; // ← necesitas react-native-svg

// ── Tipos ──────────────────────────────────────────────────────────────────

type MealSection = {
  id: string;
  label: string;
  icon: string;
  consumed: number;
  goal: number;
};

// ── Datos de ejemplo ───────────────────────────────────────────────────────

const MEALS: MealSection[] = [
  { id: "breakfast", label: "Desayuno", icon: "☕", consumed: 56, goal: 635 },
  { id: "snack1", label: "Colación 1", icon: "🍎", consumed: 0, goal: 150 },
  { id: "lunch", label: "Comida", icon: "🥗", consumed: 856, goal: 847 },
  { id: "snack2", label: "Colación 2", icon: "🥜", consumed: 0, goal: 150 },
  { id: "dinner", label: "Cena", icon: "🍽️", consumed: 379, goal: 529 },
];

const DAILY_GOAL = 2100;

// ── Helpers de fecha ───────────────────────────────────────────────────────

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const MONTHS_SHORT = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// ── DiaryScreen ────────────────────────────────────────────────────────────

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(TODAY));

  const isFutureDay = selectedDate > TODAY;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
    }, []),
  );

  const meals = isFutureDay ? MEALS.map((m) => ({ ...m, consumed: 0 })) : MEALS;
  const totalConsumed = meals.reduce((sum, m) => sum + m.consumed, 0);
  const remaining = DAILY_GOAL - totalConsumed;

  const handleAddFood = (mealId: string, mealLabel: string) => {
    router.push({ pathname: "/add-food", params: { mealId, mealLabel } });
  };

  return (
    <LinearGradient
      colors={[
        "#0A2472",
        "#0D47A1",
        "#1976D2",
        "#42A5F5",
        "#90CAF9",
        "#E3F2FD",
        "#F8FBFF",
      ]}
      locations={[0, 0.12, 0.28, 0.45, 0.62, 0.8, 1]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 150 },
        ]}
      >
        {/* Header — INTACTO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Diary</Text>
            <Text style={styles.placeHolder}>Your daily diary.</Text>
          </View>
          <TouchableOpacity style={styles.gridBtn} activeOpacity={0.8}>
            <Ionicons name="grid" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* DateHeader — INTACTO */}
        <DateHeader
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* ── CalorieSummary REDISEÑADO ── */}
        <CalorieSummary
          goal={DAILY_GOAL}
          consumed={totalConsumed}
          remaining={remaining}
          isFuture={isFutureDay}
        />

        {/* ── MealCards REDISEÑADAS ── */}
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onAdd={() => handleAddFood(meal.id, meal.label)}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

// ── DateHeader — INTACTO ───────────────────────────────────────────────────

type DateHeaderProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

function DateHeader({ selectedDate, onDateChange }: DateHeaderProps) {
  const [calVisible, setCalVisible] = useState(false);
  const [calMonth, setCalMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const changeDay = (n: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + n);
    onDateChange(next);
  };

  const getDayLabel = () => {
    if (isSameDay(selectedDate, TODAY)) return "Hoy";
    const yesterday = new Date(TODAY);
    yesterday.setDate(TODAY.getDate() - 1);
    if (isSameDay(selectedDate, yesterday)) return "Ayer";
    const tomorrow = new Date(TODAY);
    tomorrow.setDate(TODAY.getDate() + 1);
    if (isSameDay(selectedDate, tomorrow)) return "Mañana";
    return `${selectedDate.getDate()} ${MONTHS_SHORT[selectedDate.getMonth()]}`;
  };

  const getFullDateLabel = () => {
    const dayName = WEEK_DAYS[selectedDate.getDay()];
    const month = MONTHS_SHORT[selectedDate.getMonth()];
    return `${dayName} ${selectedDate.getDate()} de ${month}, ${selectedDate.getFullYear()}`;
  };

  const openCalendar = () => {
    setCalMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );
    setCalVisible(true);
  };

  const generateDays = (): (Date | null)[] => {
    const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
    const lastDay = new Date(
      calMonth.getFullYear(),
      calMonth.getMonth() + 1,
      0,
    );
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(calMonth.getFullYear(), calMonth.getMonth(), d));
    }
    return days;
  };

  return (
    <>
      <View style={headerStyles.container}>
        <View style={headerStyles.row}>
          <TouchableOpacity
            style={headerStyles.arrowBtn}
            onPress={() => changeDay(-1)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyles.dateBtn}
            onPress={openCalendar}
            activeOpacity={0.8}
          >
            <Text style={headerStyles.dayLabel}>{getDayLabel()}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="rgba(255, 255, 255, 0.83)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyles.arrowBtn}
            onPress={() => changeDay(1)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={headerStyles.fullDate}>{getFullDateLabel()}</Text>
      </View>

      <Modal visible={calVisible} transparent animationType="fade">
        <Pressable
          style={calStyles.overlay}
          onPress={() => setCalVisible(false)}
        >
          <Pressable
            style={calStyles.sheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={calStyles.monthRow}>
              <TouchableOpacity
                onPress={() =>
                  setCalMonth(
                    new Date(
                      calMonth.getFullYear(),
                      calMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                style={calStyles.monthArrowBtn}
              >
                <Text style={calStyles.monthArrow}>‹</Text>
              </TouchableOpacity>
              <Text style={calStyles.monthLabel}>
                {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCalMonth(
                    new Date(
                      calMonth.getFullYear(),
                      calMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                style={calStyles.monthArrowBtn}
              >
                <Text style={calStyles.monthArrow}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={calStyles.weekRow}>
              {["D", "L", "M", "X", "J", "V", "S"].map((d) => (
                <Text key={d} style={calStyles.weekDay}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={calStyles.grid}>
              {generateDays().map((day, i) => {
                if (!day)
                  return <View key={`empty-${i}`} style={calStyles.dayCell} />;
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, TODAY);
                const isFuture = day > TODAY;
                return (
                  <TouchableOpacity
                    key={day.toISOString()}
                    style={[
                      calStyles.dayCell,
                      isSelected && calStyles.daySelected,
                      isToday && !isSelected && calStyles.dayToday,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => {
                      onDateChange(day);
                      setCalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        calStyles.dayText,
                        isSelected && calStyles.dayTextSelected,
                        isToday && !isSelected && calStyles.dayTextToday,
                        isFuture && !isSelected && calStyles.dayTextFuture,
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={calStyles.todayBtn}
              onPress={() => {
                onDateChange(new Date(TODAY));
                setCalVisible(false);
              }}
            >
              <Text style={calStyles.todayBtnText}>Ir a hoy</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// ── CalorieSummary — REDISEÑADA ────────────────────────────────────────────
// Ring circular con gradiente + 3 pills de macros debajo

type CalorieSummaryProps = {
  goal: number;
  consumed: number;
  remaining: number;
  isFuture?: boolean;
};

function CalorieSummary({
  goal,
  consumed,
  remaining,
  isFuture,
}: CalorieSummaryProps) {
  const isOver = remaining < 0;
  const progress = Math.min(consumed / goal, 1);

  // Geometría del ring SVG
  const SIZE = 140;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={summaryStyles.card}>
      {/* Ring + número central */}
      <View style={summaryStyles.ringWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3090FE" />
              <Stop offset="100%" stopColor="#64B5F6" />
            </SvgGradient>
          </Defs>
          {/* Track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="#EEF3FF"
            strokeWidth={STROKE}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={isOver ? "#FF6B6B" : "url(#ringGrad)"}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        {/* Texto sobre el ring */}
        <View style={summaryStyles.ringCenter}>
          <Text
            style={[summaryStyles.ringNumber, isOver && summaryStyles.ringOver]}
          >
            {Math.abs(remaining).toLocaleString()}
          </Text>
          <Text style={summaryStyles.ringLabel}>
            {isFuture ? "disponibles" : isOver ? "excedido" : "restantes"}
          </Text>
        </View>
      </View>

      {/* Pills: Meta · Consumido · % */}
      <View style={summaryStyles.pillsRow}>
        <View style={summaryStyles.pill}>
          <View
            style={[summaryStyles.pillDot, { backgroundColor: "#C5D8FF" }]}
          />
          <Text style={summaryStyles.pillValue}>{goal.toLocaleString()}</Text>
          <Text style={summaryStyles.pillSub}>Meta</Text>
        </View>
        <View style={summaryStyles.pillDivider} />
        <View style={summaryStyles.pill}>
          <View
            style={[summaryStyles.pillDot, { backgroundColor: "#3090FE" }]}
          />
          <Text style={summaryStyles.pillValue}>
            {consumed.toLocaleString()}
          </Text>
          <Text style={summaryStyles.pillSub}>Consumido</Text>
        </View>
        <View style={summaryStyles.pillDivider} />
        <View style={summaryStyles.pill}>
          <View
            style={[
              summaryStyles.pillDot,
              { backgroundColor: isOver ? "#FF6B6B" : "#34D399" },
            ]}
          />
          <Text
            style={[
              summaryStyles.pillValue,
              { color: isOver ? "#FF6B6B" : "#34D399" },
            ]}
          >
            {Math.round(progress * 100)}%
          </Text>
          <Text style={summaryStyles.pillSub}>Completado</Text>
        </View>
      </View>
    </View>
  );
}

// ── MealCard — REDISEÑADA ──────────────────────────────────────────────────
// Progress bar de fill + badge de estado

type MealCardProps = {
  meal: MealSection;
  onAdd: () => void;
};

function MealCard({ meal, onAdd }: MealCardProps) {
  const isOverGoal = meal.consumed > meal.goal;
  const isEmpty = meal.consumed === 0;
  const progress = meal.goal > 0 ? Math.min(meal.consumed / meal.goal, 1) : 0;

  // Color del progress bar
  const barColor = isOverGoal ? "#FF6B6B" : isEmpty ? "#E8EEFF" : "#3090FE";
  const barFill = isOverGoal ? "#FF6B6B" : "#3090FE";

  // Badge label
  const badgeLabel = isEmpty
    ? "Vacío"
    : isOverGoal
      ? `+${meal.consumed - meal.goal} cal`
      : `${Math.round(progress * 100)}%`;

  const badgeBg = isEmpty ? "#F0F4FF" : isOverGoal ? "#FFF0F0" : "#EEF8FF";

  const badgeColor = isEmpty ? "#B0BAD0" : isOverGoal ? "#FF6B6B" : "#3090FE";

  return (
    <View style={cardStyles.card}>
      {/* Fila principal */}
      <View style={cardStyles.row}>
        {/* Icono */}
        <View style={cardStyles.iconWrapper}>
          <Text style={cardStyles.iconText}>{meal.icon}</Text>
        </View>

        {/* Info */}
        <View style={cardStyles.info}>
          <View style={cardStyles.topRow}>
            <Text style={cardStyles.label}>{meal.label}</Text>
            {/* Badge */}
            <View style={[cardStyles.badge, { backgroundColor: badgeBg }]}>
              <Text style={[cardStyles.badgeText, { color: badgeColor }]}>
                {badgeLabel}
              </Text>
            </View>
          </View>
          <Text style={cardStyles.cals}>
            <Text
              style={[
                cardStyles.calsConsumed,
                isOverGoal && { color: "#FF6B6B" },
              ]}
            >
              {meal.consumed}
            </Text>
            <Text style={cardStyles.calsGoal}> / {meal.goal} cal</Text>
          </Text>
        </View>

        {/* Botón + */}
        <TouchableOpacity
          style={cardStyles.addBtn}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={cardStyles.barTrack}>
        <View
          style={[
            cardStyles.barFill,
            {
              width: `${progress * 100}%` as any,
              backgroundColor: barFill,
              opacity: isEmpty ? 0 : 1,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ── Estilos nuevos ─────────────────────────────────────────────────────────

const summaryStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#3090FE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    gap: 16,
  },
  ringWrapper: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNumber: {
    fontFamily: "DMSans_900Black",
    fontSize: 28,
    color: "#1A1A2E",
    letterSpacing: -1,
  },
  ringOver: {
    color: "#FF6B6B",
  },
  ringLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#9098A3",
    marginTop: 1,
  },
  pillsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F7FAFF",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillValue: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#1A1A2E",
  },
  pillSub: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#9098A3",
  },
  pillDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E8EEF8",
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingTop: 14,
    paddingBottom: 0,
    paddingHorizontal: 16,
    shadowColor: "#2A6DB5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: { fontSize: 22 },
  info: {
    flex: 1,
    gap: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#1A1A2E",
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 11,
  },
  cals: {
    fontSize: 13,
  },
  calsConsumed: {
    fontFamily: "DMSans_700Bold",
    color: "#1A1A2E",
  },
  calsGoal: {
    fontFamily: "DMSans_400Regular",
    color: "#9098A3",
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#3090FE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  barTrack: {
    height: 4,
    backgroundColor: "#EEF3FF",
    marginHorizontal: -16,
    borderRadius: 0,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 0,
  },
});

// ── Estilos base (header + gradiente — INTACTOS) ───────────────────────────

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1A6FD4",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  dayLabel: { color: "#fff", fontSize: 18, fontFamily: "DMSans_700Bold" },
  fullDate: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 6,
  },
});

const calStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 160,
  },
  sheet: {
    width: "88%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthArrowBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthArrow: {
    fontSize: 22,
    color: "#9098A3",
    fontFamily: "DMSans_400Regular",
  },
  monthLabel: { fontSize: 15, fontFamily: "DMSans_700Bold", color: "#1A1A2E" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDay: {
    width: 36,
    textAlign: "center",
    fontSize: 11,
    color: "#9098A3",
    fontFamily: "DMSans_400Regular",
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: { backgroundColor: "#1A6FD4", borderRadius: 18 },
  dayToday: { backgroundColor: "rgba(26,111,212,0.1)", borderRadius: 18 },
  dayText: { fontSize: 14, color: "#1A1A2E", fontFamily: "DMSans_400Regular" },
  dayTextSelected: { color: "#fff", fontFamily: "DMSans_700Bold" },
  dayTextToday: { color: "#1A6FD4", fontFamily: "DMSans_700Bold" },
  dayTextFuture: { color: "#C0C5CC" },
  todayBtn: {
    marginTop: 16,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#1A6FD4",
  },
  todayBtnText: {
    color: "#1A6FD4",
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
  },
});

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  title: {
    fontFamily: "DMSans_900Black",
    fontSize: 36,
    letterSpacing: -1.5,
    color: "#F7FFF5",
  },
  placeHolder: { fontFamily: "DMSans_400Regular", color: "#7BA7E1" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gridBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(217, 231, 255, 0.44)",
    backgroundColor: "rgba(112, 178, 239, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a6b7ec",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
});
