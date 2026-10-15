export type ExperimentCount = { visitors: number; conversions: number };
export type ExperimentDay = {
  date: string;
  a: ExperimentCount;
  b: ExperimentCount;
};
const validCount = (n: ExperimentCount) =>
  Number.isSafeInteger(n.visitors) &&
  Number.isSafeInteger(n.conversions) &&
  n.visitors >= 0 &&
  n.conversions >= 0 &&
  n.conversions <= n.visitors;
/** Rows are daily observations in host order. Invalid counts are omitted, never coerced. */
export const validDays = (days: ExperimentDay[]) =>
  days.filter((d) => validCount(d.a) && validCount(d.b));
export const conversionRate = (count: ExperimentCount) =>
  count.visitors > 0 ? (count.conversions / count.visitors) * 100 : null;
export const formatRate = (rate: number | null) =>
  rate === null ? "—" : `${rate.toFixed(2)}%`;
export const signed = (value: number, digits = 2) =>
  `${value > 0 ? "+" : ""}${value.toFixed(digits)}`;
export function summarizeExperiment(days: ExperimentDay[]) {
  const data = validDays(days);
  const a = { visitors: 0, conversions: 0 },
    b = { visitors: 0, conversions: 0 };
  let wins = 0,
    comparable = 0;
  const cumulative = data.map((day) => {
    a.visitors += day.a.visitors;
    a.conversions += day.a.conversions;
    b.visitors += day.b.visitors;
    b.conversions += day.b.conversions;
    const ar = conversionRate(day.a),
      br = conversionRate(day.b);
    if (ar !== null && br !== null) {
      comparable++;
      if (br > ar) wins++;
    }
    return { date: day.date, a: { ...a }, b: { ...b } };
  });
  const ar = conversionRate(a),
    br = conversionRate(b);
  return {
    data,
    cumulative,
    a,
    b,
    ar,
    br,
    wins,
    comparable,
    points: ar === null || br === null ? null : br - ar,
    lift:
      ar === null || br === null || ar === 0 ? null : ((br - ar) / ar) * 100,
  };
}
export function meetsExperimentGate(
  days: ExperimentDay[],
  confidence: number | null,
  threshold: number,
  minimum = 1000,
) {
  const s = summarizeExperiment(days);
  return (
    s.a.visitors >= minimum &&
    s.b.visitors >= minimum &&
    s.points !== null &&
    s.points > 0 &&
    confidence !== null &&
    Number.isFinite(confidence) &&
    confidence >= threshold &&
    confidence <= 100
  );
}
