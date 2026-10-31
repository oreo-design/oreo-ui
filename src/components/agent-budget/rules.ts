import type { ComponentRule } from "../../lib/component-rules";
export const agentBudgetRules = {
  id: "agent-budget", version: 1, title: "Agent Budget",
  use: ["Use BudgetCapControl for cap editing, BudgetOutcome for estimates, and MonthlyBudgetCard for the complete draft/save composition."],
  avoid: ["The host owns saved and draft values, actual spend, persistence and failures. These components do not charge money, execute real runs or schedule a billing reset."],
  atomic: ["Money uses integer USD cents. The cap must satisfy 0 ≤ spent ≤ value ≤ planMax, with a positive planMax and positive integer step.", "BudgetCapControl is controlled: pair value with onChange. BudgetOutcome uses costPerRun > 0, dailySpend ≥ 0 and daysToReset > 0."],
  states: ["Invalid inputs render an error state. Disabled locks the slider and step buttons; enabled boundary buttons remain operable so the constraint can be explained.", "Home/End reach the exact spent floor and plan maximum; arrows and Page keys change one step. Numeric feedback is immediate.", "Save requires a changed valid draft. Zero daily pace shows No recent spend; no affordable whole runs shows Paused."],
  copy: ["Format display amounts from integer cents. Keep spent, draft cap and plan maximum distinct.", "Through reset is an estimate at the current pace, not a guarantee. Keep the boundary explanation and readable reset label visible."],
  layout: ["MonthlyBudgetCard composes BudgetCapControl and BudgetOutcome. The Agent Budget template separates saved and draft caps; only the saved allowance feeds its local sample runs."],
  examples: [{title: "Agent Budget", href: "/agent-budget"}],
} as const satisfies ComponentRule;
