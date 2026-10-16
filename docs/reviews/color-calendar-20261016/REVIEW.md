# Color Calendar review

Reference: https://x.com/yishanzh/status/2110495231972090314, Yishan Zhang. Inspected actual reference image (`reference.png`, metadata `source.json`): five-day October week, month navigator and calendar-source sidebar, pastel event fills with narrow accent borders, timed grid, all-day lane, overlapping Thursday meetings. No interaction video. No OS wallpaper/window chrome is reproduced.

Baseline: `50519583c38511db47996cfe704aad9c91e53928`. Local Chromium through Playwriter session 10, localhost:5257, English, 1440×1080 light. Task worktree preserves unrelated primary-checkout WIP. Actual new route fell back to Button docs (`before-entry.png`). Actual existing Meeting Planner rendered and inspected (`before-peer.png`).

## Pre-edit consistency comparison
| Lens | Target → peer / owner | Decision and coverage |
|---|---|---|
| Entry | Weekly calendar → MeetingPlanner / MeetingCard | Checked actual peer and source. Existing meeting list/detail is not a weekly grid; add a new dense week composition and keep shared Button/IconButton and modal focus behavior. |
| Loading | Local fixture → MeetingPlanner synchronous fixture | Not applicable to local template: no network or artificial wait. Grid component will expose initial loading / refresh state for hosts. |
| Empty | Filtered week → DocumentEmpty and AgentWorkspaceState | Reuse centered AgentWorkspaceState with reason-specific clear/create action. Do not call a filtered week a loading/error state. |
| Actions | Toolbar and edit actions → MeetingPlanner Button/IconButton | Same canonical compact primary/secondary/tertiary variants, tapScale=1. Source visibility is a labelled checkbox, palette is native radio group. |
| Titled scrolling | Timed grid → existing bounded details/list regions | New horizontal grid scroll owns sticky opaque day header, left time gutter and all-day lane. Event content must never overlap header. Mobile offers day view without horizontal page overflow. |
| Icons/color | Calendar categories → existing palette tokens / BrandSwatch | BrandSwatch is a copyable brand specimen, not a selection control. New CalendarColorPicker uses existing named palette tokens, not raw source colors. Event label includes calendar name, so color is not the sole identifier. Neutral operation icons inherit label color. |

Scope: CalendarEventBlock, CalendarSourceList, CalendarColorPicker, CalendarWeekGrid, documented playgrounds, full Color Calendar template and changelog entry. New source colors propagate to all same-source events, preserving per-event color override. Native form validation, add/edit/delete/undo, week/day switching, category visibility, search, date navigation and filtered JSON export are local simulations. Week uses 7 days so weekend events remain reachable; initial view may show five workdays via explicit toggle. Fixed wall-clock demo timezone, no calendar provider or invites.

Visual baseline for new mobile, dialogs, source color and empty states does not exist; record this gap rather than invent predecessors. Before/after entry and changelog pairs plus final desktop/mobile/dark/interactions will be retained here. Continuous recording is unavailable in the existing direct-headless session (no extension tabCapture); no new timed animation is planned. Evidence gaps do not block authorized integration.

## Result and evidence

Implemented four reusable components, docs/playgrounds and `/color-calendar`. Compared final local UI with the inspected reference and existing Meeting Planner. New composition is deliberately denser than MeetingCard: 64px/hour grid, compact title-only blocks at ≤30 minutes, title/time for taller blocks, full date/time/source in accessible names. Existing semantic palette tokens supply accent colors; 12% accent mixed into the base surface supplies the pastel fill. Day headers and the time gutter have opaque backgrounds. No shared meeting component was modified.

