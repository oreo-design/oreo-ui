import { addDays, validDate, weekDates } from "../color-calendar/model.ts";
export { addDays, validDate, weekDates };
export function scheduleError(start: string | undefined, due: string) {
  if (start && !validDate(start)) return "Choose a valid start date.";
  if (due && !validDate(due)) return "Choose a valid due date.";
  if (start && !due) return "Add a due date or clear the start date.";
  if (start && due && start > due)
    return "Due date must be on or after the start date.";
  return "";
}
export function calendarDays(date: string, mode: "month" | "week") {
  if (!validDate(date)) return [];
  return weekDates(
    mode === "month" ? date.slice(0, 7) + "-01" : date,
    mode === "month" ? 42 : 7,
  );
}
export function moveMonth(date: string, direction: number) {
  if (!validDate(date)) return date;
  const d = new Date(date.slice(0, 7) + "-01T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + direction);
  const next = d.toISOString().slice(0, 10);
  return validDate(next) ? next : date;
}
export function timelineSpan(
  start: string | undefined,
  due: string,
  first: string,
  count: number,
) {
  if (
    !validDate(first) ||
    !validDate(due) ||
    scheduleError(start, due) ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 366
  )
    return null;
  const a = start || due,
    last = addDays(first, count - 1);
  if (a > last || due < first) return null;
  const day = (value: string) =>
    Math.round(
      (Date.parse(value + "T12:00:00Z") - Date.parse(first + "T12:00:00Z")) /
        86400000,
    );
  return {
    from: Math.max(0, day(a)),
    to: Math.min(count - 1, day(due)),
    continuesBefore: a < first,
    continuesAfter: due > last,
  };
}
