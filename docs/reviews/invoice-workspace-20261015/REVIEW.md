# Invoice Workspace — review record

Reference: [Louis on X](https://x.com/louisnstudio/status/2110442646607122924), [interactive reference](https://louis-unpaid-invoice.vercel.app). The reference image and actual prototype were inspected: status-sorted invoice rows, gradient avatars, List/Board/Simple/Overview, status filter, row menu and invoice detail dialog. Only read-only actions were taken on the reference prototype.

PR: [#51](https://github.com/oreo-design/oreo-ui/pull/51).

Implementation: `InvoiceStatusBadge`, `InvoiceTable`, `InvoiceTotals`; `/invoice-workspace`; three docs/playgrounds; sidebar/metadata; Changelog. Local fixture only. EUR cents and an explicit as-of date (2026-10-15) drive all views. Board cards open an editor; no drag-and-drop or external invoicing is implied.

## Revisions and capture environment

- Baseline: `19f70beaab34eb0c5adf341678e72b5a6c091f2e` (fresh origin/main).
- Product revision: `51d2d17b00ca959188bb04889d0aa709fff29625`. Most screenshots were captured from this implementation before committing; the only intervening visual correction was the mobile theme button. No original was overwritten.
- Worktree: `/Users/ziye/Documents/Project/Research/oreo-ui-invoices-20261015`, branch `codex/invoice-workspace-20261015`.
- Chromium, Playwriter session 58, task-owned tabs, `http://localhost:5225`, English UI. Desktop 1440×1000, mobile viewport 390×844; source-image capture 1440×1080. Local fixtures, no account. Capture date: October 15, 2026 Asia/Shanghai.
- Baseline entry and Changelog are light theme at 1440×1000. Before editing, visiting the requested `/invoice-workspace` resolved to the existing Button playground because the invoice route did not exist. That real result is the baseline; peer task dialogs are comparisons, not a fabricated invoice baseline.
- SHA-256 and PNG dimensions for every evidence file are in `manifest.json`.

## Page/state evidence

| Scenario | Before / comparison | After | Change and verification |
| --- | --- | --- | --- |
| Requested route / default list | [before-entry.png](before-entry.png) | [after-list-final.png](after-list-final.png) | Missing invoice route becomes complete workspace. 19 invoices, default status order, EUR totals, six sortable columns. `after-list.png` is the earlier capture, retained. |
| Reference and peer surfaces | [reference image](louis-invoice-reference.png), [live prototype](louis-invoice-live.png), [Project Workspace](peer-project.png), [task dialog](peer-task-dialog.png) | [expanded navigation](after-expanded-navigation.png), [invoice dialog](after-dialog.png) | Compact rail, shared controls/status/avatar, titled dialog; invoice fields and currency table remain domain-specific. |
| Board / Simple / Overview | No existing invoice equivalents; default-entry baseline above | [Board](after-board.png), [Simple](after-simple.png), [Overview](after-overview.png) | Shared modified dataset: 21 invoices and €110,899.50. Overview outstanding includes overdue; cards are not disjoint sums. |
| Validation | No previous invoice form | [create error](after-create-error.png), [dialog](after-dialog.png) | Blank client/description rejected. Negative amount rejected; correction saved. Created INV-0095 (€125.50), edited to Pending/€150.25; duplicate INV-0096 is Draft. |
| Delete / empty / recovery | No previous invoice operation | [confirmation](after-delete-confirmation.png), [deleted filtered view](after-delete-empty.png), [search empty](after-search-empty.png) | Keep cancels; Delete removes; Undo restores exact invoice. Search-empty clear action restores results. Export disabled while empty. |
| Mark paid while filtered | Initial Overdue list: 3 invoices / €9,700 (runtime snapshot) | [after-paid-filtered.png](after-paid-filtered.png) | INV-0070 marked paid; 2 overdue invoices / €5,500 remain. Original trigger disappears; Create invoice gets focus. |
| Dark theme and portals | Dark baseline not captured; no previous invoice route | [overview](after-dark-overview.png), [filter](after-dark-filter.png), [mobile](after-mobile-dark.png) | Shared tokens/Tag palette; local menu portal inherits theme. Mobile theme control remains available without the sidebar. |
| Mobile | Mobile baseline not captured; no previous invoice route | [list](after-mobile-list.png), [board](after-mobile-board.png), [overview](after-mobile-overview.png), [dialog](after-mobile-dialog.png), [scrolled dialog](after-mobile-dialog-scrolled.png) | Horizontal scrolling preserves table/board structure. Two-column totals; one-column 16px input form; sticky opaque dialog header and reachable footer. Viewport emulation, not physical-device/OS-keyboard proof. |
| Component docs and playgrounds | Existing docs shell seen in baseline | [empty table](after-table-playground-empty.png), [compact dark table](after-table-playground-dark.png), [status](after-status-playground.png), [empty totals](after-totals-empty.png), [API docs](after-documentation.png) | Registered controls and shared docs shell. Empty recovery restores table; compact hides description/date; paid badge and zero totals checked. |
| Changelog | [before-changelog.png](before-changelog.png) | [after-changelog.png](after-changelog.png), [full page](after-changelog-full.png), [entry](after-changelog-entry.png) | Entry links the template and actual PR. |

`intermediate-mobile-dark.png` is **superseded** by `after-mobile-dark.png`: initial mobile lacked a theme control and the early capture caught a closing filter transition. Retained for history, not acceptance evidence.

## Consistency review

This is an Oreo cross-surface review using actual Project Workspace/task-dialog and new workspace renders, plus shared source owners. It is not a cross-product review.

| Lens | Evidence / canonical owner | Result or gap |
| --- | --- | --- |
| Entry behavior | Baseline route, sidebar docs shell, Project Workspace | New route registered in App/site/sidebar; no new navigation system for docs. Collapsible workspace rail follows existing workspace role. |
| Loading | Synchronous local invoice fixture | No asynchronous invoice loading behavior; deliberately no fake spinner. Network/account loading states out of scope. |
| Empty and error | AgentWorkspaceState; table empty and form screenshots | Shared empty-state owner reused with clear-filter recovery. Validation is inline role=alert. Board-column emptiness is compact contextual text because it is inside one of five status columns. |
| Actions | Canonical Button/IconButton/Menu; runtime menus and dialogs | Shared sizing/pressed treatment, clear button semantics; menu actions emit callbacks. Delete confirmation and undo owned by host. Base UI focus/Escape behavior inspected. |
| Titled scroll surfaces | Project task dialog comparison; invoice dialog/mobile scrolled capture | Title remains in an opaque sticky header; content scrolls below it. Table has its own sticky headings and bounded horizontal/vertical scroll. |
| Icons/colors | Shared Icon, Avatar, Tag, semantic CSS tokens; dark menu screenshot | Status text remains primary signal. Status mapping uses existing orange/mint/pink/neutral tags. Alternate icon-provider toggle could not be resolved reliably through the automation locator; no claim of interactive Lucide verification. |

Same-role owners inspected: Tag/Avatar/Button/Menu, TaskRow and Project Workspace dialog, AgentWorkspaceState. No changes to those shared owners were needed. The new invoice module is the single owner for status derivation, money/date display, table sorting and totals. No backend or other projects edited.

## Focused verification

- `npm run build`: TypeScript and Vite passed. Existing bundle-size advisory remains.
- `git diff --check`: passed.
- Runtime: list/status filtering; amount ascending sort; search empty/recovery; all four views; sidebar expansion; create/edit validation and recovery; duplication as draft; delete cancellation/removal/undo; filtered mark-paid totals; mobile and dark views.
- Keyboard: Tab stays in opened detail dialog; Escape closes; focus returns to row action. After deletion/filter removal of that trigger, focus returns to Create invoice.
- CSV download event occurred. Playwright `saveAs` could not copy the Chromium download artifact, so the actual `~/Downloads/oreo-invoices.csv` was preserved byte-for-byte in `qa-export-original.csv.xz`; [qa-export.csv](qa-export.csv) is its LF-normalized readable copy. Parsed 21 records; sum €110,899.50; INV-0070 Paid and INV-0096 Draft. Export quotes cells and prefixes leading formula characters in source.
- Fresh runtime logs after interaction contained no application error; development HMR logs include expected module invalidation while editing. No production endpoint verified.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No invoice dialog at baseline | `invoice-workspace.css:391–421`: 180ms opacity + full transform from scale(.97), shared `--ease-out`; centered dialog | Short contextual entry/exit with no layout animation; ordinary form opening is occasional. |
| Existing Menu component | Reused `menu.variants.ts:17–23`: trigger-origin scale/opacity, 150ms entry / 100ms exit | Preserve canonical menu behavior instead of a bespoke animation. |
| No invoice filtering or view transitions | Search/filter/sort/view selection update immediately; controls use tapScale=1 | Frequent work should not wait through decorative motion. |
| Standard dialog movement | `invoice-workspace.css:562–568`: reduced-motion drops transform, keeps opacity | Preserve state signal without spatial movement. Reduced-motion dialog opened/closed in browser; screenshot captured. |

**Approve.** No newly introduced high-frequency or layout animation, no scale(0), custom easing and duration within the existing product range. CSS transitions remain interruptible; hover rules are fine-pointer gated. Screenshot evidence alone is not a timing proof.

[Interaction recording](invoice-interaction.mp4): actual menu → Open invoice → Tab → Escape → return focus, 1440×1000, 7.07 seconds, encoded at 30fps. Inspected decoded contact sheet and animation frames. Original 80 CDP JPEG frames/timestamps are preserved in `recording-original.json.xz`; `recording-timing.json` records the edit (operator idle holds capped at 2 seconds). Encoding rate is not a frame-performance benchmark. No pre-change invoice recording exists because the route was absent. Reduced-motion behavior has source + runtime/static evidence, not a matched motion recording. Those are explicit evidence coverage gaps, not delivery gates.

## Boundaries

Local, frontend fixture actions only. Reload resets data. No email, payment, authentication, persistence or physical-device validation. New mobile/dark states and component docs do not have matched pre-change screenshots; the desktop route and Changelog baselines are preserved. Screenshots and recording document implementation separately from PR merge/deployment status.
