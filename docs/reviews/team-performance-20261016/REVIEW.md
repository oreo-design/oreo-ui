# Team Performance — review record

Source: https://x.com/vektorastudio/status/2110661960425787787 — Vektora Studio, Karva Team Performance Management Dashboard. Actual image inspected in native browser: [reference](reference.png). A white application shell with left navigation, four summary cards, a green/orange/red ticked review bar and a dense member table with score rings, deltas, departments, review dates and pagination. The desktop wallpaper and dock are presentation framing, not product UI. Reference figures are not internally consistent; the template derives all counts from its fixture records instead of copying those totals.

Baseline: `4019659e37d821ddfa58521c7ce9e61bf7082fc7`; local preview http://localhost:5251. New `/team-performance` route falls back to Button home: [before](before-entry.png). Chromium / Playwriter, en-US, light, 1440×1000. Primary checkout contains unrelated work and is untouched.

## Pre-edit comparison map

| Lens | Peer / shared owner | Reuse / difference | Evidence |
| --- | --- | --- | --- |
| Entry | CompanyDirectory + Base UI Dialog | Member name opens a controlled edit/review dialog, Escape and focus return. Native filters follow existing directory. | `src/patterns/company-directory`, [rendered peer](peer-company.png) |
| Loading | CompanyTable | Same content-shaped table skeleton, no invented spinner overlay. | Source inspected; runtime coverage pending |
| Empty/error | AgentWorkspaceState in CompanyTable | Reuse centered recovery in table region. | Source inspected; runtime coverage pending |
| Actions | Button/IconButton, WorkspaceMetric | Reuse primary export, secondary edit/save, metric-card composition; no new KPI primitive. | Company directory runtime and command-search source |
| Titled scrolling | CompanyTable sticky opaque heading, bounded table region | Reuse protected table headings; first identity column remains visible on narrow screens. | Source + rendered peer |
| Icons/color | Icon, Avatar, Tag, semantic status palette | Neutral operation icons, status colors only for scores/review categories, deltas include arrows/text. | Source + reference |

HealthMeters (`src/components/operations/index.tsx`) is a single-value health meter. ReviewProgress needs multiple exclusive categories and exact counts, justifying a new segmented composition. ModelUsageRing displays resource shares; PerformanceScore needs a labeled score out of 100 with quality thresholds and unavailable handling. MemberPerformanceTable adds review-specific columns; generic account table remains unchanged. Existing palette, radius, typography and spacing tokens remain authoritative. New template shell follows the directory's 224px rail, responsive main area and existing metric cards. No external media assets copied into product UI.

## Verification / delivery

Implementation and after-evidence pending. New component states have no prior equivalent route; baseline gaps will stay explicit. Static reference supplies no transition timing; no custom animation planned. Fixture edits do not affect actual employees or HR systems.

## Implemented result and evidence

Three reusable components: PerformanceScore, ReviewProgress and MemberPerformanceTable. The Team Performance template composes existing WorkspaceMetric, Button/IconButton, Avatar, Tag, AgentWorkspaceState and Base UI Dialog. Month, department and name filters scope metrics; review state narrows the table only. Editing validates scores/goals/notes, recalculates summaries and progress, keeps each month's data independent, and supports one-step undo. CSV includes all filtered members, not just the current seven-row page.

| Scenario | Before / peer | After / result |
| --- | --- | --- |
| New route | [Missing route](before-entry.png) | [Initial desktop viewport](after-desktop-light-ready.png), [complete final page](after-desktop-final.png) |
| Reference composition | [Reference](reference.png), [Company directory](peer-company.png) | Four reused metric cards, segmented progress and dense table retain the requested hierarchy in Oreo tokens |
| Dark / medium / narrow | No prior template | [Corrected tablet dark](after-tablet-dark.png), [mobile light final](after-mobile-light-fixed.png), [mobile dark viewport](after-mobile-dark-viewport.png) |
| Filter / edit / totals | New local interaction | [Review dialog](after-review.png), [validation](after-validation.png), [saved review](after-saved.png), [filtered export](after-filtered-export.png) |
| Empty / loading / error | New table states; CompanyTable source peer | [No search results](after-empty-dark.png), [loading mobile](after-loading-mobile.png), [error mobile](after-error-mobile.png); retry restored real rows |
| Mobile scrolling / focus | CompanyTable sticky-header source pattern | [Table scrolled to end](after-mobile-table-end.png), [mobile dialog](after-mobile-dialog.png). Escape returned to Olivia's row button; captured focus ring confirms return |
| Docs / playground | New component routes, no separate baseline | [Table playground](after-table-playground.png), [progress playground](after-progress-playground.png), [API docs](after-docs.png) |
| CSV | No prior export | [Actual downloaded Engineering CSV](export-engineering.csv), parsed: three rows, Ivan score 84.5, Completed, Sep 30 sample review date |
| Changelog | [Before](before-changelog.png) | Pending PR-number entry |

