import test from "node:test";
import assert from "node:assert/strict";
import {
  dateError,
  createTask,
  applyTaskBoard,
  hasDependencyCycle,
} from "./model.ts";
test("date pair accepts empty endpoints and rejects impossible/reversed dates", () => {
  assert.equal(dateError("", ""), "");
  assert.equal(dateError("2028-02-29", "2028-02-29"), "");
  assert.ok(dateError("2026-02-29", ""));
  assert.ok(dateError("2026-10-19", "2026-10-18"));
  assert.ok(dateError("bad", ""));
});
test("filtered board movement preserves hidden tasks and detail fields without mutation", () => {
  const a = {
    ...createTask("a", "First"),
    description: "Keep me",
    comments: [{ id: "c", text: "Review", at: "2026-10-16" }],
  };
  const hidden = createTask("hidden", "Hidden");
  const b = createTask("b", "Last");
  const all = [a, hidden, b];
  const result = applyTaskBoard(all, [
    { id: "b", title: b.title, columnId: "progress", assigneeId: "emma" },
    { id: "a", title: a.title, columnId: "todo" },
  ]);
  assert.deepEqual(
    result.map((t) => t.id),
    ["b", "hidden", "a"],
  );
  assert.equal(result[1], hidden);
  assert.equal(result[2].description, "Keep me");
  assert.equal(result[2].comments, a.comments);
  assert.equal(result[0].assigneeId, "emma");
  assert.equal(all[2].status, "todo");
});
test("new cards are promoted to full editable tasks without dropping hidden records", () => {
  const all = [createTask("a", "Existing")];
  const result = applyTaskBoard(all, [
    { id: "new", title: "Added", columnId: "backlog" },
  ]);
  assert.deepEqual(
    result.map((t) => t.id),
    ["a", "new"],
  );
  assert.deepEqual(result[1].subtasks, []);
  assert.equal(result[1].status, "backlog");
});
test("dependency checks reject direct and transitive cycles but permit clearing", () => {
  const tasks = [
    createTask("a", "A"),
    { ...createTask("b", "B"), blockedBy: "a" },
    { ...createTask("c", "C"), blockedBy: "b" },
  ];
  assert.equal(hasDependencyCycle(tasks, "a", "a"), true);
  assert.equal(hasDependencyCycle(tasks, "a", "c"), true);
  assert.equal(hasDependencyCycle(tasks, "c", "a"), false);
  assert.equal(hasDependencyCycle(tasks, "a", ""), false);
});
