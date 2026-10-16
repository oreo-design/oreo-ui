# Quartz reference — Support Console

Reference: https://x.com/arlanoska/status/2110824051912683637 (21.739-second video). Inspected native streamed frames at 0, 2, 5, 7, 8, 10, 12, 14, 16, 17, 19 and 21 seconds. Frames are preserved alongside this index; this is sampled visual inspection, not continuous motion verification.

Baseline: 973dda85a4c36d9d7ed352b99a0ffc3ec7d324f4. New route /support-console has no existing equivalent; previous entry resolves to default documentation. Local fixtures only, no live support messages, payment actions or credentials.

## Inventory and reuse
- Support list, customer attachment, agent execution, draft reply: reuse InboxNotification, Attachment, ToolCall and EmailDraft. Existing ReviewQueue is contact-oriented; the notification row matches case selection more closely. No duplicate primitives needed.
- Daily spend: UsageChart covers cumulative usage and ActivityBars covers small normalized bars; neither exposes absolute daily amounts split at a daily limit. Add SpendLimitChart, reusing formatMoney and BudgetMeter for totals.
- API key table: MemberAccessTable is member/tool-specific. Add ApiKeyTable accepting metadata only, Tag permission/status, and host-owned row actions.
- One-time key: no current secret-reveal/copy field. Add SecretField with reveal/hide and async clipboard feedback; the host controls one-time lifetime.
- Reuse Base UI Dialog and Tabs, Button, IconButton, InlineConfirm and AgentWorkspaceState.

## UI consistency review
| Lens | Target / peer | Owner | Status / evidence |
| --- | --- | --- | --- |
| Entry | Console tabs / activity workspace | Base UI Tabs; standard docs navigation | Checked: runtime screenshots and interactions.jsonl (see coverage below) |
| Loading | Local fixture is synchronous; clipboard is async | Button disabled state, inline status | No artificial page loader. Clipboard success and rejected promise exercised; very short pending phase not separately captured. |
| Empty | Filtered key list / agent workspace | AgentWorkspaceState centered in owner | Checked: runtime screenshots and interactions.jsonl (see coverage below) |
| Actions | Create/edit/cancel / sales dialog | Button, IconButton, Base UI Dialog | Checked: runtime screenshots and interactions.jsonl (see coverage below) |
| Titled scrolling | Key table / member access table | Overflow region, opaque header; no overlay fade needed | Checked: narrow/medium/wide screenshots; opaque mobile queue header and contained table scrolling. |
| Icons/color | Table actions / existing library | Icon currentColor and neutral tertiary Button | Checked: light/dark screenshots. Canonical Tag palette and neutral buttons retained. |

## Evidence
Baseline navigation capture initiated before implementation. Browser timeout is recorded if capture remains unavailable; missing media does not block integration. Full after states, final source revision and verification results will be added here.


## Verification and limits
- `npm run build` passed (existing large-chunk advisory only); `node --experimental-strip-types scripts/check-support-console.mjs` passed 35 assertions, including cents precision, zero/exact/over thresholds, negative/fractional/non-finite inputs and unsafe integers.
- Browser checks: budget validation and recovery (70 → 60 USD gives 2 → 10 over-threshold days without rewriting history); empty/duplicate key-name errors; Send only and Read only creation; reveal/hide; real clipboard success; explicit clipboard rejection in playground; secret discarded on close; revoke confirmation; reset; no-result key search and recovery; local reply edit/save/reopen and case-switch draft retention.
- No new motion is authored. Base UI tabs/dialogs and existing InlineConfirm/ToolCall motion are reused. `usage-interaction.mp4` captures actual tab switching/day inspection at 1440×1000, 5.88 s. Original CDP frames and timestamps are retained in `interaction-frames.json.xz`. Native extension recording was unavailable in the session (activeTab/tabCapture limitation); Playwriter's page-scoped CDP screencast was used. This clip does not cover every state or prove source-video animation parity.
- Earlier captures `after-usage.png`, `after-keys.png`, `after-keys-dark.png` and `after-inbox.png` are preserved but superseded: zero-height red segment borders were removed, revoke labels shortened, and the unbacked image thumbnail replaced with the existing unknown-file treatment. Use `*-final.png` and mobile captures for final visuals.
- Initial hot-reload reconnect/hook errors were transient during module registration. Subsequent recorded interaction logs are clean. Automation timeouts left queued actions; the Playwriter connection was reset and relevant paths were exercised again. These were automation retries, not claimed application failures.
- New route baseline: `before-entry.png` shows the actual default Button docs reached by `/support-console` before route registration. There was no earlier support console. `peer-activity.png` verifies the existing product budget, chart and tabs family in runtime; other reused primitives are exercised in the console. No cross-product or exhaustive library consistency claim.
- Fixture only. No support message, refund, production key, provider request, deployment or backend action was performed. Physical touch devices and screen-reader narration were not tested.

## Evidence map
| Surface/state | Before | After |
| --- | --- | --- |
| New console entry | before-entry.png | after-inbox-mobile.png; after-reply-saved.png |
| Daily spend, threshold/day selection | no existing split chart; peer-activity.png | after-usage-final.png; after-usage-dark.png; usage-interaction.mp4 |
| Budget error/recovery | new flow | after-budget-error.png; interactions.jsonl |
| API keys | no prior key manager | after-keys-final.png; after-keys-dark-final.png; after-keys-mobile.png |
| Created key / copy | no prior one-time field | after-key-created.png; after-key-copied.png |
| Clipboard error | new field | after-secret-error.png |
| Empty/recovery | no prior key manager | after-keys-empty.png; interactions.jsonl |
| Responsive | new route | after-inbox-mobile.png; after-usage-mobile.png; after-keys-mobile.png; further medium/dark captures in manifest |


### Final corrections and capture environment
ToolCall's containing grid now uses `minmax(0, 1fr)` and `min-width: 0`; mobile inspection measured 324 px scroll width and client width after the fix (previously 347 vs 324). The shared ToolCall itself was not changed. API key names retain one line inside the intentional horizontal scroll region. The chart defaults to the first day so its selection is visible on narrow screens. Final product check: build passed again after these changes.

Viewports: desktop 1440×1000, medium 900×1000, mobile 390×844. Locale en-US, local deterministic fixture, light/dark CSS themes, Chrome via Playwriter. Full-page captures extend vertically. Chrome's full-page key-table capture sometimes included blank space to the right even though `inspect(body)` confirmed scroll/client width 390/390; `after-keys-mobile-clipped.png` is a fresh CDP capture constrained to the actual 390 px viewport, not a resized or fabricated image. Table action scrolling was also exercised. `after-inbox-mobile-dark-final.png` supersedes the mobile tool row clipping in earlier captures.

Evidence coverage: matched desktop entry baseline + complete new console; wide/medium/narrow and both themes across representative states; budget and clipboard errors; key no-results and chart empty state; one short real interaction recording. No before recording exists for the newly introduced route. Not all states are multiplied across every viewport/theme; native mobile touch and screen readers remain unverified.

Implementation revision: `5c75f0019b89be709d39774892675b47a6ba38ab`. PR: https://github.com/oreo-design/oreo-ui/pull/64. The final evidence/changelog commit is reviewed at its exact head in the PR; evidence-only updates do not change this implementation revision. Changelog before/after images use this implementation as their baseline and add one release entry.
