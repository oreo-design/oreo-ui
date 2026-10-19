# Verification observations

Environment: local fixture, Chrome through Playwriter session 7, production Vite preview at http://localhost:5190. English; 1440×1100, 900×1000 and 390×844 CSS viewports; light/dark; desktop browser emulation, not physical mobile hardware.

- TypeScript project build passes. Vite production build passes; existing large-chunk warning remains.
- 12 reducer tests pass: one runner, blocked-task skip, append when blocked, pause/resume progress, stale epochs, nonpreemptive answers, validation, ordering, active removal/undo, exact LIFO restore, duplicate IDs, stale events.
- Actual browser: first request completes; second needs input; third runs. Session pause preserves this state. Independent pause of first request immediately schedules third, and resume does not preempt it. Append while playing adds a sixth request.
- Three-step radio/custom answers, blank-answer validation, Back focus, answer persistence, final save returns focus to task title. Saved context remains after closing/reopening and preserves pause. Composer mention inserts @Project; local attachment accompanies submitted task; 501-character submission is rejected with visible error. Empty draft has disabled Send.
- Removal moves focus to neighboring title. Undo restores task; deleting all tasks reaches clear queue; undo from empty restores last removed task. Retry recovers all five IDs; initial loading is separate from preserved-data refresh API.
- Pointer sorting moved reorder before height. Keyboard Space/ArrowUp/Space moved flat before gradient. Escape restored the prior order. These use stable IDs and real UI input; reorder recording retained.
- Reduced-motion media emulation gives computed shimmer animation-name: none.
- All four Playground routes render and generate source JSX with correctly registered component imports. All four documentation routes render. Shared Playground layout remains its existing demo/property inspector arrangement; global fixed-top catalog redesign is outside this task.
- Narrow queue body uses overflow-y:auto and overflow-x:hidden; measured 364px client and scroll width (no horizontal overflow). Tall expanded body measured 1230px scroll height, 463px visible area. Top/middle/end captures preserve opaque toolbar and footer; footer computed background rgb(255,255,255).
- Browser console includes pre-existing extension provider collisions and undefined session errors, also observed on baseline. No new app React/export errors observed. One docs navigation coincided with rebuilding dist; retry against completed production output succeeded.

Corrections from review: split action discriminants for TypeScript narrowing; restore focus on Back-to-first-step and after answer submission; no inert context action without handler; override shared mobile overflow-visible in this template only; wrap first request when expanded; match each docs snippet to its component and clear stale saved notices; reuse shadow tokens; fix white-on-white loading placeholders with the shared border token.

Limits: no connected AI, real uploads, persistence, authentication or actual project edits. No screen-reader or physical touch device run. Pending/error clarification controls are implemented and documented but not exercised against a real asynchronous backend. Existing peer loading/error states were traced to shared owners; only peer normal surfaces were captured. New component routes have no individual pre-change screenshots; task baseline captures the prior template entry redirect. No prior queue motion existed. No production deployment claim.
