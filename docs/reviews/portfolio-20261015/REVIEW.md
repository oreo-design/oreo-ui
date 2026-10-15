# Finance Workspace — UI review

Source reference: [Orbix Studio](https://x.com/OrbixStudio/status/2110413863568969740). The three photos are adjacent slices of one finance dashboard, not three separate pages. Inspected all three actual images through a task-owned browser tab; `reference-1.png` through `reference-3.png` and `reference.json` retain the source record. X's main page returned 403; public media URLs were resolved through the public FxTwitter metadata endpoint. The quoted healthcare post was outside scope. No reference portraits or branding are shipped.

## Delivery and environment

- Baseline: `839d81ae94e005e2c84b4edf900982bea0e1183b`.
- Final product source: `2c2cbd500a1420b27232eea0e60807bc3449f0c8`. Later evidence-only commits do not alter product source.
- [PR #46](https://github.com/oreo-design/oreo-ui/pull/46). This index records the reviewed source; remote merged status is verified separately at delivery.
- Task checkout: `oreo-ui-portfolio-20261015`, isolated from unrelated primary-checkout WIP.
- Local preview: http://localhost:5218/finance-workspace. Exact baseline recovery: localhost:5219 from detached baseline checkout.
- Chromium through Playwriter session 52; English, USD, session-local fixtures, light/dark. Desktop 1440×1000, tablet 768×1000, narrow 390×844; additional layout inspection at 1024×1000.
- Initial preview font requests were blocked by Vite's serving allow list for symlinked dependencies. Temporary preview configurations were corrected; final captures loaded Inter Variable. The first baseline recovery also encountered `/tmp` versus `/private/tmp` and is preserved as `baseline-blocked-*`; it is not acceptance evidence.
- `manifest.json` lists originals, timestamps, hashes and dimensions. Original screenshots remain intact. Full-page height follows document content; the dimensions above are viewport sizes.

## Main comparison

There was no finance template or component route. Attempting `/finance-workspace` on baseline fell back to the Button playground. That actual fallback is the baseline, not an invented old finance screen.

| Before | After | Change / canonical owner |
| --- | --- | --- |
| [Desktop entry](before-desktop-recovered.png) | [Desktop entry](final-entry.png), [complete page](verified-desktop.png) | Four finance primitives composed with ActivityCard, ProspectMetric, Button, Avatar, Tag and AgentWorkspaceState. |
| [Narrow entry](before-mobile-recovered.png) | [Complete narrow page](verified-mobile.png) | Sidebar becomes wrapped in-page links; cards stack; chart geometry adapts to available width without shrinking text. |
| No prior finance page | [Tablet](verified-tablet.png), [dark desktop](dark-corrected.png), [dark mobile](dark-mobile-corrected.png) | 768 layout preserves two major columns; narrow layout stacks. Token-based dark palette; card gradient mixed with surface for readable labels. |
| [Existing metric](metric-before-recovered.png) | [Same metric](metric-after-final.png) | Existing defaults and layout remain intact. Optional sentiment separates change direction from favorability for falling expenses. Sidebar additions are expected. |
| [Changelog](changelog-before.png) | [Changelog with PR 46](changelog-after.png) | Finance Workspace added to existing dated release data. Baseline Changelog capture used fallback font; content comparison only. |

## Changed states and checks

| Scenario | Result / evidence | Limits |
| --- | --- | --- |
| Monthly → weekly | Income 15,000 → 3,750; saved balance 8,300 → 1,950; expense categories and chart switch together. Browser snapshot verified. | Illustrative snapshots, including future dates; no market data. |
| Keyboard chart inspection | Range End selects Sun Oct 18; readout exposes savings 1,950, income 3,750, expenses 1,800. Data disclosure shows all seven rows. | No screen-reader speech recording. |
| Chart empty → restored | Shared centered empty state, then range returns. [Empty chart](chart-empty.png). | Invalid/negative rows filtered in source; exhaustive numeric fuzzing not performed. |
| Savings goals | Blank submission rejects; named $250 goal adds, total 15,750 → 16,000. [Error](goal-error.png). | Error capture predates font correction. New goals are a separate allocation plan, not account debits. |
| Budget | Monthly budget 1,000 yields weekly budget 250 and an explicit 1,550 overrun. Playground 1,000 limit / 1,800 spend shows 800 over; zero limit states no budget set. [Gauge overrun](gauge-over-budget.png). | Weekly budget is monthly / 4, documented in template README. |
| Allocation empty | Count zero renders shared centered state. [Empty allocation](allocation-empty.png). | Unique item IDs are caller-owned. |
| Card selection / mask | Travel account switches suffix to 4829. Invalid lastFour is fully masked. Frozen badge and neutral treatment are explicit. [Masked frozen card](card-masked-frozen.png). | No full card number accepted by the component. |
| Frozen payment / recovery | Frozen card rejects submission with explanation; unfreeze restores ability to submit. [Frozen error](frozen-error.png). | Earlier font; local state only. |
| Payment validation / success | 999999 rejected against 27,200 balance, draft preserved. 125.25 accepted → balance 27,074.75 and one Davis activity item. [Success](payment-success.png). | No transfer sent externally. The two demo cards share one sample balance. Historical totals remain fixed snapshots. |
| Activity no results → clear | Nonsense query renders shared empty state; Clear search restores transactions. [Empty search](empty-activity.png). | Earlier font; no server search. |
| Playgrounds / code | All four routes rendered. BalanceChart generated code imports from `@/components/finance`; source hint points to finance. Allocation documentation and API rendered. | No package publishing performed. |
| Theme / responsive | 390, 768, 1024, 1440 page widths matched their viewport in layout inspection; light and dark media inspected. | 1024 capture predates chart typography correction; final narrow/wide/tablet captures supersede chart rendering. No native-device run. |

## UI consistency review

Scope: Oreo Web finance components and template; same-role existing chart, card, metric, action and empty-state consumers. Code inspection plus actual Activity Workspace and Prospecting previews, not a cross-product/global claim.

| Lens | Target and peer | Canonical owner / rule | Result | Evidence / gap |
| --- | --- | --- | --- | --- |
| Entry behavior | New component docs and template vs existing Prospecting / Activity routes | App route registry, Sidebar, DocsPage, shared playground | Checked | Real missing route baseline, four rendered docs, generated code and template navigation. |
| Loading | Local fixtures vs synchronous existing examples | Host owns async loading; do not invent a spinner | Not applicable | No network-backed data loads or refresh states added. Real-bank loading and failure remain integration work. |
| Empty states | Empty chart/allocation/activity vs AgentWorkspaceState | Shared centered icon, heading, explanatory copy, actionable recovery where possible | Checked | chart-empty, allocation-empty, empty-activity; chart with no host callback gives explanation rather than a dead button. |
| Actions | Goal/budget/card/payment vs existing Activity / Prospecting buttons | Button/IconButton variants, tapScale=1; native select for simple period/account choice | Checked | Actual peer screenshot `peer-activity.png`, source consumers, tested actions; no new dropdown or modal implementation. |
| Titled scroll surfaces | Financial panels and data table vs ActivityCard | Headers remain in normal flow; horizontal table overflow stays inside its container | Checked | Desktop/narrow full captures and data disclosure. No content passes behind sticky/floating headings, so no decorative fade needed. |
| Icons / color | Neutral operations, semantic chart categories and metric changes | Icon vocabulary, Oreo palette/status tokens, ProspectMetric optional sentiment | Checked | Down arrow + positive expense decrease; unchanged old metric; dark income text reuses prospect-positive. Category labels and table accompany color. |

External reference mapping: adopt the reference's quiet rounded panels, three-series chart, hatched selected date, segmented savings, half-ring spending and softly colored card. Use existing Oreo radii, typography, spacing scale, semantic colors and primitives. SVG coordinates are chart geometry, not copied Figma style values. Replace portrait photos with existing initials avatars. Reject the screenshot's dead controls: implemented scoped local interactions instead. The project's existing SVG/native-range chart pattern was retained, so no chart library or dependency churn was introduced.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No finance surface | Financial figures, chart selection and form state update immediately | These are frequent data-reading actions, including keyboard input. No entrance, number tween, moving chart or layout transition added. |
| Shared Button press spring | Finance callers use tapScale=1 | Avoid movement on frequent financial actions; retain existing focus and color feedback. |

Verdict: **Approve** for the scoped diff. No new movement/keyframes/transitions to time, so motion recordings are not required for a new animation. Existing shared control color feedback is unchanged. Reduced-motion mode does not change the immediate chart/form behavior. This is source-level motion verification, not a video/frame-rate claim.

## Validation and historical record

- TypeScript + Vite production build passes on final product source; log: [build.txt](build.txt). Existing >500 kB chunk warning remains.
- Scoped diff checked; no dependency changes, no real data mutations, no production deployment claim.
- Final fresh-load snapshots rendered without new runtime errors; historical Playwriter log buffers retained earlier Vite restart/font errors. The temporary serving config fix was verified by successful font loading and final captures.
- Historical `before-*` without `recovered` used fallback fonts. `after-*`, early `peer-*`, goal/payment/empty-search state captures preserve the development sequence. `after-desktop-initial` has the old expense-arrow semantics and unrounded metric containers. `final-*`/`mobile-complete` are intermediate captures; prefer `verified-*`, `final-entry`, and `dark-*-corrected` for final layout. `final-mobile` hides the logo wrapper, corrected in later captures. `final-mobile-dark` uses the earlier saturated card gradient; final dark cards are in `dark-corrected` and `dark-mobile-corrected`. `verified-light-extra` is correctly labeled as light after an automation timeout; it is not dark evidence.
- Baseline and final screenshots were inspected. Remaining gaps: no real bank backend, production deployment, screen-reader speech, physical-device testing, or exhaustive custom-data/long-name coverage. These do not imply implementation or merge failure.
