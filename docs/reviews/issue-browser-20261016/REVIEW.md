# Issue Browser — review index

Baseline: 07b515e67db57d2d53e8ebb35a36b70eb8ac85a9. Local fixture preview: localhost:5266. No GitHub account connection or production deployment. Captures are Chromium / Playwriter session 10, English, CSS pixels.

## Reference and pre-edit grounding

Source: https://x.com/kapish_dima/status/2110801612520255802. Actual 20-second video inspected at 0, 5, 11 and 17 seconds. Original browser frames: `oreo-issue-reference*.png`. Observed dense issue rows, status and label pills, selected purple row, independent right-hand issue reader, metadata, markdown description, latest comments and a persistent reply field. Visible footer suggests shortcuts; exact selection keys are not established by the video. Browser wallpaper, GitHub branding and live counts are not copied.

| Target | Same-role peer and actual evidence | Canonical owner / difference |
| --- | --- | --- |
| List → nonmodal detail | `src/patterns/task-board`, `peer-task-board.png`; `src/components/review-workspace`, `peer-review-workspace.png` | Reuse split-pane/opaque header behavior, shared Button and IconButton. New issue reader needs read-only markdown and pinned local reply instead of TaskDetailPanel's completion-centric editable heading. |
| Dense rows | ReviewQueue/ContactRow source and rendered peer | Native button rows with pressed selection. New issue row adds issue number, status, labels and comment counts; no nested controls. |
| Nav and filters | TaskBoard + TaskProperties in peer capture | AgentWorkspaceNav, InlineSearchSelect and existing neutral semantic tokens. 14rem navigation; dense 4rem-ish issue rows; reader 26rem. |
| Empty and loading | AgentWorkspaceState; SkeletonReveal owner in finance-overview (source-only) | Reuse centered state and skeleton reveal; shaped issue rows. Explicit source-only loading comparison until runtime capture. |

New route baseline: `before-route.png`, 1440×1080 light, actual `/issue-browser` falls back to Button playground. No prior issue browser exists. Peer dark board is not substituted as route baseline. Dark/narrow baseline and pre-existing issue interactions are unavailable because this route is new.

## Planned coverage

Entry/close/focus, filtered and closed lists, bounded keyboard navigation, long markdown scrolling, local comments and draft retention, empty result recovery, loading/error playground, desktop light/dark, medium and narrow list/detail, docs + source export. No live writes. All fixture changes reset on reload.

## Six lenses (pre-edit)

Entry: peers visually checked; new flow pending. Loading: shared owner source-only, pending. Empty: shared owner source-only, pending. Actions: peers visually checked. Titled scroll: opaque boundary in board and review peers; new reader pending. Icons/color: neutral shared actions, status accents only, pending.

## Implementation and verification

Added `IssueRow`, `IssueQueue`, `IssueReader`, plus `/issue-browser` and three documentation/playground pages. The full template supports search, open/closed + label filters, three sorts, bounded Arrow/J/K selection, local create/close/reopen, copy issue title/number, latest/all comments and per-issue reply drafts. No remote sends. Shared owners: AgentWorkspaceNav, InlineSearchSelect (Base UI), Button/IconButton, Avatar, **Tag**, SkeletonReveal and AgentWorkspaceState. Issue labels use canonical neutral Tag rather than a second colored-label variant. Reader is read-only and does not reuse completion-oriented TaskDetailPanel internals; both use opaque non-overlay headers and explicit close/return focus.

