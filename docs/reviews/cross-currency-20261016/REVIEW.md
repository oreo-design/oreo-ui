# Cross-Currency review

Reference: https://x.com/heisjoss/status/2110675076677042291 by Efosa. Actual image inspected in the browser (reference.png); public metadata in source.json. The source shows a compact rail, total balance with overlapping currency flags, four balance cards, actions, a quick-action column beside transaction rows, and a partially visible blue/grey bar chart. No interaction video was supplied.

Baseline: a1ac01c4da35656d9744537a0fe46b8c64dd505a. New route /cross-currency fell back to Button docs (before-entry.png). Local Chromium, Playwriter session 10, localhost:5256, English, 1440×1080 light. Primary checkout has unrelated WIP and is untouched.

## Pre-edit consistency map
| Lens | Peer / owner | Decision / evidence |
|---|---|---|
| Entry | src/patterns/finance-workspace, actual before-finance-peer.png inspected | Reuse neutral workspace frame, semantic sidebar links, local-demo disclosure and theme toggle. Reference's compact rail is appropriate for in-page sections. |
| Loading | Local FinanceWorkspace data | Synchronous fixtures: no artificial network spinner. Public activity component will provide explicit loading/error/empty props for real hosts. |
| Empty | AgentWorkspaceState | Center filtered/no-data states in owning list with applicable clear action. |
| Actions | Button / IconButton; actual finance template | Same primary/secondary/tertiary hierarchy, 32px controls, neutral icons. Base UI Dialog for entry/review, focus return and cancellation. |
| Titled scrolling | Finance activity list and BalanceChart exact table | Keep content below headings; bounded transaction region uses opaque boundary, no content under floating titles. |
| Icons/color | Icon and finance semantic tones | Inherit text color. Currency flags are decorative alongside ISO codes and names; never use flags as sole labels. |

Scope: reusable Currency Balance Card, Currency Balance Summary, Money Activity List and Cash Flow Bars plus complete Cross-Currency template. Existing BalanceChart is a multi-series line snapshot; SpendLimitChart encodes a threshold, so neither should be relabelled as incoming/outgoing paired bars. New bars reuse the existing exact-data disclosure and zero baseline conventions. Existing USD-only amount formatting is unsuitable for currency rows; use explicit ISO currency and integer minor units.

Interaction plan: local add/send/convert/request and scheduled draft forms with review/validation, atomic balance updates, undo, account filtering, search, period filtering and export. All rates and accounts are fictional, no financial advice or network/real transfers. Current balances and historical activity are separate labelled snapshots; no claim that the displayed period starts at zero.

Evidence plan: before/after entry and changelog; desktop, mobile, dark, form validation/review/completion, empty recovery and component playgrounds. Continuous recording unavailable in direct headless session (no extension tabCapture); retain screenshot state evidence and report the gap separately from delivery.

## Implemented result and coverage

Four reusable components and their documented playgrounds are registered in the existing site navigation and route metadata. The full `/cross-currency` template reuses Button, IconButton, Icon, AgentWorkspaceState and Base UI Dialog. No shared finance owner was changed. Quick-action rows extend the canonical secondary button to fit a two-line description; this differs from the compact toolbar action because it is a full-width navigational row. Cards retain the existing card-radius and border tokens, type hierarchy and semantic incoming/outgoing colors.

