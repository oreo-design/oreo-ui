# Aurora Accordion — review record

## Source and baseline

Reference: [CollectUI, Aurora Accordion by @stevelauda_](https://x.com/CollectUI/status/2112000783440814422). Actual 21.6-second video inspected in a task-owned browser tab. Original author attribution retained; Oreo fixture copy and tokens replace studio branding. Observed: five compact rows, single expanded answer, detached active card, joined inactive segments, plus-to-cross, subtle multicolor border, centered dark dotted canvas. No evidence of loading, search, error or contact submission in reference.

Baseline revision: `a3fed01821fdcb04d1a2af923bfc375c56d1684f`. New `/aurora-faq` entry previously normalizes to `/` and shows Button. Baseline captured on existing production preview localhost:5193, same source tree. New source will run on localhost:5194. Chrome / Playwriter session 10, local fixtures, desktop 1440×1000, mobile 390×844, English. No account or network mutation.

![Reference closed](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/reference-0.png)
![Reference open](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/reference-7.png)

## Grounding before implementation

Rendered Tree Stepper inspected at `/tree-stepper`, together with its component source and installed Base UI Accordion types. Reuse its Base UI disclosure ownership, single-open behavior, semantic Icon inheritance, shared empty state and height-transition method. This FAQ requires visually detached expanded cards; nested tree rails and leaf selection do not apply. Full template follows Outline Brand Footer's theme switch, semantic top navigation and source credit. It is a new marketing FAQ surface, not a replacement tree/navigation pattern.

![Rendered disclosure peer](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/peer-tree-stepper.png)

Review lenses: entry is direct route plus catalog link; loading/error not applicable to synchronous local content; empty content uses AgentWorkspaceState; actions use installed Base UI triggers and Oreo IconButton; titled content remains in document flow with no nested scroll; semantic icons inherit currentColor and shared palette tokens. No new icon system, hardcoded brand palette, or global playground layout changes. Existing Playground owns its preview/inspector scrolling and is outside this task's scope.

## Changed scenarios

New complete FAQ entry; collapsed/open/switch/collapse; light/dark; keyboard; narrow viewport; disabled/empty component; static/reduced motion; independent surface controls and generated code. Captures and outcomes follow below. The standalone surface is decorative and has no loading/error state. No remote data or form submission is claimed.

### Entry baseline
![Before — new route reached default Button page](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/before-entry.png)

### Final complete page
Source revision: `e0f6f75652d012cd83bda832fc69ead8f50b58a7`. Production build and preview, desktop 1440×1000, mobile 390×844. Full-page captures may exceed viewport height.

### Dark: collapsed and expanded

![final-wide-closed](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-wide-closed.png)

![final-wide-open](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-wide-open.png)
### Light / mobile variants

![final-wide-light](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-wide-light.png)

![final-mobile-light](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-mobile-light.png)

![final-mobile-dark](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-mobile-dark.png)
### Touch interaction

![final-touch](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-touch.png)
### Component states

![after-playground](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-playground.png)

![after-disabled](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-disabled.png)

![after-empty](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-empty.png)

![after-keyboard](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-keyboard.png)

![after-reduced](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-reduced.png)
### Independent surface

![after-surface](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-surface.png)

![after-surface-mint](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-surface-mint.png)

![after-surface-inactive](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-surface-inactive.png)
### Documentation and corrected code export

![after-documentation](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/after-documentation.png)

![final-code](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/final-code.png)

### Motion
Native Playwriter recording was unavailable: extension activeTab permission had not been invoked for this tab. Used the same session's supported CDP screencast. Actual pointer clicks cycle all five questions and close the last, followed by keyboard ArrowDown/Enter. 146 original JPEG frames and timestamp data were retained locally under `/tmp/oreo-aurora-motion`; original encoded recording and timing JSON are committed here. 30fps output follows actual frame timestamps. No synthetic animation or re-created frames.

Original: 1440×1000, 5.433s. Review crop: 1440×904, 5.433s; removes the top 96px containing the automation toolbar and header, retaining the entire FAQ interaction. Contact sheets inspected; original preserved. Screenshots use clean capture and retain full page context.

![Real interaction recording](/Users/ziye/Documents/Project/Research/oreo-ui-aurora-accordion-20261019/docs/reviews/aurora-accordion-20261019/interaction-review.mp4)

### Validation and review
- TypeScript + production build passed, `git diff --check` passed. Existing large-bundle advisory remains; no new package.
- Actual browser checks: single-open, switching, collapse, aria-expanded, ArrowDown, End, Enter/Space, theme preservation, 390px wrapping/no horizontal overflow, emulated touch expansion, disabled headers, empty/recovery, static animation, reduced-motion computed transition:none, surface tone/active properties, docs and template navigation.
- Generated JSX originally serialized the rich fixture answer incorrectly. Default fixture changed to plain text; final export verified without React-object props. API still supports host-provided ReactNode answers. Shared exporter unchanged.
- Reviewed final source diff for controlled/uncontrolled ownership, missing IDs, disabled propagation, Base UI ARIA/ref composition, style scoping, reduced-motion overrides, token mapping and route registrations. No unresolved implementation finding.
- Revision history: early `after-*` images are retained. `after-wide-open.png` was captured during transition; settled capture supersedes it. All `final-*` captures are authoritative after reducing dot texture contrast and replacing the rich default answer. `after-code.png` documents the superseded exporter issue. Other component captures remain visually equivalent to final source; no claim that old captures came from final revision.
- Evidence limits: local fixture only, no real studio service/backend/contact workflow. Original reference has no matching mobile/light/keyboard/error coverage. No new route existed before, so baseline is the actual normalized default page. Individual disabled item, custom rich content, controlled-host integration and content replacement are source-reviewed, not separately browser-fixtured. Historical baseline has no matching motion; preserved source clip/frames ground the motion study. Browser extension errors about session/ethereum also occur on baseline and are not attributed to this app.
- Delivery: reviewed source and this evidence package are intended for a task-scoped PR into main; final PR/head/merge verification is reported in the task response. Local preview does not establish a production deployment.
