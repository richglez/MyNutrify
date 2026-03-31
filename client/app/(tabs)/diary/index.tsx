// DiaryScreen → client\app\(tabs)\diary\index.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { getDayMeals, Meal, DayTotals } from "@/services/mealService";
import { useAuthStore } from "@/store/useAuthStore";

// ── Tipos ──────────────────────────────────────────────────────────────────

type MealSection = {
  id: string;
  label: string;
  icon: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  consumed: number;
  goal: number;
  meal: Meal | null; // datos reales de la API
};

// ── Config estática por mealType ───────────────────────────────────────────

const MEAL_CONFIG = [
  { id: "breakfast", label: "Desayuno", icon: "☕", goal: 635 },
  { id: "lunch", label: "Comida", icon: "🥗", goal: 847 },
  { id: "dinner", label: "Cena", icon: "🍽️", goal: 529 },
  { id: "snack", label: "Colación", icon: "🍎", goal: 150 },
] as const;

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

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
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
  const userId = useAuthStore((s) => s.userId);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date(TODAY));
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dayTotals, setDayTotals] = useState<DayTotals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loading, setLoading] = useState(false);

  const isFutureDay = selectedDate > TODAY;

  // ── Fetch del día ────────────────────────────────────────────────────────

  const fetchDayMeals = useCallback(
    async (date: Date) => {
      if (!userId) return;
      try {
        setLoading(true);
        const data = await getDayMeals(userId, toISODate(date));
        setMeals(data.meals);
        setDayTotals(data.dayTotals);
      } catch (err) {
        console.error("❌ fetchDayMeals:", err);
        setMeals([]);
        setDayTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  // Refetch al enfocar la pantalla (ej: volver de add-food)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle("light-content");
      fetchDayMeals(selectedDate);
    }, [selectedDate, fetchDayMeals]),
  );

  // Refetch al cambiar de fecha
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchDayMeals(date);
  };

  // ── Construir MealSections mezclando config + datos reales ───────────────

  const mealSections: MealSection[] = MEAL_CONFIG.map((config) => {
    const realMeal = isFutureDay
      ? null
      : (meals.find((m) => m.mealType === config.id) ?? null);

    return {
      id: config.id,
      label: config.label,
      icon: config.icon,
      mealType: config.id,
      consumed: realMeal?.totalCalories ?? 0,
      goal: config.goal,
      meal: realMeal,
    };
  });

  const totalConsumed = isFutureDay ? 0 : dayTotals.calories;
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
        "#addaff",
        "#F8F8F8",
        "#FBFAF9",
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Diary</Text>
            <Text style={styles.subtitle}>Your daily diary.</Text>
          </View>
          <TouchableOpacity style={styles.gridBtn} activeOpacity={0.8}>
            <Ionicons name="grid" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* DateHeader */}
        <DateHeader
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginTop: 12 }}
          />
        )}

        {/* CalorieSummary */}
        {!loading && (
          <CalorieSummary
            goal={DAILY_GOAL}
            consumed={totalConsumed}
            remaining={remaining}
            protein={isFutureDay ? 0 : dayTotals.protein}
            carbs={isFutureDay ? 0 : dayTotals.carbs}
            fat={isFutureDay ? 0 : dayTotals.fat}
            isFuture={isFutureDay}
          />
        )}

        {/* MealCards */}
        {!loading &&
          mealSections.map((section) => (
            <MealCard
              key={section.id}
              meal={section}
              onAdd={() => handleAddFood(section.id, section.label)}
            />
          ))}
      </ScrollView>
    </LinearGradient>
  );
}

