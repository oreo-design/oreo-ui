import { validMinor } from "../currency-finance/model.ts";
export type IncomePoint = { id: string; label: string; amount: number };
export type IncomeTone = "orange" | "purple" | "blue";
/** Amounts are nonnegative integer minor units. IDs must be unique. */
export function validIncome(points: IncomePoint[]) {
  return (
    points.every(
      (p) => p.id.trim() && p.label.trim() && validMinor(p.amount),
    ) && new Set(points.map((p) => p.id)).size === points.length
  );
}
export function incomeIndex(value: number | undefined, length: number) {
  return Math.max(
    0,
    Math.min(
      length - 1,
      Number.isFinite(value) ? Math.round(value!) : length - 1,
    ),
  );
}
export function incomeChange(
  current: number,
  previous: number | undefined,
): number | null {
  return previous === undefined ||
    !validMinor(previous) ||
    !validMinor(current) ||
    previous === 0
    ? null
    : ((current - previous) / previous) * 100;
}
export function incomeMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}
/** Symmetric envelopes of one total, not stacked categories. Smooth cubic steps cannot overshoot samples. */
export function incomeBand(points: IncomePoint[], layer = 1): string {
  if (!points.length || !validIncome(points)) return "";
  const max = Math.max(1, ...points.map((p) => p.amount)),
    width = 400,
    mid = 80,
    amplitude = 64 * Math.max(0, Math.min(1, layer));
  const coords = [
    { x: 0, v: points[0].amount },
    ...points.map((p, i) => ({
      x: ((i + 0.5) * width) / points.length,
      v: p.amount,
    })),
    { x: width, v: points.at(-1)!.amount },
  ];
  const curve = (sign: number, reverse = false) => {
    const a = reverse ? [...coords].reverse() : coords;
    return a
      .map((p, i) => {
        const y = mid + ((sign * p.v) / max) * amplitude;
        if (!i) return `${reverse ? "L" : "M"}${p.x},${y}`;
        const prev = a[i - 1],
          x = (p.x + prev.x) / 2;
        return `C${x},${mid + ((sign * prev.v) / max) * amplitude} ${x},${y} ${p.x},${y}`;
      })
      .join(" ");
  };
  return `${curve(-1)} ${curve(1, true)} Z`;
}