All captures use actual local React fixtures in Chromium/Playwriter, en-US; 1440×1000 desktop, 1024×900 tablet, 390×844 mobile. Full-page images retain that viewport's layout but extend vertically. Desktop dark/tablet captures include the edited Ivan fixture; final desktop/mobile light are fresh initial records.

Historical captures retained: `after-desktop-light.png` captured the route fallback during development before returning to the new route, superseded by `after-desktop-light-ready.png` and `after-desktop-final.png`. `after-mobile-light.png` shows a real 595px document overflow at a 390px viewport. Inspecting the hidden table caption and setting the scroll region's position to relative reduced document width to 390px; the source fix is in MemberPerformanceTable's stylesheet. `after-mobile-light-fixed.png` supersedes it. `after-desktop-dark.png` showed low-contrast mint marks/deltas; standalone dark marks now use existing bright palette background tokens while filled Tag colors are unchanged. Corrected marks appear in tablet/mobile captures. No peer component was edited.

## Final consistency pass

- Entry: checked source + actual directory and new template. Name buttons open a Base UI dialog; native selects/search retain focus semantics. Mobile Escape returns focus to the originating row. If saving removes the row from the active filter, focus falls back to the page heading.
- Loading: checked the new table skeleton and CompanyTable's source pattern. Seven static row shapes preserve table ownership. Runtime peer loading was not separately captured.
- Empty/error: checked actual new empty/error/retry states; shared AgentWorkspaceState remains centered inside the member region. No false success during error; preview error retains prior data for retry.
- Actions: checked runtime + shared owners. Export, Save, Cancel, pagination and undo reuse Button roles. Native legend buttons expose pressed state; metrics contain no invented actions.
- Titled scrolling: checked mobile table at horizontal end and modal. Opaque table headings and fixed identity cells protect labels; dialog body scrolls between opaque header/footer. No redundant fade. Seven-row pagination does not require long vertical table scrolling in this fixture; larger caller datasets use the bounded table region.
- Icons/color: checked both themes. Operation icons stay neutral; score/delta/review colors communicate status with readable text. The standalone mint contrast correction is component-owned and applies to its template and playground consumers.

## Verification and limits

- `node scripts/team-performance/check.mjs` passed: threshold boundaries, invalid scores, summary denominators, exclusive review counts, filtering/sorting without source mutation, edit validation and CSV escaping.
- `npm run build` passed after final component CSS fixes (TypeScript and production bundle). Existing >500 kB bundle warning and Node deprecation remain.
- Browser: second-page navigation, review legend filter, invalid score rejection, valid save, recalculated 84.0 average / 58% completion, month switching and retained September edits, Engineering scope (82.5 average / 67% completion), actual CSV download, undo restoring 84.5, empty results and recovery, loading/error/retry, mobile horizontal scrolling, modal Escape/focus, light/dark, medium-width layout, docs and playground routes.
- Initial Vite/HMR import updates briefly produced an invalid-hook error and stale connection logs. Fresh reloads and subsequent mobile interactions had no new errors. Final document width was measured as 390px with no horizontal page overflow; the table alone scrolls horizontally.
- Recording attempt blocked by `Extension has not been invoked for the current page (activeTab permission)`. No recording was produced. To enable a future recording, click Playwriter's extension icon on the local task tab once. Screenshots do not prove motion/timing. No custom animation was added.
- No real employee records, HR integration, live messages, assistive-technology test, physical-device test or production-deployment claim. Edits are browser-local and reset on reload.
