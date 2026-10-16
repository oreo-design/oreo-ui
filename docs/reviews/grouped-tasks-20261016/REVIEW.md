# Grouped Tasks — implementation and visual review

Reference: [Task List Grouped by Status — Startup Visuals](https://x.com/startupvisuals/status/2110803178811990300). The attached image was inspected at its public media URL; X's page request returned 403. `reference.png` preserves the inspected image in the browser. Adopted: colored status strips, task counts, dense six-column metadata, overlapping assignees. Rejected: decorative browser/background, duplicated sample IDs and mismatched counts, nonfunctional view buttons. Existing Oreo blue progress palette takes precedence over the reference orange.

Baseline: `f3dc4d58c5e369e5c07cc92d588c6026fccd5298` (main after PR 64). Task branch: `codex/grouped-tasks-20261016`. Local fixture on `http://localhost:5239`; Chrome via Playwriter session 65, English locale, desktop 1440×1000. New route `/grouped-tasks` previously redirected to the default Button playground; `before-entry.png` records that actual result before implementation. There was no previous grouped-task editor, empty state or board in this route.

## Scope and reuse

| Before | After | Why |
| --- | --- | --- |
| TaskRow offers completion, one person and flexible metadata | TaskListRow aligns six semantic table columns with tags and multiple assignees | A distinct dense table role; reuses TaskStatus, Tag, AvatarGroup and Icon |
| No grouped task table | TaskStatusGroup + GroupedTaskList with visible counts and controlled disclosure | One reusable composition, using Base UI Collapsible |
| Missing route falls back to Button playground | Complete sprint workspace with List/Kanban, local edits and reversible archive | Shared data; hidden tasks survive filtered board changes |
| Existing Kanban shows one person | Same Kanban reused; first assignee on cards, complete assignment in editor/list | Avoid a duplicate board; unassigned swimlane explicitly clears all members |

All colors map to Oreo semantic/palette tokens. Spacing uses the existing 4px scale, typography the Tailwind text scale, radii control/card tokens. 960px table minimum, 38% name column and 560px modal are structural geometry. No new timed animation: disclosure, tabs and modal state changes are immediate; the existing Kanban owns its drag motion. Primary/secondary actions use Button; group actions use IconButton.

## Evidence inventory

| Scenario | Before | After | Coverage |
| --- | --- | --- | --- |
| New route entry | [Actual fallback](before-entry.png) | [Desktop full page](after-desktop-final.png) | Captured and inspected; same viewport, light theme |
| Existing peer | [Project Workspace](peer-project-workspace.png) | Unchanged peer | Actual peer inspected for task row, action, status and avatar hierarchy |
| Empty title and recovery | No corresponding baseline editor | [Validation](after-validation.png), browser-checks.jsonl | Empty title rejected; title entered, two members selected, task saved in requested group |
| Board and list synchronization | No corresponding route baseline | [Board](after-board.png), browser-checks.jsonl | Editor opened from board, task moved to Done and reflected in list |
| Search empty and recovery | No corresponding route baseline | [Empty state](after-empty.png), browser-checks.jsonl | No-match search, Clear filters; shared AgentWorkspaceState |
| Archive and undo | No corresponding route baseline | browser-checks.jsonl | Task archived and restored locally |
| Responsive/theme | Baseline desktop entry only | [Medium light](after-medium-light.png), [medium dark](after-medium-dark-final.png), [mobile light](after-mobile-light.png), [mobile dark](after-mobile-dark.png), [mobile editor](after-mobile-editor.png) | New surface; no prior equivalent theme/mobile editor |

All evidence uses real components with local sample data. It does not prove backend persistence, production deployment or a real organization's task workflow. Source edits during an early browser sequence caused HMR; later checks re-observed actual state before continuing. Two browser clicks timed out after dispatch; subsequent snapshots established the actual resulting state instead of assuming failure or repeating blindly.

## UI consistency review

| Lens | Target / peer / canonical owner | Result and evidence |
| --- | --- | --- |
| Entry behavior | Grouped task title and board title → ProjectWorkspace editing; Base UI Dialog | Both new entries open the same editor; save/cancel/dismiss owned by Dialog. Focus returns to surviving trigger or workspace heading. Full keyboard return matrix pending. |
| Loading | Synchronous local fixtures / ProjectWorkspace | Not applicable: no network or deferred loading path introduced. Do not imply live loading verified. |
| Empty | Grouped list/search → AgentWorkspaceState used by existing templates | Checked visually and interactively for no results and recovery. Empty groups use the same owner. |
| Actions | New task/save/clear/row-plus → peer task actions | Button and IconButton reused, neutral operation icons, compact dense table action role. |
| Titled scrolling | Group tables/dialog → normal-flow peer headers | No content under fixed page titles: headers scroll in normal document flow. Table horizontal regions named and focusable. Modal scrolls as a whole. |
| Icons/color | Status/priority/assignees → TaskRow, Tag, AvatarGroup | Progress maps to shared blue; review purple, done mint. No online presence inferred from assignment. |

This is a focused Web comparison of the listed surfaces, not a whole-product or cross-platform consistency claim.

## Verification and limits

- Production build passed; existing large-bundle advisory remains.
- `node --experimental-strip-types scripts/grouped-tasks/check.mjs`: 20 assertions pass (filters, ordering, hidden-record preservation, secondary assignees, new cards, immutable inputs, dates).
- Browser observations are preserved in `browser-checks.jsonl`; screenshot originals remain unmodified.
- Final source build passed after fixing the playground export registration. Runtime Code and Documentation views were checked without new errors. The failed blank `after-playground.png` is retained as history; `after-playground-fixed.png` supersedes it. `after-documentation.png` records the docs view.
- `after-desktop-final.png` supersedes the initial desktop image; `after-dark-top.png` and `after-medium-dark-final.png` correct the framing of earlier scrolled dark captures. Historical originals remain intact. The last local contrast fix makes group-add icons inherit their status-strip label color.
- `interactions.mp4`: 1440×1000, 26.625s. Original browser screencast frames and timestamps preserved in `interaction-frames.json.xz`. The Playwriter extension's native capture was unavailable earlier in this session (activeTab/tabCapture); this uses Playwriter's connected page CDP screencast. Original timing retained, no generated UI. Selected actual frames inspected. Covers collapse/keyboard expand, view switching, keyboard lift/right/drop; the observed drop returned to Backlog, so this is not evidence of a successful cross-column keyboard drop. Cross-status editing and the data reconciler were verified separately. Touch drag and the full keyboard-drag matrix remain unverified.
- Desktop, medium and mobile light/dark outputs inspected. Mobile body scrollWidth/clientWidth both 390; six-column tables scroll inside their named regions. New pages have no prior editor/mobile-state baseline; this is an explicit coverage gap, not a fabricated comparison.
- No asynchronous/backend errors are simulated; only local form validation and recovery are exercised. No network loading path was added.

## Delivery review

Implementation commit: `8b4a21f11ee5ad402eb8fd3bb111ac19e6ac80cf`. [PR 65](https://github.com/oreo-design/oreo-ui/pull/65) includes the Changelog entry linking the same PR. [Before Changelog](before-changelog.png) and [after Changelog](after-changelog.png) / [complete new entry](after-release-entry.png) preserve the entry addition; the former was captured before editing release data, after the sidebar routes were registered. Component routes `/task-status-group`, `/task-list-row` and `/grouped-task-list` render; generated JSX uses actual registered exports. Final typecheck and the 20 focused assertions pass. No required remote CI checks are configured. Integration is authorized; exact reviewed source and remote merge result are reported in the task reply, without implying a website deployment.

The second review pass confirmed no changes to existing TaskRow, Kanban, shared primitives or unrelated WIP. Remaining evidence limits: no pre-existing mobile/editor baseline for the new route, native touch input and complete keyboard-drag matrix unverified; no real backend, persistence or deployment tested.
