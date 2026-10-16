import test from "node:test";
import assert from "node:assert/strict";
import {
  validSeries,
  chartCeiling,
  percentChange,
  filterRecords,
  validateRecord,
  recordsCSV,
  type DashboardRecord,
} from "./model.ts";
test("chart validation distinguishes zeros from missing or invalid series", () => {
  assert.equal(validSeries([{ label: "A", values: [0, 0] }], 2), true);
  for (const values of [
    [-1, 0],
    [NaN, 0],
    [Infinity, 0],
    [Number.MAX_VALUE, Number.MAX_VALUE],
    [1],
  ])
    assert.equal(validSeries([{ label: "A", values }], 2), false);
  assert.equal(validSeries([], 0), false);
});
test("grouped ceiling fits each value and stacked ceiling fits their total", () => {
  const p = [
    { label: "A", values: [80, 90] },
    { label: "B", values: [70, 20] },
  ];
  assert.equal(chartCeiling(p, false), 90);
  assert.equal(chartCeiling(p, true), 200);
  assert.equal(chartCeiling([{ label: "A", values: [0, 0] }]), 1);
});
test("percent changes avoid invented zero-base comparison", () => {
  assert.equal(percentChange(125, 100), 25);
  assert.equal(percentChange(50, 100), -50);
  assert.equal(percentChange(0, 0), null);
  assert.equal(percentChange(NaN, 100), null);
});
const record: DashboardRecord = {
  id: "1",
  name: "Alex",
  email: "alex@example.com",
  channel: "Direct",
  status: "Active",
  value: 42,
  date: "2026-10-16",
};
test("filters intersect case-insensitive query, status and source", () => {
  assert.deepEqual(filterRecords([record], " ALEX ", "Direct", "Active"), [
    record,
  ]);
  assert.deepEqual(filterRecords([record], "Alex", "Social", "All"), []);
  assert.deepEqual(filterRecords([record], "", "Direct", "Pending"), []);
});
test("record draft rejects missing names, invalid addresses and unsafe amounts", () => {
  assert.match(validateRecord("", "a@b.com", "1"), /name/);
  assert.match(validateRecord("A", "x", "1"), /email/);
  for (const v of ["", "-1", "1e3", "Infinity", "2.345", "1000000001"])
    assert.notEqual(validateRecord("A", "a@b.com", v), "");
  assert.equal(validateRecord("A", "a@b.com", "0"), "");
  assert.equal(validateRecord("A", "a@b.com", "12.50"), "");
});
test("CSV preserves commas and quotes while neutralizing spreadsheet formulas", () => {
  const csv = recordsCSV([
    { ...record, name: '=HYPERLINK("x")', email: "a,b@example.com" },
  ]);
  assert.ok(csv.includes('"\'=HYPERLINK(""x"")"'));
  assert.ok(csv.includes('"a,b@example.com"'));
  assert.equal(csv.split("\r\n").length, 2);
});
