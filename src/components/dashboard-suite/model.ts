export type ChartPoint = { label: string; values: number[] };
export type Channel = { id: string; label: string; value: number };
export function validSeries(points: ChartPoint[], count: number) {
  return (
    count > 0 &&
    points.every(
      (p) =>
        p.values.length === count &&
        p.values.every((v) => Number.isFinite(v) && v >= 0) &&
        Number.isFinite(p.values.reduce((a, b) => a + b, 0)),
    )
  );
}
export function chartCeiling(points: ChartPoint[], stacked = false) {
  const values = points.flatMap((p) =>
    stacked ? [p.values.reduce((a, b) => a + b, 0)] : p.values,
  );
  const max = Math.max(1, ...values.filter(Number.isFinite));
  const step = 10 ** Math.floor(Math.log10(max));
  const ceiling = Math.ceil(max / step) * step;
  return Number.isFinite(ceiling) ? ceiling : max;
}
export function percentChange(
  current: number,
  previous: number,
): number | null {
  return Number.isFinite(current) &&
    current >= 0 &&
    Number.isFinite(previous) &&
    previous > 0
    ? ((current - previous) / previous) * 100
    : null;
}
export const metricNumber = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 20 }).format(v);
export const metricMoney = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
export type DashboardRecord = {
  id: string;
  name: string;
  email: string;
  channel: string;
  status: "Active" | "Pending" | "Completed";
  value: number;
  date: string;
};
export function filterRecords(
  records: DashboardRecord[],
  query: string,
  channel: string,
  status: string,
) {
  const q = query.trim().toLowerCase();
  return records.filter(
    (r) =>
      (!channel || r.channel === channel) &&
      (status === "All" || r.status === status) &&
      `${r.name} ${r.email}`.toLowerCase().includes(q),
  );
}
export function validateRecord(name: string, email: string, value: string) {
  if (!name.trim()) return "Enter a name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Enter a valid email address.";
  if (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > 1e9)
    return "Enter a value from 0 to 1,000,000,000 with up to two decimal places.";
  return "";
}
export function recordsCSV(records: DashboardRecord[]) {
  const cell = (v: unknown) => {
    let s = String(v);
    if (/^[\s]*[=+@-]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  return [
    ["Name", "Email", "Channel", "Status", "Value USD", "Date"],
    ...records.map((r) => [
      r.name,
      r.email,
      r.channel,
      r.status,
      r.value,
      r.date,
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}
