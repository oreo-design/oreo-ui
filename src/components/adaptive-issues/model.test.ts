import test from "node:test";
import assert from "node:assert/strict";
import {
  fitWidth,
  snapWidth,
  matchingIssues,
  type AdaptiveIssue,
} from "./model.ts";
test("resize bounds fit small hosts and invalid inputs", () => {
  assert.equal(fitWidth(100, 1000), 320);
  assert.equal(fitWidth(9999, 280), 280);
  assert.equal(fitWidth(NaN, 900), 900);
  assert.equal(fitWidth(400, 0), 0);
});
test("snap only near stops and never beyond available space", () => {
  assert.equal(snapWidth(630, 1100), 640);
  assert.equal(snapWidth(700, 1100), 700);
  assert.equal(snapWidth(835, 820), 820);
  assert.equal(snapWidth(1000, 300), 300);
  assert.equal(snapWidth(1105, 1120), 1120);
});
test("search finds hidden metadata and trims case", () => {
  const items = [
    {
      id: 1,
      title: "Map cache",
      category: "Performance",
      pullRequest: { number: 1184, state: "open" },
      assignees: ["Maya Wilson"],
    },
  ] as AdaptiveIssue[];
  assert.equal(matchingIssues(items, "  MAYA ").length, 1);
  assert.equal(matchingIssues(items, "1184").length, 1);
  assert.equal(matchingIssues(items, "missing").length, 0);
  assert.equal(matchingIssues(items, "").length, 1);
});
