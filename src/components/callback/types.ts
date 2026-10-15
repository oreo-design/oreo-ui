export const CALLBACK_STAGES = {
  new: "New",
  review: "Root cause review",
  scheduled: "Fix scheduled",
  resolved: "Resolved",
} as const;
export type CallbackStage = keyof typeof CALLBACK_STAGES;
export type CallbackPriorityLevel = "Low" | "Medium" | "High" | "Critical";
export type CallbackPerson = { id: string; name: string };
export type Callback = {
  id: string;
  customer: string;
  issue: string;
  stage: CallbackStage;
  priority: CallbackPriorityLevel;
  reported: string;
  cost: number;
  ownerId: string;
  branch: string;
  repeat: boolean;
  awaitingParts: boolean;
  notes: string;
};
export const callbackMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
export const callbackDate = (value: string) =>
  new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
