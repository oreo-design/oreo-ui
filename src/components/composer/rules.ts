import type { ComponentRule } from "../../lib/component-rules";
export const composerRules = {
  id: "composer", version: 1, title: "Composer family",
  use: ["Use PromptBox for a composable input surface. Use Composer for the local composition of PromptBox, attachments, command tags, model/approval menus and context."],
  avoid: ["The host owns uploads, permission policy and model execution. File selection and showcase menu actions stay local; selecting a connector does not grant access."],
  atomic: ["value/onValueChange provide controlled input; defaultValue initializes uncontrolled input. Keep running, voice and menu selections independent.", "For PromptBox, attachControl overrides the built-in attachment entry, showMention controls built-in and custom mentions, and an explicit footer (including null) overrides connectApps."],
  states: ["Enter submits, Shift+Enter adds a line, and IME composition does not submit. Mention and slash palettes use arrows to move, Enter to choose and Escape to dismiss.", "The host receives selected files, commands, model and approval in Composer onSubmit context. Running/stop behavior is host-controlled.", "PromptBox permission options supply label and tone; unknown values hide the chip and a missing handler disables it. Connector connected state changes only when supplied by the host."],
  copy: ["Use actual model, permission and connector names. Preserve full permission explanations at narrow widths.", "Keep local preview feedback distinguishable from completed uploads, authorized connections or real model responses. Illustrative usage fills are specimens; real consumers must supply consistent numeric and display values."],
  layout: ["Reuse the existing PromptBox, Attachment, KeywordTag, ContextBar and menu primitives; use slots instead of duplicating the input surface.", "Menus constrain to the viewport and narrow compositions wrap semantic action clusters. Reference widths belong to specimens, not a mandatory page width."],
  examples: [{title: "Composer family gallery", href: "/composer"}, {title: "Prompt Box", href: "/prompt-box?view=docs"}],
} as const satisfies ComponentRule;
