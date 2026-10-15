export const PAYMENT_RAILS = [
  { id: "ach", currency: "USD", label: "ACH / wire", mark: "$" },
  { id: "swift", currency: "USD", label: "SWIFT", mark: "↗" },
  { id: "sepa", currency: "EUR", label: "SEPA", mark: "€" },
  { id: "usdc", currency: "USDC", label: "4 networks", mark: "◎" },
] as const;
export type PaymentRail = (typeof PAYMENT_RAILS)[number]["id"];
export type RecipientDraft = {
  kind: "business" | "individual";
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  rail: PaymentRail;
  routing: string;
  account: string;
  bic: string;
  iban: string;
  bank: string;
  bankCountry: string;
  network: string;
  wallet: string;
  country: string;
  street: string;
  city: string;
  postal: string;
};
export type Recipient = RecipientDraft & { id: string };
export type RecipientErrors = Partial<Record<keyof RecipientDraft, string>>;
export const emptyRecipient = (name = ""): RecipientDraft => ({
  kind: "business",
  name,
  firstName: name.split(" ")[0] ?? "",
  lastName: name.split(" ").slice(1).join(" "),
  email: "",
  rail: "ach",
  routing: "",
  account: "",
  bic: "",
  iban: "",
  bank: "",
  bankCountry: "United States",
  network: "Ethereum",
  wallet: "",
  country: "United States",
  street: "",
  city: "",
  postal: "",
});
export const recipientName = (r: RecipientDraft) =>
  r.kind === "business"
    ? r.name.trim()
    : `${r.firstName.trim()} ${r.lastName.trim()}`.trim();
export const recipientCurrency = (rail: PaymentRail) =>
  PAYMENT_RAILS.find((r) => r.id === rail)!.currency;
export function recipientDestination(r: RecipientDraft) {
  const v =
    r.rail === "usdc" ? r.wallet : r.rail === "sepa" ? r.iban : r.account;
  return `${r.rail === "usdc" ? r.network : r.bank || "Bank account"} · •••• ${v.replace(/\s/g, "").slice(-4)}`;
}
/** Presentation-level checks only. No ownership, bank availability, checksum or network verification. */
export function validateRecipient(r: RecipientDraft): RecipientErrors {
  const e: RecipientErrors = {};
  const required = (key: keyof RecipientDraft, label: string) => {
    if (!r[key].trim()) e[key] = `Enter ${label}.`;
  };
  if (r.kind === "business") required("name", "a legal business name");
  else {
    required("firstName", "a first name");
    required("lastName", "a last name");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim()))
    e.email = "Enter an email address, such as name@example.com.";
  if (r.rail === "ach") {
    if (!/^\d{9}$/.test(r.routing.replace(/\s/g, "")))
      e.routing = "Enter a 9-digit routing number.";
    if (!/^\d{4,17}$/.test(r.account.replace(/\s/g, "")))
      e.account = "Enter an account number with 4–17 digits.";
  }
  if (r.rail === "swift" || r.rail === "sepa") {
    if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(r.bic.trim().toUpperCase()))
      e.bic = "Enter an 8- or 11-character BIC.";
  }
  if (r.rail === "swift") required("account", "an account number");
  if (
    r.rail === "sepa" &&
    !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(
      r.iban.replace(/\s/g, "").toUpperCase(),
    )
  )
    e.iban = "Enter an IBAN beginning with two letters and two digits.";
  if (r.rail === "usdc") {
    if (!/^0x[0-9a-fA-F]{40}$/.test(r.wallet.trim()))
      e.wallet = "Enter a 0x address with 40 hexadecimal characters.";
  } else required("bank", "a bank name");
  required("street", "a street address");
  required("city", "a city");
  required("postal", "a postal code");
  return e;
}
/** Decimal parsing without floating-point rounding. UI demo cap: one million units. */
export function parsePaymentAmount(
  value: string,
  rail: PaymentRail,
): { units: bigint; normalized: string } | null {
  const precision = rail === "usdc" ? 6 : 2,
    trimmed = value.trim();
  if (!new RegExp(`^\\d+(?:\\.\\d{1,${precision}})?$`).test(trimmed))
    return null;
  const [whole, fraction = ""] = trimmed.split(".");
  if (whole.length > 8) return null;
  const scale = 10n ** BigInt(precision),
    units = BigInt(whole) * scale + BigInt(fraction.padEnd(precision, "0"));
  if (units <= 0n || units > 1000000n * scale) return null;
  return {
    units,
    normalized: `${BigInt(whole)}${fraction ? "." + fraction : ""}`,
  };
}
