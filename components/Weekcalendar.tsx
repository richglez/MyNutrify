// components/WeekCalendar.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Svg, { Rect, Path } from "react-native-svg";

// ─── Ícono calendario ─────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="3"
      stroke="#8A94A6"
      strokeWidth="2"
    />
    <Path
      d="M16 2V6M8 2V6M3 10H21"
      stroke="#8A94A6"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Íconos chevron ───────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke="#1A1F36"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRight = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke="#1A1F36"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Devuelve el lunes (o domingo) de la semana que contiene `date` */
function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  d.setDate(d.getDate() - day); // retrocede al domingo
  return Array.from({ length: 7 }, (_, i) => {
    const copy = new Date(d);
    copy.setDate(d.getDate() + i);
    return copy;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function formatHeader(days: Date[]): string {
  const first = days[0];
  const last = days[6];
  if (first.getMonth() === last.getMonth()) {
    return `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
  }
  return `${MONTH_NAMES[first.getMonth()]} – ${MONTH_NAMES[last.getMonth()]} ${last.getFullYear()}`;
}

// ─── Componente ───────────────────────────────────────────────────────────────
interface WeekCalendarProps {
  onDayPress?: (date: Date) => void;
  /** Fechas con eventos/dots (opcional) */
  markedDates?: Date[];
}

export default function WeekCalendar({
  onDayPress,
  markedDates = [],
}: WeekCalendarProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [referenceDate, setReferenceDate] = useState<Date>(today);

  const weekDays = getWeekDays(referenceDate);
  const headerLabel = formatHeader(weekDays);

  const goToPrevWeek = () => {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - 7);
    setReferenceDate(d);
  };

  const goToNextWeek = () => {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() + 7);
    setReferenceDate(d);
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    onDayPress?.(date);
  };

  return (
    <View style={styles.card}>
      {/* ── Fila superior: header + chevrons ── */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={goToPrevWeek}
          activeOpacity={0.7}
        >
          <ChevronLeft />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <CalendarIcon />
          <Text style={styles.headerText}>{headerLabel}</Text>
        </View>

        <TouchableOpacity
          style={styles.chevronBtn}
          onPress={goToNextWeek}
          activeOpacity={0.7}
        >
          <ChevronRight />
        </TouchableOpacity>
      </View>

      {/* ── Días de la semana ── */}
      <View style={styles.daysRow}>
        {weekDays.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const hasEvent = markedDates.some((m) => isSameDay(m, date));
          const dayNum = date.getDate();
          const dayName = DAY_NAMES[date.getDay()];

          return (
            <TouchableOpacity
              key={i}
              style={styles.dayItem}
              onPress={() => handleDayPress(date)}
              activeOpacity={0.75}
            >
              {/* Nombre del día */}
              <Text
                style={[
                  styles.dayName,
                  isSelected && styles.dayNameSelected,
                  isToday && !isSelected && styles.dayNameToday,
                ]}
              >
                {dayName}
              </Text>

              {/* Círculo con número */}
              <View
                style={[
                  styles.dayCircle,
                  isSelected && styles.dayCircleSelected,
                  isToday && !isSelected && styles.dayCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberSelected,
                    isToday && !isSelected && styles.dayNumberToday,
                  ]}
                >
                  {dayNum}
                </Text>
              </View>

              {/* Dot de evento */}
              {hasEvent && (
                <View
                  style={[
                    styles.eventDot,
                    isSelected && styles.eventDotSelected,
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginHorizontal: 24,
    marginTop: 12,
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    // Sombra Android
    elevation: 3,
  },

  // ── Header ─────────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1F36",
    letterSpacing: 0.1,
  },

  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Días ───────────────────────────────────────────────────────────────────
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  dayItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },

  dayName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#B0B8C9",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    // Android
    includeFontPadding: false,
  },

  dayNameSelected: {
    color: "#305BF3",
  },

  dayNameToday: {
    color: "#1A6BFF",
  },

  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  dayCircleSelected: {
    backgroundColor: "#2E90FE",
    // Sombra iOS
    shadowColor: "#4779FD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    // Android
    elevation: 4,
  },

  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: "#1A6BFF",
  },

  dayNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1F36",
    // Android
    includeFontPadding: false,
  },

  dayNumberSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  dayNumberToday: {
    color: "#1A6BFF",
  },

  // ── Dot evento ─────────────────────────────────────────────────────────────
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#375FFD",
    marginTop: -2,
  },

  eventDotSelected: {
    backgroundColor: "#FFFFFF",
  },
});
