# Project Board — review index

Reference: [Navneet, “Motion Enabled”](https://x.com/sterlynavneet/status/2110264347595583949). The actual 17.416s video was viewed at 1, 4, 8, 12 and 16 seconds. [Metadata](reference-metadata.json) and the five `oreo-sterly-reference-*.png` captures retain the source. X itself returned 403; public metadata and the original CDN video were accessible. No source video download or invented interaction evidence.

## Scope and revisions

- Baseline: `b67381e7a4d1ae3e4970c2c31dc0640683fda0ec` (origin/main, PR #57).
- Branch: `codex/project-board-20261015`; implementation commit `bd00934`. [PR #58](https://github.com/oreo-design/oreo-ui/pull/58). After captures use this task's component/template implementation, identified by this directory's containing commit. `manifest.json` hashes source and original media for exact matching.
- New reusable components: `ProjectCreateCard`, `ProjectBoardOverview`; `BoardProjectSummary` composes the existing `ProjectSummary` rather than creating a second progress/avatar implementation.
- Template: `/project-board`. Three shared-data views, category/search/priority filters, creation/editing, stage/owner/task changes, keyboard Kanban movement, owner swimlanes, inline cards, archive/undo and activity history.
- Docs/playgrounds: `/project-create-card`, `/project-board-overview`; existing site navigation, source export and Changelog receive entries.
- Local fixture only, October 15, 2026, English; resets on reload. No production deployment, backend persistence, real collaboration or external delivery claim.

## Environment and coverage

Playwriter session 65; local Chromium; `http://localhost:5232`; desktop viewport 1440×1000, mobile viewport 390×844; CSS-pixel captures. Full-page images can be taller than the viewport. Light baseline/default desktop; matching after entry uses light; dark/mobile variants are additional coverage. Browser overlays hidden for media.

| Changed page/state | Before | After | Verification / limits |
| --- | --- | --- | --- |
| New template route and entry | [Actual old route fallback](before-entry.png) | [Complete default overview](after-overview-final.png) | Old `/project-board` reached Button playground. There was no prior board or editor to compare. Same desktop viewport/light theme. |
| Reused project composition | [Existing Project Workspace](peer-project-workspace.png) | [New overview](after-overview-initial.png) | Actual peer viewed plus shared-owner code traced. Reference's more compact task cards become Oreo ProjectSummary cards with existing progress/avatar treatment. |
| Creation and validation | No prior template editor | [Name validation](after-create-error.png) | Empty title rejected; Orbit mobile created with Apps category; Escape and focus return checked. |
| Native Kanban | No prior template board | [Board](after-board-view.png), [owner swimlanes](after-swimlanes.png) | Keyboard Space → ArrowRight → Space moved project; editor readback confirmed stage. Inline Launch checklist increased project count and got contextual category. Pointer drag and cross-owner drag not separately recorded. |
| Shared grid / completion | No prior template grid | [Completed project](after-grid-completed.png), [dark grid](after-grid-dark.png) | Completed stage forces all tasks complete; category, priority and search filters work across views. Hidden records preserved by focused adapter check. |
| Archive and recovery | No prior flow | [Confirmation](after-archive-confirm.png), [activity](after-activity.png) | Archive lowers count; undo restores. Follow-up regression: edit title without saving, archive/undo restores original saved record; browser log confirms original=1 and unsaved=0. Confirmation title now also uses saved record. Original confirmation capture retained; no separate final-copy capture. |
| Empty and recovery | No prior filtered state | [No matches](after-empty.png) | Clear filters restores results. Component empty columns also verified in playground. |
| Mobile | No matching mobile pre-change capture | [Grid](after-mobile-grid.png), [overview scroll](after-mobile-overview.png), [editor](after-mobile-editor.png) | 390×844; full-page media inspected; grid stacks, overview scrolls within region, editor remains usable. This is desktop Chromium viewport emulation, not physical phone evidence. |
| Component docs / properties | Old route fallback; no dedicated docs | [Create playground](after-create-docs.png), [API](after-create-api.png), [overview playground](after-overview-docs.png), [empty](after-overview-empty-docs.png) | Code export exposes canonical import; docs open; empty/showCreate switches work. Callbacks deliberately omitted by existing source serializer and connected in documented usage. |
| Changelog entry | [Before](before-changelog.png) | [Page](after-changelog.png), [entry](after-changelog-entry.png) | Same existing release-entry composition; final capture added with actual PR number. |
| Creation hover | No old component/motion; source frames retained | [Actual page recording](hover-review.mp4), [computed states](motion-checks.json) | 1440×1000, 24.44s. Native recording blocked by extension activeTab permission; captured through same Playwriter CDP connection. Original 112 timestamped browser JPEG frames retained in `motion-frames.json.xz`; MP4 uses original intervals, no acceleration. |

## Consistency review — six lenses

| Lens | Shared owner and comparison | Outcome / evidence |
| --- | --- | --- |
| Entry behavior | App route registry, site metadata, docs Sidebar and existing Project Workspace | Added through canonical registries. Template uses local state and explicitly labels reset behavior. Peer screenshot and missing-route baseline retained. |
| Loading | Existing local fixture templates | No asynchronous load added, so no simulated loading UI. Network loading/error states not applicable. |
| Empty states | `AgentWorkspaceState` from automation; Kanban empty columns | Reused canonical workspace empty/recovery action. Component-only columns use simple noninteractive “Nothing here yet.” Copy and action distinguish query filters from empty category. |
| Actions | Existing Button/IconButton, Base UI Dialog, KanbanBoard | Canonical controls, labeled icon buttons, focus trapping/Escape/return focus, save validation. Native select is the same lightweight fixture control role. Primary creation and tertiary archive have distinct hierarchy. |
| Titled scroll surfaces | ProjectSummary and KanbanBoard; actual existing workspace | Overview is a labeled keyboard-focusable horizontal region on mobile; columns remain titled. Dialog body scrolls with header/footer in place. Grid becomes one column. |
| Icon/color inheritance | Icon abstraction, Tag/Avatar/StepProgress and CSS tokens | Existing semantic surfaces/text/borders and palette tokens; dark samples inspected. Scoped composition styling only; no shared-owner changes or unrelated consumers modified. |

This is a web-template consistency check against actual Oreo peer surfaces, not a cross-platform audit. Source art uses local illustration geometry (tilt, 3px translation, miniature dimensions) where no semantic layout token exists; project surfaces, typography and spacing otherwise follow Oreo conventions.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No ProjectCreateCard in Oreo; source shows hovering creation entry | Decorative floating card rests at −7°, fine-pointer button hover moves −3px and rotates to −3° | Small action affordance, never looping or moving readable content. |
| No transition | Transform-only 180ms enter, 120ms return, 100ms press with ease-out cubic-bezier(.23,1,.32,1) | Frequent interaction responds quickly; CSS retargeting handles interruption. No height/width/left/top animation. |
| No reduced-motion variant | `prefers-reduced-motion: reduce` disables transition and hover transform | Browser computed state verified 0s and unchanged rest transform; creation/Escape still work. |
| Existing shared Button and Kanban motion | New creation/action buttons use `tapScale=1`; canonical Kanban drag implementation unchanged | Keyboard activation does not introduce new press animation; no task-scoped rewrite of shared drag springs. |

**Verdict: Approve** for newly introduced motion. Hover enter, return/re-entry and reduced-motion create/Escape captured. Decoded MP4 frame and original screenshots inspected. No claim of exhaustive shared Kanban spring review, physical touch testing or recorded keyboard-drag timing; keyboard drag functional evidence is in browser snapshots.

## Focused checks

- `npm run build`: passes TypeScript and Vite; existing large-chunk warning retained in build logs.
- `node --experimental-strip-types docs/reviews/project-board-20261015/adapter-check.mjs`: preserves filtered-out projects, incoming visible order, completion invariant, owner reassignment and inline creation defaults. [Output](adapter-check.log).
- [Browser observations](browser-checks.jsonl): creation, invalid name, filters, view synchronization, keyboard movement, completed-stage task normalization, archive/undo, unsaved-draft recovery, mobile editor, theme, activity and motion. No uncaught application errors observed in focused scenarios. The older Changelog tab retained connection/HMR errors from preview restarts; a fresh navigation is clean in `changelog-check.json`.
- `git diff --check`: clean. Review reads all new source and task-scoped registry changes. No unrelated primary-checkout files staged.

Missing mobile baseline, new-state before media and native recording permissions are evidence limits, not delivery gates. No historical images overwritten. `after-overview-initial.png` is retained as the earlier review capture; `after-overview-final.png` is the default-state delivery capture.