// ── DateHeader ─────────────────────────────────────────────────────────────

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

  const generateDays = (): (Date | null)[] => {
    const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
    const lastDay = new Date(
      calMonth.getFullYear(),
      calMonth.getMonth() + 1,
      0,
    );
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(calMonth.getFullYear(), calMonth.getMonth(), d));
    return days;
  };

  return (
    <>
      <View style={calendarCaloriesStyles.container}>
        <View style={calendarCaloriesStyles.row}>
          <TouchableOpacity
            style={calendarCaloriesStyles.arrowBtn}
            onPress={() => changeDay(-1)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={calendarCaloriesStyles.dateBtn}
            onPress={() => {
              setCalMonth(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  1,
                ),
              );
              setCalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={calendarCaloriesStyles.dayLabel}>{getDayLabel()}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color="rgba(255,255,255,0.83)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={calendarCaloriesStyles.arrowBtn}
            onPress={() => changeDay(1)}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={calendarCaloriesStyles.fullDate}>
          {getFullDateLabel()}
        </Text>
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

// ── CalorieSummary ─────────────────────────────────────────────────────────

type CalorieSummaryProps = {
  goal: number;
  consumed: number;
  remaining: number;
  protein: number;
  carbs: number;
  fat: number;
  isFuture?: boolean;
};

function CalorieSummary({
  goal,
  consumed,
  remaining,
  protein,
  carbs,
  fat,
  isFuture,
}: CalorieSummaryProps) {
  const isOver = remaining < 0;
  const progress = Math.min(consumed / goal, 1);

  const SIZE = 140;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={summaryStyles.card}>
      <View style={summaryStyles.ringWrapper}>
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3090FE" />
              <Stop offset="100%" stopColor="#64B5F6" />
            </SvgGradient>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke="#EEF3FF"
            strokeWidth={STROKE}
            fill="none"
          />
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

      {/* Macros: Proteína · Carbs · Grasa */}
      <View style={summaryStyles.macrosRow}>
        <MacroPill label="Proteína" value={protein} color="#6C8EFF" unit="g" />
        <MacroPill label="Carbs" value={carbs} color="#F5A47A" unit="g" />
        <MacroPill label="Grasa" value={fat} color="#FF6B9D" unit="g" />
      </View>
    </View>
  );
}

function MacroPill({
  label,
  value,
  color,
  unit,
}: {
  label: string;
  value: number;
  color: string;
  unit: string;
}) {
  return (
    <View style={summaryStyles.macroPill}>
      <Text style={[summaryStyles.macroValue, { color }]}>
        {value.toFixed(1)}
        {unit}
      </Text>
      <Text style={summaryStyles.macroLabel}>{label}</Text>
    </View>
  );
}

// ── MealCard ───────────────────────────────────────────────────────────────

type MealCardProps = {
  meal: MealSection;
  onAdd: () => void;
};

function MealCard({ meal, onAdd }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isOverGoal = meal.consumed > meal.goal;
  const isEmpty = meal.consumed === 0;
  const progress = meal.goal > 0 ? Math.min(meal.consumed / meal.goal, 1) : 0;
  const barFill = isOverGoal ? "#FF6B6B" : "#3090FE";
  const badgeLabel = isEmpty
    ? "Vacío"
    : isOverGoal
      ? `+${meal.consumed - meal.goal} cal`
      : `${Math.round(progress * 100)}%`;
  const badgeBg = isEmpty ? "#F0F4FF" : isOverGoal ? "#FFF0F0" : "#EEF8FF";
  const badgeColor = isEmpty ? "#B0BAD0" : isOverGoal ? "#FF6B6B" : "#3090FE";

  const hasItems = (meal.meal?.items?.length ?? 0) > 0;

  return (
    <View style={cardStyles.card}>
      {/* Fila principal */}
      <View style={cardStyles.row}>
        <TouchableOpacity
          style={cardStyles.iconWrapper}
          onPress={() => hasItems && setExpanded((v) => !v)}
          activeOpacity={hasItems ? 0.7 : 1}
        >
          <Text style={cardStyles.iconText}>{meal.icon}</Text>
        </TouchableOpacity>

        <View style={cardStyles.info}>
          <View style={cardStyles.topRow}>
            <Text style={cardStyles.label}>{meal.label}</Text>
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
              {meal.consumed.toFixed(0)}
            </Text>
            <Text style={cardStyles.calsGoal}> / {meal.goal} cal</Text>
          </Text>
        </View>

        {/* Expand chevron (si hay items) + botón + */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {hasItems && (
            <TouchableOpacity
              onPress={() => setExpanded((v) => !v)}
              style={{ padding: 4 }}
            >
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#9098A3"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={cardStyles.addBtn}
            onPress={onAdd}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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

      {/* Items expandibles */}
      {expanded && hasItems && (
        <View style={cardStyles.itemsList}>
          {meal.meal!.items.map((item, idx) => (
            <View key={idx} style={cardStyles.itemRow}>
              <View style={cardStyles.itemDot} />
              <View style={{ flex: 1 }}>
                <Text style={cardStyles.itemName}>{item.food.name}</Text>
                {item.food.brand && (
                  <Text style={cardStyles.itemBrand}>{item.food.brand}</Text>
                )}
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={cardStyles.itemCals}>
                  {item.calories.toFixed(0)} cal
                </Text>
                <Text style={cardStyles.itemMacros}>
                  {item.quantity}
                  {item.food.unit} · P {item.protein.toFixed(1)}g
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────

const summaryStyles = StyleSheet.create({
  card: {
    backgroundColor: "#f7fbff",
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
  ringOver: { color: "#FF6B6B" },
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
    backgroundColor: "#eff6fc",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  pill: { flex: 1, alignItems: "center", gap: 3 },
  pillDot: { width: 8, height: 8, borderRadius: 4 },
  pillValue: { fontFamily: "DMSans_700Bold", fontSize: 15, color: "#1A1A2E" },
  pillSub: { fontFamily: "DMSans_400Regular", fontSize: 10, color: "#9098A3" },
  pillDivider: { width: 1, height: 36, backgroundColor: "#E8EEF8" },
  macrosRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#eff6fc",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  macroPill: { flex: 1, alignItems: "center", gap: 3 },
  macroValue: { fontFamily: "DMSans_700Bold", fontSize: 15 },
  macroLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 10,
    color: "#9098A3",
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fcfeff",
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
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
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
  info: { flex: 1, gap: 2 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontFamily: "DMSans_700Bold", fontSize: 15, color: "#1A1A2E" },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontFamily: "DMSans_700Bold", fontSize: 11 },
  cals: { fontSize: 13 },
  calsConsumed: { fontFamily: "DMSans_700Bold", color: "#1A1A2E" },
  calsGoal: { fontFamily: "DMSans_400Regular", color: "#9098A3" },
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
  barFill: { height: "100%", borderRadius: 0 },
  // Items expandibles
  itemsList: { paddingVertical: 10, gap: 10 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C5D8FF",
    flexShrink: 0,
  },
  itemName: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#1A1A2E",
  },
  itemBrand: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#9098A3",
  },
  itemCals: { fontFamily: "DMSans_700Bold", fontSize: 13, color: "#3090FE" },
  itemMacros: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#9098A3",
  },
});

const calendarCaloriesStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: "#1A6FD4",
    marginHorizontal: -20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
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
    color: "#fafcff",
  },
  subtitle: { fontSize: 15, fontFamily: "DMSans_400Regular", color: "#7BA7E1" },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
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
    borderColor: "rgba(217,231,255,0.44)",
    backgroundColor: "rgba(112,178,239,0.18)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a6b7ec",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
});
