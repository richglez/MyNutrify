// ───> Calendar Type -> types\calendar.ts

export type MacroStatus = "completed" | "partial" | "missed" | "future";

export interface DailyMacro {
  date: Date;
  status: MacroStatus;
}

export interface WeekCalendarProps {
  onDayPress?: (date: Date) => void;
  markedDates?: Date[];
  dailyMacros?: DailyMacro[];
}
