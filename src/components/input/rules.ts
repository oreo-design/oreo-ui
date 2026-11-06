import type { ComponentRule } from "@/lib/component-rules";
export const inputRules = {
  id: "input",
  version: 1,
  title: "Input",
  use: [
    "Use Input for single-line entry. Compose PasswordInput, TagInput, PaymentInput, DateInput or CounterInput for their specific editing behavior.",
  ],
  avoid: [
    "Do not rebuild a raw input with Playground-only styles. Do not use placeholder text as the only accessible name.",
    "The three password requirements demonstrate product policy, not a security score. Payment examples format locally; they do not process payments.",
  ],
  atomic: [
    "Size sm/md/lg maps to Oreo's 7/8/10 spacing-unit control scale. Native type, disabled, readOnly, required and hasError are independent.",
    "InputRoot/Wrapper/Control/Icon/Affix/InlineAffix compose a field. Input is the convenience API. A root has one editor; independent buttons/selects keep their own names and focus.",
    "Use Oreo color, typography, spacing and smooth-corner tokens. The Input owns its border; docs chrome must not repaint its descendants.",
  ],
  states: [
    "Blank adornments and placeholder are quiet; hover and focus clarify them, filled text stays primary. Focus strengthens the existing border without a second halo. Error remains error on focus; disabled feedback is suppressed.",
    "Padding and decorative icons focus the editor. Text uses a text cursor; independent actions use pointer. Disabled native inputs leave the Tab order; read-only inputs remain selectable.",
    "Password reveal preserves value and selection; its action is named and exposes pressed state. Tags commit on Enter after IME composition and never submit the surrounding form. Dates/counters use localized accessible segment and step behavior.",
    "Native form reset and caller handlers must remain intact. Error text is associated through aria-describedby and invalid state is exposed to assistive technology.",
  ],
  copy: [
    "Use a short persistent label naming the value; use an example as placeholder. Explain how to fix an error. Error replaces hint while present.",
    "Mark required or optional, never both. Name icon actions by result (Show password, Copy link). Keep credentials and real card values out of demos and logs.",
  ],
  layout: [
    "The parent owns width. Affixes are separated by a border; inline affixes share the editing row. Allow long labels and hints to wrap.",
    "Reuse Button/IconButton, Tag, Shortcut and Menu surface tokens. Keep selection popovers within the current theme/preview portal. Multiline editing remains a separate component.",
  ],
  examples: [
    { title: "All input interactions", href: "/input?view=docs#examples" },
    { title: "Playground property editor", href: "/button" },
  ],
} as const satisfies ComponentRule;
