export const DAY = 86_400_000;
export type UsageObservation = { at: number; used: number };
export type UsageAccount = {
  id: string;
  name: string;
  plan: string;
  windowStart: number;
  resetAt: number;
  observations: UsageObservation[];
  connected: boolean;
};
export type UsageForecast = {
  account: UsageAccount;
  now: number;
  multiplier: number;
  status: "ready" | "disconnected" | "invalid";
  reason: string;
  used: number;
  rate: number;
  allowed: number;
  projected: number;
  runsOutAt: number | null;
  lockedHours: number;
  atRisk: boolean;
};
export function forecastUsage(
  account: UsageAccount,
  now: number,
  multiplier = 1,
): UsageForecast {
  const result: UsageForecast = {
    account,
    now,
    multiplier,
    status: "invalid",
    reason: "Usage history is unavailable.",
    used: 0,
    rate: 0,
    allowed: 0,
    projected: 0,
    runsOutAt: null,
    lockedHours: 0,
    atRisk: false,
  };
  if (!account.connected)
    return {
      ...result,
      status: "disconnected",
      reason: "Connect sample history to calculate a forecast.",
    };
  const points = account.observations;
  if (
    !Number.isFinite(now) ||
    !Number.isFinite(multiplier) ||
    multiplier < 0 ||
    multiplier > 4 ||
    !Number.isFinite(account.windowStart) ||
    !Number.isFinite(account.resetAt) ||
    account.windowStart >= now ||
    account.resetAt <= now
  )
    return {
      ...result,
      reason: "The usage window or scenario is invalid. Load a current window.",
    };
  if (
    points.length < 2 ||
    points.some(
      (p, i) =>
        !Number.isFinite(p.at) ||
        !Number.isFinite(p.used) ||
        p.used < 0 ||
        p.used > 100 ||
        p.at < account.windowStart ||
        p.at > now ||
        (i > 0 && (p.at <= points[i - 1].at || p.used < points[i - 1].used)),
    )
  )
    return {
      ...result,
      reason:
        "Provide ordered, cumulative observations from 0 to 100% within this window.",
    };
  const last = points[points.length - 1];
  if (now - last.at > DAY)
    return {
      ...result,
      reason:
        "The latest observation is over a day old. Refresh history before forecasting.",
    };
  const first = points[Math.max(0, points.length - 4)];
  const rate =
    ((last.used - first.used) / ((last.at - first.at) / DAY)) * multiplier;
  const used = Math.min(100, last.used + rate * ((now - last.at) / DAY));
  const remainingDays = (account.resetAt - now) / DAY;
  const runsOutAt =
    used >= 100 ? now : rate > 0 ? now + ((100 - used) / rate) * DAY : null;
  const atRisk = runsOutAt !== null && runsOutAt < account.resetAt;
  return {
    ...result,
    status: "ready",
    reason: "",
    used,
    rate,
    allowed: (100 - used) / remainingDays,
    projected: used + rate * remainingDays,
    runsOutAt,
    atRisk,
    lockedHours: atRisk ? (account.resetAt - runsOutAt!) / 3_600_000 : 0,
  };
}
export const forecastDate = (at: number) =>
  new Date(at).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
export const forecastDay = (at: number) =>
  new Date(at).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
  });
export const forecastPercent = (value: number) => `${Math.round(value)}%`;
export function forecastLabel(f: UsageForecast) {
  return f.status !== "ready"
    ? f.status === "disconnected"
      ? "History disconnected"
      : "Forecast unavailable"
    : f.atRisk
      ? `Runs out ${forecastDate(f.runsOutAt!)}`
      : `${forecastPercent(Math.min(100, f.projected))} at reset`;
}
export function forecastCSV(forecasts: UsageForecast[]) {
  const escape = (value: unknown) => {
    const text = String(value);
    const safe = /^[=+@\-\t\r]/.test(text) ? "'" + text : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return [
    [
      "Account",
      "Status",
      "Used percent",
      "Daily percentage points",
      "Projected percent at reset",
      "Runs out UTC",
      "Reset UTC",
      "Locked hours",
      "Scenario multiplier",
    ],
    ...forecasts.map((f) => [
      f.account.name,
      f.status === "ready"
        ? f.atRisk
          ? "At risk"
          : "Within allowance"
        : f.status,
      f.status === "ready" ? f.used.toFixed(2) : "",
      f.status === "ready" ? f.rate.toFixed(2) : "",
      f.status === "ready" ? f.projected.toFixed(2) : "",
      f.atRisk ? new Date(f.runsOutAt!).toISOString() : "",
      Number.isFinite(f.account.resetAt) &&
      !Number.isNaN(new Date(f.account.resetAt).valueOf())
        ? new Date(f.account.resetAt).toISOString()
        : "",
      f.status === "ready" ? f.lockedHours.toFixed(2) : "",
      f.multiplier,
    ]),
  ]
    .map((row) => row.map(escape).join(","))
    .join("\r\n");
}
