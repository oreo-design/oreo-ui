# Unlink Documents — continuous review

Reference: Kevin (@kvnkld), https://x.com/kvnkld/status/2111826634902741219. Actual video frames at 0.5, 2.5, 4.5, 6.5 seconds are preserved here. Observed: anchored file selector, numbered linked rows, independent unlink and information actions, immediate animated removal and reindexing; current document remains selected. Undo and recovery are Oreo additions, not claims about the source.

Baseline: `75c9c78f1de136346c02a38b7de2293b64530062`. New route `/unlink-documents-workspace` previously redirected to the Button playground. Captured at 1440×1100 and 390×844 before edits. No previous unlink interaction existed, so a before motion pair is unavailable.

## Pre-edit grounding

- Document workspace → rendered `/document-workspace` activity and files views (`peer-document-workspace.png`, `peer-files.png`) → shared Button/IconButton, DocumentEmpty, file hierarchy and right-hand insights. New template uses the same document/context split; the reference requires a persistent page preview instead of the peer's activity feed.
- Anchored multi-action list → `src/components/data-operations/index.tsx` Popover composition → reuse Base UI focus/dismiss/positioning and theme-local portal. Source comparison only for the popover peer; no claim of visual equivalence from code alone.
- Row identity → inspected Attachment and canonical Icon; reuse Icon for the compact file glyph. Attachment’s larger tile is not used in the compact trigger. Inline unlink is distinct from deletion; introduce only a local broken-link glyph (no matching canonical icon exists).
- Empty/recovery → DocumentEmpty and shared secondary Button. Loading is a local fixture state; no live files or lending decisions.
- Titled scroll surface → static header + bounded row list; controls stay visible outside scrolling. Independent filename select, unlink and info controls avoid nested buttons.
- Component playground → existing catalog entry and fixed preview/property inspector; no global playground changes authorized. Complete composed template gets its own Templates entry.

## Evidence status

Implementation complete. Baseline and reference originals preserved. All captures are local fixtures in Chrome, English, with browser extension noise recorded separately from application errors.


## Final result and validation

Four reusable components: LinkedDocumentRow, LinkedDocumentsList, LinkedDocumentsSelector, LinkedDocumentDetails. Complete template: `/unlink-documents-workspace`. Final source: `40fca08453a38c5e7a62b974e63a3026b22feb9a`. Baseline above. The final registry-only correction does not change template or component files captured at `b2b5c39341176b809e53f4b242aed0801ade5354`; see source hashes.

- TypeScript project check and production build passed. Existing large-bundle advisory remains; this task does not restructure the application bundle.
- Six pure reducer tests passed: inactive/active removal, next/previous/empty selection, exact-order multi-undo, preserved active selection, stale events, reset/empty fixture. `model-tests.txt`.
- Final production browser checks covered 68 recorded observations, including keyboard removal during another row’s exit, all-eight removal, undo from empty, Escape/focus return, info focus, per-file acknowledgment, loading/error/retry, tabs with arrows and reduced motion. `browser-qa.json`.
- Four component Playground routes rendered, row and list unlink/undo worked, and Code emitted registered component imports. Documentation API rendered. Final browser errors seen were known extension/provider/session noise already present at baseline; the earlier application export-registration error was fixed and rechecked. This is not a claim that the entire browser console is error-free.
- Wide/medium/narrow light and dark captures were inspected. Popover rectangles remained within all three viewport widths. Dark portal computed colors were checked (rgb 25 background / white text versus rgb 249 / black in light).
- The page is an illustrative local fixture, not a PDF service or financial workflow. No backend, uploads, real account, storage persistence or production deployment was tested or added.

## Six-lens second pass

