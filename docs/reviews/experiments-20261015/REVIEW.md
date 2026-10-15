# Experiment Workspace — review index

Reference: [Charles Postiaux, A/B testing](https://x.com/PostiauxCharles/status/2110321094301479197). All three source images were viewed in the browser; [metadata](reference-metadata.json) and `oreo-charles-reference-{1,2,3}.png` retain the reference. X returned 403; public metadata and original image URLs were accessible. The source is static, so it does not prove pointer behavior, keyboard access or a real deployment workflow.

## Scope and baseline

Baseline `b2e0d07b42135c323d6db2c52c7c4960f0a1ddfe`, origin/main after Project Board #58. Task branch `codex/experiments-20261015`; implementation commit `ed0a9af`; [PR #59](https://github.com/oreo-design/oreo-ui/pull/59). Sources and media are hashed in `manifest.json`; after state is the implementation in this directory's containing commit. Main checkout and other task worktrees remain untouched.

Three reusable components: **ExperimentChart**, **VariantResults**, **ExperimentDecision**. Template: `/experiment-workspace`; docs and playground routes: `/experiment-chart`, `/variant-results`, `/experiment-decision`. Registers through existing App, site metadata, Sidebar and playground source mapping. Changelog uses the existing release-entry implementation.

The local fixture resets on reload. Supports synchronized cumulative/daily cursors, native keyboard ranges, data tables, search/status filtering, draft creation, illustrative sample loading, label editing, pause/resume, confidence-gate changes and reversible local decisions. No experiment service, statistical model or website traffic is connected.

## Reference mapping and numerical meaning

| Reference technique | Oreo implementation | Deliberate difference |
| --- | --- | --- |
| Two near-black result cards, large lift/day-count headlines | Two token-based cards, light/dark themes, one-column narrow layout | Surrounding experiment navigation, editing and review flow are task extensions. |
| White B line, muted A line and paired daily dots | Shared per-chart zero-based percentage scale; two series with text labels | Straight segments preserve supplied observations; no speculative curve interpolation. Keyboard readout and full table supplement pointer tooltip. |
| A/B copy, conversion totals, readiness footer | VariantResults and ExperimentDecision, shared Button/Icon/Tag/Avatar | Readiness opens a local review, not a live “Ship” deployment. |
| +15.9%, 13 of 14, 96% confidence | First two derived from 251/6,120 and 289/6,080 plus illustrative daily counts | Daily distribution is synthetic, not recovered source data. 96% is explicitly supplied demo metadata, never presented as computed statistical significance. |

## Evidence and environment

Playwriter session 65, task-owned tabs, Chromium, localhost:5233, English local fixture. Desktop 1440×1000; medium 900×900; mobile 390×844. CSS-pixel originals, full-page captures can exceed viewport height. No physical mobile-device test.

| Page / state | Before | After | Result / limits |
| --- | --- | --- | --- |
| New template route | [Actual route fallback](before-entry.png) | [Final dark workspace](after-desktop-final.png), [light](after-desktop-light.png) | Missing route actually redirected to Button playground at `/`. Captured before registering the route; unregistered new component files had not altered that surface. No prior experiment page existed. |
| Equivalent chart surface | [Existing Finance Workspace](peer-finance.png) | [Chart playground](after-chart-playground.png) | Actual peer inspected; inherited keyboard range, readout and table approach from BalanceChart, but conversion counts require a different semantic component. Shared finance code unchanged. |
| Linked date selection | No prior experiment chart | [Linked cursors](after-linked-cursors.png), [recording](interaction-review.mp4) | Home/ArrowRight/End update both charts. Pointer selection is implemented on the plot; keyboard inspection exercised. No separate touch-pointer gesture test. |
| Decision review / undo | No prior flow | [Confirmation](after-decision-confirm.png), [recording](interaction-review.mp4) | 99% gate removes both review buttons; 95% restores. Confirm changes status to Decided and locks gate; undo restores prior Running state. Pause/resume checked. |
| Draft validation / empty results | No prior editor/draft | [Error](after-draft-error.png), [empty draft](after-empty-draft.png), [mobile editor](after-mobile-editor.png) | Required fields and distinct-copy validation in code; missing fields exercised. Created Welcome message, loaded labeled sample data, edited B label across both charts. Escape returns focus to New experiment. |
| Search and insufficient / negative evidence | No prior filters | [Search empty](after-search-empty-final.png), [collecting](after-collecting-final.png), [negative lift](after-negative-result.png) | Clear filters recovers navigation. Smaller sample and negative lift expose no review action. Final footer follows actual observation range; older draft image predates that correction. |
| Data table | No prior experiment table | [Table open](after-data-table.png) | Canonical disclosure, horizontal scroll container and opaque sticky header. Rows match cumulative counts; no title-overlay fade needed. |
| Responsive / themes | Mobile/medium baseline not captured | [Medium](after-medium-light.png), [mobile light](after-mobile-light.png), [mobile dark](after-mobile-dark.png) | Inspected actual media. Cards stack; mobile navigation scrolls horizontally; body width stays 390px. Tooltip bounded within plot after a focused layout correction. |
| Library docs / controls | No prior dedicated entries | [Chart docs](after-chart-docs.png), [chart empty](after-chart-empty.png), [variants](after-variant-playground.png), [decision](after-decision-playground.png) | Daily mode/empty controls, decision collecting/decided states and VariantResults source export checked. Existing property controls capitalize rendered labels; early automation retries used wrong-case selectors, then succeeded with actual labels. |
| Changelog | [Before](before-changelog.png) | [Page](after-changelog.png), [entry](after-changelog-entry.png) | Adds one task entry with actual PR link; existing release layout retained. |

`after-desktop-initial.png` and `after-desktop-dark.png` are retained historical captures, superseded by `after-desktop-final.png`. Final fixes use Button's `trailingIcon` slot (prevented an arrow wrapping below the label), the success token for dark-mode readiness text (palette mint text is intended for its filled Tag surface), and a clamped tooltip position. [Final keyboard focus](after-search-focus.png) confirms one 2px outer focus-within ring; `after-search-empty-final.png` supersedes the earlier double-ring capture. No historical originals overwritten.

## Six-lens consistency review

| Lens | Peer / canonical owner | Result | Evidence or gap |
| --- | --- | --- | --- |
| Entry behavior | Existing local workspace templates, App/Sidebar routing, Base UI Dialog | Checked | New template and docs use same registries. Both result cards open the same dialog; Escape/focus return and repeated decision/undo verified. |
| Loading | Local fixture workspaces | Not applicable | No asynchronous load introduced. “Load sample results” is explicit synchronous fixture insertion, not a simulated network operation. |
| Empty state | AgentWorkspaceState from automation | Checked | Reused for no observations, no search matches and new draft; owning content region centers the draft state. Sidebar filter empty stays within sidebar. |
| Actions | Button/IconButton and Base UI Dialog; same-owner consumers in Finance/Project templates | Checked | Canonical action hierarchy and icon slots; no duplicated action surface. New buttons use tapScale=1. Local review/undo action has a specific functional meaning. |
| Titled scroll surfaces | BalanceChart table disclosure, dialog component | Checked with gap | Opaque table header protects rows while scrolling; whole small editor scrolls as one surface, no fixed-title overlap. Deep-table scroll video not captured. |
| Icon/color inheritance | Icon/currentColor, Tag, tokenized text and surfaces | Checked | Light/dark screenshots and computed dark readiness color exposed the palette-role mismatch; corrected locally to status-success. Shared icon/tag owners unchanged. |

Scope is these Oreo web surfaces, not a cross-platform or whole-library audit. Reference image informed the card hierarchy; actual finance peer established chart accessibility patterns. No outside product's typography or palette copied as tokens.

## Motion / interaction review

| Before | After | Why |
| --- | --- | --- |
| Static external images, no existing experiment interaction | Immediate pointer/range date updates and synchronized chart readouts | Functional data inspection must not interpolate or delay values. |
| No experiment dialog | Canonical Base UI modal with no new entrance/exit animation | Keyboard actions remain immediate. Shared controls retained; no new spring or keyframe. |
| No interactive proof | [9.16s actual browser recording](interaction-review.mp4), 1440×1000 | Keyboard cursor inspection plus review/select/undo, captured through Playwriter CDP. Original 46 timestamped frames in `interaction-frames.json.xz`; original intervals preserved, no acceleration. Native activeTab recording limitation was already observed in this session. |

**Verdict: Approve** for this task's interaction/motion scope. No added animation code; still screenshots do not stand in for the interaction recording. Decoded MP4 frame and final desktop/mobile captures inspected. Reduced-motion media was not separately exercised because no new time-based animation exists; shared library internals were not changed.

## Focused validation

- `npm run build`: TypeScript/Vite pass in `build-delivery.log` (existing large-bundle warning). Initial playground select-helper argument error was corrected; earlier logs retained.
- [stats-check.mjs](stats-check.mjs), [output](stats-check.log): aggregate weighted rates, exact reference totals, relative lift versus percentage points, 13 winning days, zero denominators, invalid rows, minimum visitors and confidence gates.
- [Browser snapshots/logs](browser-checks.jsonl): functional scenarios above. Initial live editing caused Vite connection/HMR and transient hook errors; fresh loads and focused interactions are clean. These development interruptions are not hidden or reported as passing checks.
- `git diff --check`: clean. Task changes reviewed; no unrelated files or shared component edits.

Evidence gaps (no comparable old experiment page, medium/mobile baseline, physical touch testing and deep-table recording) remain separate from implementation and authorized delivery. No production verification claimed.
