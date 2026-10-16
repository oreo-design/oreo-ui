# Task Board / inline task editor

## Baseline and reference (before implementation)
- Baseline: be5a47624446ab3b4c8c64d4b47a9ea67b2ef58a, fresh origin/main; isolated codex/task-editor-20261016. Primary WIP untouched.
- Reference: https://x.com/zahragr8r/status/2110679274848154096 — Zahra / Gr8r Studio. Actual still image inspected (`reference.png`); “Edit tasks without losing sight of your board.” No motion inferred.
- Reference structure: workspace sidebar, project breadcrumb/title, board toolbar, compact grouped cards, right attached property panel with description, subtasks, attachments and discussion. Adopt spatial composition, not external logo/brand/assets. This supplied source is the external reference check.
- Actual previous /task-board resolves to Button docs (`before-entry.png`), captured before editing at 1440×1080 light, localhost:5265.
- Rendered peers: `peer-feed.png` (/project-feed dark) and `peer-kanban.png` (/kanban light), same viewport. Source peers: src/patterns/project-feed, src/patterns/project-board, src/components/kanban, src/components/task-row, src/components/inline-search-select, src/components/automation.

## Pre-edit comparison map
| Target | Peer / canonical owner | Reuse and justified difference |
|---|---|---|
| Board columns/cards | KanbanBoard, onCardOpen, dedicated drag handle | Reuse complete board and DnD behavior, tokens/card radii. Add no duplicate drag implementation. Board horizontal scroll stays contained while inspector uses remaining width. |
| Dense studio shell | ProjectFeedPage | Same 14rem sidebar, neutral token backgrounds and separators, compact metadata. Reference requires board + nonmodal right editor instead of feed's modal event details. |
| Property choices | InlineSearchSelect | Reuse controlled searchable choices with avatar/status icons and keyboard behavior. Dates use native controls like ProjectBoardPage. |
| Task list view | TaskRow | Reuse existing row/status/priority/avatar composition. |
| Empty/error | AgentWorkspaceState | Center within owning content region; errors remain alerts and preserve data. |
| Actions/icons | Button, IconButton, Avatar, Icon | Same role uses existing variants, tapScale=1 for frequent editing. CurrentColor and semantic label palette. |
| Detail scroll | Existing panel header separation | Sticky opaque header protects independently scrolling panel; no redundant decorative fade. Desktop nonmodal region; mobile full-width inspector with Back, no focus trap. |

Implementation plan recorded before editing. No new animation planned for frequent edit/switch actions; inherited Kanban/InlineSearchSelect motion retains reduced-motion support. New fixtures are local only and reset on reload.

## Implemented behavior and focused verification
- Added TaskProperties, TaskSubtasks and TaskDetailPanel, plus /task-board. Reused KanbanBoard, TaskRow, InlineSearchSelect, AgentWorkspaceNav/State, Avatar, Icon and Button. Added optional KanbanBoard.selectedCardId in the canonical owner: border selection and aria-current; existing consumers omit it and retain their behavior.
- Actual browser checks: status moves card; title blur/Enter updates card, blank title rejects; date pair rejects reverse range and recovers; assignee searches and updates; dependency cycles rejected; subtasks add/check/remove; complete/reopen; list completion + undo; top-level creation and in-column creation produce editable records.
- Draft comment survives A → B → A, posting creates one local comment. Task activity shows human-readable property names. Description saves on blur. Date drafts explicitly require Save; changing task discards unsaved date/title drafts. No persistence across reload.
- Pointer drag from In progress → To do with High filter preserved all six records after clearing filter and synchronized the inspector. Keyboard pickup/drop and Escape cancellation checked. Cross-column keyboard transfer into an empty column was not established; the searchable Status control is the verified keyboard alternative. No broad DnD changes introduced.
- Nested picker Escape closes picker first; next Escape closes inspector and restores card focus. Narrow-screen close also restores card focus. Native date picker behavior and physical touch devices not fully audited.
- Local attachment readback equals “Campaign assets for review.\n” (28 bytes). A >10 MB file rejects without removing prior files and displays feedback in the inspector. Export JSON readback confirms task title, status, due date, subtask completion, comment, dependency, six retained records and attachment metadata; no file bytes or blob URL exported.
- Playground property selection updates generated JSX and correct import; documentation APIs present. Checklist add/check/remove/empty and panel completion/close/reopen checked; malformed JSON recovers via Reset.
- TypeScript + Vite production build pass; four model tests pass (date pair validation, filtered board preservation, new-card promotion, dependency cycles). `tests.txt` contains results. Existing large-bundle warning remains. Local pnpm wrapper attempted a dependency repair and aborted before removal; actual build used existing TypeScript/Vite binaries, no dependency changes.

