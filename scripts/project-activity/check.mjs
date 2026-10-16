import assert from "node:assert/strict";
import {
  appendComment,
  filterActivity,
  groupActivity,
  validEvents,
  activityTime,
} from "../../src/components/project-activity/model.ts";
const now = "2026-10-16T12:00:00Z";
const make = (id, at, action = "moved", extra = {}) => ({
  id,
  at,
  action,
  actor: { id: "alex", name: "Alex Morgan" },
  project: { id: "site", name: "Website" },
  subject: "Homepage",
  subjectId: "WEB-1",
  ...extra,
});
const events = [
  make("today", "2026-10-16T11:00:00Z"),
  make("yesterday", "2026-10-15T18:00:00Z", "commented", {
    body: "Keyboard audit",
  }),
  make("week", "2026-10-12T00:00:00Z", "priority"),
  make("earlier", "2026-10-11T23:59:59Z", "project"),
  make("future", "2026-10-17T00:00:00Z", "attached", {
    filename: "tokens.zip",
  }),
];
assert.equal(validEvents(events), true);
assert.deepEqual(
  groupActivity(events, now).map((g) => g.label),
  ["Upcoming", "Today", "Yesterday", "This week", "Earlier"],
);
assert.deepEqual(
  groupActivity(events.slice(0, 4), "2026-10-19T12:00:00Z").map((g) => g.label),
  ["Earlier"],
);
assert.equal(validEvents([...events, events[0]]), false);
assert.equal(validEvents([make("bad", "invalid")]), false);
assert.deepEqual(
  filterActivity(events, { kind: "comments", query: "KEYBOARD" }).map(
    (e) => e.id,
  ),
  ["yesterday"],
);
assert.deepEqual(
  filterActivity(events, { kind: "status" }).map((e) => e.id),
  ["today", "week"],
);
assert.deepEqual(
  filterActivity(events, { query: "tokens.zip" }).map((e) => e.id),
  ["future"],
);
assert.equal(filterActivity(events, { actor: "missing" }).length, 0);
assert.equal(filterActivity(events, { project: "missing" }).length, 0);
assert.equal(
  filterActivity(events, { unreadOnly: true, readIds: events.map((e) => e.id) })
    .length,
  0,
);
assert.equal(
  filterActivity(events, { kind: "projects", actor: "alex", project: "site" })
    .length,
  1,
);
const original = structuredClone(events),
  next = appendComment(
    events,
    events[0],
    "  A useful note  ",
    events[0].actor,
    now,
    "new",
  );
assert.equal(next[0].body, "A useful note");
assert.equal(next[0].subjectId, "WEB-1");
assert.equal(next.length, events.length + 1);
assert.deepEqual(events, original);
for (const body of ["", " ".repeat(2), "x".repeat(501)])
  assert.throws(
    () => appendComment(events, events[0], body, events[0].actor, now, "new"),
    RangeError,
  );
assert.throws(
  () => appendComment(events, events[0], "ok", events[0].actor, now, "today"),
  RangeError,
);
assert.throws(
  () => appendComment(events, events[0], "ok", events[0].actor, "bad", "new"),
  RangeError,
);
assert.deepEqual(
  next.filter((e) => e.id !== "new"),
  events,
);
assert.equal(activityTime("2026-10-16T11:59:30Z", now), "Just now");
assert.equal(activityTime("2026-10-16T11:30:00Z", now), "30m ago");
assert.equal(activityTime("2026-10-15T12:00:00Z", now), "1d ago");
assert.equal(activityTime("2026-10-17T12:00:00Z", now), "Scheduled");
console.log(
  "UTC boundaries, filters, unread matching, stable order, immutable comments, validation, undo and relative times passed.",
);

assert.deepEqual(filterActivity([make("z",now),make("a",now)],{}).map(e=>e.id),["a","z"]);
