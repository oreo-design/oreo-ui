# Agent Inbox — reference, consistency and visual evidence

## Before implementation
- Reference: https://x.com/componest/status/2110750797755773328, credited by Componest to @flohoeller. Actual public video inspected at 0, 2, 5, 10 and final seconds. Original browser frame captures retained here. Observed: three groups, status colors plus text, description and query/tool counts, expanded model/activity history, cross-group movement, board/list, light/dark. This is the external reference check.
- Baseline: `68c4987808dd119fc4ac82e70a944a371af7274a` (origin/main). New route `/agent-inbox` previously resolves to Button docs (`before-entry.png`), not an inbox. No prior matching inbox template exists. Baseline entry/changelog use 1440×1080, English, light, local fixture. Studio Inbox peer uses its default dark theme.
- Compare target → peers → owner: board/group layout → rendered `/onboarding-board` (`peer-kanban.png`) and `src/components/kanban/kanban.tsx` (source inspected) → existing dnd-kit drag handle/sensor/cancel pattern. The generic KanbanBoard requires task IDs/assignees/checklists and has no card renderer, running status, history or list view. Keep its generic API unchanged; add a specialized run composition using the same dnd-kit infrastructure.
- Inbox grouping → rendered `/studio-inbox` (`peer-studio-inbox.png`), `InboxNotification` / `InboxGroup` in `src/components/studio-inbox/index.tsx`. Reuse restrained borders, token backgrounds, compact headings/counts. Agent runs need multiline summaries, run telemetry and actionable states rather than author avatars/unread markers; no new global notification pattern.
- Actions → shared Button/IconButton, secondary/tertiary, tapScale=1. Empty/error → existing `AgentWorkspaceState` owner (`src/components/automation/index.tsx`; source comparison only at baseline). Status glyphs → existing StatusIcon, text labels always retained. Palette/background/radius/typography map to Oreo tokens and scale.
- Reference details are explicit click disclosures for reliable keyboard/touch access, rather than hover-only content. Group movement has native select equivalent; local sample changes must never suggest actual agent execution.

## Planned changed states and review lenses
| Lens | Before-edit finding / planned verification |
| --- | --- |
| Entry | Missing route recorded. New template/docs/sidebar/playgrounds plus changelog entry. Compare group selection and board/list entry. |
| Loading | New controlled board supports content-shaped initial skeleton and aria-busy refresh with retained content; verify playground. |
| Empty | Centered shared state for no runs/no matches; quiet group-specific empty copy for empty lanes, preserve drop target. |
| Actions | Existing Button/IconButton; visible native move selector provides keyboard/touch equivalent. Verify approve/retry/complete/undo and disabled states. |
| Titled scroll | Main page uses document scrolling, titles scroll with contents; no overlay/fade required. Expanded history participates in normal flow. |
| Icons/color | Neutral action icons; status glyphs and labels use semantic token tones. Verify light/dark and reduced motion. |

## Evidence status
Implementation and delivery pending. Post-change captures, interaction results, motion review and manifest will be appended here. Continuous browser recordings unavailable in the current Playwriter direct browser session (extension tabCapture disconnected); source video frames and before/after stills do not prove motion timing. This is an evidence coverage gap, not a merge gate.

## Implementation and focused verification
- Added `AgentRunCard`, `AgentRunActivity`, `AgentInboxBoard`, template `/agent-inbox`, three component docs/playgrounds, route metadata and sidebar entries. Changelog entry is part of delivery.
- Reference mapping: retained three groups, quiet gray group surfaces, white/dark bordered cards, colored status glyph plus readable text, query/tool counts, expandable activity and board/list. Oreo token mapping: `radius-card-medium` for groups, `radius-card-small` for cards, `radius-control` for controls; semantic background/border/status colors; existing Button/IconButton and StatusIcon. Compact 14px summaries and 12px metadata match dense product peers. At narrow container widths (≤48rem), groups stack to keep embedded documentation readable; page mobile also stacks.
- New composition reuses dnd-kit sensors (mouse 6px activation, touch 180ms/6px), controlled final-drop commit, no data mutation on cancel/outside drop. No same-lane ordering. Native status select and explicit disclosure are keyboard/touch equivalents. Sample durations remain fixed. Changes do not persist after reload.
- Browser checks: approval moves a run to Running and appends demo history; undo restores its prior group/history. Retry, mark done, manual failed status, reset and search-clear recovery verified. Valid pointer drag changed group; Escape cancelled a drag without mutation. Focus returns to the board heading after movement. Enter activates disclosure. Refresh retains populated cards and suppresses mutation controls. Error Retry restores data. JSX Code exports the registered public component, not a private preview wrapper.
- `node --test src/components/agent-inbox/model.test.mjs`: 5 pass (grouping, immutable transitions/history, invalid/no-op updates, search, duration edge cases).
- `npm run build`: passed. Existing large-chunk warning persists (~3.23 MB main chunk); no new package dependencies.

