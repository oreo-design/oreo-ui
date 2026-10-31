import type { ComponentRule } from "../../lib/component-rules";
export const buttonRules = {
  id: "button", version: 1, title: "Button and IconButton",
  use: ["Use Button for a named action; use IconButton for an icon-only action with an accessible name."],
  avoid: ["Appearance does not choose placement or form behavior. A custom render element owns its native type and motion; htmlType applies only to the default button renderer."],
  atomic: ["Visual type (primary, secondary, tertiary), size and danger are independent. IconButton adds independent shape and floating properties.", "Use htmlType=submit or htmlType=reset for native form actions. The default htmlType is button; type continues to mean visual emphasis."],
  states: ["Disabled controls do not activate. Hover and press layer feedback over the current surface; press takes precedence.", "The default renderer owns press feedback and respects Reduce Motion. Custom render elements retain their own motion behavior."],
  copy: ["Use a short action label that names the result, such as Save or Delete. IconButton needs an aria-label describing the action rather than the glyph.", "Do not shorten essential meaning to fit a fixed width; the containing action group must leave room for long or translated labels."],
  layout: ["The container owns grouping, alignment and available width; changing emphasis must not select a different size.", "Use the existing Workflow Directory form actions as a composition reference. Preserve the form's submit semantics, cancel action and keyboard order."],
  examples: [{title: "Workflow Directory form actions", href: "/workflow-directory"}],
} as const satisfies ComponentRule;
