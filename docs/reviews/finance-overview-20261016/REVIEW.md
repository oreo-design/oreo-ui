# Finance Overview — skeleton to data

## Pre-edit grounding
Reference: https://x.com/hakimhn_/status/2110770755713814650 (Hakim Haiman, “Skeleton to live data UI”). Actual 6.05s video inspected: blank intro at 0s, matched skeleton geometry around 0.8s, staggered row reveal at 1.65s, populated two-panel overview at 3s, blank outro at 5.8s. Original browser captures retained. Left: dark attention list with tinted icons and text actions. Right: light bank accounts with masked account IDs, balances, compact bar trends, total, connect row. No inference from tweet text alone.

Baseline `c67a0a8f24bc5fdfea0ed74c948faa7ee4ac8067` from freshly fetched origin/main. `/finance-overview` previously falls back to Button docs (`before-entry.png`). No prior equivalent route. Component-specific missing-route/narrow baselines not separately captured; baseline source retained. Environment: local fixture, English, 1440×1080 light.

| Target → peer | Canonical owner / reuse | Difference and evidence |
| --- | --- | --- |
| Bank list → Cross-Currency balances/activity | `src/components/currency-finance` money formatting and fixed rational FX helpers; shared neutral borders, tinted icon tiles, rows | Rendered `/cross-currency` inspected (`peer-cross-currency.png`). New bank rows have account identity + eight-point spark bars, rather than currency-only cards. |
| Attention panel → Inbox Stream / escalation cards | `src/patterns/stream/StreamCard.tsx`, `src/components/consulting/index.tsx`, shared Button/IconButton | Inbox Stream rendered/captured; escalation source-only. New composition uses compact rows and readable action links, not author notifications or task approvals. |
| Loading → MoneyActivityList loading | `src/components/currency-finance/index.tsx` content-shaped skeleton and retained-content refresh | Existing source-only loading comparison. New reusable SkeletonReveal adds matched slots and short content transition; no global loader overhaul. |
| Empty/error → AgentWorkspaceState | Shared title/description/action hierarchy, centered inside owning panel | Source inspected, runtime states to be captured after implementation. |

Use Oreo background/border/status/palette/radius/spacing/type tokens. Reuse existing Base UI Dialog for detail and sample account connection. Mixed contrast is reference-specific: dark attention panel stays dark; bank panel follows page theme. Actions are neutral shared variants, semantic badges inherit color. No bank integration, money movement or live FX claim.

## Scope and planned states
Four reusable components: SkeletonReveal, BalanceSparkBars, FinanceAttentionList, BankAccountList. Full Finance Overview with async local sample load/refresh, simulated failure/recovery, attention review/resolve/undo, account detail/connect validation, search, dark theme. Do not count financial values upward through invented intermediate amounts; reveal final values directly. Time-based reveal purpose is state indication, only on initial load/replay, 180ms opacity/4px translation with 30ms row stagger (bounded), shared ease-out; keyboard/reduced-motion use immediate changes. Refresh keeps readable data.

Six lenses: entry (missing route/new template/dialog return), loading (matched row geometry + refresh), empty (no items vs no matches vs failure), actions (shared Button/IconButton), titled scroll (opaque dialog title/footer around independently scrolling content), icons/color (semantic markers, neutral operations) all require final checks. No cross-product audit claimed.

Visual evidence is continuous, not a merge gate. Direct Playwriter session currently has no extension tabCapture recording; capture before/after and transition frames, explicitly leave continuous timing/real-device touch coverage unverified. No fabricated video.

## Implementation and verification
Four exported components and a full local template are registered in routing, sidebar, metadata and live playgrounds. Currency conversion/formatting reuses currency-finance; icons and actions reuse Icon, Button and IconButton; dialogs use Base UI; empty/error states use AgentWorkspaceState. New CSS uses Oreo semantic palette, surface, border, radius and shadow tokens. The 4px translation and fixed minimum row dimensions are local geometry for the new reference-specific reveal.

- Initial request/replay: 1.2s simulated request, four notice/five account skeleton rows plus connect row. Ready values are final values; refresh retains readable data and disables mutations. Replay restores local edits. Timers are cancelled on unmount.
- Failure and retry exercised in browser, with prior data retained. Initial failure totals/counts use an em dash rather than implying a zero balance.
- Reminder detail → mark reviewed → undo exercised; resolving all four gives the canonical caught-up state. Search with no match → Clear search restores accounts.
- Empty account form rejects missing name/bank; valid Savings / Oreo Bank / 1234 creates a zero-balance row. Account details include eight exact daily values. Escape returns focus to its account trigger. Undo removes the new local account.
- All four playgrounds rendered; Code output inspected for correct public component import, concrete serializable props and host-owned callback placeholders. Skeleton loading control, bank error/retry, attention empty and invalid-trend fallback exercised. Documentation API opened and inspected.
- Focused model suite: 5 passing tests (comparison edge cases, proportional/invalid/zero charts, immutable review, validation/duplicates, search). TypeScript and production build pass; existing large-bundle warning remains.

