# Lumeo Studio operations suite — review index

## Scope and source

Source: [Lumeo Studio, “We design super nice products”](https://x.com/lumeodstudio/status/2110370181365076323). All three attached images were opened in the browser and visually inspected before implementation. `oreo-lumeo-reference.json` preserves public metadata and original image URLs; `oreo-lumeo-1.png` / `2.png` / `3.png` are browser captures of the reference images.

1. Fleet: dark directory / geographic route / vehicle details, telemetry, milestones, cargo and alerts. Adapted into **Fleet Control** (`/fleet-control`).
2. ML workspace: module navigation, source files, annotations, health bars and code/metrics/history/tests views. Adapted into **Pipeline Workspace** (`/pipeline-workspace`).
3. Incident monitor: regional totals, selectable map, incident feed, district/category breakdown and camera cards. Adapted into **Incident Monitor** (`/incident-monitor`). Uses fictional civic maintenance incidents; no real people or surveillance records.

Six reusable components: OperationsMap, OperationsFeed, HealthMeters, RouteTimeline, PipelineFile, CameraCheckpoint. Six documentation/playground routes, three template routes, sidebar entries, site metadata, README and Changelog integration. The icon vocabulary adds `truck` in both existing glyph libraries.

Original map, truck and camera SVG illustrations replace reference photos/map tiles. Maps explicitly say “Not for navigation”; cameras explicitly say “Illustrative snapshot”. No reference photography is shipped in product code. All state is local and resets on reload. No real routing, telemetry, dispatch, camera connection, Python execution, training, statistical inference, persistence or production deployment is claimed.

## Revisions and capture environment

- Baseline: `3e5c1d1ef9d83f40610b70a45a34dccc4ca4b8c6` (fresh `origin/main`). Primary checkout's unrelated WIP preserved.
- Task branch: `codex/operations-20261015`, isolated sibling worktree.
- Component/template implementation revision: `4e7c58dbadb906f2661e4b796db8b26a4b9d64cb`. Final head adds Changelog and review metadata; exact head and merged revision are in the delivery readback.
- Local preview: `http://localhost:5234`; Chromium via Playwriter session 65; English; local fixtures; default dark or explicitly toggled light.
- Desktop 1440×1000, medium 900×900, mobile 390×844; screenshot scale CSS; full-page captures can exceed viewport height. Reference images captured in a separate 2400×1524 browser tab.
- The folder retains its October 15 intake date; delivery occurs October 16 in Asia/Shanghai.

## Before / after evidence map

| Changed surface/state | Before | After | Coverage / interpretation |
| --- | --- | --- | --- |
| Fleet entry | `before-fleet-control.png` | `after-fleet-dark-final.png`, `after-fleet-light.png` | Before was the actual missing-route fallback to Button docs, not a prior fleet UI. New route now opens the full template. |
| Pipeline entry | `before-pipeline-workspace.png` | `after-pipeline-delivery.png`, `after-pipeline-light.png` | New template; no previous equivalent pipeline editor existed. |
| Incident entry | `before-incident-monitor.png` | `after-incidents-dark-final.png`, `after-incidents-light.png` | New template; missing route previously fell back to docs. |
| Mobile layouts | Baseline revision preserved; mobile missing-route screenshots not captured | `after-fleet-mobile-dark.png`, `after-fleet-mobile-light.png`, `after-pipeline-mobile-dark.png`, `after-pipeline-mobile-light.png`, `after-incidents-mobile-final.png`, `after-incidents-mobile-light.png` | Real rendered local components, both themes. Initial incident map clipped; fixed width and inspected 356px scene within 390px viewport. |
| Medium layouts | No prior templates | `after-fleet-medium.png`, `after-pipeline-medium.png`, `after-incidents-medium.png` | 900×900; details stack, pipeline retains sidebar, incident district summary condenses. |
| Fleet completed / no results | No prior template states | `after-fleet-completed.png`, `after-fleet-empty.png`, browser observations | Completed route ends at vehicle; idle has no route. Filter recovery, list/map selection, acknowledge/undo tested. |
| Config failure and recovery | No prior editor/checker | `after-config-error.png`, `after-config-checks.png`, `pipeline-interaction.mp4` | Invalid JSON blocked on save; valid edit saved; four range checks pass; cancellation restores saved value. Checks do not run Python. |
| Pipeline keyboard and history | No prior template states | `after-pipeline-keyboard.png`, browser observations | Base UI arrow navigation activates tabs, matching Edge peer; visible focus. Validation history and empty history checked. |
| Incidents resolved / empty | No prior template states | `after-incident-resolved.png`, `after-incident-empty.png`, browser observations | Resolve/reopen updates global counts; selected marker/feed stay synchronized; East+Traffic has zero results; clear recovers all. |
| Component previews / API | Existing Sidebar and docs shell visible in baseline fallback | `after-docs-map.png`, `after-docs-map-empty.png`, `after-docs-api.png`, `after-docs-operations-feed.png`, `after-docs-health-meters.png`, `after-docs-route-timeline.png`, `after-docs-pipeline-file-final.png`, `after-docs-camera-checkpoint.png` | All six standalone routes loaded without current runtime errors; API view and docs↔playground entry checked. |
| Changelog | `before-changelog.png` | `after-changelog.png` | Three new entries grouped under the local merge date, linked to the actual PR. |

### Historical / superseded captures

Keep originals. `after-incidents-mobile.png` shows the pre-fix map clipping and is superseded by `after-incidents-mobile-final.png`. `after-fleet-dark.png` uses the first placeholder route and is superseded by `after-fleet-dark-final.png`. `after-pipeline-dark.png` predates the source contrast/health tone corrections. `after-docs-pipeline-file.png` predates the multiline source control; final capture uses a textarea. `after-incidents-dark.png` predates smaller camera thumbnails. Earlier light/mobile/medium captures remain valid for layout but may show the former transport icon; final desktop captures show the semantic truck icon. The interaction recording precedes the truck icon addition and tab auto-activation adjustment; config behavior is unchanged.

## UI consistency review

Actual peers opened, captured and inspected: **Edge Observatory** (`before-edge-observatory.png`) and **Place Explorer** (`before-place-explorer.png`), plus the existing docs shell. Code owners inspected: Button/IconButton, Icon glyph mappings, AgentWorkspaceState, MonitorPanel, PlaceMap/ParkMapArtwork, DocsPage and playground schema. Scope is these families; no whole-product consistency claim.

| Lens | Target → peer / canonical owner | Result | Evidence / intentional difference |
| --- | --- | --- | --- |
| Entry | Templates / docs → existing template links and DocsPage; pipeline tabs → Edge Base UI Tabs | Checked | Native links and current-page selection; existing documentation/playground switch. Pipeline uses activateOnFocus like Edge. Module/files are pressed buttons, not fake tabs. |
| Loading | Local fixture templates → Edge fixture workspace | Not applicable | All data is synchronously available; no pretend network loading or new spinner. |
| Empty | Filtered fleets/incidents/modules/history → AgentWorkspaceState | Checked | Shared centered icon/title/explanation/action component, separate validation error. See empty captures. No-match map and detail retain distinct explanatory roles. |
| Actions | Config save/check, resolve/reopen, acknowledge/undo → Button/IconButton | Checked | Primary for save/check, secondary for local reversible actions; same tokens/radius/type. tapScale=1; all exposed actions functional. |
| Titled scroll | File source and mobile fleet list → protected monitor/docs headings | Checked | Source figcaption and list toolbar remain outside the bounded overflow region. No overlapping sticky title; no decorative fade needed. Desktop page scroll is normal document flow. Source horizontal overflow is intentional and keyboard-focusable. |
| Icons/color | Shell, feed and status controls → Icon semantic currentColor and project palette | Checked | Operation icons inherit neutral labels; tone reserved for statuses. Truck added to both canonical libraries instead of a local substitute. Numerical health and status text remain available without color. |

No shared peer defect was established; no peer styling changed. New OperationsMap is warranted because PlaceMap requires destination/travel-time semantics that do not fit vehicle and incident markers. It follows the existing percentage-coordinate, host-selection and explicit illustrative-map convention. No duplicate remote map dependency was introduced.

External reference check used the three actual supplied images. Adopted multi-column hierarchy, compact metadata and source annotations; rejected copying source product identities, unverified live indicators, geographic/photo assets, and nonfunctional menu entries. All UI colors map to Oreo tokens; spacing/radius/type use existing rem scale and radius tokens. SVG artwork coordinates and segment-mask pixels are intrinsic drawing geometry, not imported Figma UI values.

## Review corrections

| Before | After | Why |
| --- | --- | --- |
| Generic route continued beyond completed vehicles | Vehicle-specific origin/current/destination route; completed stops at current location, idle has none | Route semantics match the selected record. |
| Mobile minimum height could widen the map scene | Explicit width:100%; edge-aware wrapping labels | Prevents clipping without hiding markers. 356px scene checked in a 390px viewport. |
| Source playground used a single-line field | Existing multiline text control | Preserves source line breaks when editing. |
| Health control could say “All fields match” below 100% | Derived review status/tone in the playground | Status matches the demonstration value. |
| Low-contrast source keyword/annotation blue | Color mixed with active text token | Improves readability in dark/light source panels. |
| Manual tab activation differed from Edge peer | Base UI activateOnFocus | Equivalent local tab navigation follows the existing pattern. |
| Airplane icon represented road vehicles | Canonical truck glyph in Phosphor and Lucide | Correct transport meaning; shared vocabulary remains complete. |

No new animation or timing transition is added. Frequent monitoring, text edits and selections update immediately; decorative pulse/route interpolation was intentionally omitted. Existing shared button behavior is reused with press scaling disabled. Motion review: **Approve** for this scope; there is no new motion sequence to audit.

## Verification and limits

- `npm run build`: passes TypeScript and Vite production build; existing large-chunk warning remains (`build-final.log`; earlier build retained in `build.log`).
- `domain-checks.txt`: defaults, malformed/non-object JSON, missing fields, numeric range/integer boundaries, completed/idle route semantics, timeline current-step bounds and unique incident IDs passed.
- Browser interaction observations: `browser-observations.jsonl` and `docs-observations.jsonl`. Initial fleet logs include stale Vite connection errors while site registration restarted the server. Subsequent fresh route loads and interactions were clean; those earlier logs are preserved rather than erased. One getByLabel exact lookup timed out; confirmed accessible combobox names and used role-based locators successfully.
- `pipeline-interaction.mp4`: 1440×1000, 15.64 seconds, real browser config open → invalid save → cancel → valid checks. 185 original screencast frames retained in `pipeline-interaction-frames.json.xz`; encoded at original timestamps without speeding up. Native extension recording has an activeTab permission limitation in this session; capture used Playwriter's local CDP session. No separate browser runner or remote service. Decoded original frame and dimensions inspected.
- Evidence covers local fixture UI, not real accounts, geographic correctness, backend operations, notifications, camera feeds or production deployment. Source images contain no motion; no matching pre-change template interaction existed. Mobile missing-route baseline and a full theme×viewport×state cross-product are explicit coverage gaps; they do not block the authorized merge.

Delivery: [PR #60](https://github.com/oreo-design/oreo-ui/pull/60), authorized main integration after focused validation. Exact source head is matched at merge; final remote result is read back afterward.
