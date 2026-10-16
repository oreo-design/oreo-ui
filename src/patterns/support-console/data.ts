import type { ApiKeyRecord, SpendDay } from "@/components/support-console";
export const SPEND_DAYS: SpendDay[] = [
  58.12, 56.23, 60.12, 58.24, 39.1, 36.84, 76.32, 61.54, 59.91, 62.01, 60.99,
  40.96, 40.24, 81.22, 61.71, 65.31, 63.9, 65.01,
].map((amount, i) => ({
  id: `sep-${i + 1}`,
  label: `Sep ${i + 1}`,
  cents: Math.round(amount * 100),
}));
export const SAMPLE_KEYS: ApiKeyRecord[] = [
  {
    id: "widget",
    name: "support-widget",
    permission: "Send only",
    suffix: "i0p0",
    lastUsed: "Never",
  },
  {
    id: "eval",
    name: "eval-runner",
    permission: "Read only",
    suffix: "bbbb",
    lastUsed: "2h ago",
  },
  {
    id: "sync",
    name: "helpdesk-sync",
    permission: "Full access",
    suffix: "cccc",
    lastUsed: "3d ago",
  },
  {
    id: "macro",
    name: "macro-writer",
    permission: "Send only",
    suffix: "dddd",
    lastUsed: "12d ago",
  },
  {
    id: "weekly",
    name: "weekly-evals",
    permission: "Read only",
    suffix: "eeee",
    lastUsed: "6d ago",
  },
  {
    id: "billing",
    name: "billing-export",
    permission: "Read only",
    suffix: "ffff",
    lastUsed: "20d ago",
  },
  {
    id: "status",
    name: "status-page",
    permission: "Read only",
    suffix: "0000",
    lastUsed: "1mo ago",
  },
];
export const CASES = [
  {
    id: "screen",
    subject: "Cracked screen",
    name: "Maya Chen",
    time: "2m ago",
    order: "#4821",
    message: "My order arrived with a cracked screen. Can I get my money back?",
    reply:
      "Sorry about the screen, Maya. We can arrange a refund for your damaged order. Please confirm that you would like us to proceed.",
    draft: true,
  },
  {
    id: "delivery",
    subject: "New delivery address",
    name: "Jon Reyes",
    time: "6m ago",
    order: "#4822",
    message: "Can you send my order to a different address?",
    reply:
      "Hi Jon, please share your updated delivery address so we can check whether the shipment can still be redirected.",
    draft: false,
  },
  {
    id: "invoice",
    subject: "Wrong name on invoice",
    name: "Sam Okoye",
    time: "24m ago",
    order: "#4814",
    message: "The company name on my invoice is incorrect.",
    reply:
      "Hi Sam, please send us the correct company name and we will help update your invoice.",
    draft: false,
  },
  {
    id: "plan",
    subject: "Cancel my plan",
    name: "Ana Marsh",
    time: "41m ago",
    order: "#4799",
    message: "I would like to cancel my subscription.",
    reply: "Hi Ana, we can help you review your plan and cancellation options.",
    draft: false,
  },
];