| Changed surface / state | Before | After and verification |
|---|---|---|
| New template entry, desktop light 1440×1080 | [Actual missing route fallback](before-entry.png), baseline above | [Complete dashboard](after-entry.png); full-page capture, same viewport and locale |
| Existing finance peer | [Finance workspace](before-finance-peer.png) | Compared actual rendered peer plus shared component owners; no peer edits |
| Mobile light/dark 390×844 | No prior template in either state; missing route evidence above | [Light](after-mobile.png), [dark](after-mobile-dark.png); real local fixture on fresh route entry, latest dates visible with numeric axis outside the scroller |
| Medium dark 900×1000 | No prior template | [Medium](after-medium-dark.png); inspected before final chart structure correction, no clipping at this viewport |
| Conversion validation / review / completion | No prior interaction | [Insufficient funds](after-validation.png), [review](after-convert-review.png), [applied](after-converted.png); USD 100 converted to GBP 80, both accounts updated together, focus returned, undo restored balances |
| Scheduled draft and empty recovery | No prior interaction | [Draft review](after-scheduled-review.png), [filtered empty](after-empty.png); request and schedule leave balances unchanged, week filter excludes future draft, clear filters recovers |
| Mobile dark dialog | No prior interaction | [Review](after-mobile-dark-review.png), inspected for theme and viewport fit |
| Transaction details and cancellation | No prior interaction | [Details](after-transaction-details.png); Escape closes and focus returns to the originating transaction button |
| Activity component ready/loading/error | New component; same-role state owner is AgentWorkspaceState | [Ready](after-activity-playground.png), [loading](after-activity-loading.png), [error](after-activity-error.png); retry and empty-reset callbacks exercised |
| Balance card / summary | New components | [Card](after-card-playground.png), [summary](after-summary-playground.png); controlled selection and hide/show exercised |
| Cash flow / exact values | New paired-bar component; existing BalanceChart exact-table convention | [Playground](after-chart-playground.png); day focus/selection, exact table, period changes checked. Table header stays opaque; date series alone scrolls |
| Changelog | [Existing changelog](before-changelog.png) | Final added entry capture is recorded below after the PR number is assigned |

### Focused checks

- Integer minor-unit parser, exact rational half-up conversion, atomic updates/non-mutation, invalid/dust/insufficient amounts, no-money-movement drafts, date validation, destination-aware filtering and posted-only cash flow: **5 tests pass**, [raw output](model-tests.txt).
- Production build passes. Existing large-bundle warning remains; no new build error. Browser console readback showed development messages only.
- Browser actions also verified sending USD 25.50, adding EUR 20.01, all-currencies-added disabled state, GBP display total £169,431.41, rate table, hidden accessible balance labels, search and account filters.
- [Actual filtered export](export-filtered.json) contains only the searched future scheduled draft, with explicit minor units and filter scope. Export is generated locally; nothing is sent externally.
- Fictional fixed rates and opening account snapshot are explicit. Historical rows are a partial activity snapshot, not an accounting ledger starting at zero. No bank, market-rate, payment, notification or automatic scheduled execution integration is claimed.

### Corrections and historical captures

All originals are retained. `initial-*` and validation/conversion/scheduled/empty screenshots were captured before currency-symbol shortening; these preserve interaction evidence, not final typography. ISO codes remain independently visible in final cards and activity labels. `mobile-before-sticky-axis*` and `superseded-after-mobile*` document chart iterations; the final axis is a sibling outside the date scroller, so labels cannot pass beneath it. `resized-from-desktop-*` captures preserve a desktop-to-mobile resize with its existing scroll position; final mobile images are fresh entries and begin at recent dates. `superseded-after-entry.png` predates that structural chart correction. `superseded-after-activity-loading.png` exposed low-contrast placeholders; final loading capture uses base background and border-default placeholder tokens, inspected after correction.

### Verification limits

Evidence is local Chromium fixture evidence, not real banking, production deployment or native-device evidence. No previous mobile/modal page existed to capture; the actual missing-route baseline is preserved instead. Continuous recording remains missing because this direct headless Playwriter session lacks extension tabCapture; screenshots and exercised keyboard/actions do not establish timed-motion fidelity. This template adds no timed animation. No Safari, physical-device, screen-reader session or real-account flow was tested. Evidence coverage is separate from the authorized merge.

Source/media digests, dimensions and UTC file timestamps are recorded in `manifest.json`; source digests identify the code behind final captures without self-referential commit hashes. Historical states are identified above. All screenshots linked here were visually inspected.
