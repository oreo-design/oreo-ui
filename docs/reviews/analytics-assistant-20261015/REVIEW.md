# Analytics Assistant — review record

## Scope and revisions

Reference: [Anant — Ask AI component for an analytics product](https://x.com/HeyAnantJ/status/2110408357488333059). Inspected the embedded 31.5-second video through a task-owned Chromium tab; selected light suggestions, light answer and dark suggestions frames are retained as `anant-reference-04.png`, `anant-reference-09.png`, `anant-reference-24.png`. Metadata is in `reference.json`. No reference artwork or remote video is shipped in the product.

Baseline: `16cbac1f0dfb6012642eb79326de659237457b72` (origin/main). Worktree: `oreo-ui-analytics-20261015`, branch `codex/analytics-assistant-20261015`. Existing dirty primary checkout was preserved. Product source revision: `323e64399149576c10a03ad92a949b2dbaf545d0`. Delivery: [PR #50](https://github.com/oreo-design/oreo-ui/pull/50); final exact-head/merge status is read back separately.

Two reusable components: `AskAnalytics` and `InsightSources`. Complete template: `/analytics-assistant`. Also adds docs, editable playgrounds, sidebar and metadata entries, README inventory and website Changelog entry.

## Capture environment

Local Vite preview at `http://localhost:5224`, Chromium through Playwriter session 57, English, local sample data with no account. Desktop 1440 × 1000 CSS pixels; mobile 390 × 844. Light and dark CSS-variable themes. Original screenshots use CSS scale. Full-page captures are taller than the viewport. Automation toolbar/cursor hidden. These are real rendered components with local fixtures, not live AI, analytics ingestion or production verification.

## Before and after coverage

| Page/state | Before | After | Change / limit |
| --- | --- | --- | --- |
| Template entry | [Before](before-entry.png) | [Overview](after-overview-light.png), [complete answer](after-answer-light.png) | Entering the previously absent route fell back to the Button page. Now reaches a complete dashboard. Same desktop viewport/theme. |
| Ask card: suggestions / collapsed | Absent at baseline; reference video only | [Collapsed](after-collapsed.png), [suggestions](after-overview-light.png) | Compact input, suggestion disclosure, native submission. Keyboard focus/typing is immediate. |
| Request lifecycle | No previous analytics request flow | [Loading](after-loading.png), [error](after-error.png), [retry](after-recovery.png), [unsupported](after-unsupported.png) | 1.2-second local fixture delay; unsupported questions get no fabricated answer. Retry preserves question. Cancel clears timer and returns input focus. Recovery image predates singular “source” copy correction; corrected copy is visible in playground capture. |
| Sources | No previous analytics source details | [Light dialog](after-source.png), [dark dialog](after-source-dark.png) | Base UI Dialog; same source data used by answers and dashboard. Tab trap, Escape and return focus verified. |
| Saved insights | No previous saved analytics state | [Saved](after-saved.png), [empty](after-saved-empty.png) | Save/remove in memory, empty-state route back to overview. Delete returns focus to Saved insights navigation. |
| Dark | No matching baseline dark template; explicit coverage gap | [Overview](after-overview-dark.png), [answer](after-answer-dark.png) | Uses existing theme tokens, including palette inversion. |
| Mobile | No matching baseline mobile template; explicit coverage gap | [Overview](after-mobile-overview.png), [answer](after-mobile-answer.png), [dark](after-mobile-dark.png) | Two metric columns; assistant precedes chart; labels/sources wrap without horizontal overflow in inspected captures. Desktop fixture viewport resizing, not physical-device proof. |
| Components/docs | New docs routes absent; shared docs entry baseline above | [Playground](after-playground.png), [documentation](after-documentation.png), [empty sources](after-sources-empty.png) | Shared docs/playground shell; each component independently usable. |
| Changelog | [Before](before-changelog.png) | [After](after-changelog.png) | Reuses existing release model and filters. |

`superseded-hmr-idle.png` records an interrupted capture during hot reload and proves no error/empty state. It is retained only as historical evidence. All new states are additions, so there is no fictional “before” analytics screenshot. Dark/mobile baselines and real assistive-technology/device coverage remain gaps, separate from delivery.

## Consistency review

Compared the rendered Assistant Modal playground, opened/closed its launcher, and inspected its source owner plus Sources, Button/IconButton and Agent Hub dialog consumers. [Peer surface](peer-assistant.png). This is an Oreo-only review, not a cross-product claim.

| Lens | Shared owner and decision | Evidence / coverage |
| --- | --- | --- |
| Entry | Existing docs route registry, DocsPage and sidebar. Inline question card is appropriate beside analytics; existing AssistantModal remains the floating conversation launcher. | Baseline fallback, peer launcher interaction, new template and docs captures. |
| Loading | Host-owned discriminated request state, visible cancel action and status announcement. No animation on loading entry. | Loading capture; cancel then wait past request deadline remained idle; input focus returned. |
| Empty/error | Existing AgentWorkspaceState for empty saved list; compact inline message inside question context for unavailable/unsupported data. | Saved empty, unsupported, error and recovery media. |
| Actions | Shared Button/IconButton with tapScale=1; semantic native suggestion and source buttons; Base UI Dialog. | Blank submission disabled, Enter submission, three suggestions, save/remove, retry, Escape/Tab and focus-return checks. |
| Titled scroll surfaces | Page owns scroll; question answer grows naturally. Source dialog owns bounded viewport scroll with title/description inside. | Desktop full-page and mobile answer captures; no clipped long answer. |
| Icon/color inheritance | Oreo Icon vocabulary and existing CSS theme variables; no external brand logos, new palette or global icon changes. | Light/dark template and sources; both icon providers available in shared playground. Lucide rendering is not separately captured. |

## Motion review

| Before | After | Why |
| --- | --- | --- |
| New surface absent | Pointer disclosure and async results: opacity + full translateY(4px → 0), 180 ms shared easeOut | Keeps answer arrival legible without animating chart data or layout dimensions. |
| Initial implementation also animated focus-driven disclosure/loading | Keyboard/focus disclosure and loading enter immediately; pointer disclosure and asynchronous results retain short motion | Frequent input actions must stay immediate. |
| Source content cleared as exit began | Retain selected source through the 180 ms Base UI exit | Prevents an empty panel flashing during close. |
| Potential movement under reduced motion | useHidden drops translation; dialog CSS removes scale; opacity remains | Gentler state indication. |

Verdict: **Approve** for scoped implementation. No height/width/layout animation, scale-from-zero, transition-all, unbounded spinner or animated metrics. Source modal is centered, not an anchored popover. Hover is fine-pointer gated. `interaction.mp4` preserves an earlier normal flow (loading, answer, source, save/remove); source exit is superseded by `source-motion.mp4`. Original frames and timing maps are retained. Long operator idle intervals are capped at 2 seconds in encoded clips; transition timings are preserved. 30 fps encoding is not a measured frame-rate claim. Keyboard/reduced-motion final checks and media are recorded below.

## Validation and limits

- TypeScript + production Vite build passed; existing >500 kB chunk-size warning remains.
- `git diff --check` passed.
- Interactive checks: empty input, keyboard Enter, suggestions, three distinct answer datasets, source details, focus trap/return, save/remove, empty saved recovery, unsupported question, simulated connection failure/retry, cancel/stale-response prevention, light/dark, mobile, component playground interaction and documentation.
- Trial rows total 1,279 and 1,560; 18.0% rounded decline, 6.95% conversion and 192 invitations agree with source details.
- Final-page browser runs showed no new runtime errors. Earlier HMR connection errors occurred during edits and are not represented as final runtime failures.
- No external service, persistence, real AI inference, live analytics ingestion, deployment or physical-device verification is claimed.

## Final checks

`reduced-motion.mp4` records the final reduced-motion source close, reset, keyboard collapse and input-focus expansion. Source content stays visible through closing; source trigger regained focus. Final keyboard/focus expansion is immediate. Source dialog Tab trapping and Escape focus restoration each returned the expected focused element. All three clips were inspected through decoded frame sheets; encoded dimensions were verified as 1440 × 1000.

Changelog entry links to PR #50 and the new template; no website deployment is claimed. Build output is recorded in the manifest. The exact final PR head is reviewed and checked at merge time; this evidence directory remains part of that head.
