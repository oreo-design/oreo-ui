import type { Currency } from "@/components/currency-finance/model";
export type BankAccount = {
  id: string;
  name: string;
  bank: string;
  last4: string;
  currency: Currency;
  balance: number;
  history: number[];
  tone: "blue" | "purple" | "mint" | "orange";
};
export type FinanceNotice = {
  id: string;
  title: string;
  description: string;
  action: string;
  kind: "forecast" | "bill" | "collection" | "reconcile";
  detail: string;
  resolved: boolean;
};
export function balanceChange(points: number[]): number | null {
  if (
    points.length < 2 ||
    points.some((p) => !Number.isFinite(p) || p < 0) ||
    points[0] === 0
  )
    return null;
  return ((points.at(-1)! - points[0]) / points[0]) * 100;
}
export function sparkHeights(points: number[]): number[] {
  if (!points.length || points.some((p) => !Number.isFinite(p) || p < 0))
    return [];
  const max = Math.max(...points);
  return points.map((p) => (max === 0 ? 0 : (p / max) * 100));
}
export function resolveNotice(items: FinanceNotice[], id: string) {
  return items.map((item) =>
    item.id === id ? { ...item, resolved: true } : item,
  );
}
export function validateBankDraft(
  draft: { name: string; bank: string; last4: string },
  accounts: BankAccount[],
) {
  if (!draft.name.trim() || !draft.bank.trim())
    return "Enter an account name and bank.";
  if (!/^\d{4}$/.test(draft.last4))
    return "Enter exactly four digits for the account ending.";
  if (
    accounts.some(
      (a) =>
        a.bank.toLowerCase() === draft.bank.trim().toLowerCase() &&
        a.last4 === draft.last4,
    )
  )
    return "This bank and account ending are already in the demo.";
  return "";
}
export function searchAccounts(accounts: BankAccount[], query: string) {
  const q = query.trim().toLowerCase();
  return accounts.filter((a) =>
    `${a.name} ${a.bank} ${a.last4} ${a.currency}`.toLowerCase().includes(q),
  );
}
