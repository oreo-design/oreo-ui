# Project Feed — review

Reference: https://x.com/zahragr8r/status/2110632965361529237. Actual static image inspected in reference.png. Dense actor/action/subject/project rows, grouped dates, category and actor filters, dark project sidebar. No source interaction or animation is inferred.

Baseline: d697303942153c69dd8c16a70c009683ca3aa167. Isolated task branch; unrelated primary worktree preserved. Playwriter session 2; Chromium, English local fixtures, localhost:5247, 1440×1000 unless noted. New /project-feed entry fell back to Button home (before-entry.png) before editing.

## UI consistency review
| Lens | Target / peer | Canonical owner / result |
|---|---|---|
| Entry | Project Feed / Project Workspace | Existing App and Sidebar routes; peer captured and inspected live. Details use Base UI Dialog with focus return, as project tasks. |
| Loading | Grouped feed / DocumentTimeline | List-shaped static skeleton. Peer has no initial-load contract; comparison of the new skeleton is scoped to its list shape. |
| Empty | Grouped feed / project task empty region | Shared AgentWorkspaceState, centered within owning list; reset filters / retry as applicable. |
| Actions | Feed toolbar/detail / Project Workspace | Shared Button, IconButton, Avatar, Tag. Plain native row button is a full-row navigation target. |
| Titled scrolling | Event detail / task drawer | Opaque fixed header/footer, independently scrolling body. Feed date headings scroll in normal document flow, so no fade needed. |
| Icons/color | Project sidebar / Project Workspace | Shared Icon neutral currentColor; existing person palette and project-color markers. Read/unread indicator is accompanied by accessible text. |

Existing AuditTimeline and DocumentTimeline inspected: neither owns a compact actionable project-event row or chronological grouping/filter model. New ActivityEventRow and GroupedActivityFeed compose existing identity/action/state primitives; existing owners and their consumers remain unchanged. Shared project/member fixture labels are imported from Project Workspace.

Implementation complete; after-state coverage is recorded below. New route has no corresponding pre-change detail, empty or filtered state; this is an explicit baseline gap, not simulated evidence.

## Final result / evidence map

ActivityEventRow and GroupedActivityFeed are implemented, with component docs/playgrounds and a complete Project Feed template. Source-derived density is retained: 24px avatars, compact 48px normal rows, normal-flow date headings and muted action/project labels. Spacing/radii/colors map to Oreo tokens. The drawer's 20% black backdrop follows the existing Project Workspace backdrop because theme-inverting overlay tokens do not describe modal dimming.

| State | Baseline | After / result |
|---|---|---|
| New full route | before-entry.png; missing route fell back to Button home | after-final-light.png / after-final-dark.png, full template in context |
| Source appearance | reference.png | after-final-dark.png; event identities reuse existing Oreo fixtures |
| Project peer | peer-project-workspace.png | Shared identities, buttons and drawer behavior preserved |
| Filter + local comment | No previous feed | after-comment.png, after-filtered-comment.png; posting adds one event and discussion entry, actor/category/search finds it; undo removes it from both |
| Comment validation | No previous detail flow | after-comment-error.png; blank input rejected, valid submission succeeds |
| Long detail / scrolling | Existing task drawer owner inspected | after-detail-scroll.png: 1,299px body content in 641px scroll region, opaque header/footer remain visible |
| Narrow/light/dark | New route absent | after-mobile-light.png, after-mobile-dark.png (390×844), after-tablet-light.png, after-tablet-dark.png (768×1024); page horizontal overflow=false |
| Mobile navigation/detail | Existing inline project nav behavior reused | after-mobile-nav.png, after-mobile-detail.png; project selection closes menu; detail fits viewport |
| No matches | New route absent | after-empty-v2.png supersedes after-empty.png: wording now says No activity found instead of implying no outstanding work |
| Error / recovery | Shared AgentWorkspaceState owner | after-error.png; export disabled, Try again restores 12 rows and local data |
| Initial loading | New list shape | after-loading.png; static list skeleton, no fake async completion |
| Read state / pagination | No prior feed | Unread only + Mark view as read yields zero rows; clearing filters and Load more yields 18. Opening an unread row marks it read. Dialog close returns to the row, or heading if that filtered row disappeared. Both focus cases inspected. |
| Components | Missing entry baseline above | after-feed-docs.png, after-row-docs.png; props and read-state controls available |
| Export | No previous export | export-filtered.json from native Chrome download: exactly activity-3 for Status changes + Sam + Website filters |
| Changelog | before-changelog.png recovered from 5246 (same source tree as baseline merge) | after-changelog.png (captured with final entry) |

Consistency status: entry/actions/icons checked with actual Project Workspace peer and new runtime. Empty/loading share inspected owners; new runtime captured, equivalent peer empty/loading captures are a coverage gap. Titled scrolling checked in new drawer, shared owner/source compared. No cross-product audit is claimed.

Validation: production build passed, with existing large-chunk warning only. Focused script passes UTC midnight/week boundaries, composite filters, unread matching, stable ordering, comment validation/immutability/undo and relative times. An initial Vite HMR update produced a temporary DocsPage invalid-hook error while routes were changing; a full reload recovered, final interactions and subsequent error log readback are clean. This was not a reproduced production failure.

No new timed animation; motion comparison is not applicable to the static reference. Capture coverage is fixture-only and does not verify server persistence, notifications, attachment download or deployment. Post-comment button color was corrected by scoping a counter-label rule to the direct span; after-mobile-detail.png and after-detail-scroll.png show the corrected button. Original screenshots are retained. All local test comments were undone and final views reloaded. Source revisions and screenshot hashes are in manifest.json / Git history.

Delivery: PR #74 https://github.com/oreo-design/oreo-ui/pull/74. Reviewed implementation revision: 5b6af1385e05a3e83db8030859393e2e5ae3ecd0. Changelog and manifest are in the subsequent evidence commit; final remote integration is verified through the PR.
