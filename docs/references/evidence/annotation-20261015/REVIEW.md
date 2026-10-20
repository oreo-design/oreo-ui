> 历史研究归档：正文结论、日期和验证限制来自原分析；本次只迁移文件并将本包媒体链接改为相对路径。历史“当前/已交付/待完成”等表述均以原日期为准。

# Oreo Playground Annotation — feasibility review

2026-10-15. Analysis only; no application code edited or committed.

## Evidence and scope

Reference: https://x.com/roohbuilds/status/2110355509622837281?s=20
The 9.55-second reference shows numbered component outlines, a two-column part-name/description legend, and emphasis on a hovered part. Inspected browser-rendered frames at 1 and 5 seconds plus the later frame initially playing. This is anatomy documentation; freeform authoring and measurement tools are not demonstrated. Keyboard behavior and the original mode entry are unverified.

Current product: local working checkout /Users/ziye/Documents/Project/Research/oreo-ui, branch codex/settings-language-lab, HEAD f63171f4d0f8097d98ca9606a7d6760f7871bf79 plus existing extensive dirty and untracked work. HEAD alone does not reproduce this preview. Local fixture at http://localhost:5203/prompt-box, Chrome, light theme, English, screenshots at 2544×1624 CSS pixels. Existing WIP was preserved. This is not evidence of deployed production.

- [Current Preview](oreo-current.png)
- [Current Code](oreo-code-current.png)
- [Reference at 1 second](oreo-ref-at-1.png)
- [Reference at 5 seconds](oreo-ref-at-5.png)

All four images inspected. Tested Preview → Code → Preview. No new implementation and therefore no after screenshots exist.

## Comparison and coverage

| Lens | Target → peer / owner | Result and coverage |
| --- | --- | --- |
| Entry | Proposed Annotation → existing Preview / Code; ComponentPlayground | checked for existing toggle and return in local runtime; reuse the same view controls. New mode remains a proposal. |
| Loading | Local metadata/overlay → synchronous existing spec rendering | not applicable to remote content loading in this proposal; async geometry readiness and font settling remain unverified. |
| Empty | Missing anatomy / currently hidden part → schema-controlled preview states | unverified: no existing anatomy-empty peer inspected. Offer mode only where metadata exists; retain hidden-part descriptions with a clear current-state label and no orphan outline. |
| Actions | Annotation entry/legend → existing view controls, Button, Icon | checked in Preview and Code plus source; reuse existing sizes/tokens. Annotation selection and keyboard focus need future testing. |
| Titled scrolling | Legend → Properties section structure | source and resting image inspected; scrolled top/middle/end behavior unverified. Keep legend heading in flow or protect it with an opaque boundary if sticky. |
| Icons/color | Annotation neutral controls and active emphasis → current Button/Icon and semantic tokens | checked only for light resting Preview/Code and source. Dark, disabled, focus, and annotation contrast unverified. |

Comparison is scoped to these local Playground surfaces, not a complete cross-product audit. No pixel metrics/colors copied from the reference.

## Recommended integration

Preview / Annotation / Code share a single live component and its values. Annotation adds numbered outlines and a part legend under the preview, with pointer and keyboard selection linking both. Properties remains available. Pause demo on entry; do not automatically resume on exit. Keep ordinary component interaction separate from annotation selection to prevent a click meant to inspect from submitting or opening an unrelated menu.

Shared owner: src/docs/playground/ComponentPlayground.tsx. Extend PlaygroundSpec in schema.ts with optional part metadata (stable id, human-readable title, description, semantic target). registry.tsx owns component-specific mappings. Reuse useDemo pause controls. Actual component slots may need stable data attributes or refs; avoid brittle class-name selectors and avoid introducing wrappers that change layout. Keep annotations out of generated JSX.

Use a shared overlay whose positions follow current element bounds on resize, scroll, conditional rendering and state changes. Portaled MenuPopup is outside the preview DOM and requires explicit registration/support. Reference part names must not be copied as Oreo exports: several PromptBox internals are not separately exported components. Label a semantic region as such.

Initial pilot: Prompt Box; then one simple component and Menu to exercise nested/portaled elements before expanding coverage. Main complexity is reliable anchoring, overlapping nested labels, hidden parts, mobile selection, and focus handling—not drawing outlines. No backend is required for static anatomy definitions.
