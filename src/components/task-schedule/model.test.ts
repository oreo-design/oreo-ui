import test from "node:test";
import assert from "node:assert/strict";
import {
  calendarDays,
  moveMonth,
  scheduleError,
  timelineSpan,
} from "./model.ts";
test("month grid starts Monday and includes leap day and year boundary", () => {
  const dates = calendarDays("2024-02-29", "month");
  assert.equal(dates.length, 42);
  assert.equal(dates[0], "2024-01-29");
  assert.ok(dates.includes("2024-02-29"));
  assert.deepEqual(calendarDays("2026-01-01", "week"), [
    "2025-12-29",
    "2025-12-30",
    "2025-12-31",
    "2026-01-01",
    "2026-01-02",
    "2026-01-03",
    "2026-01-04",
  ]);
  assert.equal(moveMonth("2026-01-31", 1), "2026-02-01");
  assert.equal(moveMonth("2026-12-31", 1), "2027-01-01");
  assert.deepEqual(calendarDays("bad", "month"), []);
});
test("timeline clips inclusively and does not invent start dates", () => {
  assert.deepEqual(timelineSpan(undefined, "2026-10-15", "2026-10-12", 14), {
    from: 3,
    to: 3,
    continuesBefore: false,
    continuesAfter: false,
  });
  assert.deepEqual(timelineSpan("2026-10-01", "2026-11-01", "2026-10-12", 14), {
    from: 0,
    to: 13,
    continuesBefore: true,
    continuesAfter: true,
  });
  assert.equal(
    timelineSpan("2026-11-01", "2026-11-03", "2026-10-12", 14),
    null,
  );
  assert.equal(
    timelineSpan("2026-10-20", "2026-10-15", "2026-10-12", 14),
    null,
  );
});
test("date editing rejects invalid and inverted ranges but accepts no dates and one-day tasks", () => {
  assert.equal(scheduleError("", ""), "");
  assert.equal(scheduleError(undefined, "2026-10-15"), "");
  assert.equal(scheduleError("2026-10-15", "2026-10-15"), "");
  for (const [a, b] of [
    ["2026-10-20", "2026-10-15"],
    ["2026-10-15", ""],
    ["", "2026-02-29"],
    ["bad", "2026-10-15"],
  ])
    assert.ok(scheduleError(a, b));
});
