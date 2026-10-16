# Writing Folders — review record

Reference: https://x.com/goutham/status/2110710268540117089 — Folders empty state for writer.so. Actual source image inspected in native browser: [reference](reference.png). Light left rail, Folders heading, search and list/grid controls, table header, faded illustrative rows, centered folder icon / two-level empty copy / New Folder action. The illustration is a deliberate empty-state background, not evidence of a loading state. Sidebar folder examples conflict with an empty main list; our fixture starts with no folders and four unfiled documents so the counts remain coherent.

Baseline: `4f9ff6ac4fcd624baf2ddc7f85262a687120fe2e`. New route `/writing-folders` falls back to Button home. Local fixture at http://localhost:5252, Chromium / Playwriter, en-US, desktop 1440×1000. Primary checkout's unrelated WIP is untouched.

## Before-edit comparison map

| Lens | Peer / canonical owner | Decision / evidence |
| --- | --- | --- |
| Entry | DocumentWorkspace and WritingStudio | Reuse document navigation and local editing; Base UI Dialog from newer templates provides consistent escape/focus. Source inspected, document runtime capture in this package. |
| Loading | CompanyTable / MemberPerformanceTable | Separate content-shaped initial skeleton from decorative empty backdrop. Existing data stays visible when refreshing. |
| Empty | DocumentEmpty in document-activity | Reuse its centered folder icon/title/description/secondary action. Add optional actionLabel with existing Clear filters default unchanged, then compose FolderEmptyState around it. Existing DocumentWorkspace empty consumers remain unchanged. |
| Actions | Button/IconButton, DocumentEmpty | Both creation entries use existing button roles, matching primary New folder toolbar and secondary contextual empty-state action. No purple brand override. |
| Titled scrolling | DocumentWorkspace / MemberPerformanceTable | Opaque header above a bounded, positioned table scroll region; modal body scrolls between fixed opaque header/footer. |
| Icons/color | Icon, Tag, Avatar, tokens | Neutral operations, meaningful private/workspace labels; visibility is local sample metadata, not real sharing permissions. |

New components: FolderEmptyState (decorative fading rows + canonical DocumentEmpty) and FolderCollection (list/grid folder browsing, counts, visibility and host-owned actions). No equivalent collection in document-activity, which models an event timeline; WritingStudio is a rich text surface, not a folder organizer. Template adds folder creation/rename/delete with document recovery and undo, document creation/edit/move, search, visibility filter, sort and local JSON export. Empty is the default. No real cloud writes or sharing.

## Implementation and verification

- `FolderEmptyState` composes the shared `DocumentEmpty` with five static, aria-hidden rows. 68px illustrative rows fade vertically; desktop empty region 440px and mobile 380px. The 248px writing rail and 520px bounded editor are composition dimensions, rather than new global tokens. Colors, typography, spacing and radii use Oreo tokens; the reference purple is mapped to the canonical primary button.
- `FolderCollection` renders a controlled list/grid, derived counts, UTC dates and optional host actions. Loading uses visible border-subtle skeleton bars; refresh keeps existing rows. Error and no-match recovery reuse AgentWorkspaceState and DocumentEmpty. Table headers are opaque and the table scroll region is positioned and keyboard-focusable.
- `WritingFoldersPage` starts with zero folders and four unfiled documents. Folder creation, normalized/case-insensitive uniqueness, rename, search, visibility filter, sort, list/grid, document creation/edit/move, delete confirmation, document-preserving removal, undo and full JSON export are connected. Edits are local and reset on reload; visibility has no security semantics.
- Shared DocumentEmpty only gains optional `actionLabel`, defaulting to the previous Clear filters. Both activity and files consumers were inspected; the Activity empty/recovery state was exercised in the existing DocumentWorkspace. Files empty runtime capture is a coverage gap.
- `npm run build` and `node scripts/writing-folders/check.mjs` passed. The build retains the existing large-bundle advisory. Model checks cover duplicate normalization, invalid names/documents, unknown folder prevention, counts, movement, deletion conservation and immutable undo snapshots.
- Browser checks: new folder through contextual CTA; duplicate validation and recovery; workspace/private filtering; renamed folder updates navigation; a document moved from Unorganized to Studio letters changed counts 4→3 and 0→1; delete moved it back; undo restored the folder and membership. Mobile created a document inside a folder. Download event fired and actual Downloads JSON was parsed: one folder, five documents, expected title/body and matching folder ID. Original exported fixture is retained.
- Error Try again restored existing data; Clear filters restored results; loading with rows retained them. Escape returned focus to the rename button. Mobile HTML width stayed 390px; the table alone scrolled 543px content within 356px. Folder Collection playground grid selection and row callback worked; documentation navigation and API rendered. Folder Empty State action was exercised separately.

## Capture map

Desktop screenshots use 1440×1000, mobile uses 390×844 (full-page images retain their actual content height). Local fixture, en-US; no real account or production claims.

| Scenario | Before | After / result |
| --- | --- | --- |
| Route entry, light | [previous missing route → Button home](before-entry.png) | [final writing empty state](after-empty-final.png) |
| Shared DocumentEmpty, dark / query missing-folder-proof | [before](before-peer-empty.png) | [after](after-peer-empty.png); Clear filters restores activity |
| Peer context | [DocumentWorkspace](peer-document.png) | Preserved canonical action and empty-state roles |
| Populated folder list | New state; no prior folder template | [list](after-list.png); final shell colors use elevated token |
| Grid and deletion undo | New state | [settled dark grid after undo](after-grid-dark-settled.png), [confirmation](after-delete-confirm.png), [deleted](after-deleted.png) |
| Duplicate recovery / document organization | New states | [validation](after-validation.png), [document editor](after-document-editor.png) |
| Filter empty / error recovery | New states | [no matches](after-no-results.png), [error](after-error.png) |
| Initial loading | New state | [final visible skeleton](after-loading-final.png); preview ready restores empty view |
| Mobile | No pre-change mobile route capture; desktop missing-route baseline retained | [empty](after-mobile-empty.png), [list](after-mobile-list.png), [editor](after-mobile-editor.png), [final grid](after-mobile-grid-final.png) |
| Component catalog/playground | Previously absent; missing route baseline above | [collection playground](after-docs.png); shared documentation shell retained |
| Changelog | [before update](before-changelog.png) | Follow-up capture recorded with the actual PR entry |

Historical correction captures are retained: after-empty.png has stacked button icons and inherited CTA color, fixed by Button.leadingIcon and a narrower description selector; after-empty-fixed.png precedes the final elevated rail/header. after-grid-dark.png was captured mid theme-color transition; after-grid-dark-settled.png is the settled replacement. after-mobile-loading.png exposed invisible white-on-white skeletons, replaced by after-loading-final.png. after-loading-fixed.png and after-mobile-grid.png precede the final elevated-shell token correction. Mobile empty document description now wraps rather than inheriting document-row truncation; the initial editor screenshot retains the old background description. No historical original was overwritten.

## Evidence limits

Recording attempt failed: “Extension has not been invoked for the current page (see activeTab permission).” Enabling recording requires clicking the Playwriter extension icon on this task's tab. No MP4 was produced. Interactive behavior was exercised and state captures inspected; timing/motion evidence remains incomplete. No new authored animation is part of this template. Missing mobile baseline and uncaptured same-role Files empty state are explicitly separate from implementation/merge status. No cloud persistence, permissions, or production deployment was tested.
