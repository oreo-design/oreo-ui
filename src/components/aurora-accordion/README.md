# Aurora Accordion and Aurora Surface

Reference: Aurora Accordion by @stevelauda_, curated by CollectUI: https://x.com/CollectUI/status/2112000783440814422.

## Independent properties
AuroraAccordion accepts `items` (unique nonempty id, question, ReactNode answer, optional icon/disabled), controlled `value`/`onValueChange` or initial `defaultValue`, region `label`, `tone` (spectrum/mint/neutral), `animated`, `disabled`, empty-state copy and `className`. One question or null. Unknown selected IDs display collapsed; a returning ID restores selection. Disabled preserves open content. AuroraSurface independently accepts active/tone/animated and native div props/ref; it imposes no padding or interaction.

## States and interaction
Collapsed, expanded, single-open switching, individual/all disabled, keyboard focus and shared empty state. Base UI supplies ARIA and keyboard navigation. Keyboard is instant; pointer height/gaps 220ms, plus rotation/glow 200ms. Reduced Motion or animated=false disables transitions. No network, artificial loading or errors. Existing answer links remain operable when disclosure is disabled.

## Copy
Host owns questions, rich answers, labels and empty messages. Use concise questions and full answers; IDs must be unique and nonempty. Default content is a fictional Oreo Studio fixture, not an offer to provide a service. Preserve reference attribution when presenting the study.

## Layout and dependencies
One readable 28rem-wide column; active cards separate by spacing-4 and inactive segments retain joined corners. Icons inherit currentColor. Theme/palette/radius/type/spacing use Oreo tokens. Custom gradient and shadow proportions are decorative artwork rather than new semantic tokens. Copy both source files with installed Base UI Accordion, Icon and AgentWorkspaceState. No added dependencies. Full composition: `/aurora-faq`; docs/playgrounds: `/aurora-accordion`, `/aurora-surface`.
