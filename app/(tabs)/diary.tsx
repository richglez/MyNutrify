// app/(tabs)/diary.tsx
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
  { id: "breakfast", label: "Desayuno",  icon: "☕",  consumed: 56,  goal: 635 },
  { id: "snack1",    label: "Colación 1",icon: "🍎",  consumed: 0,   goal: 150 },
  { id: "lunch",     label: "Comida",    icon: "🥗",  consumed: 856, goal: 847 },
  { id: "snack2",    label: "Colación 2",icon: "🥜",  consumed: 0,   goal: 150 },
  { id: "dinner",    label: "Cena",      icon: "🍽️", consumed: 379, goal: 529 },
];

const DAILY_GOAL = 2100;

// ── Helpers de fecha ───────────────────────────────────────────────────────

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate()     === b.getDate()  &&
    a.getMonth()    === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const WEEK_DAYS   = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS      = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const MONTHS_SHORT = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];

// ── DiaryScreen ────────────────────────────────────────────────────────────

export default function DiaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(TODAY));

  const isFutureDay = selectedDate > TODAY;

  // En días futuros mostramos todo en cero
  const meals = isFutureDay
    ? MEALS.map((m) => ({ ...m, consumed: 0 }))
    : MEALS;

  const totalConsumed = meals.reduce((sum, m) => sum + m.consumed, 0);
  const remaining     = DAILY_GOAL - totalConsumed;

  const handleAddFood = (mealId: string, mealLabel: string) => {
    router.push({
      pathname: "/add-food",
      params: { mealId, mealLabel },
    });
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>


      {/* ── Header de fecha ── */}
      <DateHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Resumen de calorías ── */}
        <CalorieSummary
          goal={DAILY_GOAL}
          consumed={totalConsumed}
          remaining={remaining}
          isFuture={isFutureDay}
        />

        {/* ── Banner ── */}
        <Image
          source={require("../../assets/wallpaper-food-healthy.png")}
          style={styles.banner}
          resizeMode="cover"
        />

        {/* ── Cards de comida ── */}
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onAdd={() => handleAddFood(meal.id, meal.label)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ── DateHeader ─────────────────────────────────────────────────────────────

type DateHeaderProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

function DateHeader({ selectedDate, onDateChange }: DateHeaderProps) {
  const [calVisible, setCalVisible] = useState(false);
  const [calMonth, setCalMonth]     = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const changeDay = (n: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + n);
    onDateChange(next);
  };

  const getDayLabel = () => {
    if (isSameDay(selectedDate, TODAY)) return "Hoy";
    const yesterday = new Date(TODAY); yesterday.setDate(TODAY.getDate() - 1);
    if (isSameDay(selectedDate, yesterday)) return "Ayer";
    const tomorrow  = new Date(TODAY); tomorrow.setDate(TODAY.getDate() + 1);
    if (isSameDay(selectedDate, tomorrow))  return "Mañana";
    return `${selectedDate.getDate()} ${MONTHS_SHORT[selectedDate.getMonth()]}`;
  };

  const getFullDateLabel = () => {
    const dayName = WEEK_DAYS[selectedDate.getDay()];
    const month   = MONTHS_SHORT[selectedDate.getMonth()];
    return `${dayName} ${selectedDate.getDate()} de ${month}, ${selectedDate.getFullYear()}`;
  };

  const openCalendar = () => {
    setCalMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setCalVisible(true);
  };

  // Genera los días del mes para el grid
  const generateDays = (): (Date | null)[] => {
    const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
    const lastDay  = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0);
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
        {/* Fila principal: flecha ‹ | día | flecha › */}
        <View style={headerStyles.row}>
          <TouchableOpacity
            style={headerStyles.arrowBtn}
            onPress={() => changeDay(-1)}
            activeOpacity={0.7}
          >
            <Text style={headerStyles.arrow}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={headerStyles.dateBtn}
            onPress={openCalendar}
            activeOpacity={0.8}
          >
            <Text style={headerStyles.dayLabel}>{getDayLabel()}</Text>
            <Text style={headerStyles.chevron}>▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={headerStyles.arrowBtn}
            onPress={() => changeDay(1)}
            activeOpacity={0.7}
          >
            <Text style={headerStyles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Fecha completa */}
        <Text style={headerStyles.fullDate}>{getFullDateLabel()}</Text>
      </View>

      {/* ── Modal calendario ── */}
      <Modal visible={calVisible} transparent animationType="fade">
        <Pressable style={calStyles.overlay} onPress={() => setCalVisible(false)}>
          <Pressable style={calStyles.sheet} onPress={(e) => e.stopPropagation()}>

            {/* Navegación mes */}
            <View style={calStyles.monthRow}>
              <TouchableOpacity
                onPress={() =>
                  setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))
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
                  setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))
                }
                style={calStyles.monthArrowBtn}
              >
                <Text style={calStyles.monthArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Encabezados días semana */}
            <View style={calStyles.weekRow}>
              {["D","L","M","X","J","V","S"].map((d) => (
                <Text key={d} style={calStyles.weekDay}>{d}</Text>
              ))}
            </View>

            {/* Grid días */}
            <View style={calStyles.grid}>
              {generateDays().map((day, i) => {
                if (!day) return <View key={`empty-${i}`} style={calStyles.dayCell} />;

                const isSelected = isSameDay(day, selectedDate);
                const isToday    = isSameDay(day, TODAY);
                const isFuture   = day > TODAY;

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
                        isSelected  && calStyles.dayTextSelected,
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

            {/* Botón "Hoy" */}
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
  isFuture?: boolean;
};

function CalorieSummary({ goal, consumed, remaining, isFuture }: CalorieSummaryProps) {
  const isOver = remaining < 0;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>
        {isFuture ? "Meta del día" : "Calorías Restantes"}
      </Text>

      <View style={styles.summaryRow}>
        {/* Meta */}
        <View style={styles.summaryCol}>
          <Text style={styles.summaryNumber}>{goal.toLocaleString()}</Text>
          <Text style={styles.summarySubLabel}>Meta</Text>
        </View>

        <Text style={styles.summaryOperator}>−</Text>

        {/* Comida */}
        <View style={styles.summaryCol}>
          <Text style={styles.summaryNumber}>{consumed.toLocaleString()}</Text>
          <Text style={styles.summarySubLabel}>Comida</Text>
        </View>

        <Text style={styles.summaryOperator}>=</Text>

        {/* Restantes */}
        <View style={styles.summaryCol}>
          <Text
            style={[
              styles.summaryNumber,
              styles.summaryRemaining,
              isOver && styles.summaryOver,
            ]}
          >
            {Math.abs(remaining).toLocaleString()}
          </Text>
          <Text style={styles.summarySubLabel}>
            {isFuture ? "Disponibles" : isOver ? "Excedido" : "Restantes"}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ── MealCard ───────────────────────────────────────────────────────────────

type MealCardProps = {
  meal: MealSection;
  onAdd: () => void;
};

function MealCard({ meal, onAdd }: MealCardProps) {
  const isOverGoal = meal.consumed > meal.goal;

  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <Text style={styles.iconText}>{meal.icon}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.mealLabel}>{meal.label}</Text>
        <Text style={[styles.mealCals, isOverGoal && styles.mealCalsOver]}>
          {meal.consumed} / {meal.goal} Cal
        </Text>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1A6FD4",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
  arrow: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 26,
    fontFamily: "DMSans_400Regular",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayLabel: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
  },
  chevron: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
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
  monthLabel: {
    fontSize: 15,
    fontFamily: "DMSans_700Bold",
    color: "#1A1A2E",
  },
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: "#1A6FD4",
    borderRadius: 18,
  },
  dayToday: {
    backgroundColor: "rgba(26,111,212,0.1)",
    borderRadius: 18,
  },
  dayText: {
    fontSize: 14,
    color: "#1A1A2E",
    fontFamily: "DMSans_400Regular",
  },
  dayTextSelected: {
    color: "#fff",
    fontFamily: "DMSans_700Bold",
  },
  dayTextToday: {
    color: "#1A6FD4",
    fontFamily: "DMSans_700Bold",
  },
  dayTextFuture: {
    color: "#C0C5CC",
  },
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
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  banner: {
    width: "100%",
    height: 130,
    borderRadius: 16,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },

  // ── Summary card ──
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 14,
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  summaryCol: {
    alignItems: "center",
    minWidth: 64,
  },
  summaryNumber: {
    fontFamily: "DMSans_700Bold",
    fontSize: 22,
    color: "#1A1A2E",
  },
  summarySubLabel: {
    fontFamily: "DMSans_400Regular",
    fontSize: 11,
    color: "#9098A3",
    marginTop: 2,
  },
  summaryOperator: {
    fontFamily: "DMSans_400Regular",
    fontSize: 20,
    color: "#9098A3",
    marginBottom: 14,
  },
  summaryRemaining: {
    color: "#3090FE",
  },
  summaryOver: {
    color: "#FF6B6B",
  },

  // ── Meal card ──
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconText: { fontSize: 22 },
  cardInfo:  { flex: 1 },
  mealLabel: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#1A1A2E",
    marginBottom: 2,
  },
  mealCals: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#9098A3",
  },
  mealCalsOver: { color: "#FF6B6B" },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3090FE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 26,
    fontFamily: "DMSans_400Regular",
  },
});
