# Project Workspace review

## Source and scope

Reference: [Zahra / Gr8r](https://x.com/zahragr8r/status/2110262138124320955), [live demo](https://gr8r-taskmanagement.vercel.app). Inspected the real home, project board and task drawer read-only; sampled the public post video. `reference-home.png`, `reference-board.png`, and `reference-detail.png` retain the observed reference. Direct X access returned 403; public post metadata and the linked demo supplied the reference. No reference source code copied or remote data changed.

Extracted two reusable components, **ProjectSummary** and **TaskRow**, plus the complete **ProjectWorkspace** template. The template includes overview, assigned/all/project tasks, grouped list, Kanban, filters, sorting, task creation/editing, subtasks, archive/undo, progress and activity. It deliberately uses Oreo's existing components and tokens. Sample data is local React state and resets on reload; the fixed sample date is October 15, 2026. No backend, real account, or deployment claim.

Baseline: `7170c1b1bd20090c75243d203a7fb8d5205871c5`. Implementation revision: `743b5cae8e6143ef4f39e3bae6992d87779a4934`. Isolated branch `codex/project-tasks-20261015`; original dirty checkout preserved. Capture environment: macOS Chromium through Playwriter session 45, localhost:5214, English, fixture data; desktop 1440×1000, mobile 390×844 and tablet 768 pixels wide. Full-page captures can exceed viewport height. Light/dark are paired where available. Captures were made throughout implementation before the source commit; later cosmetic correction is separately identified.

## Before / after inventory

The new route previously fell through to the Button playground; it had no comparable task state. Entry captures therefore show the actual pre-change destination, not an invented previous workspace. New drawer/filter/board states have no previous equivalent on this route.

| Scenario | Before | After | Result / shared owner |
| --- | --- | --- | --- |
| Desktop entry and overview | [before-entry](before-entry.png) | [home light](after-home-light.png), [home dark](after-home-dark.png) | Full dashboard replaces unknown-route fallback. Button, IconButton, Avatar, Tag, StepProgress reused. |
| Mobile entry / navigation | [before-mobile](before-mobile.png) | [mobile light](after-mobile-light.png), [mobile dark](after-mobile-dark.png) | Collapsed navigation, two-column stats, stacked project summaries; 390px width, no body overflow observed. |
| Existing Kanban consumer | [before-kanban](before-kanban.png) | [after-kanban-peer](after-kanban-peer.png) | Existing whole-card keyboard dragging/cancel retained. Optional details action has a separate native drag handle. |
| Project list and filters | No prior route state | [project list](after-project-list.png), [tablet list](after-tablet-list.png) | TaskRow used in dashboard and grouped list; title opens details, checkbox completes independently. |
| No results / recovery | No prior route state | [no results](after-no-results.png) | Existing AgentWorkspaceState; Clear filters restores tasks. |
| Creation validation | No prior route state | [title error](after-title-error.png) | Empty title gives inline alert and input focus; successful creation checked interactively. |
| Details and subtasks | No prior route state | [light](after-detail-light.png), [dark](after-detail-dark.png), [mobile](after-mobile-detail.png) | Base UI Dialog owns focus/Escape; fixed title/actions with scrolling form body. |
| Project board | No prior route state | [light](after-board-light.png), [dark settled](after-board-dark-settled.png) | Existing Kanban owner reused, horizontally scrollable within board. Filtered edits preserve hidden tasks. |
| Standalone components | New component routes | [TaskRow playground](after-task-row-playground.png), [ProjectSummary playground](after-project-summary-playground.png) | Docs, API and playground controls registered. Disabled TaskRow controls checked. |
| Status consistency correction | Earlier captures in this directory | [Planning status](after-planning-status.png) | Project header now matches summary: Planning neutral, At risk orange, On track mint. Final source correction verified. |

## Six-lens consistency review

This is an Oreo cross-surface review, not a cross-product consistency claim. Actual existing Kanban and new standalone playgrounds were viewed, alongside the reference and new template. Source traces checked Button/IconButton, Avatar, Tag, StepProgress, AgentWorkspaceState and Kanban consumers.

| Lens | Evidence / result | Coverage limits |
| --- | --- | --- |
| Entry behavior | Before route fallback, after full template; sidebar component/template registration; mobile navigation opens and selecting a project closes it. | No deep links to individual tasks; navigation is local demo state. |
| Loading | Synchronous fixture initializes immediately, no artificial spinner. | Network loading/retry is inapplicable; no backend behavior claimed. |
| Empty / error / recovery | Search-empty capture, Clear filters recovery; blank-title validation; archive and Undo restore saved task data. | Entire workspace emptied and all-assigned-tasks-complete states not separately captured. |
| Action components | Canonical Button/IconButton for primary/form actions; native row title/checkbox and dedicated drag handle; keyboard and disabled controls exercised. | Real-device touch and screen-reader audit not performed. |
| Titled scroll surfaces | Existing Kanban horizontal region; drawer title/footer fixed while middle scrolls; mobile/tablet screenshots inspected. | No baseline recording for newly created drawer; no comparable prior state exists. |
| Icon / color inheritance | Oreo Icon, semantic text/background/border tokens and palette colors; dark/light reviewed. Planning tag corrected at shared role. | No exhaustive alternate icon-library matrix. |

## Interaction verification

- Create a task with High priority and a new subtask, reopen and verify saved data.
- Blank title rejects submission with a focused title input and alert.
- Edit task status and subtask completion, save and reopen.
- Archive removes a task; Undo restores it. Editing a title without saving then archiving/undoing restores the saved title.
- Enter in the new-subtask field adds the subtask without submitting/closing the drawer.
- Completion updates dashboard count and project progress; Audit component usage moves to Done (final Planning screenshot).
- Search no-match and Clear filters recovery.
- Filter board to High priority (3 cards), move a task, clear filter and verify all 7 original project tasks remain.
- Inline board creation creates a usable task with project/default metadata.
- New drag handle: Space, ArrowRight, Space commits Backlog → To do; opening details confirms status. Existing whole-card Kanban Space/ArrowRight/Escape cancellation preserved.
- Escape closes details and returns focus to the opening task title. Mobile keyboard navigation and 390px drawer inspected.

## Motion review (before commit)

| Before | After | Why |
| --- | --- | --- |
| New workspace has no prior interactions | Instant navigation, list edits and drawer; action buttons use `tapScale={1}` (`src/patterns/project-workspace/index.tsx`) | Frequent task workflows and keyboard actions should respond immediately. |
| Existing Kanban whole-card activation | Optional dedicated drag handle; original motion constants unchanged (`src/components/kanban/kanban.tsx:17`, `:34`) | Details and dragging have separate targets, preserving the existing gesture owner. |

**Accessibility / interruptibility:** existing Kanban disables movement transitions for keyboard/reduced motion, supports Escape cancellation and commits only valid drops. No new keyframes, layout-property animation, or timing values. Dedicated activator ref supports keyboard focus. Pointer spring behavior is inherited, not newly tuned or performance-profiled.

**Approve.** No feel-breaking motion regression found in the changed paths. Keyboard drop and cancellation exercised; new high-frequency actions are instant.

[Final interaction recording](interaction-complete.mp4): keyboard move, open details with To do status, close. Verified 1440×920, 3.8 seconds; decoded frame inspected. Recorded through CDP screencast on the same Playwriter-managed page because native extension recording hit the activeTab limitation in this session. Source frames are 1440×1000; top 80px automation toolbar cropped from the delivered clip only. Original frames, timestamps and concat manifests retained in [motion-originals.zip](motion-originals.zip).

Historical files retained: `interaction.mp4` is superseded (first attempt ended during an active drag); `after-board-dark.png` is superseded by `after-board-dark-settled.png` (theme transition intermediate). Do not use those as final-state proof. No pre-change motion recording for existing Kanban; before/after stills and interactive regression check cover it, leaving a recording coverage gap. All screenshots are local fixture or explicitly marked remote-reference evidence, never production verification.

## Validation and review limits

TypeScript check and production build pass; [build log](build.log) retains output. Existing bundle-size advisory remains. `git diff --check` passes. Fresh interaction logs showed no new exceptions; session history contains a resource 403 and development-server reconnect failures, so this is not a claim of zero network errors. Screenshot originals, hashes and dimensions are in [manifest](manifest.json). Main integration is reported separately from evidence coverage.
