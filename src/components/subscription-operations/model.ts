import {
  matchesQuery,
  validateCondition,
  type QueryCondition,
  type QueryField,
} from "../trace-query/model.ts";
export type { QueryCondition, QueryField };
export type Plan = {
  id: string;
  name: string;
  cents: number;
  description: string;
};
export type Leg = { id: string; name: string; sponsor: string; tier: string };
export type Customer = {
  id: string;
  name: string;
  phone: string;
  planId: string;
  legId: string;
  source: string;
  start: string;
  risk: boolean;
  active: boolean;
};
export type Member = {
  id: string;
  name: string;
  phone: string;
  sponsorId: string;
  start: string;
  welcome: boolean;
};
export type Segment = {
  id: string;
  name: string;
  mode: "all" | "any";
  rules: QueryCondition[];
  pinned: boolean;
};
export type Target = { amount: string; month: string; split: boolean };
export const SOURCES = ["Referral", "Walk-in", "Campaign", "Other"];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
export function parseMoney(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const [d, c = ""] = value.trim().split(".");
  const n = Number(d) * 100 + Number(c.padEnd(2, "0"));
  return Number.isSafeInteger(n) && n > 0 && n <= 100000000 ? n : null;
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + "T00:00:00Z")) &&
    new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value
  );
}
export function tenureMonths(start: string, today: string) {
  const a = new Date(start + "T00:00:00Z"),
    b = new Date(today + "T00:00:00Z");
  return Math.max(
    0,
    (b.getUTCFullYear() - a.getUTCFullYear()) * 12 +
      b.getUTCMonth() -
      a.getUTCMonth() -
      (b.getUTCDate() < a.getUTCDate() ? 1 : 0),
  );
}
export function nextRenewal(start: string) {
  if (!validDate(start)) return "";
  const d = new Date(start + "T00:00:00Z"),
    day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + 1);
  const end = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, end));
  return d.toISOString().slice(0, 10);
}
export const normalizePhone = (phone: string) => phone.replace(/[^0-9]/g, "");
export function personError(
  name: string,
  phone: string,
  start: string,
  people: { phone: string }[],
) {
  if (!name.trim()) return "Enter a full name.";
  if (
    !/^\+?[0-9 ()-]+$/.test(phone.trim()) ||
    !/^\d{7,15}$/.test(normalizePhone(phone))
  )
    return "Enter a phone number with 7–15 digits.";
  if (people.some((p) => normalizePhone(p.phone) === normalizePhone(phone)))
    return "This phone number is already in this list.";
  if (!validDate(start)) return "Choose a valid start date.";
  return null;
}
export const activeCustomers = (customers: Customer[], today: string) =>
  customers.filter((c) => c.active && validDate(c.start) && c.start <= today);
export function segmentFields(plans: Plan[], legs: Leg[]): QueryField[] {
  return [
    {
      key: "plan",
      label: "Plan",
      type: "enum",
      options: plans.map((p) => p.name),
    },
    {
      key: "tenure",
      label: "Tenure (months)",
      type: "number",
      min: 0,
      max: 1200,
    },
    { key: "source", label: "Source", type: "enum", options: SOURCES },
    {
      key: "leg",
      label: "Leg",
      type: "enum",
      options: legs.map((l) => l.name),
    },
    {
      key: "risk",
      label: "Risk",
      type: "enum",
      options: ["Healthy", "At risk"],
    },
  ];
}
export function segmentCustomers(
  customers: Customer[],
  segment: Pick<Segment, "mode" | "rules">,
  plans: Plan[],
  legs: Leg[],
  today: string,
) {
  const fields = segmentFields(plans, legs);
  if (segment.rules.some((r) => validateCondition(r, fields))) return [];
  return activeCustomers(customers, today).filter((c) => {
    const record = {
      plan: plans.find((p) => p.id === c.planId)?.name,
      tenure: tenureMonths(c.start, today),
      source: c.source,
      leg: legs.find((l) => l.id === c.legId)?.name,
      risk: c.risk ? "At risk" : "Healthy",
    };
    return (
      !segment.rules.length ||
      (segment.mode === "all"
        ? matchesQuery(record, segment.rules, fields)
        : segment.rules.some((r) => matchesQuery(record, [r], fields)))
    );
  });
}
export function summarize(
  customers: Customer[],
  plans: Plan[],
  legs: Leg[],
  today: string,
) {
  const active = activeCustomers(customers, today),
    amount = (c: Customer) => plans.find((p) => p.id === c.planId)?.cents ?? 0;
  return {
    count: active.length,
    mrr: active.reduce((s, c) => s + amount(c), 0),
    tenure: active.length
      ? active.reduce((s, c) => s + tenureMonths(c.start, today), 0) /
        active.length
      : 0,
    risk: active.filter((c) => c.risk).length,
    groups: legs.map((l) => ({
      ...l,
      count: active.filter((c) => c.legId === l.id).length,
      cents: active
        .filter((c) => c.legId === l.id)
        .reduce((s, c) => s + amount(c), 0),
    })),
  };
}
/** Largest remainder apportions integer cents exactly, with stable ties. Zero weights split evenly. */
export function allocateTarget(
  cents: number,
  weights: { id: string; cents: number }[],
) {
  if (!Number.isSafeInteger(cents) || cents < 0 || !weights.length) return [];
  const safe = weights.map((w) =>
      Math.max(0, Number.isFinite(w.cents) ? w.cents : 0),
    ),
    sum = safe.reduce((a, b) => a + b, 0);
  const raw = safe.map((w) => cents * (sum ? w / sum : 1 / safe.length)),
    values = raw.map(Math.floor);
  let rest = cents - values.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, f: v - values[i] }))
    .sort((a, b) => b.f - a.f || a.i - b.i);
  for (const v of order) {
    if (rest-- <= 0) break;
    values[v.i]++;
  }
  return weights.map((w, i) => ({
    id: w.id,
    cents: values[i],
    share: sum ? safe[i] / sum : 1 / weights.length,
  }));
}
export function targetError(target: Target, today: string) {
  if (parseMoney(target.amount) === null)
    return "Enter a target from $0.01 to $1,000,000 with at most two decimals.";
  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(target.month) ||
    target.month < today.slice(0, 7)
  )
    return "Choose the current month or a future month.";
  return null;
}
