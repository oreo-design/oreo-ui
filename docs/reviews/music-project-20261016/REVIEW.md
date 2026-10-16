# Music Project review

Baseline `671dba9f3ddb2eb00e8059512c90e7b202a33c2c`, fresh main, isolated worktree preserving settings WIP. Reference: https://x.com/designflyio/status/2110867727741341732 (Brad / Designfly, Project page). X fetch blocked 403, public metadata and actual full image inspected through Playwriter. English, Chromium, local fixtures, localhost:5264, desktop 1440×1080. Reference screenshot retained at 1600×1200.

## Before-edit grounding

Reference shows a dark music-production project detail: left workspace rail, title/BPM/key/favorite, full-width track card with blue progress waveform and timestamped avatar markers, comment composer below waveform, Tasks/Comments/Versions/Files tabs, six task rows with due dates and assignees, expandable stem checklist. It is a still image; motion and unseen tabs are not source-verified.

| Target | Peer / canonical owner | Reuse / justified difference |
| --- | --- | --- |
| Track waveform and timestamp navigation | `project-chat/AudioClip`, `music-workspace/ProjectChatDemo`; actual Music Workspace captured | Reuse existing local synthesized audio fixture and HTML audio timing semantics, native seek range, Button/IconButton. New controlled AnnotatedWaveform adds explicit timestamp controls alongside avatar markers and precise comment selection; the older compact chat player remains unchanged. |
| Production checklist | `task-row/TaskRow`, `grouped-tasks/TaskListRow` source inspected | Reuse native checkbox, Avatar, neutral date tokens. New ProductionTaskList supports nested stem completion and track timestamp links; no status/priority columns where reference has none. |
| Version selection | ProjectChannels, BrowserSessionTabs source inspected | Base UI tabs for page sections; new MixVersionList provides single controlled selection with uploader/duration/latest metadata. |
| Detail layout | MusicWorkspace and StudioInbox composed layout source; Music Workspace screenshot inspected | Existing music identity, neutral surfaces, semantic blue playback/progress; dedicated full-width detail rather than floating chat. Sidebar has only useful links. |
| Empty / error / loading | AgentWorkspaceState, existing audio error behavior | Shared centered states; initial audio metadata status, recoverable media error, version-specific no comments. No pretend remote fetch. |

Before route `/music-project` resolves to Button docs: [baseline](before-entry.png). No previous music detail route; individual new states and narrow baseline do not exist. Product peer: [Music Workspace](peer-music-workspace.png). Reference: [actual image](reference.png). New local template remains independent of the existing library's conversation action.

Motion plan: no decorative animation or animated tab/list switches. Native media time updates drive progress; no autoplay, pause on source replacement and hidden tab. Reduced-motion keeps accessible numeric timing and hides moving progress overlay. Playback evidence will use real audio state and browser frame capture if native recording remains unavailable.

## Implementation and verification

Three new components: AnnotatedWaveform (controlled amplitude display, native seek input, markers and explicit timestamp links), ProductionTaskList (nested completion, collapse and timestamp navigation), MixVersionList (controlled pressed selection). The Music Project template composes these with existing Avatar, Button/IconButton, Base UI Tabs and AgentWorkspaceState. Existing chat/audio components and Music Workspace remain unchanged. Source metadata, sidebar, API docs and playground code generation are registered.

The still reference was mapped to the product's existing tokens. Main page has a 14rem workspace rail, full-width player, inline composer and dense task region; below 760px the rail becomes a wrapping navigation strip. Task dates and assignees wrap at 600px. Markers may overlap when timestamps are close; the separate timestamp links provide distinct pointer and keyboard targets at all widths. The waveform is illustrative, while playback and its duration use the actual audio element. All four seeded versions reuse the existing 3:58 synthesized fixture; newly selected local audio is read and stored only for this browser session.

### UI consistency review
| Lens | Result | Peer / evidence / limit |
| --- | --- | --- |
| Entry | Checked | Existing Music Workspace and Studio Inbox linked; new route opens standalone project detail. Before route fell back to Button docs at `/`. |
| Loading | Checked, media screenshot gap | Metadata loads into the same player region with the seek/play controls disabled; no synthetic remote refresh or page spinner. Fast local metadata state was not captured separately. |
| Empty / error | Checked | Shared AgentWorkspaceState in empty comments, empty components and invalid waveform; actual broken audio recovery captured and retried. Invalid file leaves existing mix intact. |
| Actions | Checked | Existing Button/IconButton, neutral operation icons, native checkbox/range. Base UI tabs use arrow navigation plus Enter activation, verified. Parent task completion and Undo exercised. |
| Titled scrolling | Checked | All project content scrolls in normal document flow; no fixed title overlay requiring a fade. Responsive tabs use contained overflow. 390px and 900px content widths equal viewport widths. |
| Icons / color | Checked | Existing Avatar, Icon vocabulary and semantic progress/status colors. No shared token changed. Dark/light screenshots inspected. |

