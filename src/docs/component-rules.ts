import type { ComponentRule } from "../lib/component-rules";
/** Metadata only. Neither catalog nor this resolver imports component runtimes. */
export const componentRuleIds: Readonly<Record<string, string>> = {
  button: "button", "icon-button": "button",
  "tree-stepper": "tree-stepper",
  "budget-cap-control": "agent-budget", "budget-outcome": "agent-budget", "monthly-budget-card": "agent-budget",
  composer: "composer", "prompt-box": "composer",
};
const loaders: Record<string, () => Promise<ComponentRule>> = {
  button: () => import("../components/button/rules.ts").then(module => module.buttonRules),
  "tree-stepper": () => import("../components/tree-stepper/rules.ts").then(module => module.treeStepperRules),
  "agent-budget": () => import("../components/agent-budget/rules.ts").then(module => module.agentBudgetRules),
  composer: () => import("../components/composer/rules.ts").then(module => module.composerRules),
};
export function loadComponentRules(slug: string): Promise<ComponentRule | undefined> {
  const id = Object.hasOwn(componentRuleIds, slug) ? componentRuleIds[slug] : undefined;
  return id ? loaders[id]().catch(() => undefined) : Promise.resolve(undefined);
}
