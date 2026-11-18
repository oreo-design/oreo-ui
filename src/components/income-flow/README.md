# Income Flow

IncomeFlowCard composes IncomeFlowChart and IncomeComparison. Reuses StatusView, Icon and Oreo focus/state layers; the template reuses Button, IconButton and DashboardStatCard. Existing TrendAreaChart/BalanceChart remain appropriate for axis-based or multi-series analysis.

- Properties: points with unique IDs and nonnegative safe-integer USD cents, label, independent orange/purple/blue tone, disabled, optional controlled committed index and callback. Standalone chart requires value/onValueChange; onPreviewChange drives a host readout.
- Interaction/states: pointer preview resets on leave/cancel; click/tap commits; native month buttons work with Enter/Space, Left/Right, Home/End and Escape to latest. Disabled blocks both surfaces. Empty and invalid use StatusView. Zero draws a flat line, single-period/missing-prior/zero-prior show no fabricated percentage. No network, upload or money movement.
- Copy: concise metric and month labels; exact formatted dollars with cents when needed. Four bands represent one total, not categories. Local fixtures are labeled as examples. Long titles wrap.
- Layout: compact token-based surface, mirrored smooth envelopes without sample overshoot, readable footer. Pointer marker uses 120ms transform easeOut; values and dataset changes are immediate, keyboard/reduced motion do not interpolate. SVG coordinates and layer ratios are chart geometry; static glow is an optical effect.

Routes: /income-flow-card, /income-flow-chart, /income-comparison and /income-flow-workspace. Foundation tokens are reused; no Bencho implementation code or assets are distributed.
