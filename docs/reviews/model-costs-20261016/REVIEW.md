# Model Costs — reference, reuse and visual review

## Scope and source

Reference: [Imran — LLM Usage & Cost Dashboard, Lumen](https://x.com/imimran04/status/2110703416976748572). The post contains one static 4096 × 3028 image; `reference.png` is a browser capture of that image. Post metadata was read through the public FXTwitter mirror because direct web access returned 403. No reference motion was supplied. The original logo, portrait and artwork were not copied.

Baseline: `8e4729127e9a07294baf56b603a3f32c6112cc0d`. Implementation lives in `src/components/model-usage`, `src/patterns/model-costs`, component docs, playground registry and route metadata. The manifest records file hashes for the captured implementation. This is a local fixture template; no provider, authentication, billing or production deployment was verified.

## Component extraction and canonical owners

| Role | Decision and inspected peers |
| --- | --- |
| Summary metrics | Reuse `WorkspaceMetric` from command-search, also consumed by Activity Workspace. |
| Budget explanation | Reuse Activity `BudgetMeter`; explicitly identify selected-period spend versus a monthly ceiling. |
| Multi-model trends | Add `ModelTrendChart` with model IDs and selectable cost/token/request units. Existing Activity `UsageChart` is a cumulative budget/forecast chart, and Finance `BalanceChart` has fixed financial series; neither owns this arbitrary model-series role. |
| Request distribution | Add `ModelUsageRing`, deriving shares and token totals from the same dataset as the trend. |
| Agent/activity usage | Add `AgentUsageRow`; existing RequestLog and Agent Hub tiles have different density/content roles and do not expose cost/token totals plus independent inspect/run actions. |
| Controls and status | Reuse Button, IconButton, Icon, Tag, Avatar, AgentWorkspaceState and Base UI Dialog. Omit press scaling with `tapScale={1}`. |
| Documentation | Reuse the docs shell, property controls, generated JSX, route navigation and existing changelog release entries. |

`peer-activity.png` captures the actual Activity Workspace in dark mode. Source inspection additionally covered Finance charts and Agent Hub. This is a focused Oreo peer comparison, not a claim of visual review across every product or every peer state.

## State and evidence matrix

All captures use Chrome through Playwriter session 1, task-owned tabs, English UI, local fixtures at `localhost:5244`. Desktop is 1440 × 1000, phone is 390 × 844, tablet is 768 × 1024. Full-page PNG height may exceed viewport height. The reference capture uses 1600 × 1200. Automation overlays were hidden.

| Scenario | Before | After / verification |
| --- | --- | --- |
| Direct template entry | `before-entry.png`: requesting the absent `/model-costs` route reached Button; captured before implementation | `after-desktop-v2.png`: complete new template, same desktop/light environment (includes CSV export confirmation). `after-desktop.png` is the initial normal view. |
| Model and date controls | No corresponding prior page or interactions | `after-staging-day.png`; production/staging, 7/3/1-day ranges, Cost/Tokens/Requests, keyboard day slider, shared model highlight. |
| Sample task and details | No corresponding prior flow | `interaction.mp4`, `after-run-details.png`, `after-agent-paused.png`; one run adds 1 request, 1,842 tokens, 5 cents and an activity entry in the selected environment. Paused run controls verified disabled in the dialog and list; resume restores execution. |
| Search | No comparable baseline | `after-search-empty.png`; no results and clear-query recovery exercised. |
| Empty/error/recovery | No comparable baseline | `after-empty.png`, `after-error.png`; error retry preserves local data, restore sample data recovers charts and rows. |
| Dark theme | No same-page baseline | `after-dark.png`; semantic background, border, icon and series colors inherit Oreo tokens. |
| Responsive layout | No same-page phone/tablet baseline | `after-mobile-v2.png`, `after-tablet.png`; document width equals viewport at 390 and 768 px, including opened data table. `after-mobile-dialog.png` shows opaque dialog header/footer and body. |
| Component surfaces | The routes did not exist; the generic missing-route entry is captured above, not represented as a separate baseline for each component | `after-doc-trend.png`, `after-doc-ring.png`, `after-doc-row-paused.png`, `after-doc-api.png`; route navigation, docs, playground and generated JSX inspected. |
| Loading/error component | No corresponding prior component | `after-doc-loading.png`, `after-doc-error.png`; retry returns to ready. |
| Changelog | `before-changelog.png` | `after-changelog.png` (added after PR creation). |

The 1440 × 1000 interaction recording is a sequence of real Chrome screencast frames. Idle gaps are capped at two seconds for review, encoded to 24 fps; original frames and timestamps remain in `interaction-frames.json.xz`. It is not an unedited wall-clock performance benchmark. There is no fabricated before recording or source motion comparison. A decoded frame was visually inspected and dimensions verified with ffprobe.

Superseded originals are retained: `after-mobile.png` had crowded date ticks; `after-mobile-v2.png` replaces it with four readable ticks while preserving all seven data points. `after-doc-row.png` shows the initial active state; `after-doc-row-paused.png` proves the paused state. `after-desktop-v2.png` is the final desktop capture; the first desktop screenshot is retained. Earlier state captures predate the minor singular-day wording/tick-spacing correction but retain the same tested behavior.

## Mandatory consistency lenses

| Lens | Evidence and result / explicit gap |
| --- | --- |
| Entry behavior | Real missing-route baseline and complete new route captured. Docs and template entries use existing route/metadata/sidebar owners. |
| Loading | Chart-shaped loading on docs; preserved data while busy supported. Peer loading states were inspected in code, not captured at runtime. No real network loading is claimed. |
| Empty/error | Shared AgentWorkspaceState used for chart, list and page recovery. Actual local empty/error and search-empty captures included; peer empty states were not separately captured. |
| Actions | Shared Button/IconButton plus native select/range and controlled legend buttons. Disabled pause behavior checked on template and playground; Escape returns focus to the trigger (observed focused Explain usage control). |
| Titled scroll surfaces | Dialog body scrolls between opaque header/footer. Exact chart values scroll horizontally inside their own table container; mobile page has no horizontal overflow. No decorative overlay fade was added. |
| Icon/color inheritance | Shared Icon system and semantic tokens used in both themes. Chart labels and shapes share model tones. Dark palette text tokens intentionally resolve to pale colors, consistent with existing theme definitions. |

## Validation and limits

- `npm run build`: TypeScript and Vite passed; existing bundle-size warning remains.
- `node --experimental-strip-types scripts/model-usage/check.mjs`: aggregate sums, selected-day totals, nearest-rank p95, immutable sample increments, unchanged other models, empty data, duplicate IDs, missing models, non-finite/fractional/negative counts, unsafe aggregate totals and CSV quoting/precision passed.
- Browser: environment/date/metric controls; slider keyboard; model highlight; run/activity/dialog; pause/resume; search; empty/error recovery; CSV action; all three playground routes and generated code; light/dark and phone/tablet reviewed. Generated CSV content is checked by the focused model test; no filesystem download-content assertion was performed.
- Initial development navigation produced transient hook errors during Vite refresh. A clean reload and subsequent interaction flow reported zero page errors. Build passed after final edits.
- Budget and model labels are sample data, not current provider prices. Latency is p95 of explicit sample calls, not an average of daily percentiles. Analysis is deterministic text, not an AI response.
- Missing baseline variants and peer runtime-state coverage remain explicit evidence gaps; they do not imply a deployment or block the authorized merge.

## Delivery

[PR #71](https://github.com/oreo-design/oreo-ui/pull/71). Implementation commit: `83e32d1`. Remote merge verification is reported with the final delivery. The primary dirty Oreo checkout and other running previews were left untouched.
