# Workflow directory — Jubayer reference

Reference: https://x.com/jubayer6910/status/2111721342316020098 . Four actual static images: filter, sort, row submenu, bulk selection. Inspected in Chrome via Playwriter; no source motion is supplied. Baseline: b89172c92fbd2f4043f8b988dd2dfad18bbd2c09. Isolated task checkout preserves original dirty work. Local preview: localhost:5183, Chrome, English, fixture data.

## Pre-edit grounding

| Target | Verified peer | Owner / reuse decision | Difference |
|---|---|---|---|
| Dense workflow table | Company Directory (`src/components/company`, peer-company.png) | Semantic table, bounded horizontal/vertical scroll, opaque sticky header, Avatar, shared empty/error state | Workflow-specific columns, selection and run metrics require a new table composition |
| Sort and row actions | Menu playground (`src/components/menu`, peer-menu.png) | Canonical Menu / MenuItem / MenuSubmenu, overlay elevation and motion | Controlled field/direction selection and caller-defined action groups |
| Draft filters | MultiSelectMenu source; presence Popover source | Base UI Popover for form semantics, Menu styling tokens; native labeled checkboxes/select | Apply/cancel draft form cannot be represented as immediate menu selection. Source-only comparison for form popover |
| Bulk actions | Reference bulk state; company selection has no same-role bar | Canonical Button/IconButton/Menu, same destructive color inheritance | Smallest new selection toolbar, caller-owned IDs; explicit select all matching |
| Page controls and states | Rendered Company Directory | Oreo tokens, Button variants, AgentWorkspaceState | Compact top navigation instead of CRM sidebar; source emphasizes table not CRM navigation |

Reference already supplies concrete external examples for all four new interactions. Keep its information hierarchy, grouped filter sections, selected row tint and floating bulk actions. Use Oreo's neutral primary button, radius/spacing/palette rather than copying source blue gradient or brand logos. Connectors use named neutral monograms. Reference counts are not real data.

## Baseline and peers

New route did not exist and redirected to Button. There is no previous workflow list or corresponding pre-change interaction.

![Before — new route fell back to Button](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/before-entry.png)
![Existing Company Directory](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/peer-company.png)
![Existing Menu](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/peer-menu.png)

## Capture scope

Capture full template, draft/apply filters, sorting, nested row menu, selection toolbar, archive/undo, no matches and error/retry; narrow/medium/wide light and dark; documentation/playground exports. Record new interaction sequence, with no fabricated source motion. All actions affect only local sample data. Original browser includes unrelated wallet/session extension errors, seen on the baseline too.

## Review lenses — initial

Entry: existing anchored Menu handles focus/return; verify new Popover separately. Loading: reuse content-shaped table skeleton. Empty/error: AgentWorkspaceState. Actions: shared Button and Menu. Titled scroll: opaque table headers; popup header/footer protect scrolling filter sections. Icons/color: currentColor, semantic destructive states. Final runtime results below when captured.

## Implemented result and matched baseline

Seven components: DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar, WorkflowStatusBadge, WorkflowRunBars, WorkflowTable. The complete Workflow Directory uses those components for local creation/edit, duplication, folder moves, pause, archive/restore, undo, pagination and CSV export. Filters OR within one group and AND between groups. Search/filter/view/folder changes clear selection; pagination keeps it. Bulk actions intersect selected IDs with matching results.

| Before — route missing, 1440×1000 | After — complete new entry, 1440×1000 |
|---|---|
| ![Before](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/before-entry.png) | ![After](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-final.png) |

![Full template after implementation](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-final-full.png)

## Source interaction mapping

Reference images are supplied examples, not pre-change Oreo pages. No prior corresponding flow existed. Reference blue gradients/brand marks are replaced by Oreo primary controls and named connector monograms. The directory needs no decorative card/list toggle or inactive import control. Open workflow edits name/owner; execution is not connected, and history honestly shows only the current fixture revision.

| Source | Implemented |
|---|---|
| ![Reference — Draft filters](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/reference-filter.png) | ![After — Draft filters](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-filter-draft.png) |
| ![Reference — Field and direction sort](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/reference-sort.png) | ![After — Field and direction sort](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-sort.png) |
| ![Reference — Nested row action](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/reference-row-menu.png) | ![After — Nested row action](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-row-submenu-r2.png) |
| ![Reference — Selected rows and bulk toolbar](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/reference-bulk.png) | ![After — Selected rows and bulk toolbar](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-bulk-r2.png) |

## Runtime states

No pre-change equivalents exist for these new states.

### Applied filter

![Applied filter](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-filter-applied.png)

### No matches and clear filters

![No matches and clear filters](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-empty.png)

### Content-shaped loading

![Content-shaped loading](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-loading.png)

### Error and retry

![Error and retry](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-error.png)

### Create validation

![Create validation](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-form-error.png)

### Archive with undo

![Archive with undo](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-archive.png)

## Responsive and theme review

Narrow and medium screens keep all table columns inside a named, keyboard-focusable scroll region. Body width was checked at 390px with no horizontal page overflow. Filter header/footer stay outside the scrolling form.

### 390×844

| Light | Dark |
|---|---|
| ![Light](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-mobile-light.png) | ![Dark](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-mobile-dark-r2.png) |

### 768×1024

| Light | Dark |
|---|---|
| ![Light](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-tablet-light.png) | ![Dark](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-tablet-dark.png) |

![Narrow dark filter](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-mobile-filter-dark-r2.png)

