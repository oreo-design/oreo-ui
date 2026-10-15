# Callback Workspace — implementation and visual review

## Source, scope and environment

Reference: [Nizam — From Callback Chaos To Operational Clarity](https://x.com/nizamdesign/status/2110279441683235256). X returned 403; the public metadata in [reference-metadata.json](reference-metadata.json) supplied the original image URL. The image was viewed directly in a task-owned Chromium tab and retained as [reference.png](reference.png), a 1440×1080 browser capture. No reference media was installed as a product asset.

Observed: narrow icon rail, team/mine selector, search, risk and branch views, stage columns and service cards emphasizing priority, reported date, technician and cost. Adopted that hierarchy using Oreo tokens and primitives. The supplied image does not establish drag, dialog, filtering or save behavior; those are implemented demo interactions, not claims about the original product. Fixture counts intentionally derive from the actual 12 open records rather than copying the reference's 27.

Baseline: `701d10ec4d9be529fea886178249f3bd8ae51327` (origin/main after PR #53). Product revision: `109bec7ab128805334df0c67a429ef18359a87ae`. Changelog/evidence are added in a follow-up commit in the same PR. Local preview: `http://localhost:5228/callback-workspace`. Playwriter session 61, installed Chromium, English, fixture date October 6, 2026. Main checkout and unrelated development servers preserved.

## Component map and reuse

| Surface | Existing peer / owner | Decision |
| --- | --- | --- |
| Callback Priority | TaskRow priority, Tag palette, Icon/currentColor | New four-level service priority with signal bars and text; Critical uses status-error and a 10% semantic tint. No raw copied reference color. |
| Callback Card | Existing Kanban card, Avatar and Icon | Dedicated service record with issue, branch and cost. One button opens host-owned details. Existing general task card lacks these service fields. |
| Callback Board | KanbanBoard and Project Workspace | Preserve stage hierarchy and contained horizontal scrolling. Dedicated service board owns only layout/counts/open/create callbacks. No drag affordance or drag implementation; stage changes use an accessible detail select. Generic KanbanBoard and its consumers unchanged. |
| Details / create | Project Workspace's Base UI Dialog, Button | Same behavior owner: modal focus management, Escape, return focus, bounded content scrolling and fixed opaque header/footer. Local form validates required fields, date and cost. |
| Empty and filtered state | AgentWorkspaceState | Reused in columns and whole workspace. No results -> clear filters; no open work -> create callback. |
| Docs / entry | DocsPage, playground registry, Sidebar, site metadata | Standard component routes/playgrounds/API pages plus template and Changelog. |

Typography, color, control/card radius and spacing map to existing tokens or rem equivalents of the project's scale. 1.5rem panel radius uses the existing rounded-3xl scale; 4.5rem rail/16rem filter column/32rem detail panel are local layout geometry. The priority bars are component-specific 2px geometry. Source branding and extra navigation were reduced to functional local destinations rather than decorative dead buttons.

## Evidence map

| Scenario | Before | After | Coverage / limits |
| --- | --- | --- | --- |
| New route, desktop light 1440×1000 | [before-entry](before-entry.png) | [final board](after-board-final-v2.png) | Before editing, the nonexistent route actually returned to the default Button page. No previous callback page existed. |
| Changelog, same viewport/theme | [before](before-changelog.png) | [after](after-changelog.png) | Added after obtaining the actual PR number. |
| Product peers | [Project Workspace overview](peer-project-workspace.png), [existing task board](peer-project-board.png) | [service board](after-board.png) | Actual product surfaces inspected plus shared owner code. No cross-product/global consistency claim. |
| Card details and stage/cost edits | No previous callback capability | [details](after-details.png), [changed stage](after-stage-change.png) | Review -> scheduled changes counts 4/4/4 to 4/3/5. $1,280.55 cost updates total to $5,220.55. |
| Mine / branch grouping / list | No previous callback capability | [mine](after-mine.png), [grouped](after-grouped.png), [grouped list](after-list-grouped.png), [cost sorted](after-list-sorted.png) | Mine: 3 / $1,220. Branch create correctly preselects the clicked group. Highest-cost order verified. |
| Archive and recovery | No previous callback capability | [archive](after-archive.png), [restored list](after-list-sorted.png) | Archive removes a local record; Undo restores it. When a removed trigger disappears, focus returns to the main heading. Only the latest archive has undo. |
| No matches / no open work | No previous callback capability | [no results](after-empty.png), [empty queue](after-empty-queue.png) | Search clear restores records. All 12 open records archived via UI; New callback in empty queue opens the form. |
| Form errors | No previous callback form | [required fields](after-validation.png), [mobile validation](after-mobile-validation.png) | Blank fields and negative costs rejected. Mobile error scrolled into view and focused. Date rule source-reviewed, not separately browser-tested. |
| Themes and responsive | Desktop light baseline only | [desktop dark](after-dark.png), [medium dark 1024×900](after-medium-dark.png), [mobile light](after-mobile-light.png), [mobile dark](after-mobile-dark.png), [mobile filters](after-mobile-filters.png) | 390×844 mobile; board scrolls horizontally within its region, page remains 390px wide. No matched dark/mobile baseline or physical-device test. |
| Components and docs | No previous callback components | [priority](after-component-priority.png), [card](after-component-card.png), [board](after-component-board.png), [empty board](after-component-empty.png), [API](after-api.png) | All three routes rendered. Empty component board uses shared centered states. Preview cards navigate to the full template. |
| Interaction timing | Reference is a still image; no previous callback interaction | [callback-flow.mp4](callback-flow.mp4) | Actual group toggle -> detail -> stage edit -> save. No matching baseline recording exists for this new surface. |

Original captures retained; `after-board.png` is the initial successful implementation, `after-board-final.png` precedes the final no-open-work distinction, and `after-board-final-v2.png` is the final default state. Earlier screenshots show different intentional fixture edits; these are not a single synchronized account session. `after-mine.png` predates a singular-technician wording correction. The flow recording predates only the no-open-work copy/action refinement; the recorded populated behavior is unchanged.

## Consistency review — six lenses

| Lens | Status | Evidence and bounded result |
| --- | --- | --- |
| Entry behavior | checked | Existing Project Workspace navigation and details owner compared in code and live overview/board. New card and list-row entries share one `open` action and one Base UI dialog. New/empty/column create actions use that same form. Focus return, archive fallback and form-error focus exercised. |
| Loading | not applicable | Synchronous local records, no initial/refresh network fetch or fake spinner. No backend loading contract claimed. |
| Empty state | checked | Shared AgentWorkspaceState handles empty columns and no matches; all-caught-up has a distinct useful create action. Centered in owning regions. Empty queue, no-results and empty component captured. |
| Actions | checked | Button/IconButton/Switch/Avatar owners reused. Save/Cancel/Archive share canonical variants; priority is a readable status, not an action. Archive recovery tested. No duplicate modal implementation. |
| Titled scrolling | checked | Main headers scroll normally. Dialog uses separate scroll content under an opaque fixed flex header/footer; mobile error scroll inspected. Board is a labeled, focusable horizontal region like the existing Kanban peer. Sidebar scrolls as a complete region. No overlay title requires an extra decorative fade. |
| Icon/color inheritance | checked with limits | Ordinary operations inherit neutral labels. Critical and archive use status semantics. Light/dark and three viewport classes inspected. Default Phosphor provider only; no formal contrast or alternate-icon-provider browser audit. |

Review correction: grouping originally had a potential mismatch between the clicked branch and the new record's default. The shared `open` function now accepts the group branch; verified by creating Eastside Workshop directly within Houston. Validation originally risked leaving mobile errors below the viewport; error focus/scroll now makes them visible. No equivalent shared primitive defect was established, so unrelated owners were not edited.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No callback page | No new entrance/layout animation or animated reordering | Frequent search, filter, editing and keyboard operations remain immediate. Source is a static reference and provides no motion contract. |
| Generic task board supports drag springs | Service board has no drag; stage changes via form | Avoid an implied drag affordance without service-specific requirements. Same card/detail state remains accessible by keyboard. |
| Canonical Button press spring | Call sites use tapScale 1 | Frequent operational actions do not bounce. |
| Existing Switch | Reused canonical default track/thumb behavior, including reduced-motion thumb CSS | One existing control pattern. No custom spring, animation timer, keyframe or layout property animation introduced. Existing 150ms color / 200ms thumb transitions are not claimed a new GPU-only implementation. |

**Verdict: Approve for this diff.** New callback CSS adds no animation/transition declarations; hover styling is fine-pointer gated. Existing control motion remains owned by Switch. No frame-rate/performance benchmark or direct reduced-motion browser capture claimed. The actual interaction recording was inspected via a decoded contact sheet; static screenshots are not substituted for timing evidence.

## Validation, recording and delivery

`npm run build` passed TypeScript and Vite, retaining the existing large-chunk advisory. `git diff --check` passed. [verification.txt](verification.txt) records exact browser scenarios and totals. No redundant new test framework or application dependency added.

Recording: 1440×1000, 30fps, 5.233 seconds. 58 original CDP JPEG frames/timestamps are preserved in [recording-original.json.xz](recording-original.json.xz). [recording-timing.json](recording-timing.json) records timestamp durations, a minimum 8ms frame duration and a 1-second final hold; conversion is capped to the summed durations and has no idle trimming. Native capture frames were collected through the same Playwriter session. The original reference image is not the recording.

Limits: local fixtures, not real scheduling, customer contact, persistence, account workflows or production deployment. Mobile/dark pre-change media, screen-reader behavior, physical touch devices, date-error UI and a full keyboard-only run remain explicit gaps. Historical HMR connection failures occurred while adding modules; fresh reloads and final exercised actions were clean. Missing media does not alter the authorized implementation/merge status.

Delivery: [PR #54](https://github.com/oreo-design/oreo-ui/pull/54). Final source review, main merge and remote readback follow the last push and are reported in the task. Production deployment is separate.
