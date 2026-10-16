# Agent Observatory review

Reference: [Adeeb's dashboard](https://x.com/adeebrq/status/2110891362103267793), inspected via the linked [live demo](https://overseer-dashboard-psi.vercel.app/). The Overview is implemented in the reference; Agents and View details lead to Coming soon. Captures retain this distinction. No live reference data was changed.

Baseline: `17273e9837bd13aa65c317cb494f0431f7580e18`. New isolated worktree, local preview localhost:5254, Chromium Playwriter session 10, 1440×1080, English, fixture data. `/agent-observatory` previously returned to the Button docs: before-entry.png. No previous corresponding dashboard. Baseline recorded before product edits.

## Pre-edit comparison map
| Target | Peer / evidence | Decision |
| --- | --- | --- |
| Dithered inference area | RevenueMatrix in src/components/sales/index.tsx, peer-sales.png; ModelTrendChart source | RevenueMatrix is currency pixel bars, ModelTrendChart multiple series. Add single-series count area with deterministic dither, zero baseline, exact table and keyboard selection; preserve existing owners. |
| Success / budget matrix | QuotaUsage and PerformanceScore source; peer-performance.png | Existing ring semantics reused conceptually, new dot matrix needed for dense horizontal success rates. Shared PixelMeter owns success and budget presentation. |
| Regional traffic | OperationsMap source; supplied reference-overview.png | Existing operational map is a district map. New schematic dot-world composition with labelled regions; location/area is decorative, counts are exact. |
| Agent health table | MemberPerformanceTable, peer-performance.png | Same table mechanics: bounded scroll, opaque sticky header, stable identity column, Button sorting, Avatar, Tag and centered AgentWorkspaceState. New domain-specific data and meter column. |
| Metrics/actions/editor | WorkspaceMetric; Button/IconButton/Menu; Dispatch Allocation dialog source | Reuse canonical primitives and Base UI dialog; no cloned green controls or new global tokens. |

Reference technique adopted: four compact metrics; two equally weighted chart cards; dense health table; restrained mono numerals; square-dot fill. Rejected: reference branding, raw green and decorative sidebar entries that lead to Coming soon. Template's region/period selection, details, pause/resume, undo and CSV export will be local and functional.

## Evidence plan
Capture desktop/mobile/tablet light/dark, chart selection, region filter, no matches, details, pause/resume, error recovery, docs/playgrounds and changelog. One index and original captures retained here. Browser direct headless mode cannot record tabCapture; no new continuous animation planned. Loading/error docs fixtures do not prove backend behavior.

## Implemented result

Four reusable components and one complete template: `/pixel-meter`, `/inference-chart`, `/regional-traffic`, `/agent-health-table`, `/agent-observatory`. All routes have metadata; components have sidebar entries, playground controls, generated JSX and API documentation. The template reuses existing metrics, buttons, menus, avatars, tags, error/empty state and Base UI dialog owners. Changelog entry is added with the actual PR number before merge.

The template uses a 216 px desktop rail, 4-column metrics (2 on smaller screens), 2-column charts (1 below 1100 px), 20 px panel padding and existing 16 px card / 8 px control radii. At 680 px the rail becomes horizontal navigation. Tables scroll within their own region with opaque sticky first column/header. Semantic success, warning, text, surface, border and shadow tokens carry both themes. SVG coordinates/dot geometry are visualization-only constants. No new continuous animation or independent timing system.

## Evidence and consistency coverage

| Scenario / category | Baseline or reference | Result | Verification |
| --- | --- | --- | --- |
| Entry, complete normal dashboard | [before-entry](before-entry.png), [reference overview](reference-overview.png) | [desktop final](after-desktop-verified.png) | Same local URL at 1440×1080 light; previous route normalized to Button docs; now renders complete template. No earlier equivalent monitoring page. |
| Metric/chart same-role comparison | [Sales peer](peer-sales.png), [Team Performance peer](peer-performance.png) | [chart values](after-chart-values.png), [table playground](after-table-playground.png) | Count chart adds required area/dither geometry while reusing inspection/exact-value approach. Health table follows the peer sticky header/identity, standard Button sort and shared empty owner. |
| Theme and responsive | No new-page baseline at these sizes | [desktop dark](after-desktop-dark.png), [tablet dark](after-tablet-dark.png), [mobile final](after-mobile-final.png) | 1440×1080, 768×1024 and 390×844. Table horizontally scrolls, identity stays visible; mobile nav remains available. Dark/tablet captures show Courier paused after undoing its resume (active count 4). |
| Region / period / totals | New interaction | [EU 7 days](after-region-period.png), [regional playground](after-region-playground.png) | EU shows 8,801 requests and 8,071 successes; two agents. Region markers and cards are controlled inputs. Metric/chart totals agree. |
| Detail, actions, recovery | Reference [details placeholder](reference-details.png) and [Agents placeholder](reference-agents.png) | [paused details](after-details-paused.png), [mobile dialog](after-mobile-dialog-viewport.png), [mobile menu](after-mobile-menu-clean.png) | Courier Degraded → Paused → Degraded; undo returns Paused. Enter opens details, Escape closes; status callback and menu detail entry exercised. Historical counts unchanged. Viewport dialog capture is canonical for overlay coverage. |
| Search, sort, empty | New table interaction | [no matches](after-no-matches.png), [first-use empty](after-table-empty.png), [filtered empty](after-table-filtered.png) | Clear filters restores rows. Healthy + p95 ascending produces Prism, Sentinel, Vector QA. CSV readback verifies those three ordered rows and 7-day counts. |
| Export | No prior export | [downloaded CSV](export-healthy-7-days.csv) | Actual browser download; only visible sorted rows. Unit checks cover quoting/formula prefix escaping. |
| Loading / error / retry | No prior new components | [chart loading final](after-chart-loading-final.png), [table loading final](after-table-loading-final.png), [chart error](after-chart-error.png), [table error](after-table-error.png) | Shared error surface and retry restore ready state. Initial skeletons had insufficient contrast against docs background and were corrected. Static loading is intentionally motion-free. |
| Bounds / zero / unknown | New component states | [zero chart final](after-chart-zero-final.png), [over-limit meter](after-meter-over-limit.png), [unknown meter](after-meter-unknown.png) | Zero stays on baseline with integer axis ticks; overflow clamps dot fill but preserves 125%; unknown has explicit label. Regional empty/invalid states verified by browser snapshot; no dedicated screenshots for those two states. |
| Documentation and source | Previous unavailable routes | [docs](after-docs.png), [JSX export](after-chart-code.png) | Playground, docs, generated component import/data and table-state controls exercised. Code exports starter JSX, with host callback wiring documented. |
| Icons / color inheritance | Shared Icon/Button/Menu/Tag and peer captures | Desktop dark and mobile menu above | Component-owned menu portal preserves nested theme. Unknown/success/error are labelled, not color-only. Both icon libraries are inherited; alternate Lucide appearance was not separately captured. |

## Validation and limits

- `npm run build`: passed; existing large-bundle warning remains (main bundle about 3.13 MB uncompressed).
- `node scripts/agent-observability/check.mjs`: passed weighted success/median, no-traffic values, non-mutating filters/sorts, status restoration, invalid telemetry, exact bucket sum including zero/one, and CSV checks.
- Fresh browser reload logs and final exercised flows have no new runtime errors. Earlier development logs include transient HMR errors while incomplete files were being written; final reload/build succeeded.
- Screenshot sources are actual local React components with fixture data; no backend request or real operational status was changed. Counts, p95 and costs are illustrative; region map is schematic. This does not verify production deployment.
- Motion interaction recording remains a coverage gap: Playwriter extension sessions timed out; the available direct headless session cannot use tabCapture. No new continuous motion was introduced. State transitions were exercised and captured as stills; stills do not prove timing.
- Full-page early modal captures show viewport overlay placement within the tall document. Use `after-mobile-dialog-viewport.png` for actual viewport overlay review.
- Superseded originals retained: `after-mobile-light.png` / `after-mobile-details.png` precede the mobile navigation correction; `after-chart-loading.png` / `after-table-loading.png` show the initial low-contrast placeholders; `after-chart-loading-v2.png` is an intermediate capture; `after-chart-zero.png` precedes integer axis ticks; `after-mobile-menu.png` includes the automation cursor and is replaced by the clean version. Other originals remain useful state records. Unknown-meter capture includes a pointer overlay; it verifies the text state, not a clean presentation image.

Manifest contains original image dimensions, SHA-256 hashes and source hashes. This index is the single task review location; subsequent changelog evidence and delivery revision are appended here.

## Delivery revision

Implementation commit: `3a2178037247dc4a8f23e1afea0f126f98852b74`. [PR 81](https://github.com/oreo-design/oreo-ui/pull/81). The follow-up adds the real PR-linked changelog entry and its evidence; product component/template source is unchanged. Changelog pairing: [before](before-changelog.png) → [after](after-changelog.png), 1440×1080 light.

Coverage clarification: the four new component routes did not receive separate pre-change screenshots; their exact baseline revision is retained above. The captured template entry demonstrates the pre-change missing-route behavior, but is not claimed as four independent component-route captures. `git diff --check` flags the downloaded CSV's original CRLF line endings; `git -c core.whitespace=cr-at-eol diff --check` passes without altering the downloaded artifact.

Post-merge verification: PR 81 merged at `2ff2a1dfc2d47596be4b4171bce783d4969c6c9d`; remote main contains reviewed head `52c8f71f9f9cc1bb625b13b9f583619d1163b4f9`. `after-desktop-verified.png` is the canonical 1440×1080 light full-page result, captured after explicitly returning to the top. `after-desktop-final.png` is retained as a superseded scrolled full-page capture: its sticky sidebar follows the retained viewport scroll offset and should not be used for entry-position comparison. This correction changes evidence only.

`after-desktop-top.png` is also retained as a failed first capture (main content was not painted in the screenshot). The verified replacement waits for the main heading and was visually inspected in full. [Evidence correction PR 82](https://github.com/oreo-design/oreo-ui/pull/82).
