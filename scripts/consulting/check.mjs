import assert from "node:assert/strict";
import {
  resolveConflict,
  sourceStatus,
  sourceSummary,
  validateSourceFile,
  validConversationDays,
} from "../../src/components/consulting/model.ts";
const findings = { frameworks: 1, recommendations: 2, examples: 3 };
const sources = [
  {
    id: "a",
    title: "a",
    format: "PDF",
    detail: "1 page",
    usedFor: "test",
    findings,
    status: "review",
  },
  {
    id: "b",
    title: "b",
    format: "PDF",
    detail: "1 page",
    usedFor: "test",
    findings,
    status: "approved",
  },
  {
    id: "c",
    title: "c",
    format: "PDF",
    detail: "1 page",
    usedFor: "test",
    findings,
    status: "duplicate",
  },
];
const conflicts = [
  {
    id: "c1",
    title: "Mismatch",
    context: "test",
    options: [
      { sourceId: "a", title: "a", quote: "one" },
      { sourceId: "b", title: "b", quote: "two" },
    ],
  },
];
assert.equal(sourceStatus(sources[1], conflicts), "conflict");
assert.equal(sourceSummary(sources, conflicts).frameworks, 0);
let result = resolveConflict(sources, conflicts, "c1", "a");
assert.equal(result.sources[0].status, "approved");
assert.equal(result.sources[1].status, "duplicate");
assert.equal(result.conflicts[0].resolution, "a");
assert.equal(sourceSummary(result.sources, result.conflicts).frameworks, 1);
assert.equal(sources[0].status, "review");
assert.equal(conflicts[0].resolution, undefined);
assert.deepEqual(resolveConflict(sources, conflicts, "c1", "unknown"), {
  sources,
  conflicts,
});
assert.deepEqual(
  resolveConflict(result.sources, result.conflicts, "c1", "b"),
  result,
);
result = resolveConflict(sources, conflicts, "c1", "ask");
assert.equal(result.conflicts[0].resolution, "ask");
assert.equal(sourceSummary(result.sources, result.conflicts).approved, 2);
for (const name of ["a.PDF", "b.docx", "c.pptx", "d.xlsx"])
  assert.equal(validateSourceFile({ name, size: 50 * 1024 * 1024 }), null);
assert.ok(validateSourceFile({ name: "bad.exe", size: 1 }));
assert.ok(validateSourceFile({ name: "empty.pdf", size: 0 }));
assert.ok(validateSourceFile({ name: "big.pdf", size: 50 * 1024 * 1024 + 1 }));
assert.ok(
  validConversationDays([
    { id: "a", label: "Monday", answered: 0, escalated: 1 },
  ]),
);
assert.ok(
  !validConversationDays([
    { id: "a", label: "Monday", answered: -1, escalated: 1 },
  ]),
);
assert.ok(
  !validConversationDays([
    { id: "a", label: "Monday", answered: NaN, escalated: 1 },
  ]),
);
assert.ok(
  !validConversationDays([
    { id: "a", label: "Monday", answered: 1, escalated: 0 },
    { id: "a", label: "Tuesday", answered: 1, escalated: 0 },
  ]),
);
console.log(
  "PASS: conflict precedence, selection/ask policy, immutability, counts, file limits and chart data",
);
