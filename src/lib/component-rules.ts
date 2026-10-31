/** Product-owned prose only: never import runtime components into this contract. */
export type RulePart = "atomic" | "states" | "copy" | "layout";
export type ComponentRule = {
  id: string;
  version: number;
  title: string;
  use: readonly string[];
  avoid: readonly string[];
  atomic: readonly string[];
  states: readonly string[];
  copy: readonly string[];
  layout: readonly string[];
  examples: readonly { title: string; href: string }[];
};
export const ruleParts: readonly { key: RulePart; title: string }[] = [
  { key: "atomic", title: "Properties and variants" },
  { key: "states", title: "Interaction and states" },
  { key: "copy", title: "Copy and content" },
  { key: "layout", title: "Composition and layout" },
];
export const missingComponentRules = "Dedicated component rules are not available for this component yet. Check its documentation and source before integrating; this export does not establish complete behavior coverage.";
/** Docs and Agent exports consume exactly the same family-owned text. */
export function formatComponentRules(rule: ComponentRule | undefined): string {
  if (!rule) return missingComponentRules;
  return [
    `${rule.title} rules (${rule.id}, v${rule.version})`,
    "Use when:\n" + rule.use.map(text => `- ${text}`).join("\n"),
    "Boundaries:\n" + rule.avoid.map(text => `- ${text}`).join("\n"),
    ...ruleParts.map(({key, title}) => `${title}:\n${rule[key].map(text => `- ${text}`).join("\n")}`),
    "Examples:\n" + rule.examples.map(example => `- ${example.title}: ${example.href}`).join("\n"),
  ].join("\n\n");
}
