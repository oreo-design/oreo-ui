import test from "node:test";
import assert from "node:assert/strict";
import {
  balanceChange,
  sparkHeights,
  resolveNotice,
  validateBankDraft,
  searchAccounts,
  type BankAccount,
  type FinanceNotice,
} from "./model.ts";
const account: BankAccount = {
  id: "one",
  name: "Operating",
  bank: "Harbor",
  last4: "4021",
  currency: "USD",
  balance: 100,
  history: [50, 100],
  tone: "blue",
};
test("change handles rising, falling, unchanged and undefined comparisons", () => {
  assert.equal(balanceChange([100, 125]), 25);
  assert.equal(balanceChange([100, 50]), -50);
  assert.equal(balanceChange([100, 100]), 0);
  for (const points of [[], [10], [0, 10], [NaN, 10], [-1, 10]])
    assert.equal(balanceChange(points), null);
});
test("spark values preserve proportional geometry and do not fabricate zero or invalid data", () => {
  assert.deepEqual(sparkHeights([0, 50, 100]), [0, 50, 100]);
  assert.deepEqual(sparkHeights([0, 0]), [0, 0]);
  for (const points of [[], [Infinity, 1], [-1, 1]])
    assert.deepEqual(sparkHeights(points), []);
});
test("review changes only its target without mutating undo snapshot", () => {
  const notice: FinanceNotice = {
    id: "one",
    title: "Review",
    description: "",
    action: "Open",
    kind: "bill",
    detail: "",
    resolved: false,
  };
  const source = [notice, { ...notice, id: "two" }];
  const next = resolveNotice(source, "one");
  assert.equal(next[0].resolved, true);
  assert.equal(source[0].resolved, false);
  assert.equal(next[1], source[1]);
});
test("account validation rejects blanks, malformed endings, and case-insensitive duplicate banks", () => {
  assert.match(
    validateBankDraft({ name: " ", bank: "Harbor", last4: "4021" }, []),
    /name/,
  );
  assert.match(
    validateBankDraft({ name: "New", bank: "Harbor", last4: "123" }, []),
    /four digits/,
  );
  assert.match(
    validateBankDraft({ name: "New", bank: " harbor ", last4: "4021" }, [
      account,
    ]),
    /already/,
  );
  assert.equal(
    validateBankDraft({ name: "New", bank: "Harbor", last4: "1234" }, [
      account,
    ]),
    "",
  );
});
test("account search handles bank, name, currency, ending and empty results", () => {
  for (const query of ["harbor", "OPERATING", " USD ", "4021", ""])
    assert.deepEqual(searchAccounts([account], query), [account]);
  assert.deepEqual(searchAccounts([account], "missing"), []);
});
