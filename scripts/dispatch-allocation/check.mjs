import assert from "node:assert/strict";
import {
  assignJob,
  allocationError,
  dispatchDay,
} from "../../src/components/dispatch-allocation/model.ts";
const resources = [
  { id: "a", name: "Amara", vehicle: "Minibus", seats: 12 },
  { id: "b", name: "Ethan", vehicle: "Sedan", seats: 4 },
];
const job = {
  id: "one",
  customer: "Studio",
  from: "A",
  to: "B",
  category: "Private hire",
  duration: 2,
  passengers: 8,
  luggage: 12,
};
const jobs = [
  job,
  {
    ...job,
    id: "two",
    allocation: { resourceId: "a", start: 10, date: "2026-10-16" },
  },
];
const value = { resourceId: "a", start: 8, date: "2026-10-16" };
const assigned = assignJob(jobs, resources, "one", value);
assert.equal(jobs[0].allocation, undefined);
assert.deepEqual(assigned[0].allocation, value);
assert.equal(
  allocationError(jobs, resources, "one", { ...value, start: 12 }),
  undefined,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, start: 9 }),
  /already has/,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, resourceId: "b" }),
  /seats/,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, start: 17 }),
  /18:00/,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, start: 8.5 }),
  /18:00/,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, date: "2026-02-30" }),
  /valid date/,
);
assert.throws(
  () => assignJob(jobs, resources, "one", { ...value, resourceId: "missing" }),
  /available driver/,
);
assert.throws(() => assignJob(jobs, resources, "missing", value), /no longer/);
assert.equal(
  allocationError(jobs, resources, "one", {
    ...value,
    start: 10,
    date: "2026-10-17",
  }),
  undefined,
);
const removed = assignJob(assigned, resources, "one");
assert.equal(removed[0].allocation, undefined);
const dispatched = dispatchDay(assigned, "2026-10-16");
assert.ok(dispatched.every((j) => j.dispatched));
assert.throws(() => assignJob(dispatched, resources, "one"), /Dispatched/);
assert.equal(dispatchDay(jobs, "2026-10-17")[1].dispatched, undefined);
assert.equal(dispatchDay(jobs, "2026-10-16")[0].dispatched, undefined);
console.log(
  "Allocation checks passed: boundaries, conflicts, capacity, dates, immutability, unassign and dispatch locks.",
);
