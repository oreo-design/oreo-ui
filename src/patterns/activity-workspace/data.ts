import type { AuditEntry, RequestEntry, UsagePoint } from "@/components/activity";
export const periods = {
  september: { label: "September 2026", short: "Sep", used: 6516.17, forecast: 11438.82, personal: 249.87, requests: "13,180", tokens: "214.2M", change: "+216%", reset: "Oct 1", days: 30 },
  august: { label: "August 2026", short: "Aug", used: 2062.08, forecast: undefined, personal: 271.6, requests: "9,416", tokens: "156.8M", change: "+12%", reset: "Sep 1", days: 31 },
};
export type ActivityPeriod = keyof typeof periods;
export function usagePoints(period: ActivityPeriod): UsagePoint[] {
  const p = periods[period];
  const days = period === "september" ? 19 : 31;
  const count = days * 5;
  const increments = Array.from({ length: count }, (_, i) => i === 0 ? 0 : 8 + ((i * 37) % 79) + Math.sin(i / 5) * 22);
  const total = increments.reduce((sum, value) => sum + value, 0);
  let running = 0;
  return increments.map((value, i) => {
    running += value;
    return { label: `${p.short} ${Math.min(days, Math.floor(i / 5) + 1)}`, value: Math.round(p.used * running / total * 100) / 100 };
  });
}
export function requestEntries(period: ActivityPeriod): RequestEntry[] {
  return Array.from({ length: period === "september" ? 40 : 24 }, (_, i) => ({ id: `${period}-${i}`, model: ["Kimi K3", "Gemini 3.5 Pro", "Claude Opus 5.5", "Claude Opus 5.5"][i % 4], actor: ["Kit", "Dax", "Ludvig", "Dax"][i % 4], status: period === "september" && [5, 14, 27, 35].includes(i) ? 429 : 200, time: period === "august" ? `Aug ${31 - Math.floor(i / 4)}` : i === 0 ? "Just now" : `${i}m ago`, tokens: `${(2400 + i * 147).toLocaleString("en-US")}`, cost: (0.018 + i * 0.003).toFixed(3) }));
}
export const auditEntries: AuditEntry[] = [
  { id: "policy", title: "Updated model policy", actor: "Ludvig", time: "34m ago", highlighted: true },
  { id: "budget", title: "Updated Jay’s budget", actor: "Kamil", time: "3h ago" },
  { id: "evals", title: "Created ci-evals", actor: "Ludvig", time: "4h ago" },
  { id: "design", title: "Created Design spend", actor: "Dax", time: "8h ago" },
];
export const members = [{ id: "alan", name: "Alan", amount: 1976.51 }, { id: "james", name: "James", amount: 1193 }, { id: "luke", name: "Luke", amount: 955.63 }];
export const personalBars = Array.from({ length: 30 }, (_, i) => ({ value: i > 18 ? 0 : 18 + ((i * 17 + 7) % 63) }));
