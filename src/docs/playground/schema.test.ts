import assert from "node:assert/strict";
import test from "node:test";
import { normalizeNumber, number, updateValues, resolveControl } from "./schema.ts";

test("numeric controls reject incomplete and non-finite input", () => {
  const control = number(.4, 0, 1, .05);
  for (const value of ["", " ", "-", "NaN", "Infinity"]) assert.equal(normalizeNumber(value, control), null);
});
test("numeric controls clamp and snap without floating-point drift", () => {
  const control = number(.4, 0, 1, .05);
  assert.equal(normalizeNumber("99", control), 1);
  assert.equal(normalizeNumber("-99", control), 0);
  assert.equal(normalizeNumber(".31", control), .3);
  assert.equal(normalizeNumber(".96", number(.96, .8, 1, .01)), .96);
  assert.equal(normalizeNumber("0", number(3, 1, 10)), 1);
});

test("linked bounds keep inspector values and preview values in sync", () => {
  const controls = { current: { ...number(1, 1, 10), maxFrom: "total" }, total: number(3, 1, 10) };
  assert.deepEqual(updateValues(controls, { current: 3, total: 3 }, "total", 1), { current: 1, total: 1 });
  const effective = resolveControl(controls.current, { current: 1, total: 3 });
  assert.equal(effective.kind === "number" && effective.max, 3);
  assert.deepEqual(updateValues(controls, { current: 1, total: 3 }, "current", 99), { current: 3, total: 3 });
});