## Six-lens consistency review
| Lens | Target and peer / owner | Result | Evidence / limits |
|---|---|---|---|
| Entry | Kanban title action + dedicated drag handle; ProjectBoardPage modal peer | Checked | Reference explicitly needs nonmodal inspector; board remains usable, Escape and focus return verified; mobile replaces content with close action. |
| Loading | Synchronous local task records | Not applicable | No async data fetch or fabricated loading state. Local attachment selection is synchronous. |
| Empty | AgentWorkspaceState, project-feed peer | Checked | Filter empty centered with Clear filters; comments use same shared owner. Subtask empty is intentionally an inline prompt next to its creation field, not a full-page absence. |
| Actions | Button/IconButton and inline choice owner | Checked | Existing variants, frequent edit tapScale=1; shared native checklist inputs. New property icons inherit neutral label tone. |
| Titled scrolling | TaskDetailPanel | Checked | Opaque sticky top bar, independently scrolling body; `after-discussion-final.png` shows controls/content below protected header. No overlay fade needed. |
| Icons / color | Icon/Avatar/palette tokens; feed + Kanban peers | Checked | Neutral operations, label palette and avatar semantics retained; selected-card outline is neutral. Same-role consumer /kanban captured again after optional API addition. |

## Motion review
| Before | After | Why |
|---|---|---|
| No task route or inspector | Immediate nonmodal inspector and task switching | Frequent editing needs no new entrance or keyboard animation. |
| Existing Kanban/InlineSearchSelect motion | Reused, no timing changes | DnD spatial continuity and origin-aware pickers stay with their shared owners. New selected-card state is a semantic outline. |
Verdict: **Approve scoped changes**. No new motion sequence. Existing owner motion is not claimed as a whole-library audit. Reduced-motion picker interaction checked; no movement added by task components. `after-interaction.mp4` records real board/inspector operations at 1440×1080, 19.92 seconds. Recorded using Playwriter-owned CDP screencast (native extension recording is unavailable in this session's direct mode), original JPEG frames and timestamps retained. No audio track. The capture ends during return to the board; final resting inspector is separately captured. There is no pre-existing task interaction to replay; baseline is the real route fallback, not a fabricated task page.

## Evidence index
Environment: local React fixtures, Chrome via Playwriter session 10, en-US browser with explicitly formatted en-GB dates where specified. Wide 1440×1080, medium 900×1080, narrow 390×844. All new product work is local sample behavior, not live collaboration or production.

| Scenario | Before / peer | After |
|---|---|---|
| New route / complete task workspace | before-entry.png (Button fallback, light) | after-dark-final.png; after-light-default.png (same default fixture, light); after-light-settled.png (edited task) |
| Side-by-side inspector composition | reference.png; peer-feed.png; peer-kanban.png | after-dark-final.png |
| Shared Kanban consumers | peer-kanban.png | peer-kanban-after.png |
| Date validation and recovery | No equivalent task editor | after-date-error.png; recovery verified by exported due date |
| Discussion/files/subtasks and scroll protection | No equivalent route | after-discussion-final.png |
| Search empty | Existing shared empty-state owner | after-empty.png; recovery by Clear filters checked |
| Narrow editor / board return | Narrow route baseline not captured; baseline revision retained | after-mobile-dark-final.png; after-mobile-light-final.png; after-mobile-board.png |
| Medium layout | Medium route baseline not captured | after-medium-dark.png; 900px scroll width equals viewport |
| Properties / generated code | New docs entry | after-properties-playground-final.png; generated import + API readback |
| Interaction | No previous task interaction; before-entry.png records real fallback | after-interaction.mp4 + interaction-frames originals |
| Changelog | before-changelog.png | after-changelog.png |

Historical captures preserved, not final evidence: after-initial.png precedes selected-card and icon refinements; after-light-final.png caught an in-flight theme transition (use after-light-settled.png); after-properties-playground.png caught closing picker (use final); after-mobile-dark.png and after-mobile-board.png were captured in light theme with cursor overlay despite the first filename; after-comments-files.png is an early top-of-panel capture (use after-discussion-final.png); after-activity.png predates human-readable property name correction. Final captures hide automation overlay. Narrow light/dark finals inspected. Baseline dark/narrow, full screen-reader audit, physical touch, other browsers and a pre-change motion clip remain evidence gaps. Media gaps do not change delivery authorization.

## Delivery
PR: https://github.com/oreo-design/oreo-ui/pull/93. Product revision: 1d1ffca11ac2422526c00aca134f061cd996b091. Final follow-up only registers Changelog and updates evidence. Exact source review and remote merge verification are reported in the conversation after delivery. No production deployment requested.
