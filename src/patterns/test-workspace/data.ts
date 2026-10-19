import type { TestCase, TestRun } from "@/components/test-results/model";
const files = [
  [
    "src/cart/pricing.test.ts",
    "pricing",
    [
      "calculates the subtotal",
      "applies a coupon only once",
      "ignores expired coupons",
      "caps the discount",
    ],
  ],
  [
    "src/cart/checkout.test.ts",
    "checkout",
    [
      "creates a payment intent",
      "retries a declined card",
      "sends a receipt",
      "supports guest checkout",
    ],
  ],
  [
    "src/cart/sync.test.ts",
    "cart sync",
    [
      "loads saved items",
      "saves cart changes",
      "syncs between tabs",
      "clears the cart on sign-out",
    ],
  ],
  [
    "src/lib/money.test.ts",
    "formatMoney",
    [
      "rounds to the nearest cent",
      "uses the active currency",
      "supports zero totals",
      "formats negative amounts",
    ],
  ],
  [
    "src/ui/summary.test.tsx",
    "CartSummary",
    [
      "renders line items",
      "announces quantity changes",
      "shows the coupon label",
      "matches the saved layout",
    ],
  ],
] as const;
export const SAMPLE_TESTS: TestCase[] = files.flatMap(
  ([file, group, names], f) =>
    names.map((name, i) => ({
      id: `test-${f}-${i}`,
      file,
      group,
      name,
      status:
        f === 3 && i === 3
          ? "skipped"
          : (f === 0 && i === 1) || (f === 2 && i === 2)
            ? "failed"
            : "passed",
      durationMs:
        f === 2 && i === 2
          ? 5000
          : f === 4 && i === 0
            ? 640
            : 3 + ((f * 17 + i * 11) % 70),
      ...(f === 0 && i === 1
        ? {
            failure: {
              kind: "assertion" as const,
              message:
                "The coupon was applied twice when the cart was recalculated.",
              expected: '{ "discount": 420, "total": 3780 }',
              received: '{ "discount": 840, "total": 3360 }',
              frames: [
                {
                  file,
                  line: 31,
                  column: 29,
                  code: `const cart = withCoupon(baseCart, "SAVE10");
const repriced = applyCoupon(applyCoupon(cart));
expect(repriced.total).toBe(3780);`,
                },
                {
                  file: "node_modules/@vitest/runner/dist/index.js",
                  line: 163,
                  framework: true,
                },
              ],
            },
          }
        : {}),
      ...(f === 2 && i === 2
        ? {
            failure: {
              kind: "timeout" as const,
              message: "Timed out after 5s while waiting for a storage event.",
              frames: [
                {
                  file,
                  line: 22,
                  column: 3,
                  code: `const other = openTab();
await addItem("sku_123");
await waitFor(() => expect(other.cart.items).toHaveLength(1));`,
                },
                {
                  file: "node_modules/@vitest/runner/dist/index.js",
                  line: 229,
                  framework: true,
                },
              ],
            },
          }
        : {}),
    })),
);
export const COMPLETED_RUN: TestRun = {
  id: 1,
  phase: "complete",
  tests: SAMPLE_TESTS,
  elapsedMs: 6300,
};
export const FIX_LINES = [
  {
    type: "context" as const,
    content: "export function applyCoupon(cart: Cart, code: string) {",
  },
  {
    type: "add" as const,
    content: "  if (cart.appliedCoupons.includes(code)) return cart;",
  },
  {
    type: "context" as const,
    content: "  return calculateDiscount(cart, code);",
  },
  { type: "context" as const, content: "}" },
];
