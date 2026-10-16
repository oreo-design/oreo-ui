export type SavedMethod = {
  id: string;
  brand: "Visa" | "Mastercard" | "Wallet";
  name: string;
  detail: string;
  last4?: string;
  expiry?: string;
};
export type CheckoutQuote = {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  discountBps: number;
  taxBps: number;
  taxBasis: "subtotal" | "discounted";
};
export function quoteCheckout(
  unitCents: number,
  seats: number,
  discountBps = 0,
  taxBps = 1000,
  taxBasis: CheckoutQuote["taxBasis"] = "subtotal",
): CheckoutQuote {
  if (
    ![unitCents, seats, discountBps, taxBps].every(Number.isSafeInteger) ||
    unitCents < 0 ||
    seats < 1 ||
    seats > 100 ||
    discountBps < 0 ||
    discountBps > 10000 ||
    taxBps < 0 ||
    taxBps > 10000
  )
    throw new RangeError("Invalid checkout amount, seat count or rate");
  const subtotal = unitCents * seats;
  if (!Number.isSafeInteger(subtotal) || subtotal > 1e10)
    throw new RangeError("Checkout amount is too large");
  const discount = Math.round((subtotal * discountBps) / 10000);
  const tax = Math.round(
    ((taxBasis === "subtotal" ? subtotal : subtotal - discount) * taxBps) /
      10000,
  );
  return {
    subtotal,
    discount,
    tax,
    total: subtotal - discount + tax,
    discountBps,
    taxBps,
    taxBasis,
  };
}
export function money(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
export function validateMethod(
  name: string,
  last4: string,
  expiry: string,
  now = new Date(),
) {
  if (!name.trim()) return "Enter the name on the sample card.";
  if (!/^\d{4}$/.test(last4)) return "Enter exactly four ending digits.";
  const match = /^(0[1-9]|1[0-2])\/(\d{4})$/.exec(expiry);
  if (!match) return "Use MM/YYYY for expiry.";
  const month = Number(match[1]),
    year = Number(match[2]);
  if (
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1)
  )
    return "Choose an expiry in the current month or later.";
  return null;
}
