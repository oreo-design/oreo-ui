# Plan Upgrade — Jordan Hughes reference

## Source and scope

Reference: https://x.com/jordanphughes/status/2110767174008574457 (Jordan Hughes, “Day 1,324”). Two static 3840×2880 images were inspected in a task-owned browser tab: [desktop reference](reference-desktop.png) and [mobile/detail reference](reference-mobile.png). The web fetch returned 403 and the X media click requested login; public media URLs from the post metadata rendered successfully in the browser. Images are evidence only; no reference artwork, portraits, brand assets or implementation was copied into the product.

Observed: narrow icon rail, settings sidebar, three checkout steps, saved payment choices with edit/remove, manual entry and a dotted-rule summary with coupon, discount, tax and total. Adopted the hierarchy, two-column checkout and responsive stacking. Replaced source branding and scenery with Oreo's semantic surfaces, shared controls and neutral initials. The manual entry intentionally captures display metadata only (name, last four digits, expiry); a production provider-owned card field is outside this frontend demo. The source does not reveal Plan or Complete behavior; those are original working local flows, not claims about the source app.

Three reusable components: SavedPaymentMethods, DiscountCodeField, CheckoutSummary. Complete template: `/plan-upgrade`, with a preselected annual plan opening on Payment to match the reference, editable Plan, metadata CRUD/undo, coupon validation, explicit failure recovery and local completion. No real charge, subscription, wallet login, provider connection, email or durable storage.

Baseline: `0b4987091da75778dca674ca147757200b77ad3a`. Branch `codex/plan-upgrade-20261016`. Isolated worktree; primary dirty workspace preserved. Capture environment: localhost:5243, Chromium via Playwriter session 1, English, deterministic sample state. Desktop 1440×1000, tablet 960×1000, mobile 390×844. Theme is page-local. Overlay hidden. Product hashes and original media hashes are in `manifest.json`.

## Before / after

| Surface/state | Before | After / verification |
| --- | --- | --- |
| Template entry | [actual absent route → Button](before-entry.png) | [payment light](after-payment-light-settled.png), [dark](after-payment-dark-settled.png). No prior plan-upgrade surface existed. |
| Plan | No equivalent prior stage | [8 monthly seats](after-plan.png), [invalid seats](after-invalid-seats.png). Monthly/annual changes recalculate; 0 seats hides the total and blocks continuation. |
| Saved methods / metadata | New interactive surface; reference static only | [payment](after-payment-light-settled.png), [empty form error](after-method-error.png). Select, edit name, add 4242, remove selected method, blocked continue and Undo tested. |
| Discount | New state | [invalid code](after-code-error.png). Editing invalidates the discount; invalid code restores $506.88. Applying FRIENDS by Enter restores $414.72. |
| Failure / recovery / completion | No prior matching flow | [failed attempt](after-failure.png), [complete](after-complete-final.png). Failure preserves state; recovery completes 4 monthly seats at $43.20 with Mastercard. Completion clears removal Undo so the receipt cannot change afterward. |
| Responsive | New page | [mobile light](after-mobile-light-settled.png), [mobile dark](after-mobile-dark-settled.png), [mobile plan](after-plan-mobile.png), [tablet](after-tablet.png). Actual HTML scroll/client widths 390/390 and 960/960. Summary follows the form on mobile; no horizontal page overflow. |
| Component states/docs | New routes absent; individual baselines not captured | [saved methods](after-methods-playground.png), [empty](after-methods-empty.png), [error](after-methods-error.png), [loading](after-methods-loading.png), [discount](after-discount-playground.png), [summary](after-summary-playground.png), [docs](after-docs.png). Empty recovery and retry tested, radio ArrowDown selects Mastercard. |
| Changelog | [before](before-changelog.png) | PR-linked entry and capture added during delivery. |

[Interaction recording](interaction.mp4): real local Plan → monthly cycle → Payment → Mastercard → Complete, 1440×1000, 3 seconds. Original 11 screencast events in `interaction-frames.json.xz`. Viewing copy clamps idle intervals to 2s and holds very short frames for 0.1s; not a performance benchmark. Actual resulting video frame was inspected. No custom animation was added; existing shared button color transitions and StepProgress behavior are inherited.

