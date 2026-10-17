# Project scheduling follow-up

Baseline: `3d8cd7a1605fac413658f490b358b53a039d799c`. Isolated `codex/project-schedule-20261017`; primary WIP preserved. Local preview localhost:5269, Chromium via Playwriter session 10, English fixtures, desktop 1440×1080. Prior evidence remains in ../project-tasks-20261015 and ../task-editor-20261016.

## Reference and pre-edit decisions

Reference: https://x.com/zahragr8r/status/2110776888050524179 links to https://gr8r-taskmanagement.vercel.app and its public repository. The post has no attached media. Inspected the actual home, Calendar and Timeline read-only. Source screenshots are `oreo-zahra-home.png`, `oreo-zahra-calendar-settled.png`, and `oreo-zahra-timeline-settled.png`. Earlier calendar/timeline captures show a loading transition and are historical only. No source code copied and no remote records changed.

Home/list/board/editor/feed already have Oreo counterparts. This follow-up extends the existing Project Workspace with the missing day-based planning composition: month/week task calendar and grouped project timeline. Source month cells show compact task chips with project color/avatar/status, plus overflow counts; source timeline keeps task names at left, calendar dates above, colored duration bars and project milestones. Adopt these structures mapped to Oreo tokens; do not create another workspace shell. Dependency arrows, remote collaboration and the source app's other unrelated modules are outside this focused addition.

| Target | Concrete peer / canonical owner | Choice before editing |
| --- | --- | --- |
| Task calendar | src/components/color-calendar (rendered calendar peer), src/components/task-row; current ProjectWorkspace task list | Existing calendar is hourly event scheduling, not due-date tasks. Reuse its UTC date helpers and semantic palette; new TaskCalendar groups by due date, shares existing task editor. |
| Day-based timeline | src/components/dispatch-allocation/AllocationTimeline (source inspected); current task list | Transport owner is hourly resources + allocation rules. Add a small day-range task view instead; opaque sticky date/name headers and contained horizontal scroll follow same table protection. No separate drag system. |
| Compact task chip | TaskRow / Avatar / Icon / status labels | Separate native title/open action; status text and accessible full title, project palette mapped to existing tokens. Existing completion/edit remains canonical drawer. |
| Missing dates and empty search | AgentWorkspaceState, existing ProjectWorkspace empty state | Undated tasks stay visible in a tray and open existing editor; zero filter matches use existing Clear filters recovery. |
| Date editing | Existing ProjectWorkspace dialog | Add optional start date with strict valid date and ordering checks; do not invent duration for tasks without a start. Due-only tasks occupy one day. Shared task state keeps list, board and schedule synchronized. |

Baseline before editing: overview, all-task list and dark all-task list captured. New calendar/timeline views have no prior direct equivalent; existing view switcher/list is their actual entry baseline. Review uses ui-consistency-review, ui-change-visual-proof and repository emil-design-eng. Frequent schedule navigation stays instant, with no new animation.

## Final implementation and comparison

Added `TaskScheduleChip`, `TaskCalendar`, and `TaskTimeline`; extended the existing Project Workspace rather than adding a second workspace. Three documentation/playground routes are registered in App, navigation and site metadata. Optional start dates use the existing editor and task state. Calendar uses a stable Monday-first 42-day month or seven-day week; timeline supports 14/28 days, inclusive clipped bars and project deadline markers.

