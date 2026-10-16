# Browser Agent — Yogesh reference delivery

## Scope and source

Reference: https://x.com/yogesharc/status/2110796597454102593 — Yogesh, “Stay informed when agent is controlling the browser.” Streamed the 58.73s source video and inspected frames at 0.2/10/20/30/40/50/58s. `reference-*.png` are original browser captures; `reference-fit-*.png` confirm object-fit did not reveal additional page content. The source video itself is zoomed to the app's upper-left region. No unseen browser content is claimed.

Observed: a pixel activity icon replaces the browser tab favicon, a soft colored light stays on the working tab while Chat is selected, new browser tabs appear during the run, and the favicon returns on completion. Reused Oreo ThinkingState for the icon. Added BrowserSessionTabs and BrowserControlBar, plus a complete `/browser-agent` template. Pause, takeover, local guide pages and the activity sidebar are template extensions, not claims about unseen reference behavior.

Baseline: `d618ba3e218dd1d04bb40a14d8d5993b8ed61d56`. Task branch: `codex/browser-agent-20261016`. PR: https://github.com/oreo-design/oreo-ui/pull/68. Implementation commit: `7520f2e`; Changelog and final captures are in the following delivery commit. Product source is the final PR tree containing this index; `manifest.json` records SHA-256 hashes of captured implementation files and original media. Primary checkout WIP was untouched.

## Capture environment

Real React components served at http://localhost:5241 in task-owned Playwriter session 1 / Chromium. Deterministic local fixtures, no account, English locale. Desktop 1440×1000; mobile 390×844. Dark default template plus light theme. Source video tab 1440×960. CSS pixel screenshots, toolbar/cursor overlays hidden. Evidence demonstrates this local template, not external browser execution, AI service behavior or production deployment.

## State coverage

| Scenario | Before | After / evidence | Result |
| --- | --- | --- | --- |
| Entry to new template | [before-entry](before-entry.png): `/browser-agent` normalized to existing Button playground | [ready](after-ready-dark.png), [running while Chat selected](after-final-running.png), [light complete](after-light.png) | Route, sidebar entry, metadata added. New page has no equivalent prior browser state; baseline docs theme is light, template default dark intentionally follows reference. |
| Live ownership | No corresponding baseline state | [paused](after-paused.png), [takeover with note](after-takeover.png), [stopped](after-stopped.png) | Pause retains progress; takeover selects target, enables local edits; return resumes same step. |
| Errors / recovery | New state | [error](after-error.png), [complete](after-complete.png) | Retry continues at 1/6; completes 6/6; closed notes reopen through Read the summary. |
| Empty search / recovery | New state | [empty search](after-empty-search.png) | Shared AgentWorkspaceState; Clear search restores guide. |
| Tabs playground / keyboard | New routes absent on baseline (same router as captured entry; no individual baseline screenshots) | [tabs](after-tabs-playground.png), [empty tabs](after-tabs-empty.png) | ArrowRight moves focus, Enter selects; empty Open tab recovers. Code export verified; host supplies callbacks. |
| Control playground / docs | New routes absent; no separate baseline media | [control](after-control-playground.png), [default error](after-control-error.png), [docs](after-documentation.png) | Pause/resume/takeover reflected in properties. Public API and local-demo limits documented. |
| Responsive | No equivalent template | [390px light](after-mobile-light.png) | Actual document scrollWidth/clientWidth both 390; tabs scroll internally; controls wrap; full page inspected. |
| Motion | No previous browser signal | [interaction](interaction.mp4), [reduced motion](after-reduced-motion.png) | Automatic handoff scenario completes; tab light follows target while selection stays on another page. Reduced motion: glow and pixels report animation-name=none. |
| Changelog | [before](before-changelog.png) | [after](after-changelog.png) | One addition in existing release component; existing history preserved. |

