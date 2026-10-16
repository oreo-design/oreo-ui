# Subscription Workspace — review index

Baseline: 85a96bae23623562abe39e3656acde15e6182dbe. Preview localhost:5267. Chromium / Playwriter session 10, English, local fixture. No charges, messages or live network enrollment.

## Pre-edit reference and comparison

Source: https://x.com/jubayer6910/status/2110770177428058596. Four actual full images inspected in the browser (`oreo-jubayer-1..4.png`): centered segment-rule dialog with ALL/ANY and live summary; target dialog with share-based allocation; customer dialog with three plan cards and recurring-revenue impact; member dialog with sponsor-derived leg, locked earned tiers and welcome-kit toggle. These are static images; no source timing/interaction claim.

| Target | Existing same-role owner and evidence | Reuse / justified difference |
| --- | --- | --- |
| Four creation dialogs | Company Directory add form, `peer-company-dialog.png`; SubscriptionDialog, `peer-subscription-dialog.png` | Same Base UI Dialog behavior, shared buttons, opaque header/footer and scrolling form body. Centered compact creation composition follows existing subscription dialog and supplied image; long company inspector remains untouched. |
| Segment rules | QueryFilterBar / trace-query model; `peer-trace-explorer.png` | Reuse QueryCondition, fieldOperators, validateCondition and matchesQuery, InlineSearchSelect. New inline rule rows expose ALL/ANY instead of trace-specific chip popovers and fixed AND. |
| Metadata controls and labels | Company form and shared Tag/Avatar/Switch/Button | Reuse controls, semantic tokens and existing radius/spacing. Native radio group for price choices: existing Plan component is an execution plan, not a pricing selector; SavedPaymentMethods demonstrates radio card semantics (source-only). |
| Live summaries and empty content | DashboardStatCard, AgentWorkspaceState | Reuse stats and centered empty result. New segment preview and exact target allocation serve different aggregate roles. Source-only peer aggregate comparison; final new components will be inspected. |

`before-route.png` preserves the actual missing `/subscription-workspace` route (Button fallback), 1440×1080 light. No comparable existing page or pre-change four-dialog flow exists. Dark/narrow baseline is an explicit gap, not replaced by unrelated screenshots.

## Planned coverage

Four dialogs: draft, cancel, submit, return focus; invalid names/numbers; matched-all/any/zero rules and no matches; exact allocation sum; customer plan/date impact; sponsor-derived member leg, locked tiers, local welcome request; desktop/light/dark, medium and narrow; docs/playground/changelog. Loading is not applicable to synchronous local fixture operations; no invented remote pending state.

## Implemented result and matched evidence

Four reusable exports: `SegmentRuleBuilder`, `SegmentPreview`, `SubscriptionPlanPicker`, `RevenueTargetEditor`, composed at `/subscription-workspace`. All four have playgrounds, API docs, sidebar entries and route metadata. Existing Base UI Dialog, Button/IconButton, InlineSearchSelect, Switch, Avatar/Tag, DashboardStatCard and AgentWorkspaceState are reused; query evaluation/validation belongs to the existing trace-query model. No shared components or token values changed.

| Scenario | Before | After / evidence | Outcome |
| --- | --- | --- | --- |
| Route entry, desktop light 1440×1080 | [Missing route](before-route.png) at baseline | [Workspace](after-workspace-light.png) | Complete customer/member/revenue workspace; local fixture only |
| Desktop dark | No equivalent pre-change page | [Workspace](after-workspace-dark-v3.png) | Three stats and dense native tables; future customers excluded from MRR |
| Segment | Static source 1; peer query/page evidence above | [Dark](after-segment-dark-v3.png), [light](after-segment-light.png), [zero result](after-zero-segment.png) | ALL=5, ANY=19 in fixture; zero rules=22 active; invalid rules block save; save adds a selected pinned segment |
| Revenue target | Static source 2 | [Dark](after-target-dark.png), [light](after-target-light.png), [zero MRR](docs-target-zero-mrr.png) | $1,800.01 allocated as $501.07+$501.07+$422.87+$375; zero MRR splits equally. $2,000.01 save and undo verified |
| Customer creation | Static source 3 | [Dark](after-customer-dark.png), [light](after-customer-light.png), [recording](interaction.mp4) | Empty name and normalized duplicate phone rejected. ArrowRight selected Family; today's new customer moved MRR $1,128→$1,207; undo restored. Future 2026-11-01 customer left MRR $1,128 |
| Member creation | Static source 4 | [Dark](after-member-dark.png), [light](after-member-light.png), recording | Sponsor Jamie Park inherits East studio. Welcome off saved “Not requested”; welcome on saved “Requested locally”. Creation and undo verified |
| Search and recovery | No equivalent pre-change page | [Empty search](after-search-empty.png) | Zero results and clear filters recovery |
| Narrow 390×844 | Baseline capture gap | [Workspace](after-mobile-workspace.png), [segment](after-mobile-segment.png), [customer](after-mobile-customer.png), [scrolled customer](after-mobile-customer-scrolled.png), [member](after-mobile-member.png), [target](after-mobile-target.png) | Dialog 374×828, page width 390 without horizontal page overflow; opaque header/footer, body scroll retains controls |
| Medium 1024×900 | Baseline capture gap | [Workspace](after-medium.png) | Responsive navigation, stats and table container |
| Docs/playgrounds | New routes; no old corresponding component | [Rules](docs-rule-playground.png), [API](docs-rule-api.png), [preview](docs-preview.png), [plans](docs-plans.png), [target](docs-target.png) | All four render; target control changes and zero MRR fallback verified |

