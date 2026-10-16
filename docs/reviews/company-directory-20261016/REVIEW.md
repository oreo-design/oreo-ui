# Company Directory — review record

Reference: https://x.com/eliakuratli/status/2110823532917862573. Static Arc CRM companies table; company marks, stage, ARR, employees, owner, last interaction, mine/hot views, favorites and filtered sum. Metadata and actual browser image inspected. No video was attached; unseen CRM screens are not inferred from the caption.

Baseline: ac1c5b5726f050bf12f4f00c2f992b397042abba. New /company-directory currently redirects to Button home (before-entry.png). Local fixture, en-US; desktop 1440×1000. No prior company-directory state exists.

## Before-edit comparison map

- Company table → src/components/sales/DealTable (peer-sales.png and live table markup); retain semantic table, scroll region, neutral dividers, numerical alignment, shared empty state. New company identity/owner/ARR/employee fields justify a separate composition rather than altering sales Deal schema.
- Stage → DealStageBadge/Tag. Reuse canonical DealStageBadge for overlapping stages, compose Proposal/Demo labels with the same Tag primitive. Do not change existing sales stage semantics.
- Identity → Avatar, uses local initials and optional caller-owned marks; no third-party logo dependency. Sample companies fictional, same sales workspace names where applicable.
- Actions/navigation/detail → existing project-feed Button/IconButton/Base UI Dialog; same secondary export, primary add, local edit form, focus return, inline compact navigation. Source-only detail comparison initially; post-change interaction verification pending.
- Empty/error/loading → AgentWorkspaceState and content-shaped static skeleton. Refresh keeps rows; no custom timed animation.
- Reference-specific density: 48px rows instead of DealTable's larger sales progress rows, company-first sticky column and opaque sticky heading/footer in the bounded table. This is an account directory, with more records than the sales dashboard.

## Six lenses

| Lens | Owner/peer | Status before implementation |
| --- | --- | --- |
| Entry | Docs routing, project-feed and sales workspace | Baseline captured; new route pending |
| Loading | Static shaped skeleton, project activity precedent | Source checked; browser pending |
| Empty | AgentWorkspaceState shared owner | Source checked; browser pending |
| Actions | Button/IconButton and sales export/edit | Peer rendered; final behavior pending |
| Titled scroll | DealTable/ProjectFeed dialog | Opaque table headers and dialog boundaries planned; final scroll pending |
| Icons/color | Icon currentColor, Tag/Avatar semantic palettes | Reference and peer inspected; both themes pending |

Implementation and evidence are tracked separately. This fixture is not a connected CRM or production deployment. No outbound messages or live account changes.

## Delivered implementation

Implementation source: b0688f563ae286622603a93bc025cd6e7db82298. PR: https://github.com/oreo-design/oreo-ui/pull/75. The following evidence-only/changelog commit records these captures; exact reviewed delivery SHA is available from the PR history.

- CompanyIdentity: 24px square mark, readable name, optional secondary domain and text-labelled Hot tag; caller can supply a decorative mark.
- CompanyTable: 48px minimum rows, 44px heading, a 224px minimum sticky identity column (180px on phones), right-aligned tabular amounts, controlled sorting, optional open/favorite callbacks, shared empty/error states, initial skeleton and refresh preservation. Table and date semantics remain accessible.
- Company Directory: 23 fictional sample accounts with .example domains, All/My/Hot/Favorites scopes, search/stage/owner combinations, add/edit side panel, exact decimal-to-cents validation, duplicate-domain check, one-level undo and filtered CSV export. Uses canonical Tag-based stages rather than copying the reference's brand/status colors.
- Routes: /company-directory, /company-table and /company-identity. Existing docs shell, playground registry and sidebar are reused. No production deployment or external CRM mutation.

## Evidence map

