import test from "node:test";
import assert from "node:assert/strict";
import { bounded, shadowCSS, record, travel } from "./model.ts";

test("numeric boundaries preserve negative ranges, fractional steps and finite output", () => {
  assert.equal(bounded(-4.24, -10, 10, 0.25), -4.25);
  assert.equal(bounded(900, 0, 48), 48);
  assert.equal(bounded(-900, 0, 48), 0);
  assert.equal(bounded(NaN, -10, 10), -10);
  assert.equal(bounded(0.3, 0, 1, 0.1), 0.3);
});
test("a new edit after undo discards the stale redo branch; redundant edits do not", () => {
  let h = { past: [], present: { width: 320 }, future: [] };
  h = record(h, { width: 360 });
  h = record(h, { width: 400 });
  h = travel(h, "undo");
  assert.deepEqual(h.present, { width: 360 });
  const unchanged = record(h, { width: 360 });
  assert.equal(unchanged, h);
  h = record(h, { width: 420 });
  assert.deepEqual(h.future, []);
  assert.deepEqual(travel(h, "undo").present, { width: 360 });
  assert.deepEqual(travel(travel(h, "undo"), "redo").present, { width: 420 });
});
test("history bounds memory without losing the current or next redo value", () => {
  let h = { past: [], present: 0, future: [] };
  for (let n = 1; n <= 75; n++) h = record(h, n);
  assert.equal(h.past.length, 50);
  assert.equal(h.past[0], 25);
  for (let n = 0; n < 60; n++) h = travel(h, "undo");
  assert.equal(h.present, 25);
  h = travel(h, "redo");
  assert.equal(h.present, 26);
});
test("shadow output preserves negative spread, independent layers and alpha", () => {
  assert.equal(shadowCSS([]), "none");
  assert.equal(
    shadowCSS([
      {
        id: "a",
        x: 0,
        y: 24,
        blur: 72,
        spread: -4,
        color: "#000000",
        opacity: 12,
      },
      {
        id: "b",
        x: -2,
        y: 0,
        blur: 0,
        spread: 1,
        color: "#ffffff",
        opacity: 100,
      },
    ]),
    "0px 24px 72px -4px #0000001f, -2px 0px 0px 1px #ffffffff",
  );
});
