export type BudgetInputs = {
  cap: number;
  spent: number;
  planMax: number;
  costPerRun: number;
  dailySpend: number;
  daysToReset: number;
};
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
export function validBudget(b: BudgetInputs) {
  return (
    [b.cap, b.spent, b.planMax, b.costPerRun, b.dailySpend].every(
      (n) => Number.isSafeInteger(n) && n >= 0,
    ) &&
    b.planMax > 0 &&
    b.costPerRun > 0 &&
    b.spent <= b.cap &&
    b.cap <= b.planMax &&
    Number.isFinite(b.daysToReset) &&
    b.daysToReset > 0
  );
}
export function clampCap(proposed: number, spent: number, planMax: number) {
  return Math.min(planMax, Math.max(spent, Math.round(proposed)));
}
export function budgetOutlook(b: BudgetInputs) {
  if (!validBudget(b)) return null;
  const remaining = b.cap - b.spent,
    runs = Math.floor(remaining / b.costPerRun);
  return {
    remaining,
    runs,
    totalRuns: Math.floor(b.cap / b.costPerRun),
    days: b.dailySpend > 0 ? remaining / b.dailySpend : null,
    paused: runs === 0,
  };
}
/** A sample batch executes only whole, affordable runs; the saved cap is authoritative. */
export function runBatch(b: BudgetInputs, requested: number) {
  const o = budgetOutlook(b);
  if (!o || !Number.isSafeInteger(requested) || requested < 0)
    return { spent: b.spent, executed: 0 };
  const executed = Math.min(requested, o.runs);
  return { spent: b.spent + executed * b.costPerRun, executed };
}