| Scenario | Before / comparison | Final result |
| --- | --- | --- |
| New route entry, desktop light | [before-entry.png](before-entry.png): actual missing-route redirect to Button | [after-final-light.png](after-final-light.png) |
| Desktop dark | New route had no equivalent state; Sales Workspace rendered peer [peer-sales-table-settled.png](peer-sales-table-settled.png) | [after-final-dark.png](after-final-dark.png) |
| Tablet 768×1024, both themes | New template, no prior page | [light](after-tablet-light.png), [dark](after-tablet-dark.png) |
| Phone 390×844, both themes | New template, no prior page | [light](after-mobile-light-verified.png), [dark](after-mobile-dark-verified.png) |
| Compact inline navigation | ProjectFeed source composition | [after-mobile-nav.png](after-mobile-nav.png); view selection restores heading focus; Escape dismissal checked |
| Filters + real download | New behavior | [after-filtered.png](after-filtered.png), [export-filtered.csv](export-filtered.csv): Negotiation + Sofia returns Vertex Health only, $340,000 |
| Add + undo | New behavior | [after-added.png](after-added.png): Summit Research, $2,500.25, 24 companies; undo restored 23 and $3,286,000 |
| Error form + recovery | Existing Base UI Dialog composition | [after-validation.png](after-validation.png), [after-short-dialog-error.png](after-short-dialog-error.png). Invalid decimal rejected; $123.45 saved and undo restored $186,000. Short viewport 390×600 scrolls to focused error. |
| Empty + recovery | AgentWorkspaceState shared owner | [after-empty-v2.png](after-empty-v2.png); Clear filters restores 23 |
| Load/error + recovery | AgentWorkspaceState / static row skeleton | [after-loading.png](after-loading.png), [after-error.png](after-error.png); retry restores records |
| Horizontal/vertical table scroll | Reference's bounded table | [after-mobile-horizontal-settled.png](after-mobile-horizontal-settled.png), [after-mobile-table-end.png](after-mobile-table-end.png): pinned company, opaque heading and sum |
| Detail panel | ProjectFeed dialog source comparison | [after-mobile-details.png](after-mobile-details.png), [after-short-dialog-error.png](after-short-dialog-error.png); title/footer stay opaque, focus returns to row |
| Component docs + playground | Existing docs shell, new component pages absent | [table playground](after-table-playground.png), [table docs](after-table-docs.png), [identity playground](after-identity-docs.png) |
| Changelog | [before-changelog.png](before-changelog.png), captured before entry added (sidebar already includes new routes) | [after-changelog.png](after-changelog.png) |

### Final consistency pass

| Lens | Result / scope |
| --- | --- |
| Entry | Checked: docs route/playground and table-name / favorite-sidebar entry use the same detail form. Base UI closes and returns focus; removed favorite and undo return to heading. ProjectFeed owner comparison remains source-only, not a claimed cross-product runtime check. |
| Loading | Checked initial shaped rows and recovery; populated refresh is preserved by component implementation, not separately simulated in the template. |
| Empty | Checked shared centered AgentWorkspaceState with distinct no-results and error copy. |
| Actions | Checked against rendered Sales Workspace export/edit and shared Button/IconButton. Corrected leading icons to the canonical leadingIcon slot. |
| Titled scrolling | Checked at table top/end/horizontal scroll and a 390×600 dialog. Opaque boundaries protect header/footer. No decorative fade needed. |
| Icons/color | Checked light/dark. Stages reuse DealStageBadge/Tag palettes; ordinary star/sort/menu icons inherit neutral labels. Brand glyph is the only permanent accent. |

Reference comparison: retained dense company-first table, list scopes, favorites, owners, employees, stages and summary. Replaced third-party logos and photos with local initials. Exact relative contact times were not available as source data, so sample UTC contact dates are explicit rather than invented live recency.

## Validation and limits

`npm run build` passed (existing large-bundle warning). `node scripts/company-directory/check.mjs` passed combined filters, stable sort/immutability, exact cents and amount limits, invalid domain/date/stage/owner, blank name, note length, and CSV formula/quote escaping. Native downloaded CSV inspected, one filtered company, exact amount. Browser checked sort ordering, add/edit/undo, favorites counts/removal, empty/error recovery, focus return and responsive/theme states. Final page logs contain no new runtime errors.

Development-only issues: the first layout exposed a `cd-*` collision with Command Dashboard, fixed by task-owned `cdir-*`; initial captures are retained. Vite route/HMR edits briefly produced stale module/connection and invalid-hook logs; a clean reload recovered. Two queued Playwriter calls timed out during HMR and later changed the viewport/navigation; final 390×844 captures were repeated after checking the actual state. These intermediate captures are not final proof.

Recording gap: Playwriter recording.start failed with “Extension has not been invoked for the current page (activeTab permission).” Clicking the Playwriter extension icon on the preview tab enables later recording. There is no video artifact. Scroll/navigation were exercised and stills inspected; stills do not prove timing. No custom timed animation was added, and missing recording does not block authorized integration.

Superseded originals: after-initial.png (CSS collision); after-light.png / after-validation.png / after-filtered.png (pre-final icon/copy or focus polish; behavior still evidenced); after-empty.png (HMR reset, not a valid empty capture); after-mobile-light.png / after-mobile-dark.png (before wider filter selects); after-mobile-light-final.png / after-mobile-dark-final.png (390×600 / queued navigation, not final 844px results); after-mobile-table-scroll.png and peer-sales-table.png (captured before scroll settled). Use the explicit final links above. after-mobile-details-scroll.png has no overflow at 844px, so use the 600px error capture to inspect scrolling.