| Lens | Result | Evidence / owner / limit |
| --- | --- | --- |
| Entry behavior | Checked | Base UI Popover owner like DataFilterPopover; source peer comparison, actual new open/select/unlink/info/Escape/return verified. Tabs support arrows/Home/End. Source video showed direct unlink without modal. |
| Loading | Checked, limited | Initial local state only: content-shaped bars and explicit loading label; no fake network spinner. Actual data-refresh preservation is not modeled or claimed. Shared DocumentWorkspace has no matching linked-list loading surface; rendered loading peer comparison unavailable. |
| Empty / failure | Checked | Shared DocumentEmpty in viewer/list; distinct failure wording + retry, empty + Undo. Same owner as DocumentWorkspace; fixture screenshots cover empty and recovery. |
| Actions | Checked | Shared Button secondary/tertiary and IconButton; independent native filename control avoids nested actions. Trigger wrapper layout corrected locally after inspection; shared button owner unchanged. |
| Titled scroll surfaces | Checked structurally; long-list scroll not captured | Popover title and footer sit outside bounded list scroll; opaque popup. Inspector title remains outside its body. All eight fixture rows fit captured popovers, so top/middle/end long-list media is a coverage gap. |
| Icons / color | Checked | Icon neutral/currentColor and Button variants; no deletion-red unlink. New broken-link glyph inherits color. Light/dark portal verified. No claim of global icon-family audit. |

The existing catalog uses a fixed demo with a right-side property inspector at wide widths. The user's newer top-demo/scrolling-options preference is a shared Playground-owner gap, not implemented as a task-specific competing layout. Components remain in Components and the full template in Templates. No unrelated catalog redesign was included.

## Corrections and retained history

`round-1/` preserves captures from acfb2ff before rapid keyboard unlink focus was corrected. The focus search now filters against still-linked IDs, and exiting rows are inert. `round-2/` preserves intermediate captures before sample totals were reconciled, plus the blank Playground from the export-registration failure. Those captures are superseded by the root-level final media. The corrected registry renders actual registered components directly; it no longer imports demo wrappers from a documentation page.

## Visual evidence

New-page baseline: entering the requested route reached the existing Button playground. There was no previous unlink interaction to record. Before and after use matching wide/narrow viewport settings and English sample context; the previous page necessarily has no document fixture.

**Before — new route at 1440 × 1100**

![Before — new route at 1440 × 1100](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/before-wide.png)

**After — complete document review at 1440 × 1100**

![After — complete document review at 1440 × 1100](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-wide-light.png)

**Before — new route at 390 × 844**

![Before — new route at 390 × 844](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/before-narrow.png)

**After — complete narrow document review (full-page capture)**

![After — complete narrow document review (full-page capture)](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/responsive-narrow-light.png)

### Reference and extraction

**Source — linked documents at 2.5 seconds**

![Source — linked documents at 2.5 seconds](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/unlink-reference-25.png)

**After — same-role anchored file selector**

![After — same-role anchored file selector](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-open-light.png)

### Interaction recording

Real browser interaction, 6.23 seconds, 1440 × 1004 review crop. Continuous removal from 8 to 4 linked files, undo, then details. No source before recording exists for this new component; supplied source frames are preserved instead. Original 1440 × 1100 recording and actual frame timestamps are retained. Native tab recording failed due to activeTab permission; Playwriter CDP capture was used without another browser or account.

![Unlink, undo and inspect](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/interaction.mp4)

**Recording contact sheet inspected at one-second intervals**

![Recording contact sheet inspected at one-second intervals](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/interaction-contact.png)

**Remove active file — neighboring preview**

![Remove active file — neighboring preview](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-active-unlink.png)

**Empty after all eight removals**

![Empty after all eight removals](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-empty.png)

**Recover from empty**

![Recover from empty](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-empty-recovery.png)

**Document metadata and full filename**

![Document metadata and full filename](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-details.png)

**Loading state**

![Loading state](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-loading.png)

**Connection error**

![Connection error](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-error.png)

**Recovery from error**

![Recovery from error](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/after-recovery.png)

**Medium width**

![Medium width](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/responsive-medium-light.png)

**Dark desktop selector**

![Dark desktop selector](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/responsive-wide-dark-open.png)

**Narrow dark selector**

![Narrow dark selector](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/responsive-narrow-dark-open.png)

**Reusable list Playground**

![Reusable list Playground](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/playground-linked-documents.png)

**Reusable selector Playground**

![Reusable selector Playground](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/playground-linked-documents-selector.png)

**Code export after correction**

![Code export after correction](/Users/ziye/Documents/Project/Research/oreo-ui-unlink-documents-20261019/docs/reviews/unlink-documents-20261019/playground-code.png)

## Delivery

Source review covered all 14 changed source/documentation files, local callbacks, reducer transitions, focus/exit semantics, shared component integration and route/registry scope. PR and main readback are recorded in the final handoff. Screenshot and video coverage limitations above are separate from delivery.
