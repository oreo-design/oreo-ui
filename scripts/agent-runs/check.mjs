import assert from "node:assert/strict";
import {
  fillWeek,
  validBuckets,
  summarizeRuns,
  intensity,
  heatmapCsv,
} from "../../src/components/agent-runs/model.ts";
const data = [
  { day: 0, hour: 7, runs: 10, credits: 20, failures: 1, durationSeconds: 100 },
  {
    day: 6,
    hour: 20,
    runs: 30,
    credits: 90,
    failures: 3,
    durationSeconds: 900,
  },
];
const original = structuredClone(data);
const summary = summarizeRuns(data);
assert.equal(fillWeek(data).length, 168);
assert.equal(fillWeek(data)[7].runs, 10);
assert.equal(fillWeek(data)[0].runs, 0);
assert.deepEqual(summary.total, {
  runs: 40,
  credits: 110,
  failures: 4,
  durationSeconds: 1000,
});
assert.equal(summary.average, 25);
assert.equal(summary.failureRate, 10);
assert.equal(summary.morningShare, 25);
assert.equal(summary.peak.hour, 20);
assert.equal(summarizeRuns(data, "credits").morningShare, (20 / 110) * 100);
assert.equal(summarizeRuns([]).average, null);
assert.equal(summarizeRuns([]).peak, null);
assert.deepEqual(
  [0, 1, 25, 26, 51, 76, 100].map((n) => intensity(n, 100)),
  [0, 1, 1, 2, 3, 4, 4],
);
assert.equal(heatmapCsv(data).split("\n").length, 169);
assert.equal(heatmapCsv(data).split("\n")[8], "Mon,7,10,20,1,100");
for (const patch of [
  { day: -1 },
  { day: 7 },
  { hour: 24 },
  { hour: 0.5 },
  { runs: NaN },
  { credits: -1 },
  { failures: 11 },
  { durationSeconds: Infinity },
  { runs: 0 },
  { credits: Number.MAX_SAFE_INTEGER },
]) {
  const invalid = [{ ...data[0], ...patch }];
  assert.equal(validBuckets(invalid), false);
  assert.throws(() => fillWeek(invalid), RangeError);
}
assert.equal(validBuckets([data[0], data[0]]), false);
assert.deepEqual(data, original);
console.log(
  "Weekly validation, zero buckets, weighted averages, peak, metric insight, intensity and CSV passed.",
);
const { AGENTS, agentWeek, selectedWeek } = await import(
  "../../src/patterns/agent-runs/data.ts"
);
for (const previous of [false, true]) {
  const all = selectedWeek("all", previous),
    parts = AGENTS.map((a) => agentWeek(a.id, previous));
  assert.equal(validBuckets(all), true);
  for (let i = 0; i < 168; i++)
    for (const key of ["runs", "credits", "failures", "durationSeconds"])
      assert.equal(
        all[i][key],
        parts.reduce((n, p) => n + p[i][key], 0),
      );
  assert.deepEqual(
    selectedWeek("research", previous),
    agentWeek("research", previous),
  );
}
assert.notDeepEqual(selectedWeek(), selectedWeek("all", true));
console.log(
  "Agent filters, week filters and exact per-hour partitions passed.",
);
