export type SpendDay = { id: string; label: string; cents: number };
export type ApiKeyRecord = {
  id: string;
  name: string;
  permission: "Read only" | "Send only" | "Full access";
  suffix: string;
  lastUsed: string;
  revoked?: boolean;
};
export const validCents = (n: number) => Number.isSafeInteger(n) && n >= 0;
export function splitSpend(cents: number, limit: number) {
  if (!validCents(cents) || !validCents(limit)) return null;
  return { within: Math.min(cents, limit), over: Math.max(0, cents - limit) };
}
export function parseDollars(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ""] = value.trim().split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return validCents(cents) ? cents : null;
}
