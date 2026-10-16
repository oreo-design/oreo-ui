# Token Bridge — review record

Reference: https://x.com/vanjek/status/2110693639664050203 (George / Bondin). Video 18.85 seconds; native browser video inspected at 1, 5, 10 and 16 seconds. Frames retain original camera motion/crop. Reference shows luminous source/destination amount cards, overlapping chain/token marks, fee/ETA choices and a two-column chain/token picker with independent searches. No actual settlement is shown.

Baseline: `169c129e9470f9338cc596b9cb0d19d0e66f4aa4`. New `/token-bridge` route previously falls back to Button home; baseline `before-entry.png`. Local fixture at http://localhost:5250, Chromium, en-US, desktop 1440×1000.

## Before-edit consistency map

| Lens | Target / peer owner | Plan / evidence |
| --- | --- | --- |
| Entry | InlineSearchSelect + RecipientSearch; Base UI Dialog | Read source for searchable options and recovery. Two independent chain/token lists justify a wide dialog rather than a one-dimensional combobox. Keyboard-native buttons/inputs; Base UI focus/escape. |
| Loading | Existing component-shaped skeletons | Static two-list loading fixture, not a spinner over an empty page. |
| Empty/error | AgentWorkspaceState | Reuse shared centered recovery in the affected token list, not a new full-page error style. |
| Actions | Button, IconButton, payment template | Reuse canonical primary/secondary/tertiary roles and token spacing. PaymentWorkspace runtime peer capture pending. |
| Titled scrolling | Existing Base UI dialogs | Opaque header and separate list scroll surfaces; mobile stacked regions with bounded scrolling. |
| Icon/color | Icon, Tag, palette tokens | Operation icons inherit neutral color; chain/token identity uses existing palette pairs. Marks are simple identity glyphs, not downloaded brand assets. |

Amounts and balances use exact integer base units in the local model. Sample fees/ETAs are fictional fixtures, not live rates. No wallet provider, blockchain or transfer is connected. UI should say Simulate transfer, use demo wallet, and clearly label sample balances/history. Existing unrelated work remains in the primary checkout.

## Implemented components and template

- ChainTokenBadge: overlapping decorative chain/token glyphs with semantic palette pairs and optional compact network text.
- TokenAmountPanel: controlled decimal-string amount or read-only output, wallet/balance context, optional token selection and Max actions, and linked validation.
- ChainTokenPicker: independent searches, grouped chain buttons, scoped token balances, native keyboard focus and controlled selection. Base UI Dialog is owned by the template.
- Token Bridge: source/destination selection, route reversal, sample fee/speed preferences, demo connection, exact quote, review, failure/retry, cancel, atomic simulated balances, history and JSON export. Source/destination asset changes invalidate the quote immediately. Pending actions are locked; operation IDs reject duplicate and late settlement.

## Evidence index

All product images use actual local React components, Chromium/Playwriter, en-US. Desktop is 1440×1000, mobile 390×844. Dark is the template default; light mode uses the same Oreo tokens. These are fixtures, not live wallet or blockchain evidence.

| State | Baseline / reference | After |
| --- | --- | --- |
| New route | [Missing route → Button home](before-entry.png) | [Dark entry](after-entry-dark.png), [light after interaction](after-entry-light.png), [mobile dark](after-mobile-dark.png), [mobile light](after-mobile-light.png) |
| Two-column picker | [Reference](reference-01.png), [reference selected chain](reference-16.png); no previous picker | [Desktop](after-picker-dark.png), [combined search](after-picker-filtered.png), [mobile stacked](after-mobile-picker.png) |
| Loading / empty / error | New component; no previous state | [Empty mobile](after-mobile-empty.png), [loading corrected](after-mobile-loading-fixed.png), [error / retry](after-mobile-picker-error.png) |
| Quote and review | [Reference amount cards](reference-10.png) | [Review](after-review-dark.png), [pending](after-pending.png), [history](after-history.png) |
| Amount / route validation | New component | [Insufficient balance](after-amount-error.png), [unsupported ETH](after-unsupported.png) |
| Failure / cancellation | No previous simulation | [Failed](after-simulation-error.png), [cancelled](after-cancelled.png), unchanged balances verified |
| Demo connection | New action | [Disconnected](after-disconnected.png); reconnect restores review without external effects |
| Documentation | New routes; baseline not separately captured | [Picker playground](after-picker-playground.png), [picker docs](after-picker-docs.png), [amount playground](after-amount-playground.png) |
| Export | No prior action | [Actual downloaded JSON](export-history.json); 200 USDC from Arbitrum to Solana, fee 0.42, received 199.58, balances 1004.1 and 248.3 |
| Same-role peer | [Payment Workspace](peer-payment-full.png) | Shared Button, recovery, search, focus and token behavior retained; no edits to peer |