## Evidence map
Local fixtures only; English. Desktop 1440×1080 light unless specified. Browser screenshots inspected. No account credentials or live banking, payments or production verification.

| Scenario | Before | After | Coverage / change |
| --- | --- | --- | --- |
| New template entry | before-entry.png | after-ready-v3.png | Actual former fallback → complete new two-panel overview |
| Initial loading → ready | baseline route above; reference hakim-skeleton.png / hakim-transition.png / hakim-3.png | after-loading-v3.png → after-ready-v3.png | Matched desktop row slots; static captures do not prove timing |
| Retained refresh / failed refresh / recovery | No prior route; baseline revision preserved | after-refresh.png / after-error.png / after-ready-v3.png | Functional recovery verified; earlier refresh/error captures precede removal of duplicate action arrows |
| Empty/reminder/search recovery | No prior route | after-empty.png | Distinct caught-up and no-matches states; clear and undo exercised |
| Validation / account zero details | No prior route | after-validation.png / after-account-zero.png | Error and successful recovery; earlier captures precede icon cleanup |
| Responsive light/dark | Missing-route narrow baseline not captured | after-mobile-light-v2.png / after-mobile-dark.png | 390×844 viewport; full-page captures; readable wrapped balances, single column |
| Dialog context / title and scroll | No prior route | after-mobile-dialog.png | Dark mobile full-page capture includes scrolled background; dialog is viewport-fixed; viewport crop added below |
| Medium / reduced motion | Missing-route medium baseline not captured | after-medium-dark-reduced.png | 900×1000 dark; OS reduction emulated; no continuous timing claim |
| Component documentation | Missing-route component baselines not separately captured | docs-skeleton.png / docs-api.png / docs-attention-empty.png | Canonical playground / docs / shared empty state |
| Changelog | before-changelog.png | after-changelog.png | Same desktop viewport/theme |

Superseded originals are retained: after-ready.png and after-ready-v2.png contained wrapping/duplicate arrow icons; v3 is canonical. after-loading.png had a cursor overlay; v3 is canonical. after-mobile-light.png predates icon and minimum-height fixes; v2 is canonical. docs-bank-error.png predates unavailable-total correction. No source screenshot overwritten.

## Motion review
| Before | After | Why |
| --- | --- | --- |
| Reference count-up / blur | Final amounts appear directly; 180ms opacity + 4px translate, 30ms row stagger capped at 120ms (`src/components/finance-overview/finance-overview.css:1`) | State indication without displaying fabricated financial values; transform/opacity only |
| Default shared press scale | This template opts into tapScale=1 | Avoid unnecessary movement on repeated/keyboard financial controls |
| Hidden content still focusable risk | Pending content is inert and aria-hidden; skeleton always decorative (`src/components/finance-overview/index.tsx:56`) | Prevent focus entering hidden actions |

Verdict: Approve code-level motion review. No layout-property animation or transition:all; CSS transitions are interruptible. Shared strong ease-out; keyboard and reduced-motion opt out, a deliberate conservative choice for this dashboard. Continuous motion recording is unavailable in this direct Playwriter session (extension tabCapture disconnected); timing smoothness and real-device touch remain unverified. Static state evidence is separate from that gap and does not block authorized delivery.

### Final correction round
Product source snapshot `80c5092` was reviewed, then keyboard activation was hardened on Refresh, Replay loading and Simulate failure: click `detail === 0` explicitly disables reveal, in addition to keyboard capture and reduced-motion CSS. Browser keyboard replay now reads `data-animate=false` after completion; reusable SkeletonReveal keyboard toggling also verified false. Initial-failure counts/totals are unavailable em dashes. `docs-bank-error-v2.png` supersedes v1. `after-mobile-dialog-viewport.png` supplies the pending 390×844 viewport crop with fixed title/footer and full account table.

PR: https://github.com/oreo-design/oreo-ui/pull/87. Changelog addition links this actual PR. Final screenshot manifest records file hashes/dimensions and source content hashes; evidence-only later commits do not alter the captured product code. Canonical ready screenshot v3 matches final visible overview; final correction only affects keyboard transition intent and initial-error labels. Deployment is not verified.
