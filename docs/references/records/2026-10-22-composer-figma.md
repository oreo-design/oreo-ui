# Composer · Oreo Figma reconciliation

Date: 2026-10-22. User requested foundation reconciliation and exact static alignment with six sections of the Oreo Agentic UI Library.

- [Prompt](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-13568)
- [Context](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-14490)
- [Attachment](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4024-1263)
- [Keyword](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4111-5890)
- [Usage](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=4363-3315)
- [Menus](https://www.figma.com/design/9DedWc3BMXrLdlN44jBIFz?node-id=5069-5580)

Implemented in the existing prompt-box, context-bar, attachment, keyword-tag owners and the new composer family. `/composer` includes the complete local template and source-sized variants. Shared foundation changes include Mona Sans / Fragment Mono, placeholder color, Card Large radius and missing semantic tokens. Explicit legacy Inter instances are retained.

The single task evidence owner is [REVIEW.md](/Users/ziye/Documents/Project/Research/oreo-ui-composer-20261022/artifacts/composer-20261022/REVIEW.md). It contains the source exports, before/after screenshots, geometry comparison, responsive/dark coverage, recordings and delivery status. Evidence stays local; source is tracked here. This note links that owner and does not duplicate its audit.

Static comparison covers the supplied native dimensions and browser-rendered specimens. Font rasterization is platform dependent; no zero-pixel-difference claim is made. WebGPU renders the original Ultracode shader; unsupported browsers retain the neutral track. Local fixtures do not prove upload services, model execution, real microphone transcription or deployment.

Adoption: implemented; PR and remote result are recorded in the task review index.

Follow-up on 2026-10-22: the live site was still the 14:32 deployment and did not contain PR #129. The refreshed Context Bar source changes body labels to Regular and icon/text spacing to 6px. The follow-up also corrects queue-grip color, Composer trailing tones, exact reset/chevron assets in live popups, and the Figma asset alias. Source captures and paired correction evidence remain under the same REVIEW (`context-revision-2/` and `live-check-20261022/`). Production readback is recorded there separately from Git integration.


### Prompt Box icon correction round

Re-audited the public `/prompt-box` Playground and Doc variants against the linked Figma frames. Fixed preview-shell disabled opacity, keyword plus and removal marks, selected menu checks and submenu chevrons, suggestion stars, the slash key glyph, and Figma brand proportions. File icons and video play now use untouched native-frame Figma SVG exports including their source shadows instead of manually translated paths and CSS approximations. Semantic tokens still own monochrome colors; brand colors and exported attachment artwork remain original assets.

Sources: prompt variants 4111:13598–13683; file frames 4020:2211, 2231, 2249, 2267, 2285, 2303, 2309, 2315 and play 4020:2081; hover marks 4020:2078 / 2352 and 4079:27658 / 27689; context 4064:16958. Native SVG dimensions are asset geometry (10/12/14/16/20px), not new layout tokens. A 1px inside stroke can export as a 0.5px centered stroke: attribute widths alone are not evidence of a visual mismatch.

Validation and original Figma exports, matching public-before/local-after screenshots, computed sizes/colors, and final deployment readback are indexed in the existing task review: `artifacts/composer-20261022/REVIEW.md`, section `/prompt-box 全图标复核`. No new motion or provider behavior.

Rebased on PR #136 without reverting its new entry, permission or connected-app controls. The toolbar plus reuses the original keyword plus at the 20px action size; its permission picker uses the same original 16px selected check. Gmail/Slack/ClickUp are preserved upstream identity assets; no matching nodes exist on the supplied Composer page, so their source fidelity is explicitly outside the Figma comparison claim.

Final export handling preserves full SVG render bounds around the 20px file / 14px video logical frames; source offsets are artwork geometry, not new spacing tokens. The slash uses a fixed 20px keycap with a 14px original glyph.

### Prompt and Context surface stroke correction

The theme recipe's `box-shadow` replaced PromptBox's inset ring; connected-app styling likewise removed ContextBar's ring when disabling elevation. The Figma source still specifies inside 0.5px strokes: border-default (12% black) for the prompt and border-subtle (9% black) for context. Render these strokes on a pointer-transparent pseudo-element that inherits both radius and corner shape, independently of the existing elevation. This also preserves the outline in the intentionally shadowless ASCII theme. PR #138 spacing and controls are retained. Matching baseline/result evidence and live readback remain in the existing REVIEW under `border-fix/`.

### Permission control theme geometry — 2026-10-23

User screenshot feedback: Ask for approval was too tightly spaced and used the tiny-label corner tier. Runtime checks confirmed theme variables were already changing; the mismatch was the geometry recipe, not failed theme propagation. Use the existing control radius, 4px default icon gap, 8px horizontal inset, and a 24px density-scaled minimum height. Compact density retains the label line box to prevent clipping. Preserve permission/menu semantics, warning colors, original shield asset, smoothing and feedback owners. This is a product-theme correction; no new Figma permission reference was supplied. Before/after default, spacious/large radius, compact/zero radius and mobile-dark evidence is in the existing REVIEW under `permission-theme/`.

### Composer family theme audit — 2026-10-23

Follow-up checks found density-independent menu/search/effort/usage geometry, a fixed 16px ContextBar overlap, mismatched smooth corners on context/chips/menus/dictation errors, and hover backgrounds that replaced selection. PromptBox permission, connected-app and model popups also adopt the same smooth-corner recipe without changing the global Menu primitive. Route geometry through existing spacing/control/card tokens and the shared squircle/state layer. Derive popup inner width from its actual density-scaled inset. Keep exported SVG geometry, typography, hairline widths, circular/capsule roles and bounded source/viewport widths as explicit exceptions. Compact permission descriptions retain their two text lines.

Matched default, spacious/large-corner, compact/zero-corner and mobile-dark before/after specimens, real footer-toggle recordings, error/recovery fixtures and delivery readback remain in the same REVIEW under `family-theme/`. The source-sized `/composer` documentation layout is a reference fixture, not a newly themed product shell. This audit does not assert pixel identity for every custom theme or real speech/provider services.
