export type RunMetric = "runs" | "credits" | "failures";
export type HourBucket = {
  day: number;
  hour: number;
  runs: number;
  credits: number;
  failures: number;
  durationSeconds: number;
};
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const METRICS: { value: RunMetric; label: string }[] = [
  { value: "runs", label: "Runs" },
  { value: "credits", label: "Credits" },
  { value: "failures", label: "Failures" },
];
export const hourLabel = (hour: number) =>
  `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
export const slotKey = (b: Pick<HourBucket, "day" | "hour">) =>
  b.day * 24 + b.hour;
export const count = (n: number) => n.toLocaleString("en-US");
/** Sparse weekly data is valid; absent hours are zero. Duplicate hours are rejected. */
export function validBuckets(data: HourBucket[]) {
  const seen = new Set<number>();
  return data.every((b) => {
    const key = slotKey(b);
    if (
      !Number.isInteger(b.day) ||
      b.day < 0 ||
      b.day > 6 ||
      !Number.isInteger(b.hour) ||
      b.hour < 0 ||
      b.hour > 23 ||
      seen.has(key)
    )
      return false;
    seen.add(key);
    return (
      [b.runs, b.credits, b.failures, b.durationSeconds].every(
        (n) =>
          Number.isSafeInteger(n) &&
          n >= 0 &&
          n <= Math.floor(Number.MAX_SAFE_INTEGER / 168),
      ) &&
      b.failures <= b.runs &&
      (b.runs > 0 || (b.credits === 0 && b.durationSeconds === 0))
    );
  });
}
export function fillWeek(data: HourBucket[]): HourBucket[] {
  if (!validBuckets(data))
    throw new RangeError("Expected unique, valid weekly hour buckets.");
  const slots = new Map(data.map((b) => [slotKey(b), b]));
  return Array.from(
    { length: 168 },
    (_, i) =>
      slots.get(i) ?? {
        day: Math.floor(i / 24),
        hour: i % 24,
        runs: 0,
        credits: 0,
        failures: 0,
        durationSeconds: 0,
      },
  );
}
export function summarizeRuns(data: HourBucket[], metric: RunMetric = "runs") {
  const week = fillWeek(data);
  const total = week.reduce(
    (a, b) => ({
      runs: a.runs + b.runs,
      credits: a.credits + b.credits,
      failures: a.failures + b.failures,
      durationSeconds: a.durationSeconds + b.durationSeconds,
    }),
    { runs: 0, credits: 0, failures: 0, durationSeconds: 0 },
  );
  const peak = week.reduce((a, b) => (b[metric] > a[metric] ? b : a));
  const morning = week
    .filter((b) => b.day < 5 && b.hour >= 6 && b.hour < 12)
    .reduce((n, b) => n + b[metric], 0);
  return {
    total,
    peak: peak[metric] ? peak : null,
    average: total.runs ? total.durationSeconds / total.runs : null,
    failureRate: total.runs ? (total.failures / total.runs) * 100 : null,
    morningShare: total[metric] ? (morning / total[metric]) * 100 : null,
  };
}
export function intensity(value: number, max: number) {
  return value <= 0 || max <= 0
    ? 0
    : Math.min(4, Math.max(1, Math.ceil((value / max) * 4)));
}
export function heatmapCsv(data: HourBucket[]) {
  return (
    "weekday,hour_utc,runs,credits,failures,total_duration_seconds\n" +
    fillWeek(data)
      .map(
        (b) =>
          `${WEEKDAYS[b.day]},${b.hour},${b.runs},${b.credits},${b.failures},${b.durationSeconds}`,
      )
      .join("\n")
  );
}
