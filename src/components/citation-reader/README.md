# Citation Reader

Components: CitationAnswer, CitationSourcePreview, CitationSourceList. The family composes existing WebSearch source identity/URL helpers, Base UI Popover, Button/IconButton, StatusView and SkeletonReveal. Existing WebSearch consumers are unchanged.

- Properties: host-owned claims with stable IDs, source records, per-claim source evidence/excerpt/optional match/exact metadata; source availability and interaction disabled are independent. Preview navigation and list selection are controlled callbacks.
- Interaction/states: hover preview, click/tap/Enter/Space access, safe pointer travel, pagination, Escape/outside/close dismissal, source-list sentence highlighting; loading, error/retry, empty, invalid URL and disabled. Unknown sources are omitted as controls, never as answer text. Duplicate source IDs keep the first. Loading completion is host-owned.
- Copy: concise titles; readable excerpts; exact flag only for an actual quotation. The optional match highlights its first literal occurrence. No automatic verification, generation or saved-state claim. Passage text-fragment support depends on the destination/browser.
- Layout: compact framed answer, inline chips/article links, anchored bounded preview, footer disclosure and numbered source list. Existing Oreo foundation tokens, concentric smooth corner owner, neutral icons and focus layer. Fine-pointer preview125ms transform/opacity easeOut; keyboard/touch/reduced motion immediate. No geometry animation while reading.

Routes: /citation-answer, /citation-source-preview, /citation-source-list, /citation-reader-workspace.
