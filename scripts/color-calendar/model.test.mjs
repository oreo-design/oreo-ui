import test from "node:test";
import assert from "node:assert/strict";
import {
  validDate,
  addDays,
  weekDates,
  parseTime,
  validateEvent,
  filterEvents,
  placeEvents,
} from "../../src/components/color-calendar/model.ts";
const sources = [
  { id: "work", name: "Work", visible: true, color: "blue" },
  { id: "home", name: "Home", visible: false, color: "pink" },
];
const event = {
  id: "a",
  title: "Meeting",
  date: "2026-10-19",
  start: 600,
  end: 660,
  sourceId: "work",
};
test("date helpers preserve wall-clock dates across DST and month/year boundaries", () => {
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("2028-02-29"), true);
  assert.equal(validDate(""), false);
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.deepEqual(weekDates("2026-11-01", 7), [
    "2026-10-26",
    "2026-10-27",
    "2026-10-28",
    "2026-10-29",
    "2026-10-30",
    "2026-10-31",
    "2026-11-01",
  ]);
});
test("event validation rejects invalid dates, durations, quarter-hour boundaries and unknown calendars", () => {
  assert.equal(validateEvent(event, sources), null);
  for (const update of [
    { title: " " },
    { date: "2026-02-30" },
    { start: NaN },
    { end: 600 },
    { end: 607 },
    { end: 1500 },
    { sourceId: "missing" },
  ])
    assert.ok(validateEvent({ ...event, ...update }, sources));
  assert.equal(
    validateEvent({ ...event, allDay: true, start: 0, end: 1440 }, sources),
    null,
  );
  assert.equal(parseTime("23:45"), 1425);
  assert.ok(Number.isNaN(parseTime("24:00")));
});
test("overlap groups include chained overlaps and keep adjacent events in one lane", () => {
  const rows = [
    event,
    { ...event, id: "b", start: 630, end: 690 },
    { ...event, id: "c", start: 660, end: 720 },
    { ...event, id: "d", start: 720, end: 750 },
  ];
  const before = JSON.stringify(rows);
  const result = placeEvents(rows);
  assert.deepEqual(
    result.map((e) => [e.event.id, e.column, e.columns]),
    [
      ["a", 0, 2],
      ["b", 1, 2],
      ["c", 0, 2],
      ["d", 0, 1],
    ],
  );
  assert.equal(JSON.stringify(rows), before);
});
test("triple overlaps and all-day exclusion are deterministic", () => {
  const rows = [
    event,
    { ...event, id: "b", start: 615, end: 645 },
    { ...event, id: "c", start: 630, end: 675 },
    { ...event, id: "all", allDay: true, start: 0, end: 1440 },
  ];
  assert.deepEqual(
    placeEvents(rows).map((e) => [e.column, e.columns]),
    [
      [0, 3],
      [1, 3],
      [2, 3],
    ],
  );
  assert.deepEqual(placeEvents([]), []);
});
test("filtering shares visible source, exact date and search semantics with export", () => {
  const rows = [
    event,
    { ...event, id: "hidden", sourceId: "home" },
    { ...event, id: "other-day", date: "2026-10-20" },
    { ...event, id: "all-day", allDay: true, start: 0, end: 1440 },
    { ...event, id: "place", title: "Lunch", location: "Studio" },
  ];
  assert.equal(filterEvents(rows, sources, ["2026-10-19"]).length, 3);
  assert.equal(
    filterEvents(rows, sources, ["2026-10-19"], "studio")[0].id,
    "place",
  );
  assert.equal(filterEvents(rows, sources, ["2026-10-19"], "HOME").length, 0);
  assert.equal(
    filterEvents(rows, sources, ["2026-10-19"], "work")[0].id,
    "all-day",
  );
});
