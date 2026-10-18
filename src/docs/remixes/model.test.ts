import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePages, canRunStep, finishJob, filterEvidence, hasRemix } from "./model.ts";

test("page ranges accept mixed ranges, deduplicate and normalize order", () => {
  assert.deepEqual(parsePages("4, 1-2, 2", 4), [1, 2, 4]);
  assert.deepEqual(parsePages(" 1 - 4 ", 4), [1, 2, 3, 4]);
});
test("page ranges reject incomplete, reversed, out-of-bounds and fractional input", () => {
  for (const input of ["", " ", "0", "5", "3-2", "1-", "1,", "1.5", "1e2", "1-99999999999", "a"]) assert.equal(parsePages(input, 4), null, input);
});
test("dependent steps stay locked after failure, unlock only on success", () => {
  assert.equal(canRunStep(["pending", "pending", "pending"], 0), true);
  assert.equal(canRunStep(["pending", "pending", "pending"], 1), false);
  assert.equal(canRunStep(["done", "failed", "pending"], 1), true);
  assert.equal(canRunStep(["done", "failed", "pending"], 2), false);
  assert.equal(canRunStep(["done", "done", "pending"], 2), true);
  assert.equal(canRunStep(["done", "done", "running"], 2), false);
  assert.equal(canRunStep(["done", "done", "done"], 2), false);
});
test("the failure fixture fails once and retry retains job identity and input", () => {
  const original = { id: 2, text: "Check [fail] evidence", status: "running" as const, attempts: 1 };
  const failed = finishJob(original);
  assert.equal(failed.status, "failed");
  const retried = finishJob({ ...failed, status: "running", attempts: 2 });
  assert.equal(retried.status, "done");
  assert.equal(retried.text, original.text);
  assert.equal(retried.id, original.id);
  assert.equal(original.status, "running", "state transition must not mutate the source record");
  assert.equal(finishJob({ ...original, text: "Check evidence" }).status, "done");
});
test("evidence search finds quotations and titles without fabricating matches", () => {
  assert.equal(filterEvidence("  EIGHT  ")[0].id, "research");
  assert.equal(filterEvidence("activation")[0].id, "analytics");
  assert.equal(filterEvidence("nonexistent").length, 0);
  assert.equal(filterEvidence("").length, 3);
});
test("remix entry is limited to the five selected components", () => {
  for (const slug of ["prompt-box", "attachment", "confirmation", "plan", "sources"]) assert.equal(hasRemix(slug), true);
  assert.equal(hasRemix("button"), false);
});
