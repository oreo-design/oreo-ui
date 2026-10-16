# Agent Runs — review record

Source: https://x.com/shokhnur_says/status/2110657757850263727 (two static light/dark images; actual images inspected in reference-1.png and reference-2.png). No source motion is implied.
Baseline: 08e67bf928bb14ab99e7bbcadbd9e4dfb85ad5ce. Chrome via Playwriter session 1, localhost:5246, English local fixtures, 1440×1000 unless named otherwise. Isolated branch; original dirty workspace preserved.

## Scope and baseline
New WeeklyHeatmap and AgentRunsCard; complete Agent Runs template; docs/playground, sidebar and changelog. Before editing /agent-runs resolved to the existing Button home (before-entry.png). There was no agent hourly heatmap route. Comparable Model Costs is captured in peer-model-costs.png, and inspected live along with its source. Reference density and light/dark grouping map to existing spacing, card radii and semantic status-progress colors; no external artwork needed. Cell grid geometry is a new data visualization, not an existing generic control.

## UI consistency review
| Lens | Target / peer and owner | Result / coverage |
|---|---|---|
| Entry | App route + Sidebar / Model Costs route | Baseline inspected; new template uses same direct route entries and real links |
| Loading | WeeklyHeatmap / ModelTrendChart | Reuse chart-shaped static skeleton behavior; fixtures expose loading without pretending a network request |
| Empty | AgentRunsCard / ModelTrendChart | AgentWorkspaceState owns centered empty/error and recovery |
| Actions | Card/template / Model Costs | Shared Button, IconButton, Tag; compact metric choice follows existing pressed-button group |
| Titled scrolling | Heatmap / Model Costs chart | Title outside horizontal chart scrolling; no overlapping sticky title or redundant fade |
| Icons/color | Template / Model Costs | Shared Icon currentColor neutral operations; semantic blue chart and red failure metric |

Implementation: pending. Evidence coverage: baseline, source, populated peer captured; after-state captures and interactions pending. No cross-product claim.

## Implemented result and evidence
- **WeeklyHeatmap**: 7×24 sparse-or-dense data, relative intensity scale, exact hover/focus values, arrow/Home/End navigation, single tab stop, controlled Enter/Space/tap selection, hoverable tooltip with Escape dismissal. Neutral zero, semantic progress blue or failure red. Grid retains a minimum readable width and scrolls inside its own region.
- **AgentRunsCard**: three metrics, calculated totals, comparison, weighted duration, failure percentage, metric-specific peak and weekday-morning share. Shared Button, Tag and Icon; no new timed animation.
- **Agent Runs**: filters by agent/week, per-agent selected-hour details, scrollable exact-value table, filtered CSV and explicit fixture states. All data is local; no network provider runs.
- Docs layout correction: summary now wraps by its actual available flex width, not only browser width. `after-card-docs.png` is superseded by `after-card-docs-v2.png`. No shared peer styles changed.

| Scenario | Before | After / checks |
|---|---|---|
| New route / full template | before-entry.png (missing route falls back to Button home) | after-light.png, after-light-full.png |
| Source comparison | reference-1.png / reference-2.png | after-tooltip.png / after-dark-failures.png |
| Filtered data and keyboard selection | No comparable hourly view | after-filtered.png; research + previous week + credits = 12,138. ArrowRight/Enter selected Thu 11 AM: 95 runs, 285 credits, 1 failure, 54s. Ctrl+Home/End selected Mon 12 AM / Sun 11 PM. Escape removed tooltip. |
| Table / protected title | peer-model-costs.png | after-table-scroll.png; opaque sticky table header protects rows |
| Responsive | New route absent | after-mobile-light.png, after-mobile-dark.png (390×844); after-tablet-light.png, after-tablet-dark.png (768×1024). Actual page horizontal overflow false; chart horizontal overflow true by design. Sun 11 PM remains selectable at narrow width. |
| Empty / recovery | No comparable route state | after-empty.png; Reset filters restored grid |
| Error / recovery | Existing AgentWorkspaceState peer code | after-error.png; export disabled, Try again restored grid |
| Initial loading | Existing ModelTrendChart skeleton peer code | after-loading.png; cell-shaped static skeleton; no simulated request claim |
| Component entries | New routes absent at baseline; same fallback as before-entry.png | after-heatmap-docs.png, after-card-docs-v2.png; documentation API readback verified |
| Changelog | before-changelog.png, recovered from previous task server 5245 (source tree equals baseline merge tree) | pending |
| Download | No export on baseline missing route | export-all-current.csv: actual browser download, exactly equals all 168 filtered buckets. Playwriter saveAs artifact transfer failed; recovered the successful native download from Downloads (download failure=null). |

Validation: build and focused weekly-data tests pass. Tests cover invalid/duplicate/out-of-range buckets, zero denominators, exact totals, weighted average, peak, intensity, CSV and agent partitions. Runtime console contains no errors. Matched UI checked against Model Costs within Oreo only; loading and empty shared-owner comparison includes source-level evidence, not a separate captured peer state.

Coverage limits: static source; no source interaction/motion inference. No custom animated transition introduced; no before/after motion recording is applicable. Keyboard and pointer checks are browser checks, not a screen-reader certification. No production deployment or real provider verification. Initial captured state used session 1; after capture switched to dedicated session 2 when session 1 was replaced by another task. Original screenshots preserved. Source revision: see the implementation commit and this review package's Git history.
