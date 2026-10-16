export const CURRENCIES = {
  USD: { name: "US Dollar", flag: "🇺🇸", num: 1, den: 1 },
  GBP: { name: "British Pound", flag: "🇬🇧", num: 5, den: 4 },
  NGN: { name: "Nigerian Naira", flag: "🇳🇬", num: 1, den: 1600 },
  GHS: { name: "Ghanaian Cedi", flag: "🇬🇭", num: 1, den: 16 },
  EUR: { name: "Euro", flag: "🇪🇺", num: 11, den: 10 },
} as const;
export type Currency = keyof typeof CURRENCIES;
export type CurrencyAccount = { currency: Currency; balance: number };
export type MoneyEntry = {
  id: string;
  currency: Currency;
  amount: number;
  kind: "in" | "out" | "exchange" | "request" | "scheduled";
  description: string;
  date: string;
  to?: Currency;
  received?: number;
};
export type Wallet = { accounts: CurrencyAccount[]; entries: MoneyEntry[] };
export type MoneyOperation = {
  kind: MoneyEntry["kind"];
  currency: Currency;
  amount: string;
  recipient: string;
  to: Currency;
  date: string;
};
export const DEMO_TODAY = "2026-10-16";
export const validMinor = (value: number) =>
  Number.isSafeInteger(value) && value >= 0;
export function parseMinor(text: string) {
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(text.trim())) return null;
  const [whole, fraction = ""] = text.trim().split(".");
  const value = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return validMinor(value) && value > 0 ? value : null;
}
export function formatCurrency(minor: number, currency: Currency) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}
/** Fixed illustrative rational rates. Round half up once at the destination minor unit. */
export function convertMinor(amount: number, from: Currency, to: Currency) {
  if (!validMinor(amount))
    throw new RangeError("Amount must be non-negative integer minor units.");
  const a = CURRENCIES[from],
    b = CURRENCIES[to];
  const numerator = BigInt(amount) * BigInt(a.num) * BigInt(b.den),
    denominator = BigInt(a.den) * BigInt(b.num);
  const result = Number((numerator + denominator / 2n) / denominator);
  if (!validMinor(result))
    throw new RangeError("Converted amount is too large.");
  return result;
}
export function balanceTotal(accounts: CurrencyAccount[], base: Currency) {
  const total = accounts.reduce(
    (sum, a) => sum + convertMinor(a.balance, a.currency, base),
    0,
  );
  if (!validMinor(total)) throw new RangeError("Total too large.");
  return total;
}
export function applyOperation(
  wallet: Wallet,
  op: MoneyOperation,
  id: string,
): Wallet {
  const amount = parseMinor(op.amount);
  if (amount === null)
    throw new Error("Enter a positive amount with up to 2 decimal places.");
  const source = wallet.accounts.find((a) => a.currency === op.currency);
  if (!source) throw new Error("Choose an available account.");
  if (["out", "request", "scheduled"].includes(op.kind) && !op.recipient.trim())
    throw new Error("Enter a recipient name.");
  if (
    ["out", "exchange", "scheduled"].includes(op.kind) &&
    amount > source.balance
  )
    throw new Error("This amount exceeds the available balance.");
  if (
    op.kind === "exchange" &&
    (op.currency === op.to ||
      !wallet.accounts.some((a) => a.currency === op.to))
  )
    throw new Error("Choose a different available destination account.");
  if (
    op.kind === "scheduled" &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(op.date) ||
      op.date <= DEMO_TODAY ||
      Number.isNaN(Date.parse(op.date)) ||
      new Date(op.date).toISOString().slice(0, 10) !== op.date)
  )
    throw new Error("Choose a valid date after October 16, 2026.");
  const received =
    op.kind === "exchange"
      ? convertMinor(amount, op.currency, op.to)
      : undefined;
  if (received === 0)
    throw new Error(
      "The converted amount is below one destination minor unit.",
    );
  const accounts = wallet.accounts.map((a) => ({
    ...a,
    balance:
      a.balance +
      (a.currency === op.currency
        ? op.kind === "in"
          ? amount
          : ["out", "exchange"].includes(op.kind)
            ? -amount
            : 0
        : 0) +
      (op.kind === "exchange" && a.currency === op.to ? received! : 0),
  }));
  if (accounts.some((a) => !validMinor(a.balance)))
    throw new Error("The resulting balance is too large.");
  const description =
    op.kind === "in"
      ? "Demo funds added"
      : op.kind === "exchange"
        ? `Converted ${op.currency} to ${op.to}`
        : op.kind === "request"
          ? `Request from ${op.recipient.trim()}`
          : op.kind === "scheduled"
            ? `Scheduled for ${op.recipient.trim()}`
            : `Sent to ${op.recipient.trim()}`;
  return {
    accounts,
    entries: [
      {
        id,
        currency: op.currency,
        amount,
        kind: op.kind,
        description,
        date: op.kind === "scheduled" ? op.date : DEMO_TODAY,
        ...(received !== undefined ? { to: op.to, received } : {}),
      },
      ...wallet.entries,
    ],
  };
}
export function visibleEntries(
  entries: MoneyEntry[],
  query: string,
  currency: Currency | "all",
  period: "all" | "week",
) {
  return entries.filter(
    (e) =>
      (currency === "all" || e.currency === currency || e.to === currency) &&
      (!query.trim() ||
        `${e.description} ${e.currency} ${e.to ?? ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())) &&
      (period === "all" || (e.date >= "2026-10-10" && e.date <= DEMO_TODAY)),
  );
}
export type CashFlowDay = { date: string; incoming: number; outgoing: number };
export function cashFlowDays(
  entries: MoneyEntry[],
  period: "all" | "week",
): CashFlowDay[] {
  const start = period === "week" ? 10 : 1;
  return Array.from({ length: 17 - start }, (_, i) => {
    const date = `2026-10-${String(start + i).padStart(2, "0")}`;
    return {
      date,
      incoming: entries
        .filter((e) => e.date === date && e.kind === "in")
        .reduce((sum, e) => sum + convertMinor(e.amount, e.currency, "USD"), 0),
      outgoing: entries
        .filter((e) => e.date === date && e.kind === "out")
        .reduce((sum, e) => sum + convertMinor(e.amount, e.currency, "USD"), 0),
    };
  });
}