| Changed state | Before | After / check |
|---|---|---|
| Desktop entry, 1440×1080 light | [Missing route fallback](before-entry.png) | [Complete calendar](after-entry.png), actual local fixture, matching viewport |
| Existing peer | [Meeting Planner](before-peer.png) | Actual render and source compared, shared buttons/state typography reused |
| Desktop and medium dark | No prior calendar page | [Desktop dark](after-desktop-dark.png), [900×1000](after-medium-dark.png); horizontal overflow is owned by the schedule, not the page |
| Mobile day view, 390×844 | No prior mobile page | [Light](after-mobile.png), [dark](after-mobile-dark.png); single date by default, week option retained |
| Form / validation | No prior editor | [Title validation](after-validation.png), [edit with explicit override](after-edit.png), [mobile dark](after-mobile-dialog.png); blank title and reversed time rejected, alert focused, save/Escape returns focus |
| Calendar-wide color | No prior source editor | [Source color preview](after-source-color.png); Work changed to orange, inherited Standup updated, explicit pink Design review preserved. Screenshot precedes final legend wording correction from Event color to Calendar color |
| Deletion and recovery | No prior action | [Confirmation](after-delete.png); delete removes only selected event; undo restores it |
| Filtered empty | No prior weekly result | [Empty](after-empty.png); reset restores demo week, visible sources and clears search |
| Timed scroll | No prior weekly grid | [End of scroll](after-scroll-end.png); opaque day header protects titles while event content passes underneath |
| Event component | New component | [Selected event playground](after-event-playground.png), click updates controlled selected state |
| Palette | New selector; BrandSwatch is a different copy action | [Palette playground](after-palette-playground.png); native radio ArrowRight changed blue to mint |
| Sources | New component | [Sources playground](after-sources-playground.png); checkbox updates host visibility; hiding Work removed all Standup events in template |
| Grid normal / loading / error | New component | [Grid playground](after-grid-playground.png), [loading](after-loading.png), [error](after-error.png); retry and empty reset restore schedule |
| Changelog | [Before](before-changelog.png) | Final entry capture added after real PR number is assigned |

### Validation and limits

- `npm run build` passed after final source changes; existing large-bundle warning remains. Latest browser console readback contained only development messages. The initial invalid icon name was caught by TypeScript and repaired to the canonical `ellipsis` icon before final QA.
- Five focused tests pass: wall-clock date arithmetic across month/year/DST boundaries, invalid event/time validation, chained/adjacent overlap placement, triple overlaps with all-day exclusion, and date/source/search filtering. Raw output: [model-tests.txt](model-tests.txt).
- Created Weekend workshop as an all-day event on October 24; week automatically included weekends. [Actual downloaded export](export-filtered.json) contains only that searched event, with start/end 0/1440, explicit allDay, visible sources and filter scope.
- Same-source color propagation, individual override retention, cancel, validation focus, edited-event focus return, one-event deletion/undo, source visibility, search reset, view changes and keyboard palette selection exercised through actual UI.
- Dates/times are fixed local wall-clock demonstration data, deliberately without timezone conversion or a backend. No recurring-series or provider behavior is claimed; all edits reset on reload. Export is local JSON, not a calendar invitation.
- Continuous recording is missing: existing direct-headless Playwriter session lacks extension tabCapture. Screenshots establish states, not animation timing. No new timed animations are introduced. Physical devices, Safari and live calendar accounts were not tested. New mobile/modal states have no pre-existing equivalents; the actual missing-route baseline is retained.

### Correction history

Original captures are retained. `initial-desktop.png` exposed flex-shrunk text in 45-minute tiles; grid tiles now show title/time without an extra source line, retaining the source in their accessible name. Compact tiles use a 1.2 line-height and no vertical padding so 15-minute slots fit. `superseded-after-desktop-dark.png` used pale category accents that weakened purple/brown identity; final accents use their named dark palette backgrounds. `superseded-after-medium-dark.png` has a capture artifact after viewport resize; canonical medium capture was repeated at a settled viewport. `superseded-after-scroll-end.png` was taken before keyboard scrolling settled; the canonical scroll image uses a deterministic instant scroll to the end. `pre-final-*` and `superseded-after-mobile-dialog.png` precede final compact sizing or native dark-control color-scheme fixes. Every canonical screenshot linked above was inspected; originals are not overwritten.

Second consistency pass: entry, loading, empty, actions, titled scrolling and icons/color are checked at the source and actual-render scope described above. No broader cross-product claim. Source/media hashes and dimensions in manifest.json identify final source and captures; historical phases are explicitly identified here. Implementation and merge status remain separate from evidence coverage.

## Delivery record

PR: https://github.com/oreo-design/oreo-ui/pull/85. Implementation commit: `39a8222d60b1ca5ec624e4a8fc225fa72f43d815`. [Final changelog](after-changelog.png) uses the existing release-entry pattern and links to `/color-calendar` and PR #85; rendered DOM and screenshot inspected at the matching baseline viewport. Final exact source head is reviewed before merge; the remote merged result is reported in the delivery response. This record establishes source/local verification, not a website deployment.
