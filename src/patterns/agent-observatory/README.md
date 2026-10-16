# Agent Observatory

Reference: [Adeeb's dashboard](https://x.com/adeebrq/status/2110891362103267793), inspected through the post's live demo. The reference's agent/details pages are placeholders; this template adds local details and reversible status controls.

Reusable components in `src/components/agent-observability`: **PixelMeter**, **InferenceChart**, **RegionalTraffic**, **AgentHealthTable**. Shared primitives: WorkspaceMetric, Button, IconButton, Menu, Tag, Avatar, AgentWorkspaceState and Base UI Dialog. Existing Sales and Team Performance surfaces informed chart inspection and table behavior.

`/agent-observatory` provides region and reporting-period filters, count-based KPIs, exact chart bucket values, agent search/status filtering/sorting, details, pause/resume, one-step undo and CSV export of visible rows. Resume restores the status recorded before pausing; agents initially paused resume as Healthy. Historical sample traffic is unchanged by status controls. The demo resets on reload.

Metric semantics: success is weighted by request counts; active excludes paused agents; median agent p95 is a median of agent-level percentiles, not fleet p95. Regional latency is the rounded mean of agent p95 values. Counts are synthetic, with deterministic integer apportionment preserving the selected total. Time labels identify sample bucket starts ending October 16, 2026 UTC. Periods scale counts; costs and latency are fixed sample attributes. World silhouettes/marker positions are schematic, with exact region data in adjacent controls.

Component routes `/pixel-meter`, `/inference-chart`, `/regional-traffic`, `/agent-health-table` include playgrounds, JSX export and API docs. The regional component uses `all` as its no-selection sentinel; region IDs must be unique and must not use `all`. Inference labels are ordered buckets, not a continuous datetime axis.

Colors, surface, border, shadow and radii reuse Oreo tokens. Layout spacing follows the existing 4 px scale. Custom 500×260 map coordinates, 560×240 chart geometry and 3 px dot geometry are visualization coordinates, not new design tokens. No new automatic animation. Keyboard users can inspect chart buckets, select regions, sort columns, open details, use menus and dismiss the dialog with Escape.

Checks: `node scripts/agent-observability/check.mjs` and `npm run build`. [Review and original captures](../../../docs/reviews/overseer-dashboard-20261016/REVIEW.md). These are local sample interactions, not backend monitoring or production deployment verification.
