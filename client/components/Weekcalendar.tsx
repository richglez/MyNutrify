// ───> Component WeekCalendar -> client\components\Weekcalendar.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Rect, Path } from "react-native-svg";
import type {
  MacroStatus,
  DailyMacro,
  WeekCalendarProps,
} from "../types/calendar";

// ─── Ícono calendario ─────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="3"
      stroke="#0053D3"
      strokeWidth="2"
    />
    <Path
      d="M16 2V6M8 2V6M3 10H21"
      stroke="#2e90fe"
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
      stroke="#0053D3"
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
      stroke="#0053D3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── Macro Indicator ──────────────────────────────────────────────────────────
const MacroIndicator = ({
  status,
  isSelected,
}: {
  status: MacroStatus;
  isSelected: boolean;
}) => {
  if (status === "future") {
    return (
      <View
        style={[
          macroStyles.circle,
          { borderColor: isSelected ? "rgba(255,255,255,0.5)" : "#D1D5DB" },
        ]}
      />
    );
  }

  if (status === "completed") {
    return (
      <View
        style={[
          macroStyles.circle,
          macroStyles.completedCircle,
          isSelected && macroStyles.selectedCompleted,
        ]}
      >
        <Svg width={10} height={10} viewBox="0 0 12 12">
          <Path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  if (status === "partial") {
    return (
      <View style={[macroStyles.circle, macroStyles.partialBorder]}>
        <View style={macroStyles.partialFill} />
      </View>
    );
  }

  if (status === "missed") {
    return (
      <View style={[macroStyles.circle, macroStyles.missedCircle]}>
        <Svg width={8} height={8} viewBox="0 0 10 10">
          <Path
            d="M2 2L8 8M8 2L2 8"
            stroke="#EF4444"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </View>
    );
  }

  return null;
};

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

function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
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

// ─── Componente principal ─────────────────────────────────────────────────────
export default function WeekCalendar({
  onDayPress,
  markedDates = [],
  dailyMacros = [],
}: WeekCalendarProps) {
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
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

  const getMacroStatus = (date: Date): MacroStatus => {
    const macroEntry = dailyMacros.find((m) => isSameDay(m.date, date));
    if (macroEntry) return macroEntry.status;

    // ✅ comparar con startOfDate normalizado
    const startOfDate = new Date(date);
    startOfDate.setHours(0, 0, 0, 0);

    if (startOfDate < today) return "missed";
    return "future";
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
          const macroStatus = getMacroStatus(date);
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
              <View style={styles.dotSlot}>
                {hasEvent && (
                  <View
                    style={[
                      styles.eventDot,
                      isSelected && styles.eventDotSelected,
                    ]}
                  />
                )}
              </View>

              {/* Indicador de macros */}
              <MacroIndicator status={macroStatus} isSelected={isSelected} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Estilos del indicador ────────────────────────────────────────────────────
const macroStyles = StyleSheet.create({
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginTop: 2,
  },
  completedCircle: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  selectedCompleted: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },
  partialBorder: {
    borderColor: "#F59E0B",
    position: "relative",
  },
  partialFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "#F59E0B",
  },
  missedCircle: {
    borderColor: "#EF4444",
    borderWidth: 1.5,
  },
});

// ─── Estilos del calendario ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fcfdff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginHorizontal: 24,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
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
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#0053D3",
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
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dayItem: {
    flex: 1,
    alignItems: "center",
  },
  dayName: {
    // "Mon", "Tue", etc.
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: "#3574f1",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    includeFontPadding: false,
    paddingBottom: 8,
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
    shadowColor: "#4779FD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 18,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: "#1A6BFF",
    borderRadius: 18,
  },
  dayNumber: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
    color: "#0d41bb",
    includeFontPadding: false,
  },
  dayNumberSelected: {
    color: "#ffffff",
    fontWeight: "700",
  },
  dayNumberToday: {
    color: "#1A6BFF",
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#375FFD",
    marginTop: -2,
  },
  eventDotSelected: {
    backgroundColor: "#2a7cff",
  },
  dotSlot: {
    height: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
});
