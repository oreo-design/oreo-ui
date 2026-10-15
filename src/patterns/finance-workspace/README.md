# Finance Workspace

A frontend-only composition inspired by the three-part Orbix Studio dashboard image:
https://x.com/OrbixStudio/status/2110413863568969740

Route: `/finance-workspace`. Reusable components: `/balance-chart`, `/allocation-bar`, `/spending-gauge`, `/payment-card`.

## Composition

- BalanceChart: income, expense and savings snapshots on one scale, range control and accessible table.
- AllocationBar: category-weighted savings with a text legend.
- SpendingGauge: segmented half-ring, budget remaining/overrun and meter semantics.
- PaymentCard: last-four-only display and frozen state.
- Reuses ActivityCard, ProspectMetric, Button, IconButton, Avatar, Tag, Icon and AgentWorkspaceState. ProspectMetric's optional `sentiment` separates direction from whether the change is favorable, without changing existing defaults.

Monthly and weekly fixtures are illustrative, including future dates. Period changes switch the chart, summary totals and spending categories together. A weekly budget is one quarter of the editable monthly budget. All amounts are USD. Savings goals represent a separate allocation plan; adding a goal does not debit an account. Demo payments reduce the shared sample balance and add a local activity entry. The two cards share that balance and have separate frozen states. Historical period totals are fixed snapshots and do not include newly added demo payments.

No external APIs, real payments, bank data or persistence. Reload resets changes. Real integrations should supply aggregation, authorization, idempotency, persistence and loading/error states at the application boundary.

Charts deliberately update without motion. They reuse the project's SVG chart and native range-control approach, with no new dependency. All visible colors/radii map to Oreo tokens. SVG coordinates are geometry, not design tokens; the decorative card gradient combines existing palette tokens.

Reference photographs and branding are not shipped. Review: `docs/reviews/portfolio-20261015/REVIEW.md`.
