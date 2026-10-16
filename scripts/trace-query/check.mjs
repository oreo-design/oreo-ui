import assert from "node:assert/strict";
import {
  matchesQuery,
  validateCondition,
  selectTraces,
  queryDocument,
  TRACE_FIELDS,
} from "../../src/components/trace-query/model.ts";
const c = (field, operator, value) => ({ id: field, field, operator, value });
assert.equal(
  matchesQuery({ score: null }, [c("score", "lte", "0")], TRACE_FIELDS),
  false,
);
assert.equal(
  matchesQuery(
    { feedback: null },
    [c("feedback", "neq", "positive")],
    TRACE_FIELDS,
  ),
  false,
);
assert.equal(
  matchesQuery({ score: 0 }, [c("score", "eq", "0")], TRACE_FIELDS),
  true,
);
assert.equal(
  matchesQuery(
    { score: 0.6, status: "error" },
    [c("score", "lte", ".8"), c("status", "eq", "success")],
    TRACE_FIELDS,
  ),
  false,
);
assert.equal(
  matchesQuery(
    { tags: ["Docs", "Preview"] },
    [c("tags", "contains", "DOC")],
    TRACE_FIELDS,
  ),
  true,
);
for (const value of ["", " ", "Infinity", "-0.1", "1.1"])
  assert.ok(validateCondition(c("score", "lte", value), TRACE_FIELDS));
assert.ok(validateCondition(c("status", "eq", "missing"), TRACE_FIELDS));
assert.ok(validateCondition(c("score", "contains", "1"), TRACE_FIELDS));
const records = [
  {
    id: "a",
    startedAt: "2026-10-15T12:00:00Z",
    name: "docs",
    input: "Memory",
    score: null,
    durationMs: null,
  },
  {
    id: "b",
    startedAt: "2026-10-16T12:00:00Z",
    name: "docs",
    input: "TOOLS",
    score: 0,
    durationMs: 0,
  },
  {
    id: "c",
    startedAt: "2026-10-16T11:00:00Z",
    name: "other",
    input: "Tools",
    score: 0.8,
    durationMs: 400,
  },
];
assert.deepEqual(
  selectTraces(records, [], null, "", "score").map((t) => t.id),
  ["b", "c", "a"],
);
assert.deepEqual(
  selectTraces(
    records,
    [],
    Date.parse("2026-10-16T12:00:00Z"),
    "tools",
    "newest",
  ).map((t) => t.id),
  ["b"],
);
assert.deepEqual(
  selectTraces(records, [], null, "", "duration").map((t) => t.id),
  ["c", "b", "a"],
);
assert.deepEqual(
  queryDocument([c("score", "lte", ".8")], null, "tools", "newest"),
  {
    schema: "oreo-trace-query/v1",
    match: "all",
    from: null,
    search: "tools",
    sort: "newest",
    conditions: [{ field: "score", operator: "lte", value: 0.8 }],
  },
);
assert.equal(records[0].id, "a");
console.log(
  "Trace query checks passed: null semantics, AND, validation, case, date boundary, sort, nonmutation and export.",
);