## Consistency review — six lenses

- Entry: existing Company Directory and SubscriptionDialog were inspected in browser. Same modal foundation and action hierarchy; compact centered composition follows SubscriptionDialog and source. Escape restores focus to New segment; save/cancel close correctly.
- Loading: not applicable to synchronous local fixture operations. No claimed server fetch, async enrollment or loading transition.
- Empty: existing AgentWorkspaceState reused. Segment no-match and customer no-search-result were captured and inspected; clear recovers the table. Zero-MRR target keeps exact allocation and explains missing ARPU.
- Actions: canonical Button/IconButton and Switch; form action copy identifies local creation, pin checkbox native, pricing native radio group. Browser tested keyboard plan changes, save, undo, cancel and Escape. No live payment/message side effects.
- Titled scroll surfaces: dialog header/title and footer are opaque and outside the scrolling body; narrow scrolled screenshot confirms content does not paint over them. Table header belongs to its own bounded overflow container. Equivalent company form and subscription dialog were compared; existing behavior preserved.
- Icon/color: canonical Icon wrapper and semantic text/status/palette tokens. No direct icon library dependency; dark and light captures inspected. Local dark backdrop uses 80% `--color-bg-base` to keep this reference's dimmed context, because the existing global dark overlay token is intentionally light. Shared overlay tokens unchanged.

## Visual/motion review — Approve

| Before | After | Why |
| --- | --- | --- |
| No corresponding page; shared query model and dialog primitives already exist | Four local flows with controlled reusable components | Fill the reference's missing operations without duplicating shared foundations |
| First implementation reused `sw-` prefix and collided with Sales Workspace | Unique `subw-` scope, 44rem maximum dialog, 1.5rem desktop/0.5rem narrow margins | Prevent cross-template layout inheritance; other consumers unchanged |
| Global dark overlay produced a light veil | Local token-derived dark scrim | Preserve source contrast without changing shared product tokens |
| Duplicate form/editor alerts in first target capture | Editor owns target and rule inline errors; form owns name/contact errors | Avoid duplicate screen-reader announcements |
| No corresponding motion baseline | Existing Switch motion only; no new modal/list animation or custom durations | Reuse house motion; direct state transitions suit frequent form work |

`interaction.mp4` is real Playwriter/CDP browser capture, 33.12 seconds, 1440×994 output. Relay supplied 1440×993 frames; one bottom padding pixel was added for H.264 compatibility, with no crop, resize or UI reconstruction. Original JPEG frames, timestamps and concat input are retained in `interaction-frames/`. Key source frames inspected. It covers match changes, empty result, removing/adding rules, customer keyboard selection/save/undo, target split/save/undo, sponsor selection/member creation/undo. No equivalent old flow existed for a before recording; that is an explicit coverage gap.

Superseded captures retained: `after-workspace-dark.png`, `after-segment-dark.png` (prefix collision); `after-segment-v2.png` (workspace after hot reload, despite filename); `segment-dark-final.png` (light backdrop defect, despite filename); `target-error.png` (duplicate error before correction). Use v3 or the final error-recovery capture when available. All other screenshots are fixture evidence, not account or production evidence.

## Verification and limits

- Six focused Node model tests passed: ALL/ANY/empty/invalid rules, current MRR, exact cent allocation including zero weights, amount/month bounds, leap/month-end renewal and tenure, normalized duplicate phone and dates.
- TypeScript project build passed; Vite production build passed with existing large-bundle warning.
- Browser checks listed above passed. No browser error logs observed in the template's focused run.
- Static source images establish layout, not original animation timing. Keyboard and narrow viewport checks are browser fixture checks, not physical mobile or assistive-technology certification.
- Data resets on reload, as the UI states. No persistence backend, charges, sent kits/messages, production deploy or remote enrollment is implemented or claimed.
- Manifest records source/media hashes; baseline remains `85a96bae23623562abe39e3656acde15e6182dbe`. Integration status is recorded in the linked PR, separately from media coverage.

Final checks: [single past-month validation error](target-error-final.png) confirmed blocked submit and corrected single announcement. Unpinned segment remains selectable in the saved-segment picker, editing updates that same segment, and undo restores its previous data. The review approved this task diff before commit.

Delivery PR: https://github.com/oreo-design/oreo-ui/pull/95. Implementation revision `1919e55` contains the reviewed component/template and evidence. Follow-up only adds the changelog entry, its capture and this index; final exact-head approval is recorded in PR metadata.

Changelog baseline was recovered after editing from the preserved, clean Issue Browser checkout at `07b587383eee05e77e29bde5e89c062eb4c0265c` (localhost:5266), whose src tree is identical to baseline merge `85a96bae`. Matched 1440×1080 light [before](before-changelog-recovered.png) and [after](after-changelog.png) were inspected; count increases 60→61 and PR #95 links the new entry.
