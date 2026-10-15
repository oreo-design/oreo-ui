# Thinking State / Thinking Workspace review

## Scope and source

Reference: [Purpose Walker — Thinking State](https://x.com/purpose_walker/status/2110382989414740308). X itself returned 403; public post metadata is retained in `reference-metadata.json`. The linked 60.49-second video was opened in a task-owned browser tab and inspected at 5, 15, 30, 45 and 58 seconds. `reference-*.png` are original browser captures. No remote video was downloaded.

Observed: compact pixel glyph beside six activity labels; color, square/circle, speed, grid and shimmer controls; light/dark examples. Adopted the pixel signal and controls with Oreo tokens, StatusIcon and ShimmerText. The deterministic phase algorithm is an original implementation informed by the reference, not recovered source. The complete assistant workspace is an Oreo extension of that component reference; it is not presented as a replica of a full app from the video.

Baseline: `73899e3267455f3baa6c3fd11cca387e76953ef7` (origin/main, PR #52).
Implementation revision: `549e415d9b52d6e3861b88db428f5d1511242835`. Final captures match this product revision; earlier rounds and their differences are listed below. Changelog and evidence are a follow-up commit on the same PR.
Environment: local Vite at `http://localhost:5227`, installed Chromium, Playwriter session 60, English, local prewritten fixtures. Desktop 1440×1000, medium 1024×900, mobile 390×844; source video tab 1280×800. Screenshot capture freezes CSS animations; timing claims use the recording separately.

## Components and integration

- `/thinking-state`: 5×5 SVG pixel signal, six phases, square/circle, four token tones, 0.5–2× speed, grid and opt-in existing shimmer. Animation uses opacity; no per-frame React timer.
- `/thinking-timeline`: host-controlled operational steps; existing StatusIcon; empty state uses AgentWorkspaceState. Current indicator accepts the same shape/tone/speed settings.
- `/thinking-workspace`: starter briefs, controlled PromptBox, six-stage local run, pause/resume, stop/restart, sample failure/retry, copy/save and responsive theme controls.
- Registered docs, playgrounds, sidebar, metadata, README and Changelog. No shared primitive behavior changed; no dependency added.

## Evidence map

| Scenario | Before | After | Coverage |
| --- | --- | --- | --- |
| New route entry, desktop light | [before-entry](before-entry.png) | [final entry](after-idle-final-v2.png) | Before editing, the new path actually reached the existing default Button page. This is the real missing-route baseline, not an invented previous workspace. |
| Changelog entry | [before](before-changelog.png) | [after](after-changelog.png) | Matching desktop/light route; change links to the new template. |
| Active run / completed outline | No previous workspace | [running](after-running.png), [complete](after-complete.png), [video](thinking-run.mp4) | Local fixture; six operational labels, not model reasoning. |
| Pause / stop | No previous capability | [pause](after-paused.png), [stop](after-stopped.png) | State and retained brief exercised; reducer assertions cover paused/stopped ticks. |
| Error and recovery | No previous capability | [error](after-error.png), [recovered](after-recovered.png) | Explicit Demo scenario failure; retry disables failure and reaches a complete sample. |
| Validation | No previous capability | [2001-character error](after-validation.png) | No run starts; draft retained. |
| Responsive / theme | Desktop baseline only | [medium](after-medium.png), [mobile light](after-mobile-idle.png), [mobile dark final](after-mobile-dark-final.png), [mobile settings](after-mobile-settings.png), [dark corrected](after-dark-corrected.png) | No matched mobile or dark pre-change capture. Not a cross-browser check. |
| Component controls / reduced motion | [existing Reasoning peer](peer-reasoning.png) is a comparator, not a baseline | [component](after-component.png), [reduced motion](after-component-reduced.png) | Active false computed paused; reduced-motion computed animation-name none. 2× loop computed 1.2s in both template indicators. |
| Timeline normal / empty / API | No previous component | [timeline](after-timeline.png), [empty](after-timeline-empty.png), [API](after-api.png) | API screenshot predates the final added speed row; live code/build includes it. |

Original captures are retained. Superseded: `after-idle.png` (initial render crash from unsupported icon, corrected); `after-idle-corrected.png` (composer pushed below first screen); `after-idle-layout.png` and `after-idle-final.png` (older capture rounds; final default is v2); `after-dark.png` and `after-mobile-dark.png` (older mint token). `after-complete`, state and medium captures predate the final mint token correction, heading-focus helper, and timeline speed pass-through, but still document those unchanged state layouts. No screenshot was altered to hide a defect.

## Consistency review — six lenses

| Lens | Status | Compared owner / evidence / bounded conclusion |
| --- | --- | --- |
| Entry behavior | checked | Existing docs shell, sidebar and Reasoning playground compared with new docs/playground; existing page map owns routing. Before route fallback captured; New brief reset and keyboard focus exercised. No new navigation animation. |
| Loading | checked | Reference continuous thinking signal compared with existing Reasoning/activity labels. This is ongoing operational activity, not network/page-loading UI; no initial network skeleton is needed for synchronous fixtures. Pause preserves content; failure is distinct from success. |
| Empty states | checked | AgentWorkspaceState owns timeline-empty, stopped and failed presentation. Existing automation consumers inspected in code; actual new empty/error captures inspected. No meaningless empty-timeline action. Welcome is a task-start surface with three concrete starters, not a no-results/error replacement. |
| Actions | checked | Existing Button, IconButton, PromptBox, Avatar and Tag retained for equivalent roles. Shared PromptBox send/stop behavior used; inert attach/mention affordances hidden locally because this template has no attachment feature. Copy and Save feedback verified. Existing Reasoning peer and new controls visually inspected; no global consistency claim. |
| Titled scroll surfaces | checked | Header has an opaque boundary; desktop main and inspector scroll independently and composer stays within view. Initial overly tall layout corrected after screenshot inspection. Top/content and lower inspector settings observed; mobile stacks inspector after main. No new decorative fade needed. Long user text tested. |
| Icon/color inheritance | checked with limits | Existing Icon/StatusIcon use canonical roles; label stays neutral, pixels take existing semantic/palette tokens. Corrected mint from palette text (meant for mint surfaces) to status-success for standalone pixels, then inspected dark and mobile. No formal contrast-ratio audit or alternate icon-provider browser pass. |

Mapping: product typography/spacing/radius/color reuse existing scale and CSS tokens. Local layout widths (15rem sidebar, 18rem inspector, 4.75rem header), SVG 24-unit geometry, 3-unit cells and phase offsets are component-specific geometry with no equivalent token. These are isolated to this new family. Systemic scope: no issue found that justified changing shared primitives or unrelated templates.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No pixel-state component | `thinking-state.css:29–46`: opacity-only continuous 2.4-second loop with per-cell negative delays; `index.tsx` clamps speed to 0.5–2 | Sustained activity indication, not a UI entrance. A 1.2–4.8-second loop intentionally exceeds the sub-300ms interaction budget; there is no delayed click/keyboard response. Linear periodic interpolation avoids abrupt velocity changes in a repeating signal. |
| No pause/reduced-motion behavior | CSS paused when inactive/hidden; reduced-motion sets animation none with deterministic inline opacity | Pausing preserves the phase; reduced motion keeps a legible label/static glyph. No required spatial information is lost. |
| Template actions could inherit tap motion | Button/PromptBox tapScale 1; StatusIcon animated false; no layout/entry transitions added | Frequent keyboard/workspace actions remain immediate. Pointer hover styles are gated. |
| Main speed control initially affected only main glyph | Speed passed through ThinkingTimeline to current indicator | Equivalent live signals now use the same setting; run timing remains independent. |

**Verdict: Approve for the introduced motion.** No animated layout properties, entrance delays or new trigger-origin effects. Pixel loops are interruptible via pause and restart lifecycle. Optional ShimmerText reuses the existing component (its background shimmer is not newly claimed GPU-only); default is off. Shared PromptBox behavior is reused without changing its motion owner. Reduced-motion inspected in browser. Hidden-document pausing is source-reviewed; no dedicated visibility recording. No quantitative dropped-frame or CPU benchmark claimed.

## Verification and recording provenance

`npm run build` passed (TypeScript and Vite), with the existing large-chunk advisory. Full output: [build.txt](build.txt). [verify-run.cjs](verify-run.cjs) checks lifecycle behavior through the actual reducer; [verification.txt](verification.txt) records browser coverage and assertions. `git diff --check` passed.

[thinking-run.mp4](thinking-run.mp4) is an actual browser recording of retry through six stages and completion, 1440×1000, 30fps, 11.0 seconds. The original 441 CDP JPEG frames and timestamps are preserved in [recording-original.json.xz](recording-original.json.xz); [recording-timing.json](recording-timing.json) records frame durations. Conversion retains timestamp deltas (minimum 8ms, final frame held 0.7s), no idle trimming. Decoded contact sheet inspected locally. It predates the final static mint-token/focus and speed pass-through corrections; motion algorithm and run timing did not change. No matching previous motion exists because this is a new capability. Individual pause/stop actions have static evidence and behavior verification, not a paired motion recording.

Limits: local fixtures only. No AI calls, web search, account workflows, persistent saves, backend integration or production deployment verified. Save is a local mark and resets on a new run/reload. Copy's write promise resolved; clipboard readback not performed. No screen-reader, alternate-browser, exhaustive phase-by-phase recording, or formal contrast audit. Missing baseline variants and interaction recordings remain explicit coverage gaps; they do not block the already-authorized merge.

## Delivery

[PR #53](https://github.com/oreo-design/oreo-ui/pull/53) includes only this task. Build, reducer checks, motion review and browser review passed before integration. Exact remote source and merge status are verified after the final push and reported in the task. Production deployment is separate.