Historical evidence is preserved: `peer-payment.png` is an earlier cropped capture, superseded by `peer-payment-full.png`. `after-mobile-loading.png` revealed a mobile group CSS rule hiding chain skeletons; the rule is now scoped to chain groups, and `after-mobile-loading-fixed.png` supersedes it. The initial desktop picker captured a blue All chains glyph; final neutral navigation glyph is visible in mobile picker captures. Existing per-chain colors remain semantic identity accents.

## Consistency review result

Entry/selection: compared InlineSearchSelect and RecipientSearch source plus actual PaymentWorkspace runtime. The wide selector has two independently searchable dimensions, unlike a one-dimensional combobox, so native button lists in an existing Base UI dialog preserve focus/escape without inventing an editor pattern. Escape returned focus to the triggering source token button in the mobile browser check.

Loading/empty/error: shared AgentWorkspaceState rendered in token empty/error regions and failed simulation. Static row skeletons retain both list shapes. The mobile skeleton defect was found by inspecting actual media and corrected before delivery.

Actions and colors: Button/IconButton owners reused. Chain Token Badge is shared by amount cards, review route and token rows. All-chain navigation is neutral; named chain identities use existing blue/purple/mint/orange pairs. No raw reference colors or third-party brand image downloads.

Titled scroll surfaces: modal header/footer are opaque, list headers are outside scrollable lists, and mobile chain/token regions are independently bounded. Actual 390px chain scroll region: width/client 356px, horizontal overflow false. Entry/page overflow inspected separately. No fade is needed where opaque headers already protect titles.

Layout: 720px template max width, 800px selector max width, two-column desktop selector, stacked below 600px; amount cards stack input and token trigger on mobile. Card radii, type, palette, surfaces and spacing reuse Oreo tokens. Layout widths are composition-specific; existing payment template is a step-based flow rather than a two-leg amount surface. No new custom animation; simulation's 1.8-second timer is deliberately independent of fictional route ETA.

## Verification and limits

- Focused `node scripts/token-bridge/check.mjs` passed: decimal boundaries including precision beyond Number.MAX_SAFE_INTEGER, unsupported routes, fee/amount boundaries, conservation of funds including fee, atomic balance changes, duplicate run prevention, stale completion, cancel, failure and search.
- `npm run build` passed (TypeScript + production bundle). Existing bundle-size warning and Node deprecation warning remain.
- Browser verified two-dimensional search, source selection and quote updates, review and completion, actual exported JSON, insufficient balance, unsupported ETH/recovery, Max, speed change, failure/retry, cancel with balances unchanged, disconnected/reconnect entry, mobile empty/loading/error/retry, Escape focus restoration, both themes and docs routes. No assistive-technology or real-device assertion.
- Initial development triggered transient Vite/HMR hook errors and cached connection-refused logs; reloading restored the page. Final mobile state operations checked fresh logs. Some Playwriter clicks timed out after dispatch; subsequent snapshots verified resulting state before further interaction.
- Recording attempt failed: `Extension has not been invoked for the current page (activeTab permission)`. Click the Playwriter extension icon once on the task's local bridge tab to enable later recording. No recording exists; screenshots do not prove timing.
- No actual wallet connection, transaction signing, real prices, network access to a chain or fund movement. Fees/times are fixture values and balances/history reset on reload.
- Missing prior picker/review/history states are explicit new-surface baseline gaps. No prior UI was fabricated. Reference video was inspected through its native browser URL; it was not downloaded.