| Before → after | Reason and invariant | Evidence |
| --- | --- | --- |
| List/Board entry → List/Board/Calendar/Timeline | Same task records, filters, view-switch treatment and editor. No new shell. | `before-tasks.png` → `after-list-light-final.png`, `after-calendar-light-complete.png`, `after-timeline-light-final.png` |
| Due date only → optional start and due | Validate actual dates, require due when start exists, reject inverted ranges; due-only tasks remain one day. | `after-date-error.png`, `after-mobile-editor-dark.png`; prior editor baseline remains in ../task-editor-20261016. No exact pre-change two-date state existed. |
| No planning components → three reusable primitives | Reference's project colors, day grouping and protected task names mapped to Oreo palette/card/control tokens. | `after-chip-docs.png`, `after-calendar-docs.png`, `after-calendar-api.png`, `after-timeline-docs.png` |
| Narrow timeline avatar protrusion → width-aware chip content | Container widths ≤5rem hide the avatar; ≤3rem retain the status marker. Full name stays in task column and accessible button name. No task duration or data changed. | Historical `after-medium-timeline-light.png` → `after-medium-timeline-light-final.png`; `after-timeline-28-light-final.png` |
| Fixed desktop layout → contained date scrolling | 49rem calendar minimum (45rem on mobile); timeline sticky names 15rem (12rem mobile), minimum 40px/day; native scrolling, no new animation. | `after-mobile-calendar-light-final.png`, `after-mobile-timeline-dark-final.png`, `after-medium-calendar-light-final.png` |

## UI consistency review

Scope: Oreo Web task scheduling, editor and component documentation. Reference and Oreo peer screenshots were inspected, not just searched. `peer-color-calendar.png` establishes the rendered hourly-event peer; AllocationTimeline comparison is source-only. This is not a whole-product or cross-platform consistency claim.

| Lens | Target / peer and owner | Result | Evidence / limit |
| --- | --- | --- | --- |
| Entry behavior | Calendar chips / timeline names and bars / existing TaskRow → ProjectWorkspace Base UI dialog | checked | Same editor opens; Enter opens, Escape/Cancel discard unsaved due date and return focus to the task. A saved date change is visible in calendar, timeline and list. |
| Loading | New synchronous local fixtures / existing ProjectWorkspace | not applicable | No fetch, refresh or partial-load state introduced. Reference app's loading captures are historical, not a template loading claim. |
| Empty states | Filter miss / existing workspace empty recovery; invalid dates and empty timeline / AgentWorkspaceState | checked | `after-filter-empty.png`, `after-timeline-empty-docs.png`, `after-calendar-invalid-docs.png`, `after-empty-period-medium.png`. Empty calendar keeps its useful date/add grid and adds a compact explanatory line, rather than hiding creation controls. |
| Actions | Navigation and range controls / Button, IconButton; task entry / native button; date editing / existing dialog | checked | Canonical secondary/tertiary toolbar actions, native disabled chip prevents activation, existing save/cancel controls. Calendar add prefills the selected due date. |
| Titled scrolling | Timeline / AllocationTimeline's opaque header protection; dialog / existing editor | checked (timeline runtime, peer source-only) | Horizontal + vertical scroll exercised; sticky date/name surfaces protect content. `after-timeline-scroll-final.png` and `after-timeline-scroll-final.mp4` cover the corrected bars at middle/end scroll positions. Mobile editor footer remains reachable. |
| Icons and color | Task status / TaskRow and Avatar; project tone / existing semantic palette | checked | Light/dark captures inspected. Neutral toolbar actions and inherited chip text/status colors; completion additionally uses check/strikethrough and accessible status, not color alone. |

Visual second pass: reference structure retained within Oreo's existing shell, typography and density. Fixed the observed narrow-bar overflow in its shared owner. No new motion values or transitions added; existing dialog/board behavior reused. Final scoped verdict: no remaining blocking findings. Physical touch devices, screen readers and the source app's other modules are unverified.

## Focused validation

