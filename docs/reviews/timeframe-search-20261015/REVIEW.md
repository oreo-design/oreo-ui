# Timeframe + inline search / Position Studio

Source: [Rndr Realm — Cheq product work](https://x.com/rndr_realm/status/2110457217451462693). The actual 28.749s video was inspected through authenticated Chrome, with ten frames sampled at 3s intervals from the observed public video playlist. Original source screenshots and selected clean frames are retained here.

Baseline: `6da2ab0072865fcbe70698c255361ae0c350e1bd`. Implementation: `c20ee403e414605a41a304ddb4791055bbac84ae`. Isolated branch `codex/timeframe-search-20261015`. Local fixture at `http://localhost:5212`, Chromium through Playwriter session 45; English, light/dark, desktop 1440×1000, tablet 768×1024, mobile 390×844. Capture dimensions and hashes: [manifest.json](manifest.json).

## Changes and reference mapping

- **TimeframeSelector**: controlled duration choices; preceding/current pair, inline expansion, cyclic previous navigation, close and selection collapse. A single clipped track slides at 180ms with Oreo's ease-out curve, so labels never cross each other. Keyboard and reduced-motion movement is instant. Tab only visits visible choices; Escape restores focus.
- **InlineSearchSelect**: selected value becomes an input at the same anchor. Base UI owns filtering navigation and dismissal. Five-row loading skeleton, shared no-match/error state, retry callback, disabled control, local portal theme inheritance. Popup uses trigger-origin transform/opacity, 180/150ms enter and 120ms exit; keyboard instant, reduced motion opacity only.
- **Position Studio**: original complete practice template. Up/Down, Over/Under with target input, and Token vs Token with comparison picker; validates positive whole points within balance and positive target prices; records submissions, deducts practice balance, prevents duplicate submission, and resets locally. Sample prices are fixed illustrations. No wallet, real trading, settlement or backend persistence.
- Reuses Oreo Button/IconButton, Menu/MenuItem, Icon, AgentWorkspaceState and semantic tokens. Source logos become original monochrome symbol badges; source USD conversion becomes imaginary points. Field width is 11rem to fit the expanded duration row at narrow widths. Radius uses actual control/card-medium tokens. Existing content/controls elsewhere remain unchanged.

## Evidence map

| Page/state | Before / peer | After |
|---|---|---|
| New template entry | [before-entry.png](before-entry.png): requested URL previously redirected to Button playground | [after-entry-final.png](after-entry-final.png), matching 1440×1000 viewport; [complete page](after-template-final.png) |
| Existing compact menu peer | [before-peer-menu.png](before-peer-menu.png), actual InlineQuickMenu open | New interaction shares Base UI dismissal/focus and local portal conventions |
| Search / no matches | No prior searchable control at this entry | [search](after-search.png), [empty](after-empty.png) |
| Loading / failure / recovery | Source [loading reference](reference-loading.png); shared state owner inspected | [loading](after-loading.png), [error](after-error.png); Retry returned all options and BTC selection succeeded |
| Form error / recovery | No previous position form | [target validation](after-validation.png); [final receipt](after-receipt-track-final.png), 50 points deducted |
| Desktop dark / tablet dark | Same local fixture; no previous equivalent template | [dark search](after-desktop-dark-search.png), [tablet](after-tablet-dark.png) |
| Mobile themes / popup | Same local fixture | [dark](after-mobile-dark.png), [search](after-mobile-search.png), [final expanded row](after-mobile-expanded-width-final.png) |
| Motion | New controls have no pre-change interaction; source video examined | [final clip](motion-final.mp4), [original frames/timestamps](motion-originals-final.zip) |

### Capture history and limitations

All originals are preserved. `after-desktop-light.png` is superseded: initial invalid radius names were corrected. `after-receipt.png` and `motion-cdp.mp4` are superseded: the success icon moved to Button's leadingIcon slot and the completed state now uses the readable mint palette pair. `motion-round2.mp4`, `after-expanded.png`, `after-expanded-final.png`, and `after-mobile-light-expanded.png` are superseded by the single-track implementation. `after-mobile-expanded-final.png` exposed the narrow control-column clipping; `after-mobile-expanded-width-final.png` is the corrected result. Other intermediate resting screenshots retain valid feature coverage but final layout authority is the final template and mobile captures.

Native extension recording reported missing activeTab permission. Playwriter CDP screencast supplied real browser frames instead. `motion-originals-final.zip` preserves all 71 JPEG frames and capture timestamps; the delivered 30fps clip uses the first 64 constant-size frames and crops the top 80px to remove the extension toolbar. Later frames changed resolution during the full-page screenshot and are retained only in the archive. The clip is resampled variable-cadence evidence, not a frame-performance benchmark. It predates the final 8px desktop / 16px mobile field-width adjustment; the unchanged track behavior and corrected final dimensions are separately documented by screenshots. Earlier recording rounds retain their own original archives.

Screenshots and decoded motion frames were inspected. These are local fixture checks, not real account, production, cross-device or assistive-technology certification. Long-history scrolling and real touch hardware remain unrecorded. No claim of complete cross-product consistency.

## UI consistency review

| Lens | Target / peer / owner | Result and evidence |
|---|---|---|
| Entry | New picker / live InlineQuickMenu / Base UI | **Checked**: keyboard open, ArrowDown+Enter selection, Escape focus return, pointer outside dismissal. Search remains inline because filtering needs an input; existing peer is pick-only. |
| Loading | New picker / source content rows | **Checked**: five content-shaped rows, retained selected token, no duplicate spinner. Explicit playground loading; no artificial delay in template. |
| Empty | New picker and history / AgentWorkspaceState used by StudioInbox | **Checked** in live target and code owner: centered icon/title/explanation. No-match differs from failure; retry restores results. Peer empty runtime not separately recaptured. |
| Actions | Form/reset/retry / Button, Menu | **Checked**: canonical components and semantic variants; success uses leadingIcon and mint foreground/background pair. Duration controls are selection actions with pressed state. |
| Titled scrolling | Search options and history | **Checked structurally**: bounded list below external input/title, opaque separation; no content under a fixed heading. Long populated history scroll media **unverified**. |
| Icons/color | Trigger/menu / Icon and theme tokens | **Checked**: neutral inherited operation icons, semantic failure/success, dark local portal. Desktop dark and mobile dark media inspected. |

## Focused validation

- TypeScript noEmit and Vite production build passed; build output in [build.txt](build.txt). Existing large-bundle advisory remains (~2.1MB app chunk).
- Search by symbol: ETH → query bnb → keyboard select BNB. No-match query zzzz; Escape retained selection and returned focus. Outside click closed popup. Error Retry restored catalog; BTC selected. Disabled trigger confirmed.
- Duration expansion, previous cycle through wrap, pointer selection/collapse; Escape and keyboard focus; disabled variant; computed transition `none` for keyboard and reduced motion ([browser-checks.txt](browser-checks.txt)). Rapid pointer changes captured with stable shared track.
- Up/Down submission; Over/Under missing target rejected and 800 accepted; Token vs Token ETH/BTC submitted. Stake 2000 rejected against 1000 balance. Successful 50-point submission leaves 950, receipt matches choices, repeated submit disabled; reset clears receipts and restores balance.
- 1440 desktop, 768 tablet, 390 mobile; light and dark. No horizontal page overflow at tablet/mobile. Mobile search popup bounds x49, width304 within390. Final expanded row has a 102px options viewport inside a176px control column.
- Fresh browser checks after fixes showed no application exceptions or focus warnings. Local resource403 responses from the preview environment remain; earlier hot-reload errors were cleared with reload/reconnect and are not reported as clean-run exceptions.

## Motion review

| Before | After | Why |
|---|---|---|
| Per-option transforms crossed labels on rapid cycling | One stable clipped track, transform180ms | Preserves text spacing and supports interruption |
| Initial remount/keyframe entrance | Stable elements and transition | Retargets from current position |
| Popup forced focus hid external input from accessible tree | External input focus with Base UI initialFocus=false | Keeps inline combobox accessible and typeable |
| Success icon nested inside Button label | Button leadingIcon | Canonical inline icon alignment |

Verdict: **Approve** for the inspected interaction scope. No layout-property animation, trigger-origin popup, sub300ms timing, instant keyboard and reduced movement. The evidence limitations above remain separate from delivery.

## Delivery

Implementation reviewed at `c20ee403e414605a41a304ddb4791055bbac84ae`. PR and exact reviewed source revision are recorded in GitHub. Main integration is verified separately after merge; no production deployment claim.