## Second consistency pass
| Lens | Result | Evidence / limit |
| --- | --- | --- |
| Entry | checked | Actual missing route baseline; new template, three registered docs routes, board/list preserving state; docs API and generated code inspected. |
| Loading | checked | `docs-loading.png`; retained-content refresh verified with disabled mutation controls. No live fetching is claimed. |
| Empty | checked | `after-empty-dark.png`: shared centered AgentWorkspaceState and clear-search recovery. Per-lane empty text preserves drop targets. |
| Actions | checked | Shared buttons throughout; status requests delegated to host. Expanded approval/retry and undo tested. Pointer drag/drop and cancel tested; physical touch gestures not tested. |
| Titled scroll | checked | Document-flow headings never overlap passing content. Long list/full-page capture preserves complete history; no sticky-title fade needed. |
| Icons/color | checked | StatusIcon uses monochrome plus the same semantic tone as its card marker. Neutral operation icons. Light/dark, mobile/medium/wide inspected. No claim of repo-wide audit. |

## Motion review (before commit)
| Severity | Location | Finding and resolution |
| --- | --- | --- |
| Resolved | `src/components/agent-inbox/index.tsx:193` | Immediate detail expansion originally animated following cards, momentarily overlapping content (`superseded-after-expanded-light.png`). `layoutDependency` now changes only for view/data regrouping; disclosure expansion is immediate. |
| Resolved | `src/components/agent-inbox/index.tsx:206` | Pointer drag handle no longer creates a hidden focusable button. Keyboard uses the explicit native move selector; drag completion/cancel restores visible heading focus. |
| Pass | `src/components/agent-inbox/index.tsx:196` | Spatial regrouping uses position transforms and an interruptible 250ms zero-bounce spring. No animated width/height or transform scale. Drop overlay has no extra drop animation. |
| Pass | `src/components/agent-inbox/index.tsx:291,312,422` | Reduced motion and keyboard actions use duration 0. StatusIcon animation is explicitly off; frequent buttons use tapScale=1. No decorative loops/stagger or hover movement. |
| Coverage gap | Browser capture | Still frames inspect drag appearance and final result, not timing. Continuous recording is unavailable in this direct browser session; real touch hardware not exercised. |

**Verdict: Approve**, with the motion-recording coverage gap explicitly retained. Source review follows review-animations/STANDARDS.md (frequency, <300ms, transform-only movement, reduced motion). No remaining identified blocking finding.

## Capture index
All media in this directory are original browser captures. `superseded-*` and `pre-final-*` retain correction history and must not be treated as final appearance. Metadata/hash manifest will identify canonical captures and final source hashes. Fixture data is local, English. This does not verify production deployment, actual agent execution, API retries or real approvals.

### Final evidence map
| Surface/state | Before | After | Environment |
| --- | --- | --- | --- |
| New inbox entry | `before-entry.png` (fallback Button docs) | `after-board-light.png` | 1440×1080, light |
| Expanded activity + actions | New state; no prior equivalent route | `after-expanded-light.png` | 1440×1080, light; keyboard approval + undo verified |
| Mobile overview / expanded | New states; baseline source retained, no matching narrow pre-route capture | `after-mobile-light.png`, `after-mobile-dark.png` | 390×844; full-page originals |
| Medium dark, reduced motion | New state | `after-medium-dark-reduced.png` | 900×1000; reduced-motion emulation, full page |
| List and error recovery | New states | `after-list-dark.png`, `after-empty-dark.png` | 1440×1080; early functional captures, before neutral summary copy correction |
| Pointer drag | Source frames `componest-0.png`, `componest-5.png` | `drag-in-progress.png`, `after-drag.png` | Early drag screenshots before final summary copy/handle semantics correction; final handle drag re-tested successfully |
| Component docs | Missing route baseline represented by `/agent-inbox`; individual docs-route baseline screenshots unavailable | `docs-card.png`, `docs-activity.png`, `docs-board.png`, `docs-api.png` | 1440×1080; interactive public components, generated Code import checked |
| Loading/failure | New states | `docs-loading.png`, `docs-error.png` | 1440×1080; retry and populated refresh checked |
| Changelog | `before-changelog.png` | `after-changelog.png` | Matched 1440×1080, light; 51 → 52 updates, PR #86 |

Final correction: removed stale “waiting for your approval” from summary copy so status moves cannot contradict the description. Narrow embedded boards now respond to their container width, not just viewport width. A document-level keydown listener (cleaned up on unmount) also disables regrouping motion for keyboard search/undo controls outside the board. Rebuilt successfully after these changes. Keyboard Enter approval and final pointer handle drag re-verified.

Delivery: https://github.com/oreo-design/oreo-ui/pull/86. Baseline remained current after fetching origin/main. Exact final source hashes and media dimensions/timestamps are in `manifest.json`; the reviewed final commit and remote merge result are reported with delivery. Source content has been reviewed for state ownership, cancelled drop/no-op behavior, caller omission, event listener cleanup, theme inheritance and registered code export. No production claim.
