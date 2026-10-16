# Edge Observatory motion follow-up

Baseline `c42a94b864bde8d97dce73131d7b06634ce0f32b`. Local fixture at localhost:5268, Chromium/Playwriter session 10, English, desktop 1440×1080. Builds on the original [Augustas review](../august-20261015/REVIEW.md); historical evidence remains intact there. This index owns this new task and its corrections.

## Reference before editing

[Animated reference](https://x.com/augustasdesign/status/2110944321184620815) links back to the already implemented static reference. Browser inspected the actual 5-second 1464×1080 video at 0, .25, .6, 1.5, 3 and 4.8 seconds. Media URL is in source-metadata.json. Browser screenshots retain player chrome and are not product captures. The sequence reveals the shell, metric bars, dot map and routes, then regional spotlight and incident recommendation; latency traces draw left to right. The numeric count-up belongs to a presentation, not live telemetry. Do not fabricate interim metric values in an operational monitor.

## Pre-edit comparison and decisions

| Target | Existing peer / canonical owner | Decision |
| --- | --- | --- |
| Staged monitor entrance | Existing Edge Observatory (before-dark/light); LoadingSequence source; prior component evidence | Add a small reusable nonblocking MonitorReveal rather than the marketing LoadingSequence, which keeps children inert during a long intro. First-entry/replay only, cancelled by interaction, reduced-motion aware. Keep metric values and layout fixed. |
| Map region spotlight | Existing RegionTrafficMap detail below map; source video overlay | Extract RegionSpotlight with a mini latency trace. Add optional overlay composition to the existing map; below-map remains default and narrow fallback. Reuse same data and typography tokens; no duplicate map. |
| Incident advice | Existing edge-incident block, Open trace; source video recommendation | Extract IncidentRecommendation with optional action. Template offers a reviewed local routing draft; no live routing or predicted latency reduction. Existing trace filtering stays canonical. |
| Draft review | Existing Edge Observatory deployment dialog; Subscription Workspace dialog in prior task | Reuse Base UI Dialog and canonical Button/IconButton, protected header/footer and scrolling body. Save only local draft, with undo. |

Baseline captures obtained before product edits: overview dark/light, Edge Monitor playground, changelog, and reload/map-selection recording. New standalone component routes have no predecessor; existing Edge Monitor page is their entry baseline. Existing monitor renders synchronously; entrance is decorative, not loading progress. Six-lens review and after evidence will be appended.

## Delivered changes and matching evidence

This extends the existing Edge Observatory, rather than adding a duplicate template. Added `MonitorReveal`, `RegionSpotlight`, and `IncidentRecommendation`, their API pages and interactive playgrounds. The template adds a reviewed, undoable local routing draft and source attribution. No network routing, real deployment, numeric count-up or predicted latency is implemented.

| Scenario | Before | After | Change / reused owner |
| --- | --- | --- | --- |
| Desktop dark overview, 1440×1080 | [Before](before-dark.png) | [After](after-dark-final.png) | Same shell, tokens, map, controls and metrics. Detail becomes an overlay with sparkline; shared action card explains the incident. |
| Desktop light overview, same viewport | [Before](before-light.png) | [After](after-light-clean.png) | Same semantic light theme, border/status tokens. |
| Entrance and regional selection, desktop dark | [Before video](before-motion.mp4) | [After video](after-motion.mp4) | Static baseline versus a short staggered intro; selection stays immediate. After video also records routing review/save/undo. |
| Routing review, save and recovery | Existing overview/Open trace in baseline; routing review did not exist | [Dark](routing-dark.png), [light](routing-light.png), [saved](routing-saved.png), [mobile](routing-mobile.png) | Base UI Dialog, canonical Button/IconButton, protected header/footer. Escape restores trigger focus, Save retains only local draft, Undo removes it. |
| Responsive overview | No pre-edit 1024/390 capture: exact baseline revision retained | [1024×900](after-medium.png), [390×844 entry](after-mobile-entry.png), [mobile map](after-mobile-map.png) | Overlay falls below map at ≤1250px; no horizontal page overflow at 390px. Desktop baseline is not claimed as matched mobile proof. |
| Error-log filtering and empty recovery | Baseline overview entry; no pre-edit empty capture | [Empty filtered logs](empty-logs-final.png) | Existing RequestLogTable and shared AgentWorkspaceState retained. Open trace gives three sin1 504s; unmatched search shows empty state; Show all requests restores 36/36. |
| Existing component entry/API | [Edge Monitor entry](before-playground.png) | [Playground](after-playground.png), [API](after-edge-docs.png) | Same docs shell/playground host. Default detail placement remains below; reveal defaults static. |
| Three new standalone components | No prior component route; existing Edge Monitor entry above is the actual predecessor | [Reveal](docs-reveal.png), [Spotlight](docs-spotlight-final.png), [Incident](docs-incident-final.png), [API](docs-api.png) | Existing docs navigation, code blocks, props tables and live-preview registry. Incident callback checked in playground. |
| Reduced motion | No dedicated baseline capture | [Settled frame](reduced-motion.png), runtime observations below | 150ms opacity only, zero delay, no translate or clip. No dedicated reduced-motion recording; static image alone does not prove this behavior. |

Recordings are original local-fixture browser screencasts encoded at native **1440×1080** without crop/resize: baseline 13.96s, final 37.44s. Frame timestamps and originals are retained in `before-frames/` and `release-frames/`. Final sequence frames were inspected, including mid-intro and settled regional selection. Interaction recording includes a visible automation pointer; clean final stills hide it. This is local fixture evidence, not production telemetry or real account evidence.

Historical captures remain intact: `after-dark-first.png` is mid-intro; `after-light.png`, `docs-spotlight.png`, `docs-incident.png`, and `empty-logs.png` are superseded by their clean/final counterparts. `after-frames/`, `final-frames/`, and `final-intro-frames/` record earlier timing passes; **release-frames/** is final. Do not use intermediate recordings as final timing evidence.

## UI consistency review

Scope: Oreo UI web only. Compared current rendered overview, regions, logs, component playgrounds and routing dialog, plus pre-change overview/entry captures. The existing deployment dialog and prior Subscription Workspace dialog were inspected as composition peers; no claim of fresh cross-product visual coverage. Canonical owners are unchanged outside this task.

| Lens | Target / peer and canonical rule | Result / evidence |
| --- | --- | --- |
| Entry behavior | Overview, Regions and component docs use existing Tabs and docs navigation. Optional overlay only on overview; Regions keeps full below-map card. | Checked in actual fixture and code. Difference is intentional for overview density, with full card on narrow screens. |
| Loading | Existing template and new cards use a synchronous local snapshot. | Not applicable to network loading: there is no new asynchronous load. Reveal never changes values or makes children inert. No fake skeleton or invented loading state. |
| Empty state | Logs retain RequestLogTable → AgentWorkspaceState; recovery uses existing Show all requests. | Checked empty search and recovery in runtime. RegionSpotlight omits a trend with <2 valid points; this component boundary reviewed in code, not separate screenshot. |
| Actions | Incident review/trace, routing Save/Cancel/Undo and close share Button/IconButton and Base UI Dialog with existing deployment review. | Checked visual hierarchy, keyboard range, Escape and focus return. Same roles use existing variants; no bespoke press animation. |
| Titled scrolling | Routing header/footer outside scrolling body, matching existing dialog composition. | Checked at 390×844. Opaque protected header means no redundant fading overlay. Docs/table scroll containers remain existing owners. |
| Icon/color | Existing Icon inherits currentColor, neutral controls; incident status uses semantic error color. | Checked light/dark screenshots and CSS. Red incident and elevated sin1 are meaningful status exceptions, not general action coloring. |

Coverage limits: no physical mobile, screen-reader or live backend testing; no matched pre-change mobile/empty/dialog capture (dialog is new). These are evidence limits, not delivery blockers. The previous below-map detail's polite announcement is preserved in the extracted RegionSpotlight. No claim that reading code alone proves cross-surface behavior.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| Reference uses a multi-second presentation with counted metrics | Fixed true snapshot values; rise 200ms, chart wipe 260ms, 50ms steps across five groups; total 400ms | Operational data remains readable and accurate; brief sequence explains information hierarchy. |
| Early implementation timing placed spotlight/advice too late | Final delays 0/50/100/150/200ms; [runtime audit](motion-audit.json) | Consistent 50ms cadence, each animation under 300ms, without a long wait. |
| Static map detail below overview | Optional overlay uses same extracted card; selection itself has no transition | Preserve immediate frequent interactions and avoid moving targets. |
| Reduced-motion movement would be distracting | 150ms opacity 0.5→1, no delay/transform/clip | Preserve gentle feedback and honor the preference; runtime verified. |

**Interruptibility & timing:** `src/components/monitor-reveal/index.tsx:18` owns and cancels WAAPI; cleanup, preference changes and hidden documents cancel it. Pointer/key interaction reveals content immediately (`:58`). The template also clears the entire intro on pointer/key/change capture (`src/patterns/edge-observatory/index.tsx:118`). Filters, tabs and selection do not replay. Keyboard activation follows the repository's no-keyboard-motion rule and leaves the settled UI. Pointer replay is explicit and infrequent. No inert children or timer-gated actions.

**Performance & cohesion:** rise uses full transform+opacity; chart wipe uses the documented clip-path reveal technique (`monitor-reveal/index.tsx:26`) without layout animation. No universal transition, spring bounce or animated metrics. Uses house `--ease-out` (cubic-bezier(0.23, 1, 0.32, 1)); exact values checked against `.claude/skills/review-animations/STANDARDS.md`. No claim of device-level GPU profiling or frame-rate measurement.

**Accessibility:** reduced-motion runtime audit showed five opacity-only animations, duration 150ms, delay 0. Selecting a region or using keyboard yielded zero new scoped animations. Preference-change listener and visibility cleanup inspected; no hover-driven animation introduced.

**Approve** — scoped motion is brief, cancellable, infrequent and consistent with the monitoring template. No remaining blocking motion findings. Dedicated reduced-motion recording remains a coverage gap.

## Focused validation

- TypeScript build and production Vite build passed. Existing bundle-size advisory remains; no new dependency.
- Routing model: 3 tests passed, covering exact 30% totals, conservation for all integer shares 1–50%, invalid identities/rates/shares/headroom and capacity rejection.
- 30% shifts 47,400 req/s: sin1 110,600, hkg1 166,400, remaining estimated headroom 17.5%. Keyboard 31% updates to 48,980 moved / 109,020 source. Current telemetry stays unchanged after save.
- Browser: desktop dark/light, medium layout, mobile overview/map/dialog, save/undo, cancel/Escape/focus return, Open trace, empty recovery, component callbacks/API pages, pointer replay, interruption and reduced motion checked.
- Source video remains reference-only: the source shows buttons but does not demonstrate their clicks. Implemented local draft behavior is explicitly our template composition.

Source baseline and capture environment are recorded above; `manifest.json` records SHA-256 hashes of final source files and all retained media. Product source hashes identify the tested build independently of the later evidence-only commit. Integration outcome is reported in the PR and final delivery, not inferred from local screenshots.

## Changelog delivery

[Before](before-changelog.png) → [After](after-changelog.png), same 1440×1080 light docs shell. Updated entry links to the existing template and PR #96. Entry rendering and both destinations checked. PR: https://github.com/oreo-design/oreo-ui/pull/96.
