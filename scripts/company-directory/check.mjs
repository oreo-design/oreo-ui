import assert from "node:assert/strict";
import {
  companyRows,
  companyCSV,
  companyMoney,
  parseCompany,
} from "../../src/components/company/model.ts";
const owners = ["Alex", "Sam"];
const input = {
  name: " Acme ",
  domain: "ACME.EXAMPLE",
  stage: "Proposal",
  arr: "123.45",
  employees: "0",
  owner: "Alex",
  lastContact: "2026-10-16",
  notes: " notes ",
};
const parsed = parseCompany(input, owners);
assert.equal(parsed.arrCents, 12345);
assert.equal(parsed.domain, "acme.example");
assert.equal(parsed.name, "Acme");
assert.equal(parsed.notes, "notes");
for (const [field, value] of [
  ["arr", "-1"],
  ["arr", "1e4"],
  ["arr", "1.001"],
  ["arr", "10000000000.01"],
  ["employees", "2.2"],
  ["employees", "-1"],
  ["domain", "javascript:alert(1)"],
  ["domain", "https://acme.example"],
  ["lastContact", "2026-02-30"],
  ["lastContact", "no"],
  ["owner", "Unknown"],
  ["name", "  "],
  ["notes", "x".repeat(2001)],
  ["stage", "Lost"],
])
  assert.throws(
    () => parseCompany({ ...input, [field]: value }, owners),
    `${field}: ${value}`,
  );
assert.equal(
  parseCompany({ ...input, arr: "10000000000" }, owners).arrCents,
  1000000000000,
);
const rows = [
  { ...parsed, id: "a", hot: true, favorite: true },
  {
    ...parsed,
    id: "b",
    owner: "Sam",
    arrCents: 50000,
    hot: false,
    favorite: true,
  },
  {
    ...parsed,
    id: "c",
    name: "Beta",
    domain: "beta.example",
    stage: "Won",
    hot: true,
    favorite: false,
  },
];
const original = JSON.stringify(rows);
assert.deepEqual(
  companyRows(rows, {
    view: "mine",
    currentUser: "Alex",
    stage: "Proposal",
    query: "ACME",
  }).map((r) => r.id),
  ["a"],
);
assert.deepEqual(companyRows(rows, { view: "hot", owner: "Sam" }), []);
assert.deepEqual(
  companyRows(rows, {
    view: "favorites",
    sort: { key: "arrCents", direction: "desc" },
  }).map((r) => r.id),
  ["b", "a"],
);
assert.deepEqual(
  companyRows(rows, { sort: { key: "lastContact", direction: "desc" } }).map(
    (r) => r.id,
  ),
  ["a", "b", "c"],
);
assert.equal(JSON.stringify(rows), original);
assert.equal(companyMoney(12345), "$123.45");
assert.equal(companyMoney(NaN), "Unavailable");
const csv = companyCSV([
  { ...rows[0], name: " =SUM(1,2)", owner: 'A "quoted" owner' },
]);
assert.ok(csv.includes(`" '=SUM(1,2)"`));
assert.ok(csv.includes('"A ""quoted"" owner"'));
assert.ok(csv.includes('"123.45"'));
console.log(
  "Company directory model checks passed: combined filters, stable sort, immutability, decimal cents, limits, date/domain validation, CSV formula and quote escaping.",
);