- TypeScript project check passed; production Vite build passed. Existing bundle-size advisory remains (not a build error).
- Three Node model tests passed: Monday-first leap/year boundary grids; inclusive clipping and due-only spans; malformed, inverted, missing and same-day date validation.
- Real component fixture QA via Playwriter: month navigation/Today; month→week; 2/4-week timeline; out-of-period empty state; per-day task creation; four tasks on one day and overflow expansion; clear due date → Needs scheduling; filter miss → Clear filters recovery.
- Date scenario: Finalize navigation start changed to Oct 20 while due was Oct 15 → inline date error and due-input focus (title remains valid); due changed to Oct 22 → saved consistently in list, calendar and timeline.
- Cancel scenario: unscheduled Review launch schedule due filled with Oct 18 then Escape → reopened still blank; keyboard Enter and focus return checked.
- Docs: chip activation callback and disabled state; calendar range/create callbacks; malformed controlled date and recovery; timeline open callback and empty switch; all three API pages rendered, including controlled `days={days}` example.
- Desktop 1440×1080; medium 900×1000; mobile-emulated 390×844. Body width stays within 390/900 pixels; horizontal overflow remains inside the calendar/timeline. Light and dark inspected. Browser logs contained normal Vite/React development messages, no task runtime errors in checked scenarios.

## Evidence inventory and limits

All screenshots are original captures. `manifest.json` records hashes, dimensions and source file hashes. Baseline is the SHA at the top of this file; final source is the commit containing this review package and its subsequent changelog-only follow-up. Task source hashes disambiguate captures from later documentation-only commits.

- Baseline: `before-overview.png`, `before-tasks.png`, `before-tasks-dark.png`, `before-changelog.png`. New calendar/timeline had no pre-existing direct route/state, so the actual All tasks entry is the comparison.
- Final default fixture: `after-list-light-final.png`, `after-calendar-light-complete.png` (full-page height, same 1440px viewport width), `after-calendar-dark-final.png`, `after-timeline-light-final.png`, `after-timeline-dark-final.png`, `after-timeline-28-light-final.png`.
- Responsive final: `after-mobile-calendar-light-final.png`, `after-mobile-timeline-dark-final.png`, `after-medium-calendar-light-final.png`, `after-medium-timeline-light-final.png`. Editor dark mobile capture remains valid after the narrow-bar-only correction.
- Interaction states: `after-date-error.png`, `after-calendar-expanded.png`, `after-week-unscheduled.png`, `after-filter-empty.png`, `after-empty-period-medium.png`, `after-mobile-editor-dark.png`.
- Documentation: chip/calendar/timeline preview screenshots, calendar API, malformed date and empty timeline captures. The preview shell itself predates this task; no matched baseline for each newly registered docs route was captured.
- `after-interaction.mp4`: historical 1440×1080, 14.84s CDP screencast assembled from four original change frames with their timestamps; includes date edit result, timeline range change and scrolling. It predates the narrow-bar visual correction and is not a smooth-frame animation proof. Originals and timestamp concat list remain in `interaction-frames/`. No comparable pre-change schedule recording exists because these views were absent.
- `after-timeline-scroll-final.mp4`: final 1440×1080, 37.40s recording of 14→28 days, horizontal scrolling and vertical middle/end. Six native CDP change frames with original timestamps; inspected original frames 2 and 5. No crop or resize. This verifies instant state/scroll changes, not smooth animation frame pacing. Originals remain in `final-scroll-frames/`.
- Earlier screenshots without `final` / `complete` suffix preserve interim states. In particular `after-timeline-light.png`, `after-timeline-dark.png`, `after-timeline-scroll.png`, `after-mobile-timeline-light.png`, `after-mobile-timeline-light-settled.png`, `after-medium-timeline-light.png`, and `after-interaction.mp4` predate the narrow-bar correction. `after-mobile-timeline-light.png` also captured the theme transition; use settled/final captures for color judgments.
- QA mutations were local only: two temporary tasks, one later cleared due date, and a moved Finalize navigation date. Final screenshots reset to the original 14-task fixture. Fixed sample today is Oct 15, 2026; locale English; date calculations UTC. Screenshots prove local real-component fixtures, not production deployment or live account persistence.
- Browser session 10 captured baseline/reference. After session loss, resumed through Playwriter's local headless browser session 1; original media retained. No unrelated user tabs were navigated. Headless capture did not provide native full-rate recording; this is an evidence coverage limit, not an implementation gate.

Delivery: focused checks complete; PR and changelog follow-up pending at this initial commit. No production deployment claim.
