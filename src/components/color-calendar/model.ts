export const CALENDAR_COLORS = [
  "blue",
  "mint",
  "pink",
  "purple",
  "orange",
  "brown",
  "default",
] as const;
export type CalendarColor = (typeof CALENDAR_COLORS)[number];
export type CalendarSource = {
  id: string;
  name: string;
  color: CalendarColor;
  visible: boolean;
};
export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  start: number;
  end: number;
  sourceId: string;
  color?: CalendarColor;
  allDay?: boolean;
  location?: string;
};
export const DEMO_DATE = "2026-10-19";
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value
  );
}
export function addDays(date: string, n: number) {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function weekDates(date: string, count = 7) {
  const d = new Date(date + "T12:00:00Z");
  const monday = addDays(date, -((d.getUTCDay() + 6) % 7));
  return Array.from({ length: count }, (_, i) => addDays(monday, i));
}
export function dateLabel(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}
export function timeLabel(minute: number) {
  if (minute === 1440) return "12 AM (next day)";
  const h = Math.floor(minute / 60);
  return `${h % 12 || 12}${minute % 60 ? ":" + String(minute % 60).padStart(2, "0") : ""} ${h < 12 ? "AM" : "PM"}`;
}
export function timeValue(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}
export function parseTime(value: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}
export function validateEvent(event: CalendarEvent, sources: CalendarSource[]) {
  if (!event.title.trim()) return "Give the event a title.";
  if (!validDate(event.date)) return "Choose a valid date.";
  if (!sources.some((s) => s.id === event.sourceId))
    return "Choose an available calendar.";
  if (
    !event.allDay &&
    (!Number.isInteger(event.start) ||
      !Number.isInteger(event.end) ||
      event.start < 0 ||
      event.end > 1440 ||
      event.end - event.start < 15 ||
      event.start % 15 ||
      event.end % 15)
  )
    return "Choose times on quarter-hour boundaries, with an end at least 15 minutes after the start on the same day.";
  return null;
}
export function filterEvents(
  events: CalendarEvent[],
  sources: CalendarSource[],
  dates: string[],
  query = "",
) {
  const visible = new Set(sources.filter((s) => s.visible).map((s) => s.id));
  return events
    .filter(
      (e) =>
        visible.has(e.sourceId) &&
        dates.includes(e.date) &&
        `${e.title} ${e.location ?? ""} ${sources.find((s) => s.id === e.sourceId)?.name ?? ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        Number(!!b.allDay) - Number(!!a.allDay) ||
        a.start - b.start ||
        a.id.localeCompare(b.id),
    );
}
export type PlacedEvent = {
  event: CalendarEvent;
  column: number;
  columns: number;
};
/** Half-open intervals: touching boundaries do not overlap. Connected groups share width. */
export function placeEvents(events: CalendarEvent[]): PlacedEvent[] {
  const sorted = events
    .filter((e) => !e.allDay)
    .slice()
    .sort(
      (a, b) => a.start - b.start || b.end - a.end || a.id.localeCompare(b.id),
    );
  const result: PlacedEvent[] = [];
  let group: PlacedEvent[] = [];
  let ends: number[] = [];
  let until = -1;
  function flush() {
    for (const e of group) result.push({ ...e, columns: ends.length });
    group = [];
    ends = [];
    until = -1;
  }
  for (const event of sorted) {
    if (event.start >= until) flush();
    let column = ends.findIndex((end) => end <= event.start);
    if (column === -1) column = ends.length;
    ends[column] = event.end;
    group.push({ event, column, columns: 0 });
    until = Math.max(until, event.end);
  }
  flush();
  return result;
}