| Lens | Result | Evidence / boundary |
| --- | --- | --- |
| Entry | checked | Peer board and review workspace compared visually. Pointer selection, ArrowDown, mobile Close and returned row focus exercised. `interaction.mp4`, mobile captures. |
| Loading | checked | `playground-loading.png`, `playground-refresh.png`; shared SkeletonReveal shapes rows, refresh keeps real content readable. No real network involved. |
| Empty/error | checked | `after-filter-empty.png`, clear-filter recovery, `playground-error.png`, retry restores rows. Shared centered AgentWorkspaceState. |
| Actions | checked | Shared actions as in peer board. New issue, close/reopen, local comment tested; screenshot `after-created.png`. Clipboard denial remains an explicit handled branch, not browser fault-injected. |
| Titled scrolling | checked | Reader and queue have separate overflow regions and opaque headers/footers. Long markdown + expanded comments scrolled in `interaction.mp4` and `after-comments.png`. No decorative overlay fade needed. |
| Icons/color | checked | Neutral actions inherit labels. Status circles carry state text. Selected row uses existing purple palette. Final neutral labels reuse Tag. `final-light.png`, `final-dark.png`. |

### Focused checks

- TypeScript project check passed; production build passed (existing large-chunk advisory remains).
- Three model tests pass: intersected filters/immutability, sorted bounded navigation, target-only comment append + updated ordering.
- Browser: per-issue draft retained after switching; ArrowDown changes issue; local comments update count and sort; empty search clears; enhancement filter yields six rows; Most commented sorts correctly; close moves issue to Closed (count 4), reopen restores it; local creation yields #8429; reload resets fixture.
- Mobile close restored focus to original issue row. Both themes viewed at 390×844; desktop 1440×1080 and medium 1024×900. No horizontal page overflow observed. Native touch/virtual keyboard and physical devices are not verified.
- Documentation, interactive queue/loading/error/refresh/reader/row and generated source viewed. Browser console contains no errors.

### Motion and craft review

| Before | After | Why |
| --- | --- | --- |
| Missing route reached Button playground | Issue browser with immediate list/detail switching | Frequent navigation has no authored animation or delayed focus. |
| First draft inherited full-width inline selectors | 10rem label + 12rem sort controls, search wraps at medium width | Preserve dense browsing and existing picker behavior. |
| Dark palette made the whole row saturated | Existing palette mixed into base for selected row; shared neutral Tag | Keep selection visible without reducing title readability or duplicating labels. |
| Search could show two focus outlines | Parent focus-within owns the ring | One clear focus indicator. |

Verdict: **Approve** for introduced interaction/motion scope. No authored transitions or keyframes; shared picker behavior retained, Button tapScale=1, SkeletonReveal animate=false. Existing picker reduced-motion/keyboard handling remains its canonical owner; physical performance profiling is outside this fixture check.

## Evidence map and limits

- Baseline / complete new route, matching desktop light: `before-route.png` → **`final-light.png`**. Final dark: **`final-dark.png`**.
- Reference browser frames and peer originals remain in this directory.
- `after-dark.png` is superseded (wide filters and saturated selection); `after-dark-v2.png` is earlier valid layout with custom labels. `after-dark-v3.png` was captured while the page was light: mislabeled capture, retained only for history. `after-light.png`, `after-light-final.png` predate canonical Tag; use `final-light.png`.
- Medium/mobile captures prove responsive layout before the last neutral Tag/focus-ring-only correction. Final labels verified in desktop; a full device/theme/state Cartesian matrix was not captured.
- `after-comments.png`, `after-created.png`, `after-search.png`, loading/error/refresh/reader/row playground and `docs-reader.png` cover affected states. Source-only comparison for finance peer loading is explicitly limited; its actual shared component is exercised in this new playground.
- `interaction.mp4` is real browser CDP screencast: 1440×1080, 45.72s, timestamp-preserving variable frame rate. Shows selection/keyboard, local comment, reader scroll, dismissal and search. `interaction-frames/` contains all original frames/timestamps/concat index. This uses Playwriter's CDP because its native extension recorder is unavailable in direct mode. Interaction recording predates the final Tag-only style change; interaction implementation is unchanged.
- No before interaction recording exists: this is an entirely new route, with the missing route preserved as the real baseline. No fake live GitHub completion, production deployment or physical-device claim.
