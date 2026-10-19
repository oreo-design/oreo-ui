# Document Review / Unlink Documents

[Kevin (@kvnkld), Unlink Documents](https://x.com/kvnkld/status/2111826634902741219). Inspected actual video at 0.5 / 2.5 / 4.5 / 6.5 seconds: compact current-file trigger, numbered linked rows, unlink and information actions, immediate collapsing removals, synchronized counts. The complete local template adds undo, empty/loading/error recovery and responsive review context.

Routes: `/unlink-documents-workspace`, `/linked-documents`, `/linked-document-row`, `/linked-documents-selector`, `/linked-document-details`.

## Copy and reuse

Copy `src/components/linked-documents/` and its existing Oreo imports (Button, IconButton, Icon, DocumentEmpty). Base UI Popover/Tooltip and Motion already exist in the project. Copy `src/patterns/unlink-documents/` for the full template. No new package dependencies.

- `LinkedDocumentRow`: zero-based ordinal, filename selection, independent unlink, optional details action.
- `LinkedDocumentsList`: controlled data and selection; collapse/reindex animation, reduced motion, bounded scrolling, footer slot, loading/error/empty states.
- `LinkedDocumentsSelector`: same props; anchored file picker with current position/total. Selection closes; unlink remains open. Base UI owns dismissal, collision handling and focus return. Portal stays inside the local theme.
- `LinkedDocumentDetails`: full filename plus display-ready kind/size/date/owner metadata.

```tsx
<LinkedDocumentsSelector documents={documents} selectedId={selectedId}
  onSelect={selectDocument} onUnlink={unlinkDocument} onInfo={showDetails}
  footer={<Button onClick={undo}>Undo unlink</Button>} />
```

`model.ts` is optional pure local state. IDs must be unique. Unlink removes the association only. The active preview stays selected unless removed; then the next row, previous row, or null is selected. LIFO undo restores original order and preserves the current selection unless empty. Stale removal/selection events are ignored; reset clears history. Undo history has no timeout in this sample. Production hosts own permissions, async persistence, failure rollback, localization and history limits.

The template holds per-document review acknowledgment separately from association state. Unlink/undo preserves that acknowledgment. Reset clears it. All data is illustrative and resets on reload; there is no PDF renderer, upload, network mutation or loan decision. Non-statement files render clearly labeled structured sample content.

## Layout / accessibility

Oreo spacing, type, color and radius tokens; shared actions and DocumentEmpty. Local broken-link SVG is needed because the canonical icon vocabulary has link but no unlink. Popover width and page-column geometry use multiples of the spacing token; narrow layouts stack the inspector and keep document tables locally scrollable. Full names remain in accessible names, tooltips and metadata. Enter/Space activate native buttons; Tab reaches independent row actions; Escape dismisses the selector; arrow/Home/End keys switch inspector tabs. Removing a focused row transfers focus to the next/previous unlink action or list container. Initial loading replaces the list rather than claiming a persisted refresh.

[Continuous visual review](../../../docs/reviews/unlink-documents-20261019/REVIEW.md). Source-video behavior and Oreo-added recovery are labeled separately.