### Focused results
- TypeScript + production build passed. Existing bundle-size advisory remains.
- Five model tests pass (tests.txt): immutable parent cascade, derived completion/reopening, unknown task stability, seek bounds/time formatting and comment validation.
- Browser: play advances real media time; pause stays fixed; timestamp marker seeks 1:04; task seeks 1:52. The keyboard range Home reaches zero.
- Comment composed at 1:52 remains at 1:52 after seeking zero before Send. Resolution/reopening state is local. v3 has zero v4 comments; draft text restores when returning to v4.
- Checkbox parent completes all four stems; Undo restores only drums/bass completed. Collapse/expand works. Add-task Enter submits, and Undo removes it.
- Invalid WAV rejected, previous mix unchanged. Valid two-second WAV added as v5; actual metadata shows 0:02 and playback reaches end/stops. Four prior versions preserved.
- Export readback (project-export.json): 5 versions, 3 comments, v4 comment at 112 seconds, imported audio duration 2 seconds. Blob URL omitted; uploaded binary is not exported.
- Reduced-motion browser emulation hides colored progress overlay; numeric timing and controls remain. No decorative entry or tab animation added.
- Playground independent task toggle, empty task/version lists, invalid waveform, recovery, version selection, API docs and generated imports exercised.

### Motion review
| Before | After | Why |
| --- | --- | --- |
| No music project route | Explicit native audio playback updates waveform progress; no autoplay | Functional timing follows the audio, not a separate simulated clock. |
| Static reference only | Tabs, checklist, comment selection and version replacement are immediate | Frequent keyboard and inspection actions need no ornamental transitions. |
| Moving progress overlay | Hidden under reduced motion with stable time text retained | Avoid unnecessary movement without disabling playback controls. |

**Approve.** No custom CSS transition/keyframe added. Button uses canonical owner with tapScale=1. Native media callbacks own position, pause/play/error/end state; prior audio is paused on version replacement and document hiding. Object URLs are revoked on unmount. Physical-device, cross-engine and full screen-reader testing are not covered; hidden-tab pause inspected in source, not separately recorded.

## Evidence index

| State | Before | After |
| --- | --- | --- |
| New route / complete project | [Before entry](before-entry.png) | [Final dark project](after-dark-final.png), [final light project](after-light-final.png) |
| Playback / marker seeking | [Missing route recording](before-entry.mp4) | [Real browser recording](after-playback.mp4) |
| Comments / resolve | No prior detail state | [Timestamp comments](after-comments.png) |
| Version-specific emptiness | No prior detail state | [Empty v3 comments](after-empty-comments.png) |
| Replace audio / retained versions | No prior detail state | [Local v5 and previous mixes](after-upload-version.png) |
| Audio failure / retry | No prior detail state | [Error](after-audio-error.png); retry restored playback control and 1:04 seek position |
| Narrow 390×844 | No earlier route at this width | [Dark](after-mobile-dark.png), [light](after-mobile-light.png) |
| Medium 900×1000 | No earlier route at this width | [Light](after-medium-light.png) |
| Component playground | No earlier component route | [Waveform](after-waveform-playground.png) |

Original captures are preserved. after-dark-initial.png is a superseded failed render caused by an unsupported icon name during implementation; the name was replaced with the existing chat icon, build and runtime then recovered. All listed successful screenshots were inspected. Full-page images can exceed viewport height.

Recordings use Playwriter's task-owned CDP Page.startScreencast because native recording is unavailable in the retained direct connection mode. after-playback.mp4: 1440×1080, 9.72s, 60 actual JPEG frames, timestamp intervals retained, final frame held 250ms. Original frames and timestamps are in playback-frames. Recording has no audio track; real media progression and controls were browser-verified separately. before-entry.mp4: 1440×1080, 15.60s, original static fallback held until actual stop time. Recovered from the unchanged previous task preview localhost:5263 at f5c6132, whose product source matches baseline merge 671dba9. It does not pretend there was an earlier music interaction.

Known evidence gaps: no narrow baseline, transient metadata loading screenshot, every docs API screenshot, physical devices, other browser engines, full screen-reader navigation. Local fixtures do not prove real collaboration, audio upload to a server or production deployment.


## Delivery

[PR #92](https://github.com/oreo-design/oreo-ui/pull/92). Product source reviewed at `39e2ef954c4602d952fd82e60f1101aa807343b3`; follow-up contains the changelog entry and evidence metadata. Final merge uses the exact reviewed PR head, followed by remote readback. Files-tab download checksum matched the repository audio fixture: `339d94f71c7191eeabef756916c7258432ef331ffaa96b9a075057f9b0c7334a`. Resolve and Reopen were both exercised. Changelog [before](before-changelog.png) / [after](after-changelog.png); this pair covers changelog content, not the sidebar links already introduced earlier.
