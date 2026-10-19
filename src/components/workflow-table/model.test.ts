import test from "node:test";
import assert from "node:assert/strict";
import {
  workflowRows,
  toggleVisibleSelection,
  workflowCSV,
  type Workflow,
} from "./model.ts";
const make = (id: string, patch: Partial<Workflow> = {}): Workflow => ({
  id,
  name: id,
  status: "Live",
  description: "",
  trigger: "Email",
  connector: "Gmail",
  owner: "A",
  folder: "Finance",
  runs: 1,
  success: 98,
  history: [1],
  edited: "2026-10-18T00:00:00Z",
  version: 1,
  ...patch,
});
test("filters OR within groups, AND across groups; archived rows stay out of All", () => {
  const rows = [
    make("a"),
    make("b", { status: "Degraded" }),
    make("c", { trigger: "Schedule" }),
    make("d", { status: "Archived" }),
  ];
  assert.deepEqual(
    workflowRows(rows, {
      filters: { status: ["Live", "Degraded"], trigger: ["Email"] },
    }).map((r) => r.id),
    ["a", "b"],
  );
  assert.deepEqual(
    workflowRows(rows, { view: "Archived" }).map((r) => r.id),
    ["d"],
  );
  assert.deepEqual(
    workflowRows(rows, { query: " A ", folder: "Operations" }),
    [],
  );
});
test("numeric sorting is stable and missing metrics remain last both ways", () => {
  const rows = [
    make("b", { success: 50 }),
    make("a", { success: 99 }),
    make("d", { success: null }),
    make("c", { success: 99 }),
  ];
  assert.deepEqual(
    workflowRows(rows, { sort: { key: "success", direction: "desc" } }).map(
      (r) => r.id,
    ),
    ["a", "c", "b", "d"],
  );
  assert.deepEqual(
    workflowRows(rows, { sort: { key: "success", direction: "asc" } }).map(
      (r) => r.id,
    ),
    ["b", "a", "c", "d"],
  );
  assert.equal(rows[0].id, "b");
});
test("visible selection preserves other pages, deduplicates and toggles only visible IDs", () => {
  assert.deepEqual(toggleVisibleSelection(["a", "c"], ["a", "b"]), [
    "a",
    "c",
    "b",
  ]);
  assert.deepEqual(toggleVisibleSelection(["a", "b", "c"], ["a", "b"]), ["c"]);
  assert.deepEqual(toggleVisibleSelection(["c"], []), ["c"]);
});
test("CSV escapes quotes/newlines and neutralizes spreadsheet formula fields", () => {
  const csv = workflowCSV([
    make("a", { name: '=HYPERLINK("bad")', owner: "A, B\nC" }),
  ]);
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));
  assert.ok(csv.includes('"A, B\nC"'));
  assert.ok(csv.startsWith('"Name","Status"'));
});
