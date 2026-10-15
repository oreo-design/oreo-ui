# Command Dashboard — review record

Reference: [Efferd on X](https://x.com/efferdco/status/2110449789066490250). The 4.85-second video was inspected in the browser at 1.6, 3.8 and 4.4 seconds. X itself returned an access error; public metadata supplied the video URL. No remote video file was downloaded. Original metadata and browser frames are preserved here.

The reference shows an anchored Find field, F/ESC hints, grouped Platform / Developer commands, dark neutral surfaces and outline icons. It shows a cropped dashboard with placeholder regions, not a complete application. The seven-page developer workspace is an explicit extension: Overview, Deployments, Analytics, Storage, Resources, Integrations and Settings. Settings replaces the reference's cropped API Keys entry; no credentials UI is simulated. Later sampled video frames do not establish a separate filtered-results interaction.

PR: [#52](https://github.com/oreo-design/oreo-ui/pull/52).

Implementation: `CommandSearch`, `WorkspaceMetric`, `DeploymentRow`; `/command-dashboard`; three documentation/playground routes; sidebar/metadata; Changelog. All application actions use local fixtures and reset on reload.

## Revisions and environment

- Baseline: `1f8cd7c4b8dc839fb7b125b2e60499a1c2587b89`, freshly fetched origin/main.
- Product revision: `9e653546fc5328188896295129a9f7bb15cd15d8`. Earlier screenshots show work in progress; correction rounds below identify superseded states. Changelog/evidence follow in a separate commit.
- Worktree: `/Users/ziye/Documents/Project/Research/oreo-ui-command-20261015`; branch `codex/command-dashboard-20261015`.
- Chromium via Playwriter session 59, task-owned tabs, `http://localhost:5226`, English UI, October 15, 2026 Asia/Shanghai. Desktop 1440×1000; medium 1024×900; mobile 390×844. Reference viewport 1440×1040. Local fixture, no account.
- Before editing, requesting `/command-dashboard` resolved to the existing Button playground because the new route was absent. `before-entry.png` captures that actual result. `before-changelog.png` captures the existing update list. Both are desktop/light; the corresponding final light entry capture resets scroll to the top.
- SHA-256 hashes, dimensions and original filenames are in `manifest.json`. Static screenshots disable animations; the interaction recording is separate real browser evidence.

## Evidence map

| Page / state | Before or comparison | After | Result |
| --- | --- | --- | --- |
| New route / overview | [actual missing-route result](before-entry.png) | [light entry](after-entry-release-light.png), [dark default](after-overview-approved-dark.png) | Complete developer dashboard; four metrics, request chart, projects and actionable build rows. |
| Reference interpretation | [command](reference-command.png), [later frame](reference-results.png), [end frame](reference-end.png) | [command open](after-command-open.png) | Anchored grouped search, outline glyphs and keycaps retained; added workspace contents are an original composition. |
| Same-role product peer | [Position Studio](peer-position-studio.png), [open inline search](peer-search-open.png) | [component disabled state](after-component-disabled.png) | Existing Base UI Combobox behavior reused. Grouped actions differ from a persistent single-token selection because the host performs navigation/actions. |
| Search / empty / recovery | New capability; entry baseline above | [filtered](after-command-filtered.png), [empty](after-command-empty.png), [bottom of list](after-command-bottom.png), [focus return](after-command-focus-return.png) | Label/keyword search, clear recovery, keyboard activation, ESC return focus. Disabled item exposes aria-disabled and cannot execute; next action executes. |
| Deployments / failure / retry | No prior build workspace | [error](after-build-error.png), [recovered filtered empty](after-build-recovered-empty.png), [project status after retry](after-retry-project-status.png) | Local retry updates Ready counts, row and project status; Show all recovers empty filter. Focus moves to heading when retry disappears. |
| Project creation | No prior project form | [validation error](after-project-error.png), [created](after-project-created.png) | Empty/invalid name rejected; local folio-site draft increases count to four. No deployment starts. |
| Analytics / storage | New pages | [analytics](after-analytics.png), [corrected storage](after-storage-corrected.png) | 181,200 total / 25,886 daily average; shared SegmentedUsage shows 24% used / 76% free, with GB details. |
| Resources / integration / settings | New pages | [resources](after-resources.png), [saved](after-resource-saved.png), [integration](after-integration.png), [settings](after-settings.png) | Real local docs links, saved count, demo-only connection toggle, workspace rename and theme controls. |
| Responsive / themes | No pre-existing equivalent; mobile/dark baseline not captured | [medium](after-medium.png), [mobile light](after-mobile.png), [mobile menu](after-mobile-command.png), [mobile dark](after-mobile-dark.png) | Sidebar becomes horizontal page navigation; search menu stays within viewport; theme remains accessible. These are responsive browser fixtures, not physical-device proof. |
| Docs / playgrounds | New routes; no separate matched baseline | [metric](after-component-metric.png.png), [deployment callback](after-component-deployment.png.png), [disabled commands](after-component-disabled.png), [API](after-command-api.png) | Shared documentation shell, editable props, code generation and host callbacks verified. Double `.png.png` names are retained original capture filenames. |
| Changelog | [before](before-changelog.png) | [after](after-changelog.png) | New entry links the template and actual PR. |

## Consistency review

| Lens | Evidence and shared owner | Decision / coverage |
| --- | --- | --- |
| Entry | Actual old-route fallback, new overview; live Position Studio comparison | Reuse Oreo's docs/sidebar registration and workspace hierarchy. The workspace is full-page; search is anchored beside the header rather than a separate centered modal. |
| Loading | Synchronous local fixture and source review | No network-backed data or loading phase is claimed. No fake waiting indicator added. Real-account loading/recovery remains outside scope. |
| Empty / error | AgentWorkspaceState, command empty, failed filter and form captures | Reuse shared empty-state owner with clear/show-all actions. Form errors are inline alerts; deployment errors provide a local retry. |
| Actions | Button, IconButton, Base UI Combobox, Shortcut; live peer and template | Base UI owns selection, dismissal and keyboard behavior; onSelect leaves navigation with the host. No extra command dependency. Existing inline search keeps value-selection semantics. |
| Titled scroll surfaces | Position Studio search; command bottom screenshot; source review | Header search stays fixed to the workspace topbar; bounded command list scrolls while key hints remain outside it. No newly introduced scrolling dialog or hidden modal title. |
| Icons / color | Shared Icon, Tag, Avatar, SegmentedUsage, semantic CSS variables; light/dark captures | Icon names preserve shared provider inheritance and serialize cleanly in generated examples. Ready/Failed labels carry status independently of color. Alternate icon-provider interactive coverage is not claimed. |

Same-role owners/consumers inspected: InlineSearchSelect in Position Studio, Button/IconButton, Shortcut, Icon, Tag, Avatar, AgentWorkspaceState and SegmentedUsage. No shared-owner changes were necessary. This is a within-Oreo consistency review, not a cross-product visual claim. Template geometry uses the existing rem scale; colors/radii use semantic tokens. Chart percentages reflect fixture data, not copied design-tool dimensions.

## Corrections and historical evidence

- `after-overview-dark.png` predates the narrowed heading selector that stopped styling the New project button text. `after-overview-final.png` is a later intermediate. Use `after-overview-approved-dark.png` as the final default.
- `after-storage.png` shows an incorrect reuse of a currency budget component. Superseded by `after-storage-corrected.png`, using the capacity component with percentage/GB units.
- `after-project-created.png` and `after-overview-light.png` predate deriving project attention from deployment status. They still prove form creation/theme behavior. `after-retry-project-status.png` proves the corrected status after retry.
- `after-entry-light-final.png` retained a scrolled position; superseded for baseline matching by `after-entry-release-light.png` (top of page).
- `after-overview-release-dark.png` exposes duplicate keyboard outlines from the global button rule. Scoped trigger outline removal leaves one visible anchor outline; `after-command-focus-return.png` proves the correction.
- Initial playground code generation hit a circular React element in nested arrays. Command icons now use typed IconName strings; code view and a fresh-tab reload passed. Historical HMR errors remain distinguishable from fresh logs.

## Verification

- TypeScript + Vite build passed; existing large-bundle advisory remains. `git diff --check` passed.
- Browser: all seven pages, filters, project validation/create, failed-build retry and empty recovery, resources save, demo connect/disconnect, workspace save, light/dark and three viewport sizes.
- Keyboard: F opens outside editable fields; typing f in Project name does not open search. Cmd+K opens. Arrow keys/Enter navigate and execute; Escape closes and returns focus to Find. Create command focuses Project name. Retry returns focus to heading. Disabled command cannot execute, while Switch theme callback does.
- Docs: each new playground renders; metric and command generated code render; DeploymentRow callback is visible; Command Search API table renders. A fresh Command Search tab had no application error.
- Reduced-motion media setting: open/close exercised. Command state changes are deliberately instantaneous; no timing benchmark or screen-reader audit is claimed.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No command search at baseline | Instant open, highlight, filtering and dismissal | High-frequency keyboard work should not wait for decorative motion. |
| Existing shared controls | Reused Button/IconButton with tapScale=1 | Preserve control shape/state without adding press scale to frequent workspace actions. |
| No workspace chart / page transitions | Static chart; immediate navigation/state updates | No layout animation, entry stagger or chart-growth effect. |

**Approve.** No new spatial/timing transition. Hover styling is fine-pointer gated. Reduced motion uses the same immediate command behavior.

[Interaction recording](command-interaction.mp4): actual open → arrow navigation → Enter into Deployments → Cmd+K → search → Escape; 1440×1000, 9.37 seconds, encoded at 30fps. Decoded contact sheets inspected. Original 20 CDP JPEG frames/timestamps are retained in `recording-original.json.xz`; `recording-timing.json` records operator idle hold trimming (maximum two seconds). Encoding rate is not a performance measurement. No pre-change recording exists because this route/interaction was absent. Reduced-motion has runtime/static evidence, not a matched recording.

## Limits

Local frontend fixture only; reload resets changes. No external deployments, authentication, API keys, real integrations, persistence or production endpoint verified. New docs/mobile/dark/error states have no matched pre-change equivalents; the real desktop entry and Changelog baseline are preserved. Some long pages extend below viewport; captures are not all full-page. Evidence coverage is separate from implementation and merge status.