![Narrow dark bulk actions](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-mobile-bulk-dark-r2.png)

![Desktop dark nested menus](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-submenu-dark.png)

## Final consistency review

| Lens | Result | Evidence / bounded conclusion |
|---|---|---|
| Entry behavior | checked | Filters draft/apply/Escape, Menu nested move, create/edit dialog, keyboard Enter after dismissal verified focus return. Compared to rendered canonical Menu; new form popover compared to source-owned Base UI pattern. |
| Loading | checked | Table-shaped skeleton, timer cleanup; demo error→retry→rows verified. No claim of network loading. |
| Empty states | checked | Actual no-match result uses the same AgentWorkspaceState as CompanyTable; error remains distinct with Try again. |
| Actions | checked | Shared Button/IconButton/Menu. Destructive item icons inherit error text. Header checkbox handles mixed state and visible-page toggles; bulk all-matching selection tested across both pages. |
| Titled scrolling | checked | Opaque sticky table header and bounded horizontal scroll; popover header/footer separate from scrolling content. No redundant gradient overlay. |
| Icons/color | checked in this family | Neutral operations, currentColor menu glyphs, Tag palette statuses; native checkbox color-scheme now follows local theme. Success text mixes semantic success with foreground for legibility; absent metrics are neutral. |

Second pass also compared the existing BalanceSparkBars source. Its latest-value emphasis is a different financial role; WorkflowRunBars consistently colors the seven-day throughput series and presents a count. This is a source-only peer comparison. Original new skeleton row styling follows CompanyTable's composed geometry; no global components were changed.

Corrections retained in the evidence history: first submenu screenshot caught entrance opacity and is superseded by after-row-submenu-r2.png; initial dark native controls and mobile close-button wrapping are superseded by after-mobile-*-r2.png. Earlier screenshots remain intact. Tablet/wide originals predate the native checkbox color-scheme correction; the final narrow captures verify that family-level correction.

## Interaction recording

Native extension recording failed because this task-created tab lacked activeTab capture permission. Playwriter's local CDP screencast captured the actual rendered browser instead. An initial attempt was interrupted by a preview reload; those frames remain in interaction-frames/ as superseded. The completed original is interaction-original.mp4. Final interaction-clean.mp4 is 1440×1232, 30fps, 8.07s; only the top 128px containing toolbar/header are cropped. No generated states or timing changes. interaction.mp4 is a superseded crop retaining a toolbar shadow. Raw frame/timing folders are retained locally and ignored for repository size; encoded original is committed.

![Filter, apply, sort, nested move, selection, archive and undo](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/interaction-clean.mp4)

![Inspected recording contact sheet; final empty tile is beyond duration](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/interaction-contact-sheet-r2.jpg)

## Documentation and checks

All seven playground routes rendered, Preview/Code toggles exposed the expected public component imports, and the API documentation was opened. The component previews below use the actual library components.

![data-filter-popover](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-data-filter-popover.png)

![data-sort-menu](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-data-sort-menu.png)

![row-action-menu](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-row-action-menu.png)

![bulk-action-bar](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-bulk-action-bar.png)

![workflow-status-badge](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-workflow-status-badge.png)

![workflow-run-bars](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-workflow-run-bars.png)

![workflow-table](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/docs-workflow-table.png)

- TypeScript and Vite production build passed. The repository's existing large-bundle warning remains.
- Four focused model tests passed: grouped filtering/archive scope, numeric/null sorting, cross-page selection, CSV escaping/formula safety. See model-tests.txt.
- Browser passed: draft cancel/apply, field/direction sort, nested folder move and undo, cross-page selection/deselection, scoped archive/undo, create validation, duplicate, edit, selected CSV export, search clears selection, empty state, error/retry, Escape/Enter focus return, reduced-motion transition 0s.
- Download saveAs hit a local Playwriter artifact-path error. The real downloaded oreo-workflows.csv was found in Downloads and copied into this evidence directory; its single selected row was inspected.
- Chrome emits pre-existing wallet/session extension errors on reference, baseline and new routes. This was not a clean-profile run. Desktop viewport simulation does not prove physical mobile behavior. No production serving, real workflow execution, external integration or persistence is claimed.

Implementation source hashes and environment are in manifest.json. Exact commit review, PR and remote main result are recorded during delivery below.

## Source review and integration

Reviewed implementation commit: `3a23dd6bcb9ed345314975aa0209fbf7650c70ff` on main baseline `b99f9068e7bfb494ae17aad8d5e4b9e86b3f13b8` (spacing pages). Rebase conflicts were additive imports/routes in App.tsx and site.ts; both sets were retained. Only those integration files plus the sidebar differ from captured source hashes; new component/template source is unchanged. Rebased TypeScript/build passed. The final browser pass verified pause/resume, fixture test failure, current-version dialog, restore/undo, and fresh entry.

![After rebasing onto current main](/Users/ziye/Documents/Project/Research/oreo-ui-jubayer-20261019/docs/reviews/jubayer-table-20261019/after-rebased.png)

The exported CSV preserves real CRLF bytes, with a scoped Git whitespace attribute. This documentation-only record does not alter UI behavior. [PR #103](https://github.com/oreo-design/oreo-ui/pull/103) tracks delivery and its final merge revision. Exact pushed head `e2959a895ea8f5d832a70a9d7c3947c8c75fe4ca` was reviewed: task-only files, source hashes match, clean mergeability, no remote status checks reported. This final link update changes only the review record.
