# Studio Inbox — review record

Reference: [Brad / @designflyio — Inbox](https://x.com/designflyio/status/2110486258640372119). Inspected the actual still image in authenticated Chrome. Source is a static screenshot; no original interaction/motion was demonstrated.

Baseline: `6c4ac7d6985858fa4db0aaeb87c2dbe1c23c9ba1`. Task branch: `codex/studio-inbox-20261015`. Local fixtures only; no messages leave this app, no real approvals or uploads. Unrelated main checkout work is preserved.

## Before-edit inventory

New surfaces: Studio Inbox entry, notification filters/search/grouped list, selected discussion, read/archive/undo, approval result, reply composer, mobile list/detail, component documentation/playground. Baseline route falls back to Button docs: no earlier inbox template existed. Existing music-workspace and project-chat are the canonical musical collaboration peers. Reuse Avatar, Button/IconButton, ChatBubble, AudioClip, CollaborationComposer and AgentWorkspaceState. Add only notification-specific primitives. Source photographs are not republished; use Oreo initial avatars.

Environments: localhost:5211; Chromium Playwriter session 45; desktop 1440×1000 and mobile 390×844; default English; task-controlled theme. Evidence is real local component rendering, not production verification.

## Evidence and consistency

Original captures, final mappings and verification limits are recorded below.

## Result and reusable boundaries

- `InboxNotification`: controlled selection/read state, author, time, preview and project; a native button with a single accessible author name.
- `InboxGroup`: labelled date section with result count.
- `InboxFilters`: six pressed-state type filters over one list, with horizontal scrolling on small screens.
- `/studio-inbox`: full workspace with project navigation, combined search/type/project/unread filters, mark-all-read, archive/undo, inline discussions, local approval and replies. Mobile opens one discussion and returns focus to Inbox. Hidden discussions pause audio and retain drafts/replies.
- `/studio-inbox-components`: documentation, editable playground and source export registration.

Reuse: Avatar, Button/IconButton, Icon, AgentWorkspaceState, ChatBubble, AudioClip, CollaborationComposer. Existing Music Workspace audio fixture is reused; no new media dependency. Source avatars are represented with initials. The original right edge is cropped in the source image itself; this implementation completes the discussion/composer from the existing Oreo pattern.

Final implementation: `344988b` (full revision in manifest). First implementation: `4995fa3`. The final fix centers the empty region and avoids duplicate avatar names; the earlier default/interaction captures remain valid for their visible states.

## Paired evidence

| Scenario | Before / peer | After | Notes |
| --- | --- | --- | --- |
| Desktop entry, 1440×1000, light | [before-entry](before-entry.png) | [light reviewed](after-light-reviewed.png) | Exact missing-route action previously redirected to Button playground; now opens full inbox. |
| New default dark workspace | No preceding inbox; see entry baseline | [dark reviewed](after-dark-reviewed.png) | Three columns, selected notification and live local audio controls. |
| Mobile entry, 390×844, light | [before mobile](before-mobile-entry.png) | [mobile light](after-mobile-light.png) | Baseline recovered from unchanged prior worktree on port 5210; its src tree was checked against baseline commit. |
| Mobile list/detail | [mobile list](after-mobile-list.png) | [mobile discussion](after-mobile-detail.png) | Before/after within the new flow; heading focus on open, Inbox focus on back; audio paused on return. |
| Mobile type filter | [mobile light list](after-mobile-light.png) | [release filter](after-mobile-filter.png) | One release result; all six filters remain keyboard accessible. |
| Empty/recovery | [peer music empty](peer-music-empty.png) | [centered empty](after-empty-final.png) | Clear filters recovers seven notifications. Target uses shared AgentWorkspaceState. |
| Approval | [default](after-dark-reviewed.png) | [approved master](after-approved.png) | Approval saved only in page state. |
| Reply / audio timestamp | [default](after-dark-reviewed.png) | [reply at 1:24](after-reply.png) | Real sample playback, seek, pause and local composer. |
| Read all | [default](after-dark-reviewed.png) | [all read](after-all-read.png) | Zero unread; disabled mark-all action; empty state layout subsequently corrected. |
| Tablet, 1000×900 | No preceding inbox | [tablet](after-tablet.png) | Scrollable list and transcript; no root horizontal overflow. |
| Components | [old entry](before-entry.png) | [playground](after-playground.png), [documentation](after-docs.png) | Playground controls, documentation filter and API surface inspected. |
| Existing music surface | [music peer](peer-music.png) | Same existing surface | Reused actual components, not a second chat/audio implementation. |
| Source | [original image](reference-image.png) | [default adaptation](after-dark-reviewed.png) | Source is static; adaptation is interactive. Source post/expanded captures retained as context. |

Historical captures are not overwritten. `after-dark-initial.png` is superseded by the reviewed capture (outer margins); `after-empty.png` by `after-empty-final.png` (centering). `after-dark-final.png` and `after-light-final.png` are earlier interaction-round captures; use the `*-reviewed.png` pair for the final default presentation.

## UI consistency review

Scope: Oreo UI web, local fixtures. Compared actual Music Workspace rendering, its empty result and shared chat controls, with the new inbox; inspected the canonical component owners and their Music Workspace consumers. This is not a native or cross-product verification.

| Lens | Target / peer | Owner / result | Evidence or limit |
| --- | --- | --- | --- |
| Entry | Inbox / Music Workspace | Template-level route and Oreo return link; discussion selection stays in context. Mobile uses an explicit Back action because three columns do not fit. | Entry + peer + mobile captures; mobile focus verified. |
| Loading | Local in-memory inbox / local music fixture | No network loading phase; no artificial skeleton. Native media metadata belongs to AudioClip. | Not applicable to fixture data loading. Real API loading is not implemented. |
| Empty | Inbox filters / Music Workspace filters; automation owner | Same Clear filters Button role. Target uses the shared AgentWorkspaceState and centers it in the list. Existing music peer remains unchanged. | Actual peer empty and final target empty inspected; other AgentWorkspaceState consumers inspected at code level only. |
| Actions | Reply/audio / existing Project Chat | Reuse CollaborationComposer, AudioClip, Button/IconButton; no parallel audio or send implementation. | Desktop reply/draft/audio assertions; mobile pause/focus assertions. |
| Titled scroll | Notification list and discussion / ProjectChatPanel | Opaque headers outside independently scrolling content prevent overlap. No redundant fade over an opaque header. | Default, scrolled reply, tablet and mobile screenshots. |
| Icons/color | Inbox operations / music controls | Existing Icon inherits neutral text. Blue reserved for selection/unread/seek; green for workspace status. | Bright/dark captures, code owners. |

Layout specifics: 208px sidebar; list gets 39% of remaining area with a 280px minimum. At 1100px sidebar reduces to 160px; at 760px list/detail become a single-view flow. Colors and radii use Oreo semantic variables; spacing follows existing 4px-based values. Custom column proportions and viewport-relative heights implement this split-pane composition. Final empty-state placement is a wrapper change, not a global component change.

## Focused verification

- TypeScript `--noEmit`: passed. Vite production build: passed; existing large-chunk warning remains.
- Desktop: combined filtering, empty/recovery, unread counts, mark all, archive/undo, approval, reactions, persistent project draft, send/reset, audio play/pause and timestamp seek to 84 seconds passed. See [desktop QA](qa-desktop.log).
- Mobile: list/detail, focus to discussion heading and back to Inbox, pause hidden audio passed. Initial long run timed out after those assertions; completion was checked in shorter runs. See [mobile QA](qa-mobile.log).
- Mobile theme: toolbar intercepted pointer events. Normal keyboard navigation (Inbox heading, three Shift+Tabs, Space on theme) changed the theme; light screenshot confirms result. This was automation overlay interference, not app button failure.
- Widths 390, 760, 761, 1000, 1100, 1101 and 1440: no root horizontal overflow; narrow filter strip intentionally scrolls. See [breakpoints](qa-breakpoints.log).
- Final correction: centered empty/recovery, unique row accessible name, row activation and reduced-motion filtering passed. See [final QA](qa-final.log).
- Playground and documentation loaded; documentation filter reduced the list to one mention. Source export is registered. The printed CLI installation command is inherited docs UI; package publication was not verified.
- Motion review: no new animation or moving transitions; Button press scaling set to 1. Inherited color/focus feedback retained; reduced-motion state checked.
- Fresh app reload has no app exception. An existing resource 403 remains in preview logs. Earlier shared-worktree HMR briefly produced invalid-hook errors; a full reload cleared them. User Chrome also logs unrelated wallet/browser-extension errors; these are not attributed to this template.

## Coverage limits

Recording attempt failed: “Extension has not been invoked for the current page … Click the Playwriter extension icon on this tab to enable recording.” Screenshots and interaction assertions exist, but no video is claimed. Recording can be recovered by invoking that extension on the task preview tab. No new animation was introduced.

No live accounts, notification backend, remote message delivery, upload, persisted approvals or production deployment are claimed. Audio failure/retry and send rejection branches are inherited from existing Project Chat and were not fault-injected in this task. The original provides no error/loading/motion specification. Screenshot coverage and these limits are separate from main integration.
