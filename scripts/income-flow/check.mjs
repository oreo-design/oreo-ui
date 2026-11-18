import assert from "node:assert/strict";
import { test } from "node:test";
import {
  incomeBand,
  incomeChange,
  incomeIndex,
  incomeMoney,
  validIncome,
} from "../../src/components/income-flow/model.ts";
const points = [
  { id: "a", label: "Jan", amount: 0 },
  { id: "b", label: "Feb", amount: 120000 },
  { id: "c", label: "Mar", amount: 60000 },
];
test("invalid data stays invalid instead of inventing income", () => {
  assert.equal(validIncome(points), true);
  for (const amount of [-1, NaN, Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1])
    assert.equal(validIncome([{ id: "x", label: "X", amount }]), false);
  assert.equal(validIncome([points[0], points[0]]), false);
  assert.equal(incomeBand([{ id: "x", label: "X", amount: -1 }]), "");
});
test("comparison distinguishes missing, zero, growth, flat and decrease", () => {
  assert.equal(incomeChange(100, undefined), null);
  assert.equal(incomeChange(100, 0), null);
  assert.equal(incomeChange(100, 100), 0);
  assert.equal(incomeChange(150, 100), 50);
  assert.equal(incomeChange(0, 100), -100);
  assert.equal(incomeChange(10, -10), null);
  assert.equal(incomeMoney(12345), "$123.45");
  assert.equal(incomeMoney(120000), "$1,200");
});
test("band geometry stays finite and centered with empty, zero and single data", () => {
  assert.equal(incomeBand([]), "");
  const zero = incomeBand([{ id: "z", label: "Z", amount: 0 }]);
  assert.ok(zero.includes("M0,80"));
  assert.ok(!zero.includes("NaN"));
  const band = incomeBand(points);
  assert.ok(band.startsWith("M0,80"));
  assert.ok(band.endsWith(" Z"));
  assert.ok(!/NaN|Infinity/.test(band));
  assert.equal(incomeIndex(99, 3), 2);
  assert.equal(incomeIndex(-1, 3), 0);
  assert.equal(incomeIndex(NaN, 3), 2);
});
