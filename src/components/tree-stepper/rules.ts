import type { ComponentRule } from "../../lib/component-rules";
export const treeStepperRules = {
  id: "tree-stepper", version: 1, title: "Tree Stepper",
  use: ["Use for a hierarchical checklist with one controlled leaf selection and persistent recorded outcomes."],
  avoid: ["This is navigation made from native leaf buttons and accordion headers, not an ARIA tree widget. The host owns review results and persistence; the preview does not scan or change files."],
  atomic: ["Give every node a globally unique id. Keep nodes, selected value, completed and attention independent; onValueChange updates the host's selected leaf."],
  states: ["Selection opens the complete ancestor path and closes sibling branches. Attention takes visual precedence over completed.", "Tab visits checks; Enter or Space selects or expands. Arrow keys move between sibling accordion headers. Keyboard changes are instant and Reduce Motion removes disclosure geometry animation.", "getTreeSteps returns enabled leaves in depth-first order for Previous and Next navigation. Disabled nodes cannot be selected."],
  copy: ["Use meaningful step labels and a navigation label. Titles wrap, including long unbroken text; do not replace them with unexplained IDs.", "Status labels describe recorded outcomes, not proof that a demo performed a real review."],
  layout: ["Keep the step navigator and selected detail in separate owned regions. Reuse Security Review's controlled selection and Previous/Next composition."],
  examples: [{title: "Security Review", href: "/security-review"}],
} as const satisfies ComponentRule;
