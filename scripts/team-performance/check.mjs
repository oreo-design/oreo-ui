import assert from "node:assert/strict";
import {
  scoreBand,
  reviewCounts,
  performanceSummary,
  performanceRows,
  validatePerformance,
  performanceCSV,
} from "../../src/components/team-performance/model.ts";
const m = {
  id: "1",
  name: "A",
  role: "Engineer",
  department: "Engineering",
  score: 94,
  previous: 88,
  goals: 5,
  goalsDone: 4,
  review: "Completed",
  lastReview: "2026-09-24",
  note: "",
};
const rows = [
  m,
  {
    ...m,
    id: "2",
    name: "B",
    score: 60,
    previous: 70,
    goals: 3,
    goalsDone: 1,
    review: "Overdue",
  },
  {
    ...m,
    id: "3",
    name: "C",
    department: "Design",
    score: 80,
    previous: 80,
    review: "Pending",
  },
];
assert.deepEqual(reviewCounts(rows), { Completed: 1, Pending: 1, Overdue: 1 });
const summary = performanceSummary(rows);
assert.equal(summary.average, 78);
assert.equal(summary.top, 1);
assert.equal(summary.attention, 1);
assert.equal(summary.goals, 13);
assert.equal(summary.done, 9);
assert.equal(summary.achievement, 900 / 13);
assert.equal(performanceSummary([]).average, null);
assert.equal(performanceSummary([]).achievement, null);
for (const [value, expected] of [
  [90, "Excellent"],
  [89.9, "Good"],
  [80, "Good"],
  [79.9, "Developing"],
  [70, "Developing"],
  [69.9, "Needs attention"],
  [-1, "Unavailable"],
  [NaN, "Unavailable"],
  [101, "Unavailable"],
])
  assert.equal(scoreBand(value).label, expected);
assert.deepEqual(
  performanceRows(rows, "engineer", "Engineering", "Overdue", {
    key: "score",
    direction: "desc",
  }).map((m) => m.id),
  ["2"],
);
assert.deepEqual(
  performanceRows(rows, "", "All departments", "All reviews", {
    key: "change",
    direction: "asc",
  }).map((m) => m.id),
  ["2", "3", "1"],
);
assert.equal(rows[0], m);
for (const score of ["", "NaN", "Infinity", "-1", "101", "1e2", "2.34"])
  assert.ok(validatePerformance(score, "1", 5, ""));
assert.equal(validatePerformance("0", "0", 5, ""), "");
assert.equal(validatePerformance("100", "5", 5, ""), "");
assert.equal(validatePerformance("94.5", "2", 5, ""), "");
for (const done of ["", "-1", "1.1", "6", "Infinity"])
  assert.ok(validatePerformance("80", done, 5, ""));
assert.ok(validatePerformance("80", "2", 5, "x".repeat(501)));
const csv = performanceCSV([
  { ...m, name: "=SUM(1)", note: 'a,"quote"\nline' },
]);
assert.ok(csv.includes('"\'=SUM(1)"'));
assert.ok(csv.includes('"a,""quote""\nline"'));
assert.equal(csv.split("\r\n").length, 2);
console.log(
  "Team performance checks passed: score thresholds, summary denominators, exclusive review counts, filtering, sorting, validation and CSV escaping.",
);
