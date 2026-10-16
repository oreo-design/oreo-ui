import test from "node:test";
import assert from "node:assert/strict";
import {
  budgetOutlook,
  validBudget,
  clampCap,
  runBatch,
  type BudgetInputs,
} from "./model.ts";
const b: BudgetInputs = {
  cap: 120000,
  spent: 64000,
  planMax: 200000,
  costPerRun: 25,
  dailySpend: 4000,
  daysToReset: 16,
};
test("remaining estimates exclude previously spent money", () => {
  assert.deepEqual(budgetOutlook(b), {
    remaining: 56000,
    runs: 2240,
    totalRuns: 4800,
    days: 14,
    paused: false,
  });
});
test("invalid, non-integer and impossible configurations are rejected", () => {
  for (const v of [
    { spent: -1 },
    { costPerRun: 0 },
    { dailySpend: NaN },
    { cap: 200001 },
    { spent: 120001 },
    { cap: 1.2 },
    { daysToReset: 0 },
  ])
    assert.equal(validBudget({ ...b, ...v }), false);
});
test("zero pace stays unavailable, exhausted budget pauses", () => {
  assert.equal(budgetOutlook({ ...b, dailySpend: 0 })?.days, null);
  assert.equal(budgetOutlook({ ...b, cap: 64000 })?.paused, true);
});
test("clamp preserves exact spent and plan boundaries", () => {
  assert.equal(clampCap(0, 64013, 200000), 64013);
  assert.equal(clampCap(300000, 64013, 200000), 200000);
});
test("partial final batch never overspends and next batch pauses", () => {
  const r = runBatch({ ...b, cap: 64063 }, 100);
  assert.deepEqual(r, { spent: 64050, executed: 2 });
  assert.deepEqual(runBatch({ ...b, cap: 64063, spent: r.spent }, 100), {
    spent: 64050,
    executed: 0,
  });
  assert.equal(b.spent, 64000);
});
test("increasing saved cap restores capacity and invalid request is inert", () => {
  assert.equal(runBatch({ ...b, cap: b.spent }, 100).executed, 0);
  assert.equal(runBatch({ ...b, cap: b.spent + 2500 }, 100).executed, 100);
  assert.equal(runBatch(b, -1).executed, 0);
});
