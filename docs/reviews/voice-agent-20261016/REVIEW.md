# Voice Agent — UI evidence

Baseline `04c46c8a8eb0afc9ba2bee857ff39041bafe9bee`, fresh origin/main. Isolated worktree preserves unrelated settings WIP. English / local deterministic fixtures / Chromium / Playwriter session 10 / localhost:5263. Desktop 1440×1080 unless otherwise noted. Existing direct browser connection is retained; native Playwriter recording is unavailable in direct mode.

Reference: https://x.com/disarto_max/status/2110815271078559764, “Voice agent (dark mode)”. X 403; public metadata exposed original video. Actual frames inspected at 2, 14 and 29 seconds: centered dark floating panel, caller/agent signal lanes and transcript excerpts, voice-to-voice total, five-part latency rail and budget marker, recent-turn bars with outlier marks and percentiles, Pause/Barge in controls. Original video 36.465 s. Media frames stored unchanged. No inference of real recording or model behavior from the mockup.

## Before-edit comparison
| Target | Existing peer / owner | Reuse and scope |
| --- | --- | --- |
| Dual signal lanes | `project-chat/AudioClip`: real audio player with native seek range and decorative single waveform | Source inspected. Do not fake speech/audio; add VoiceSignal with explicit sample amplitudes, time position and two channel transcripts. Native range for seeking, static data display. |
| Latency decomposition | `agent-observability/AgentHealthTable` and `trace-query/TraceTable`; typed counts, p95 and source validation | Capture actual agent-health peer. New VoiceLatencyBreakdown needs stage sum, budget position and exact accessible values. Existing semantic tokens and shared error state. |
| Turn history | `agent-observability/InferenceChart`, `usage-forecast/DailyUsagePace` | Source inspected. New selectable TurnLatencyHistory has deterministic nearest-rank p50/p95, outlier marks, current selection and exact row labels. Do not duplicate generic chart primitives for another metric. |
| Template shell / controls | ActivityWorkspaceShell, Button/IconButton, settings RowShell/RowLabel | Reuse shell/card/control owners; primary reference panel remains central with a settings/inspector side rail. Existing routes for sibling agent tools. |
| Empty/error | automation/AgentWorkspaceState | Reuse centered icon-title-description and retry/reset where applicable. |

New route baseline [before](before-entry.png) reaches Button docs; no previous voice telemetry page. Narrow baseline absent, exact revision retained. New states have no prior equivalent; do not fabricate one.

Motion review: signal is functional time-series playback, not decorative wobble. Data position advances only after explicit Play, pauses on visibility loss, supports immediate seek/pause/interrupt and cleanup. No easing or number rolling. Reduced-motion hides the moving playhead while retaining textual time and phase information. No initial autoplay. Simulation is local and silent; no microphone permission or voice backend is used. The native recording limitation was recovered with Playwriter CDP screencasting; see media notes below.


## Final implementation and consistency review

Three controlled components (VoiceSignal, VoiceLatencyBreakdown, TurnLatencyHistory) and the Voice Agent template. Shared ActivityWorkspaceShell, Button/IconButton, settings RowShell/RowLabel and AgentWorkspaceState remain canonical; no shared owner was altered. Existing docs/playground, routing, metadata and navigation conventions are reused. New timings and signals use explicit typed fixture data, not fabricated live telemetry.

| Category | Evidence / conclusion |
| --- | --- |
| Entry behavior | Before route falls back to Button docs; after opens the full template. Existing agent-health peer captured and visually inspected. |
| Loading | No asynchronous data request: no loading state introduced. Host components receive already supplied data. |
| Empty / error / recovery | Shared AgentWorkspaceState for empty history, invalid stage input, closed monitor and disconnected sample. Empty/invalid playground toggles and reconnect/reopen verified. |
| Actions | Existing Button/IconButton with tapScale=1, native select/range; keyboard End reaches 8 seconds, settings action focuses budget; history uses pressed selection. |
| Titled scroll surfaces | Waveform/title stay in normal flow; narrow history scroll is contained within the panel, page remains exactly 390 px wide. Existing docs shell owns sidebar scroll. |
| Icon / color inheritance | Existing Icon and semantic tokens, orange agent lane, red over-budget indicators, neutral source stages, theme variants inspected. No alternate icon library added. |

