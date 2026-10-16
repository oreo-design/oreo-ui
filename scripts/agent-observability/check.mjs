import assert from "node:assert/strict";
import {
  healthRows,
  summarizeHealth,
  validTelemetry,
  toggleAgent,
  splitRequests,
  telemetryCSV,
} from "../../src/components/agent-observability/model.ts";
const agent = {
  id: "a",
  name: "Alpha",
  role: "QA",
  region: "us",
  status: "Degraded",
  requests: 100,
  successes: 80,
  costPer1k: 0.5,
  p95ms: 900,
  model: "Small",
  version: "1",
};
const rows = [
  agent,
  {
    ...agent,
    id: "b",
    name: "Beta",
    region: "eu",
    status: "Paused",
    requests: 900,
    successes: 900,
    p95ms: 1100,
  },
];
assert.equal(summarizeHealth(rows).success, 98); // weighted, not (80+100)/2
assert.equal(summarizeHealth(rows).medianP95, 1000);
assert.equal(summarizeHealth(rows).active, 1);
assert.equal(summarizeHealth([]).requests, 0);
assert.equal(
  summarizeHealth([{ ...agent, requests: 0, successes: 0 }]).medianP95,
  0,
);
assert.deepEqual(
  healthRows(rows, "small", "All statuses", "eu").map((a) => a.id),
  ["b"],
);
assert.deepEqual(
  healthRows(rows, "", "Paused").map((a) => a.id),
  ["b"],
);
assert.deepEqual(
  healthRows(rows, "", "All statuses", "all", {
    key: "success",
    direction: "desc",
  }).map((a) => a.id),
  ["b", "a"],
);
assert.deepEqual(
  rows.map((a) => a.id),
  ["a", "b"],
);
assert.equal(healthRows(rows, "nothing").length, 0);
assert(validTelemetry(agent));
for (const changes of [
  { successes: 101 },
  { requests: NaN },
  { costPer1k: -1 },
  { p95ms: Infinity },
  { successes: 1.2 },
])
  assert(!validTelemetry({ ...agent, ...changes }));
const paused = toggleAgent(rows, "a");
assert.equal(paused[0].status, "Paused");
assert.equal(rows[0].status, "Degraded");
assert.equal(toggleAgent(paused, "a", "Degraded")[0].status, "Degraded");
assert.throws(() => toggleAgent(rows, "gone"), /no longer/);
for (const total of [0, 1, 17, 118629]) {
  const values = splitRequests(total, [4, 0, 8, 12]);
  assert.equal(
    values.reduce((s, n) => s + n, 0),
    total,
  );
  assert(values.every(Number.isSafeInteger));
  assert.equal(values[1], 0);
}
assert.throws(() => splitRequests(-1, [1]));
assert.throws(() => splitRequests(1, [0]));
assert.equal(telemetryCSV(rows).split("\r\n").length, 3);
assert(
  telemetryCSV([{ ...agent, name: '=HYPERLINK("bad")' }]).includes(
    '"\'=HYPERLINK(""bad"")"',
  ),
);
console.log(
  "Agent observability: weighted telemetry, filter/sort, pause/resume, exact bucket totals, invalid data and CSV checks passed.",
);
