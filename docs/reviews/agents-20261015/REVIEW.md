# Agent Connections — reference implementation and review

Reference: [Priyank, October 14](https://x.com/Priyank/status/2110430943270052172). The public image shows a sidebar MCP setup card with five client marks on an arc, one setup button, and two compact circular usage indicators. [Original browser capture](reference.png); [public metadata](source.json). X itself returned 403; the image was inspected through its public media URL. The main setup flow is an Oreo composition, not an unseen part of that reference.

Baseline: `1307a3acc921144d7ea376515e7ed84bec9bb424`. Worktree: `oreo-ui-agents-20261015`. Local browser fixture at `http://localhost:5220/agent-connections`. No network connection, credentials, or persisted account mutations. The primary checkout's existing WIP is untouched.

## Changes and reuse

- **AgentConnectCard**: shallow elliptical horizon, up to five centered identity orbs, title, description, and canonical Oreo Button. Original brands/background artwork are not bundled. The primary action uses Oreo's neutral primary treatment rather than introducing a blue button variant.
- **QuotaUsage**: SVG ring with readable amount/limit, over-limit text, unknown-usage and no-limit states. Real over-quota usage stays visible; ring and meter value are clamped. This is an absolute quota, unlike FeatureCards' percentage-only SegmentedUsage; Activity BudgetMeter is a financial bar. Neither is duplicated.
- **AgentClientPicker**: controlled native radio group, keyboard arrows, disabled clients, shared centered empty state. Native semantics are sufficient for this direct single-choice form; no custom keyboard state machine.
- **Agent Connections template**: compact sidebar entry and quotas; client selection, scope search, permission validation, configuration example/copy, multiple independently managed demo connections. Reuses Button/IconButton, Icon, OreoLogo and AgentWorkspaceState.
- Adds routes, documentation, playground exports and navigation. Changelog entry is included in the final source revision.

Spacing/type/radii/colors map to existing Oreo scales and semantic variables. The arc geometry (ellipse width/offset and symmetric orb coordinates) has no existing layout token and is intentionally local. No dependencies or existing component behavior changed.

## Evidence map

All media are actual Chromium captures through Playwriter session 53, English locale, local fixture. Desktop 1440×1000, tablet 768×1024, mobile 390×844; full-page images retain the viewport width and document height. Original files are retained.

| Scenario | Before | After | Coverage |
| --- | --- | --- | --- |
| New route / docs entry | [Desktop fallback](before-desktop.png), [mobile fallback](before-mobile.png) | [Desktop entry](desktop-entry.png), [mobile](mobile.png), [tablet](tablet.png) | Exact baseline had no Agent Connections route; navigation redirected to Button. No equivalent setup page existed. |
| Light/dark template | No matching preexisting page | [Dark desktop](desktop-dark.png), [dark mobile](mobile-dark.png) | Normal template and the three new components in context. |
| Empty/search/recovery | New local states | [Search empty](search-empty.png), [permission error](access-error.png), [connected](connected.png), [configuration](configuration.png) | Zero permissions rejected; one permission recovers; saving and independent clients exercised. |
| Components/docs | New routes | [Card playground](card-playground.png), [client playground](client-playground.png), [client empty](client-empty.png), [API docs](client-docs.png), [quota over limit](quota-over-limit.png), [no limit](quota-no-limit.png) | Native keyboard selection, disabled choice, empty-list restore, 4500/3000 and zero-limit rendering. |
| Changelog | [Baseline](changelog-before.png) | Final capture added after PR number exists | Baseline recovered in an exact-revision checkout on port 5221. |

[Initial desktop](initial-desktop.png) is superseded: the promo card initially fell below the fold as the main column grew. The final sidebar stays within the desktop viewport, then returns to normal flow below 850px. Prior dark captures predate the native `color-scheme` polish; final captures will supersede them without overwriting originals. The 1-tool success text in the early connected capture was subsequently pluralized correctly.

## UI consistency review

Scope: new Oreo web components, template, docs and Changelog entry. Compared actual [Connections Workspace](peer-connections.png) plus its working inline new-connection picker, and inspected ConnectionState, SkillCard, Activity and FeatureCards shared owners.

| Lens | Target → peer / owner | Result | Evidence or limit |
| --- | --- | --- | --- |
| Entry | Promo CTA / setup → Connections inline setup | Checked | Both remain on the page. CTA moves focus to setup heading; client selection is native radio navigation. Existing project combobox was opened in the peer. |
| Loading | New local fixture / Connections local fixture | Not applicable | No asynchronous data acquisition or fabricated wait state. Copy has an explicit fallback if clipboard access fails. No live-server loading claims. |
| Empty | Connected clients, tool search, empty picker → AgentWorkspaceState | Checked | Shared centered icon/title/description. No-results has a useful Clear search action. Permission errors remain alerts rather than empty success. |
| Actions | Setup/connect/manage/disconnect → canonical Button / IconButton | Checked | Same variants, sizes and text inheritance; disconnect uses existing danger style. No duplicate button implementation. |
| Titled scroll | Main form / Connections normal-flow sections | Checked | Titles scroll with content; no content travels under them. Desktop sidebar is independently sticky; no title fade is needed. |
| Icons / color | Tool rows / shared Icon and button inheritance | Checked | Neutral icons follow text, selected client has outline and check, quotas have explicit over-limit text. Theme tokens reviewed in light/dark. |

External reference: the supplied image is the focused reference. Adopted arced identities, compact CTA, quota hierarchy. Rejected its brand artwork and unrelated finance table fragment. No broader cross-product or full-site consistency claim.

## Verification and limits

- TypeScript and Vite production build pass (existing large-chunk warning).
- Browser: native radio ArrowRight selects the editor; clear-search recovery; two default scopes can be unchecked, empty selection rejected; one read scope connects; saving a second scope updates that client; two clients coexist; disconnecting editor preserves desktop; example copy reports success; reload restores local defaults.
- Playground: disabled custom radio cannot be selected; empty list/restored list; over-limit ring at actual usage 4500, maximum 3000; zero limit changes to non-meter No limit set; API documentation and source-module registration.
- Responsive captures visually inspected. No horizontal overflow in the inspected mobile main. Final source and evidence revisions, fresh-page diagnostics, Changelog proof and delivery result are recorded below when available.
- Not tested: real MCP transport/authentication, production deployment, clipboard-denied runtime branch, nonfinite usage via browser controls (reviewed in code only). No such capabilities are claimed.
- No new entrance/selection/number animation: frequent data and keyboard updates are instant. Existing shared button tapScale is 1. A scroll recording will cover the desktop sidebar behavior; new-page baseline has no comparable sidebar interaction.

## Animation review

| Before | After | Why |
| --- | --- | --- |
| New components absent | Static arc and quota; immediate selection and state feedback | The reference is a still image; continuous orbit or animated counters would add unsupported motion. |
| Main-content height pushed sidebar promo below fold | Sticky desktop sidebar; normal-flow tablet/mobile | Preserve the reference's persistent sidebar role without hiding narrow-screen content. |

Disposition: approve the absence of new animation. Shared primitives retain their existing behavior. Record scroll behavior separately from still-frame visual coverage.