Historical captures remain. `after-payment-v1.png` precedes corrected Avatar/IconButton props. Earlier `after-payment-light.png`/`dark.png` precede the applied-code status fix. `after-payment-dark-final.png` and early mobile light/dark captures caught shared button color transitions; use the settled images linked above. `after-complete.png` is an earlier successful annual flow; final completion additionally clears obsolete Undo.

## Consistency review

Runtime peer: [Payment Workspace](peer-payment.png), with its source, shared Button/IconButton, Avatar, Tag, StepProgress, AgentWorkspaceState and existing Finance PaymentCard source. Finance PaymentCard is a display card rather than a selection list, so SavedPaymentMethods adds a distinct role rather than a second payment-card skin. Review scope is these Oreo web surfaces; not a cross-product audit.

| Lens | Canonical owner / same-role peer | Result and evidence |
| --- | --- | --- |
| Entry | App, route metadata, Sidebar, Playground; Payment Workspace stage navigation | Checked. Standard four-route registration; stage navigation gates invalid seats, moves focus to heading and never invokes payment services. Horizontal stage breadcrumbs suit three linear steps; existing StepProgress reused on completion rather than forcing the hierarchical TreeStepper into a new layout. |
| Loading | Existing data-shaped list fixtures; AgentWorkspaceState | Checked in source and new Playground. Three card-shaped placeholders; refresh preserves rows and disables mutation. Peer loading runtime not separately captured. |
| Empty | AgentWorkspaceState, used by consulting/automation | Checked in source and new runtime. Centered title/description/action; add/retry work. Peer empty runtime capture gap. |
| Actions | Shared Button/IconButton, Payment Workspace actions | Checked. Canonical primary confirmation, secondary save/apply, tertiary metadata actions; tapScale=1. Native radio selection, no nested action inside label. |
| Titled scrolling | Payment Workspace document flow | Checked in code and narrow/full-page captures. All headings move with content. Desktop summary is an opaque sticky panel, so no fade is needed. No modal or sheet introduced. |
| Icon/color | Shared Icon vocabulary, Avatar, palette and semantic tokens | Checked. Neutral action icons/brand abbreviations; native radio/select scheme follows theme. Color/radius token scan has no unresolved references. Settled dark screenshot verifies readable buttons. |

| Before | After | Why |
| --- | --- | --- |
| Empty-string error suppressed accepted-code text | Status falls back when error is empty | Applied discount remains visible. |
| Invalid seat field still showed a one-seat fallback quote | Shared explanatory state replaces totals | Never show a misleading checkout amount. |
| Removal Undo remained after completion | Clear removal/notice on completion | Receipt identity cannot be changed by an obsolete action. |
| Immediate theme capture caught old foreground color | Inspect settled styles and recapture | Inherited 150ms Button color transition is not final contrast. |

## Validation and limits

- `npm run build`: TypeScript and production Vite pass; existing large-bundle advisory remains.
- `node --experimental-strip-types scripts/checkout/check.mjs`: passes reference arithmetic, alternate tax basis, integer rounding, invalid amounts/rates/seats and metadata expiry boundaries.
- Browser interactions: discount invalid/apply/Enter, radio keyboard selection, removal/Undo, missing-selection block, edit, metadata validation/add, annual/monthly and seat recalculation, invalid-seat gate, failure/retry, completion/restart, loading/empty/error fixtures. Responsive and theme captures above.
- Formula defaults to reference arithmetic: $460.80 − $92.16 + $46.08 = $414.72. Demo tax is explicitly based on pre-discount subtotal; alternate discounted basis is supported. This is no claim about applicable tax law.
- No source motion was visible; no source interactions inferred. No physical-device, payment-provider, real-account or deployed-site verification. Component route baseline gaps and peer loading/empty runtime gaps remain explicit. Evidence limits do not change scoped implementation/merge status.
