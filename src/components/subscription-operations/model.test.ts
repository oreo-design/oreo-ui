import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allocateTarget,
  parseMoney,
  nextRenewal,
  validDate,
  tenureMonths,
  personError,
  targetError,
  segmentCustomers,
  summarize,
  type Customer,
  type QueryCondition,
} from "./model.ts";
const plans = [
  { id: "a", name: "Family", cents: 7900, description: "" },
  { id: "b", name: "Plus", cents: 4900, description: "" },
];
const legs = [{ id: "north", name: "North", sponsor: "Alex", tier: "Emerald" }];
const base: Customer = {
  id: "1",
  name: "A",
  phone: "+15550101000",
  planId: "a",
  legId: "north",
  source: "Referral",
  start: "2026-01-16",
  active: true,
  risk: false,
};
const customers = [
  base,
  { ...base, id: "2", planId: "b", source: "Other" },
  { ...base, id: "3", start: "2026-11-01" },
  { ...base, id: "4", active: false },
];
const today = "2026-10-16";
const rules: QueryCondition[] = [
  { id: "p", field: "plan", operator: "eq", value: "Family" },
  { id: "s", field: "source", operator: "eq", value: "Other" },
];
test("ALL and ANY combine valid rules; empty rules include every current active customer", () => {
  assert.equal(
    segmentCustomers(customers, { mode: "all", rules }, plans, legs, today)
      .length,
    0,
  );
  assert.equal(
    segmentCustomers(customers, { mode: "any", rules }, plans, legs, today)
      .length,
    2,
  );
  for (const mode of ["all", "any"] as const)
    assert.equal(
      segmentCustomers(customers, { mode, rules: [] }, plans, legs, today)
        .length,
      2,
    );
  assert.equal(
    segmentCustomers(
      customers,
      {
        mode: "any",
        rules: [
          ...rules,
          { id: "bad", field: "tenure", operator: "gte", value: "" },
        ],
      },
      plans,
      legs,
      today,
    ).length,
    0,
  );
});
test("future and inactive subscriptions do not affect current MRR", () => {
  const s = summarize(customers, plans, legs, today);
  assert.equal(s.count, 2);
  assert.equal(s.mrr, 12800);
  assert.equal(s.groups[0].cents, 12800);
});
test("allocation conserves every cent and is deterministic for zero weights", () => {
  for (const n of [1, 2, 101, 8000000])
    for (const weights of [
      [1, 2, 7],
      [0, 0, 0],
      [NaN, -1, 0],
    ]) {
      const a = allocateTarget(
        n,
        weights.map((cents, i) => ({ id: String(i), cents })),
      );
      assert.equal(
        a.reduce((s, v) => s + v.cents, 0),
        n,
      );
      assert.ok(a.every((v) => Number.isSafeInteger(v.cents) && v.cents >= 0));
    }
  assert.deepEqual(
    allocateTarget(2, [
      { id: "a", cents: 0 },
      { id: "b", cents: 0 },
      { id: "c", cents: 0 },
    ]).map((v) => v.cents),
    [1, 1, 0],
  );
});
test("money validation rejects rounding, negatives and targets beyond limits", () => {
  assert.equal(parseMoney("80.01"), 8001);
  assert.equal(parseMoney(" 0.1 "), 10);
  for (const v of ["0", "-1", "1.001", "1e3", "NaN", "1000000.01"])
    assert.equal(parseMoney(v), null);
  assert.ok(
    targetError({ amount: "80", month: "2026-09", split: true }, today),
  );
  assert.equal(
    targetError({ amount: "80", month: "2026-10", split: true }, today),
    null,
  );
});
test("calendar renewal clamps month end and tenure counts complete months", () => {
  assert.equal(nextRenewal("2024-01-31"), "2024-02-29");
  assert.equal(nextRenewal("2026-01-31"), "2026-02-28");
  assert.equal(nextRenewal("2026-12-31"), "2027-01-31");
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(nextRenewal("bad"), "");
  assert.equal(tenureMonths("2026-04-17", today), 5);
  assert.equal(tenureMonths("2026-04-16", today), 6);
});
test("person validation detects normalized duplicates and invalid contact dates", () => {
  assert.match(
    personError("Name", "+1 (555) 010-1000", today, [base])!,
    /already/,
  );
  assert.ok(personError("", "1234567", today, []));
  assert.ok(personError("Name", "abc1234567", today, []));
  assert.ok(personError("Name", "1234567", "2026-02-30", []));
  assert.equal(personError("Name", "+1 555 999 1234", "2026-11-01", []), null);
});
