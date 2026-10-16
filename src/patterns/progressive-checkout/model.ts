export const CHECKOUT_STEPS = [
  { id: "cart", label: "Cart" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];
export type Details = { name: string; email: string; country: string };
export function detailsErrors(d: Details) {
  return {
    name: d.name.trim() ? "" : "Enter your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())
      ? ""
      : "Enter a valid email address.",
    country: d.country ? "" : "Choose an invoice country.",
  };
}
export function invalidateFrom(completed: string[], id: string) {
  const index = CHECKOUT_STEPS.findIndex((s) => s.id === id);
  return completed.filter(
    (c) => CHECKOUT_STEPS.findIndex((s) => s.id === c) < index,
  );
}
export function reachable(id: string, current: string, completed: string[]) {
  return id === current || completed.includes(id);
}