## State / media index

| Scenario | Before | After / result |
| --- | --- | --- |
| New route, 1440×1080 viewport | [Absent route](before-entry.png) / [baseline recording](before-entry.mp4) | [Dark complete page](after-dark-final.png), [light page](after-light.png) |
| Playback, pause, interruption | No earlier voice interaction | [Actual capture](after-playback.mp4), [interrupted](after-interrupted.png). Play → Barge in preserves 621 ms; replay starts at zero; pause stays at 0.7 s. |
| Disconnect / recovery | No prior state | [Disconnected](after-disconnected.png); reconnect retained turn 5 and 868 ms. |
| Narrow, 390×844 viewport | No narrow baseline captured; baseline revision retained | [Dark](after-mobile-dark.png), [light](after-mobile-light-final.png); internal history scrolling and wrapping settings. |
| Medium, 900×1000 viewport | No prior page | [Completed playback](after-medium.png); one-column console and two-column inspector. |
| Components | No prior routes | [Signal playground](after-signal-playground.png), [invalid latency](after-invalid-playground.png), [empty history](after-empty-playground.png); restored valid states and selected turn 5. API docs and generated JSX imports inspected. |
| Changelog | [Prior entries](before-changelog.png) | Addition captured after actual PR number was assigned. |

Screenshots are full-page where needed, hence output height can exceed viewport height. Dark/light captures use identical English fixture data for the selected state. These are local fixture captures, not production or real call verification.

Superseded originals retained: after-dark.png precedes saturated semantic stage colors; after-mobile-light.png and after-mobile-dark-v2.png show the 397 px overflow before the grid min-width fix. Final mobile files above are 390 px wide. New entries in the sidebar were already present in before-changelog.png; that image is the baseline for the changelog content only.

## Motion review

| Check | Result |
| --- | --- |
| Purpose / trigger | Explicit Play only; functional cursor and transcript reveal, no autoplay or decorative waveform motion. |
| Timing / interruption | Real elapsed time at 0.5/1/2×; 80 ms sampling. Pause, seek, Barge in, turn changes and disconnect stop playback immediately. Completion clamps to 8 seconds. |
| Performance / ownership | One cleaned-up interval; playhead transform; no layout tween. Typed component remains controlled by host. |
| Reduced motion | Browser emulation verified both playheads hidden. Numeric time, phase and transcript remain usable. |
| Lifecycle | Visibility listener and timer removed on cleanup; source inspection confirms background pause. Separate background-tab capture not obtained. |
| Verdict | Approved for this local replay. No unresolved motion defects; full screen-reader and physical-device tests not performed. |

Native Playwriter recording is unsupported in the retained direct-browser mode. Recovered via the same task-owned Playwriter CDP session, Page.startScreencast, original JPEG frames and actual timestamps. The untrimmed after-playback.mp4 is 1440×1080 / 21.56 s with no audio. 54 original frames and timestamp manifest remain in recording-frames; the final frame is held 250 ms for encoding. The clip shows playback, interruption and replay; the last sampled frame precedes the final Pause update, whose frozen 0.7-second value was independently checked. Baseline before-entry.mp4 is 1440×1080 / 2.04 s, the unchanged missing-route screen held until its actual stop timestamp. Baseline recovered using the separate unchanged localhost:5262 checkout at 61f0349 (same product source as baseline main merge 04c46c8). Originals preserved; no synthetic frames inserted.

## Verification and limits

- TypeScript + production build passed; pre-existing large-bundle advisory remains.
- Six model tests passed (tests.txt): phase boundaries, immutable interruption, timing/sample validation, nearest-rank percentile, clock clamp and transcript bounds.
- Browser checks: themes, 390/900/1440 widths, seek keyboard, settings focus, close/reopen, reset, next turn, two-times completion, pause/interruption, budget reclassification, reconnect, empty/error recovery, component docs and JSX import.
- Export JSON read back: 12 turns, selected turn 12, 800 ms budget, last turn 621 ms. Stored export-session.json.
- Runtime logs clean after development initialization; initial HMR requests during file creation were transient.
- Coverage gaps: physical mobile devices, other engines, full screen-reader flow, hidden-tab recording, separate screenshots for every docs API page. No remote voice service, microphone, real audio or production deployment included.
