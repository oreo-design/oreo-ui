# AI remixes — first five components

Local examples extending **Prompt Box, Attachment, Confirmation, Plan and Sources**. Each has a capability example and a separate Claude-inspired style example. The original library component remains visible alongside the adaptation. No original component file is modified.

## Open the examples

Open **[the experiment gallery](https://oreo-ui-preview.vercel.app/ai-remixes)** for all five originals and ten adaptations. The shared sidebar also has an **AI Remixes** link. From each selected component's playground, choose **AI remixes**, or use:

- `/prompt-box?view=remixes`
- `/attachment?view=remixes`
- `/confirmation?view=remixes`
- `/plan?view=remixes`
- `/sources?view=remixes`

Append `&remix=style` for the visual adaptation, `&dark` for the initial dark theme, and `&stress` for long fixtures. Reset demos clears both specimens. Mode changes intentionally start fresh demos.

The existing route, docs shell and playground remain the information architecture. `DocsPage.tsx` adds a third view only for these five components; no new product platform, routing dependency or global component variant is introduced.

## What is new

| Component | Existing capability | Extension |
| --- | --- | --- |
| Prompt Box | Controlled text and callbacks | Five-job queue, edit/remove, pause/resume, failure and retry |
| Attachment | File identity and remove callback | Four-page text preview, validated page ranges, committed context selection |
| Confirmation | One approve/deny decision | Per-operation permission, selective local sample changes, receipt and undo |
| Plan | Derived progress and status rendering | Dependency guard, local runner, failure, retry and reset |
| Sources | Collapsible source links | Search, quote inspection, inclusion and collected evidence |

These are additional controllers/compositions, not new prop presets. A composition is a valid way to add an ability without changing the library component. All ten examples use the real selected component. `briefs.ts` is the actual task specification shown in the UI. The examples were authored during this task; there is no independent experiment, external model call or human correction log to report.

## Files

`src/docs/remixes/` contains five example modules, shared controls, a presentation view, briefs, scoped styles and testable state rules. Copy the chosen example plus its shared dependencies alongside the original component; it is intentionally not constrained to a pre-existing `variant` enum.

The 700 ms queue/plan runners are local timers, not AI execution. The queue's `[fail]` marker and the plan's first evidence-check attempt fail deliberately. Pause cancels the current timer; resume starts a fresh 700 ms interval for that job. PDF pages are authored text facsimiles, not uploaded or parsed PDF data. Permission changes only modify React state. Citation fixtures are synthetic and never fetch external pages.

## Reference and limits

Official public sources visually checked on 2026-10-18, without login:

- <https://claude.com/product/overview> — hero, product section and the conversation demo.
- <https://www.anthropic.com/news/claude-3-5-sonnet> — secondary typography/context reference.

Observed: warm neutral surfaces, serif display headings, quiet rounded cards, restrained borders, neutral utility text and a terracotta send action in the official conversation demo. Adopted those relationships in the specimen skin. Exact colors, type metrics, component compositions and dark mode are our own interpretations; this is not an official token set or a pixel-identical replica. The generic Docs/Slides/Designs promotional image was inspected and rejected as evidence for conversation UI. Screenshots and source URLs are retained under `artifacts/ai-remixes/`.

## Validation and reproduction

The publishing branch was built on canonical main `9feb03c`, preserving later components and templates. Production build/TypeScript, all 70 discovered unit tests, Settings guard, 60 browser viewport/theme/long-content cases, eight interaction groups and 22 gallery/navigation checks passed. No original component source was changed.

```bash
pnpm install
pnpm build
pnpm preview --host 127.0.0.1 --port 5200 --strictPort
# In another terminal:
REMIX_URL=http://127.0.0.1:5200 node scripts/remixes/qa.mjs
node scripts/remixes/gallery-check.mjs
REMIX_URL=http://127.0.0.1:5200 node scripts/remixes/motion-proof.mjs
```

The QA runner covers 390/900/1440 px, light/dark, both categories and long fixtures. It checks keyboard submission, focus return, page validation, selective execution/undo, dependency/retry, evidence selection and style-case interactions. Gallery checks exercise every original and adaptation link, keyboard activation, sidebar and browser history. Scripts use background Chromium with `chromiumSandbox: true`; the local QA runner blocks remote requests.

See [REVIEW.md](REVIEW.md) and [selected evidence](evidence/). Full generated matrices are written to ignored `artifacts/ai-remixes/`. Vite reports an existing large-bundle warning. Real devices, Safari and screen-reader output were not tested. Exact Claude colors, font metrics and dark mode remain independent interpretations.
