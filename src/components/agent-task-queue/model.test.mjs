import test from "node:test";
import assert from "node:assert/strict";
import { queueReducer as reduce } from "./model.ts";
const task = (id, extra = {}) => ({
  id,
  title: id,
  status: "queued",
  context: "",
  answers: {},
  progress: 0,
  ...extra,
});
const initial = (
  tasks = [
    task("a"),
    task("b", {
      questions: [{ id: "where", prompt: "Where?", options: ["Title", "Row"] }],
    }),
    task("c"),
  ],
) => ({ tasks, playing: false, epoch: 0, notice: "", removed: [] });
const tick = (s) => reduce(s, { type: "tick", epoch: s.epoch });
const status = (s) => Object.fromEntries(s.tasks.map((t) => [t.id, t.status]));
test("only one task runs and missing input is skipped", () => {
  let s = reduce(initial(), { type: "play" });
  assert.deepEqual(status(s), { a: "running", b: "queued", c: "queued" });
  s = tick(tick(s));
  assert.deepEqual(status(s), { a: "done", b: "needs-context", c: "running" });
});
test("all blocked requests leave the session available for new work", () => {
  let s = reduce(
    initial([
      task("q", { questions: [{ id: "x", prompt: "?", options: [] }] }),
    ]),
    { type: "play" },
  );
  assert.equal(s.playing, true);
  assert.equal(s.tasks[0].status, "needs-context");
  s = reduce(s, { type: "add", task: task("new") });
  assert.equal(s.tasks[1].status, "running");
});
test("pause and reset reject stale clock ticks, including after restart", () => {
  let s = reduce(initial(), { type: "play" }),
    epoch = s.epoch;
  s = reduce(s, { type: "pause-session" });
  assert.equal(reduce(s, { type: "tick", epoch }), s);
  s = reduce(s, { type: "play" });
  assert.equal(reduce(s, { type: "tick", epoch }), s);
  s = reduce(s, { type: "reset", tasks: [] });
  assert.equal(reduce(s, { type: "tick", epoch }), s);
});
test("pausing an active task schedules the next runnable task without losing progress", () => {
  let s = tick(reduce(initial(), { type: "play" }));
  s = reduce(s, { type: "pause-task", id: "a" });
  assert.deepEqual(status(s), {
    a: "paused",
    b: "needs-context",
    c: "running",
  });
  assert.equal(s.tasks[0].progress, 1);
  s = reduce(s, { type: "resume-task", id: "a" });
  assert.equal(s.tasks[0].status, "queued");
  assert.equal(s.tasks.filter((t) => t.status === "running").length, 1);
});
test("answering a blocked task does not preempt active work", () => {
  let s = tick(tick(reduce(initial(), { type: "play" })));
  s = reduce(s, { type: "answer", id: "b", answers: { where: "Title" } });
  assert.deepEqual(status(s), { a: "done", b: "queued", c: "running" });
  s = tick(tick(s));
  assert.equal(s.tasks.find((t) => t.id === "b").status, "running");
});
test("partial or oversized answers cannot release a blocked task", () => {
  let s = reduce(
    initial([
      task("b", {
        status: "needs-context",
        questions: [
          { id: "x", prompt: "?", options: [] },
          { id: "y", prompt: "?", options: [] },
        ],
      }),
    ]),
    { type: "play" },
  );
  assert.equal(reduce(s, { type: "answer", id: "b", answers: { x: "ok" } }), s);
  assert.equal(
    reduce(s, {
      type: "answer",
      id: "b",
      answers: { x: "ok", y: "z".repeat(501) },
    }),
    s,
  );
});
test("reordering preserves task states, context and running identity", () => {
  let s = reduce(initial(), { type: "play" });
  s = reduce(s, { type: "move", id: "c", over: "a" });
  assert.deepEqual(
    s.tasks.map((t) => t.id),
    ["c", "a", "b"],
  );
  assert.equal(s.tasks.find((t) => t.status === "running").id, "a");
  s = tick(tick(s));
  assert.equal(s.tasks.find((t) => t.status === "running").id, "c");
});
test("removing active work invalidates stale ticks; undo never creates two runners", () => {
  let s = reduce(initial(), { type: "play" }),
    epoch = s.epoch;
  s = reduce(s, { type: "remove", id: "a" });
  assert.equal(reduce(s, { type: "tick", epoch }), s);
  s = reduce(s, { type: "undo" });
  assert.equal(s.tasks.filter((t) => t.status === "running").length, 1);
  assert.equal(s.tasks[0].status, "queued");
});
test("remove and reverse undo restore exact order", () => {
  let s = initial();
  for (const id of ["b", "a", "c"]) s = reduce(s, { type: "remove", id });
  assert.equal(s.tasks.length, 0);
  for (let i = 0; i < 3; i++) s = reduce(s, { type: "undo" });
  assert.deepEqual(
    s.tasks.map((t) => t.id),
    ["a", "b", "c"],
  );
  assert.equal(reduce(s, { type: "undo" }), s);
});
test("add rejects duplicate IDs including undo history and invalid titles", () => {
  let s = reduce(initial(), { type: "remove", id: "a" });
  assert.equal(reduce(s, { type: "add", task: task("a") }), s);
  assert.equal(reduce(s, { type: "add", task: task("x", { title: "  " }) }), s);
  assert.equal(
    reduce(s, { type: "add", task: task("x", { title: "x".repeat(501) }) }),
    s,
  );
});
test("context edits preserve pause state and queued work", () => {
  let s = initial([task("a", { status: "paused" })]);
  s = reduce(s, { type: "context", id: "a", value: "  Use tokens  " });
  assert.equal(s.tasks[0].context, "Use tokens");
  assert.equal(s.tasks[0].status, "paused");
});
test("stale IDs and impossible transitions are no-ops", () => {
  const s = initial();
  assert.equal(reduce(s, { type: "remove", id: "missing" }), s);
  assert.equal(reduce(s, { type: "move", id: "a", over: "missing" }), s);
  assert.equal(reduce(s, { type: "resume-task", id: "a" }), s);
});
