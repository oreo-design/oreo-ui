# Oreo Changelog — review index

Implementation: website `/changelog`, reusable ReleaseEntry and UpgradePrompt with playground/API docs, complete changelog template. Seven verified selected updates across October 14–15, 2026; no invented release versions or breaking changes. Local build and browser validation passed. Main integration is authorized; deployment is a separate status.

## Revisions and environment

- Baseline: `ccafbf39c233ff4aa0ad930e06eedc9019a6441f` (fresh origin/main).
- Final product source: `454b5e4f38b50289757691790b544dadc02c5f4b`.
- Task checkout: `/Users/ziye/Documents/Project/Research/oreo-ui-changelog-20261015`.
- Preview: http://localhost:5216/changelog. Managed Chromium, Playwriter session 45, English, local fixtures, no account.
- Matched desktop: 1440 × 1000, light. Mobile: 390 × 844, light. Dark is supplemental.
- Reference: https://x.com/micka_design/status/2110389160062390442 and https://www.fluidfunctionalism.com/changelog. Read live layout and copy-feedback behavior; no source code or upgrade instructions executed.
- Website inspected before implementation: https://oreo-ui-preview.vercel.app, which served an older Button docs page without Changelog. That observation does not establish current deployment state after merge.

## Scenario / evidence map

| Scenario | Before | After | Reused pattern and result |
| --- | --- | --- | --- |
| Desktop new route and entry | [before-desktop](before-desktop.png): `/changelog` normalized to `/` and Button playground | [verified desktop](verified-desktop.png), [complete page](verified-full.png) | DocsLayout, Sidebar, OnThisPage; Changelog now in Getting Started, real timeline with PR links |
| Mobile new route and entry | [before-mobile](before-mobile.png), same missing-route fallback | [mobile](verified-mobile.png), [complete mobile](verified-mobile-full.png) | Existing responsive docs shell; adds mobile Changelog link to component playground header; browse components returns to Button; 390px has no horizontal overflow |
| Current public website | [live-before](live-before.png) | Deployment not performed/verified | Source integration does not claim public availability |
| Light / dark | Light baseline above; no prior Changelog dark state | [dark](verified-dark.png) | Uses `.theme-dark`, inherited tokens and currentColor, unchanged canonical Button surface |
| Search, categories, empty/recovery | No equivalent Changelog state existed | [filtered](after-fixed.png), [empty](after-empty.png), [interaction recording](interactions.mp4) | AgentWorkspaceState and Button; fixed = 1 item, brand search = 1 item, clear via keyboard restores 7. Empty prompt card is hidden |
| Date links and browser reload | No prior date anchors | [older date](after-older.png) | Existing OnThisPage; October 14 anchor survives reload and target heading is in viewport |
| Real previews | Existing TypeScale, StepProgress, AgentResultCard consumers inspected | [complete page](verified-full.png), [recording](interactions.mp4) | Type scale, check progress 2→3, default-open result collapse/reopen; no empty preview frames |
| Reusable docs | Exact per-route before screenshots not taken; baseline SHA retained, these routes were absent | [Release Entry playground](after-release-playground.png), [Upgrade Prompt playground](final-prompt-playground.png) | Existing registry/properties/code export/docs shell; generated JSX has correct component imports, docs API section reachable |
| Prompt and Markdown | Reference copy button success observed, [reference](reference.png) | [prompt](final-prompt-playground.png), [downloaded Markdown](downloaded-changelog.md), [recording](interactions.mp4) | Copy resolves and shows Copied; prompt readable in native details. Download saved through browser and all seven entries/links checked |

## Consistency review

Compared actual baseline Button playground, live older Button docs, new reusable component playgrounds, and full changelog. This is an Oreo web review, not a cross-product or native-platform certification.

| Lens | Evidence / decision |
| --- | --- |
| Entry behavior | Canonical docs sidebar, real links, route metadata/sitemap, mobile playground entry and return link; browser date-anchor reload checked |
| Loading | Static checked-in data renders immediately. No release request or artificial loader. Clipboard has an actual disabled pending state |
| Empty / recovery | Shared AgentWorkspaceState with native Button; search and category reset verified through Enter |
| Actions | Shared Button with tapScale=1; copy icon corrected to leadingIcon slot. Public source/docs links remain ordinary anchors |
| Titled scroll surfaces | Existing three-column docs shell and right contents; native details has a named scrollable prompt with keyboard focus; previews wrap on mobile |
| Icon and colour inheritance | Shared icon provider/currentColor, semantic tokens, `.theme-dark`; categories have text labels, not colour-only meaning. Theme snapshots inspected after transition settled |

Shared owners traced: `DocsLayout`, `Sidebar`, `OnThisPage`, `ComponentPlayground`, Button surface, AgentWorkspaceState. Changes to shared owners are limited to website navigation entries. No new control palette or independent global styles.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No changelog route | Instant search/filter/theme state updates, tapScale=1 for new Buttons | Frequent reading and filtering do not need entrance or press movement |
| Existing component behavior | Existing result disclosure and step progress reused | No custom animation introduced; actual collapse/reopen recorded |

Decision: Approve. No new animation system or timing changes. Native details is immediate. A reduced-motion-specific recording was not captured; new code adds no movement.

## Validation / limits

- `npm run build`: TypeScript and Vite passed; existing >500 kB chunk warning remains. [Full output](build.txt).
- `git diff --check`: passed. No new dependencies.
- Source review checked null/false preview handling, copy concurrency and feedback reset when prompt changes, unique labels, native link/button semantics, keyboard recovery, date provenance and truthful main/deployment wording.
- Clean browser reload produced no pageerror. During initial HMR before imports settled there were transient hook errors, absent after clean reload. Analytics dev-resource 403 was observed; no release-data request exists.
- Clipboard API success and visible Copied verified. Cross-application paste and denied-permission recovery are not verified. The catch branch exposes a readable manual-copy prompt; no success claim for that unexercised branch.
- No backend, published package, account workflow or production deployment tested. History is intentionally curated, not exhaustive or automatic. To maintain it, add verified merges in `src/patterns/changelog/data.ts`.

## Capture history

Use **verified-*** as the accepted final screenshot set. All originals remain:
- `after-desktop.png`: initial copy-icon layout, superseded.
- `after-dark.png`: initial wrong theme hook; superseded.
- `after-dark-corrected.png`: captured before colour transitions settled; superseded by verified-dark.
- `after-dark-settled.png`, `after-desktop-final.png`, `after-full.png`, `after-mobile.png`: intermediate, before removing empty preview frames.
- `final-desktop.png`, `final-dark.png`, `final-full.png`, `final-mobile*.png`: superseded capture run affected by CDP viewport restoration / pending screenshot timing. Do not use as acceptance evidence. New isolated task tab produced verified set, with viewport read back.
- `after-empty.png`: empty card already correct; later added 32px top spacing for the search area when no prompt card.
- Recording is local actual UI, 1440 × 920, 6.6 seconds, 30fps. Top 80px cropped from 1440 × 1000 CDP frames to omit automation chrome; timing gaps capped at 1.5 seconds for review. [Original JPEG frames and timestamps](recording-originals.zip) preserved. Dimensions and decoded frame inspected. Recording includes copy, prompt disclosure, filter, result disclosure, empty recovery, progress and theme actions; no claim of unedited real-time pacing.
