# AI remix gallery — publishing review

## Scope

Five components, each with one new-capability example and one Claude-inspired style adaptation, at `/ai-remixes`. Each comparison contains the actual original component, working adaptation, request brief and changed/retained notes. Fixtures and effects are visibly demo-only. No external model or business operation is performed.

The publishing branch starts at canonical main `9feb03c`, rather than the older local snapshot used for initial prototyping. Later upstream components, routes, portaled-theme behavior and mobile changelog navigation are retained. No file under `src/components/` was changed and no original worktree was modified.

## Grounding and review

| Before | After | Why |
| --- | --- | --- |
| Examples scattered across component views | `/ai-remixes`, 15 direct original/adaptation links, sidebar entry and return links | One shareable public entry without a new routing system |
| Original PromptBox callbacks | Bounded queue, editing, pause and retry | Real job state beyond existing props |
| Original Attachment chip | Four authored page facsimiles and validated page ranges | Explicit document scope without claiming PDF parsing |
| Original Confirmation decision | Per-operation choices, local selective execution and undo | Scope and rollback modeled separately |
| Original Plan progress | Dependency guards, runner, failure and retry | Progress backed by a local workflow |
| Original Sources disclosure | Query, quote inspection and inclusion model | Evidence selection survives filtering |
| Existing Oreo style | Scoped Claude-inspired specimen styles | Public visual reference with original side-by-side |

Entry, loading, disabled/error, empty, focus/keyboard and responsive/theme states were reviewed against the existing DocsPage/playground and the actual components. Gallery follows the same Sidebar, borders and token vocabulary. Original component code remains the source of truth. Comparison columns stack when there is insufficient room. No new entrance animation was added; inherited interaction feedback uses the existing Motion components, reduced-motion config and CSS overrides. Motion review verdict: approve scoped changes; no new timing or layout animation.

## Verification before publishing

- Exact production build chain `tsc -b && vite build`: passed (existing large-chunk warning).
- All 70 discovered Node unit tests: passed.
- Settings guard and mutation self-tests: passed.
- 60 browser matrix cases: all five × two categories × three widths × two themes, with long fixtures; no overflow or page errors.
- Eight interaction groups: queue Enter/Shift+Enter/edit/remove/focus/pause/retry/empty; page-range validation/navigation; selective permission execution/undo/deny; guarded plan retry/reset; source search/selection; style controls; reduced motion; existing view integration.
- 22 gallery checks: six viewport/theme cases, ten keyboard adaptation links and returns, five original documentation links, sidebar/history navigation. HTTP 200 verified.
- Screenshots of new gallery at 390/900/1440 in both themes were captured; narrow light and wide dark inspected directly. Selected screenshots and reports are in `evidence/`.
- Earlier local phase also captured ordinary/reduced-motion recordings for all five capability flows. No performance or screen-reader certification is implied.

## Reference provenance and limits

Public official pages visually inspected on 2026-10-18: [Claude product overview](https://claude.com/product/overview) and [Anthropic introduction](https://www.anthropic.com/news/claude-3-5-sonnet). The conversation demo visibly informed warm neutrals, serif display headings, rounded cards and terracotta send action. Exact tokens, font metrics, composition and dark palette are inferred adaptations, not official design-system assets or a partnership.

Not verified: Safari, physical devices, screen-reader announcements, exact Claude pixel/token fidelity. Local timers and synthetic excerpts are not AI execution or live research.