The recording is a Playwriter-connected CDP screencast of actual interactions (1440×1000, 24.6s). All 1,342 original JPEG events with timestamps are preserved losslessly in `interaction-frames.json.xz`; the viewing MP4 caps long idle gaps at 2s. Inspected frames at 4s and 20s plus screenshots. It covers pause/resume, auto progression, selected-page independence and new-target activity. Takeover/error/stop have screenshots and interaction verification, but no separate recording. No pre-change motion exists for these new components. Hidden-document animation pause is code-reviewed, not separately video-captured.

## Consistency review

Compared rendered [Thinking Workspace idle](peer-thinking-idle.png) and [running](peer-thinking-running.png), its source, and new template/playgrounds. This is an Oreo cross-surface check, not a cross-product or native-app audit.

| Lens | Shared owner / same-role consumers | Decision and evidence |
| --- | --- | --- |
| Entry behavior | `App`, `site`, docs Sidebar; Thinking Workspace and Browser Agent | Standard docs + standalone template routes; unknown baseline route returned Button. New session/scenario resets local fixture explicitly. |
| Loading / ongoing work | `ThinkingState`, also ThinkingTimeline and Thinking Workspace | Reuse existing pixels; don't add a loading skeleton for an already-open page. Current text in one control-bar live region; indicators are decorative. |
| Empty / error | `AgentWorkspaceState`, also automation and trace-query consumers | Reuse empty-state recovery. Browser failures stay in the existing session with Retry/Stop rather than replacing useful page context. Peer empty/error rendering not recaptured; source ownership inspected. |
| Actions | Shared Button/IconButton, Base UI Tabs | Same sizes and semantic variants; no press scaling for high-frequency controls. No nested tab/close buttons. Resume/retry primary; pause/takeover secondary; stop tertiary. |
| Titled scroll surfaces | Thinking Workspace activity side panel; browser-session tab strip | Desktop activity heading remains outside scrolling list. Selected page scrolls within browser view with opaque address strip; mobile uses document flow. Takeover screenshot intentionally shows scrolled notes. |
| Icon/color inheritance | Shared Icon and ThinkingState; all new controls | Uses semantic Oreo tokens and currentColor; status success/error only for matching state. 20px signal slot, 2px gradient light and 224/280px desktop columns are deliberate browser-shell geometry. Shared typography, spacing and radii retained. |

## Motion review — review-animations

| Before | After | Why |
| --- | --- | --- |
| No browser activity signal | `browser-session.css:89–112`: 2.4s linear transform-only light while running | Continuous state indication, not an interaction delay. Matches ThinkingState cadence. Tab selection and control actions are immediate. |
| Continuous motion could obscure ownership changes | Running-only mount; no motion in paused/user/complete/error/stopped | Ownership changes snap; no stale animated favicon. |
| Unrestricted continuous movement | `browser-session.css:181–185`: static light for reduced motion; hidden-page pause | Preserves state without travel. Actual computed styles checked in browser. |

Verdict: **Approve**. No new keyboard/action animation, no animated layout properties, no entrance delay. ThinkingState owns inherited opacity animation and visibility/reduced-motion support. The light stops immediately on state changes; its linear loop is appropriate for continuous activity. No new hover motion.

## Validation and limitations

- Production TypeScript/Vite build passed; pre-existing bundle-size advisory remains.
- `node --experimental-strip-types scripts/browser-session/check.mjs` passed: late ticks after pause/takeover/stop, retry preserving progress, lifecycle, reset, completion clamping and empty runs.
- Browser verified manual research flow, local notes edit, no-results recovery, error/retry, completion, close/reopen summary, automatic handoff scenario, pause lasting longer than one timer interval, stop, keyboard tabs, empty tabs, light/dark, mobile and reduced motion.
- Source review caught and fixed unsupported pause glyph, stale search after navigation, skipped batched step application and reopening a closed summary tab. Historical captures remain preserved; after-final-running.png supersedes after-running-chat.png for final-source presentation (same layout).
- New routes have no prior equivalent states. Only actual entry and Changelog baselines are available; no fabricated prior template screenshots. No real-service or deployed-site claim.
