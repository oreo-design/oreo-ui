# Document Activity / Document Workspace review

Implementation: `fed15f9c83028b0366a75adb341c4afe75ca67c5`. Baseline: `ae25227202641f5252ed199eb37692c0e9e61027`.

## Source and decomposition

[csakani / Sakani UI reference](https://x.com/samosemudiamhe/status/2110304795869524372) · [original image](reference.jpg).
The supplied image is a dark property-document activity screen: narrow workspace rail, title and Files/Activity controls, action filters, avatar timeline with attachment and approval details, and three compact insight cards. This is an independent implementation; Oreo identity, tokens and primitives replace the source brand. Representative local photo assets are attributed in `public/examples/document-workspace/README.md`.

Reusable pieces: `DocumentTimeline`, `DocumentPhotoStrip`, `FileChangeCard`, `DocumentAccessRequest`, `DocumentSummary`, `MemberActivity`, `DocumentStorage`, `DocumentEmpty`. Complete template: `DocumentWorkspace`. Documentation and storage playground are available from `/document-activity`; the template is `/document-workspace`.

## Before / after

| Scenario | Before | Final evidence | Change and reused pattern |
| --- | --- | --- | --- |
| New route and catalog entry | [Actual missing-route entry](before-entry.png), requested `/document-workspace` redirected to the default Button page | [Documentation](final-docs.png), [playground](final-playground.png), [template](final-dark-wide.png) | Registered routes, metadata, sidebar entries, DocsPage and existing playground controls |
| Existing comparable document surface | [Knowledge Base at baseline](before-knowledge.png) | [Light document workspace](final-light-wide.png) | Reuse KnowledgeSearch, Button, Avatar, Icon, Menu; new richer timeline is not a replacement for KnowledgeFileTable |
| Wide workspace, dark / light | No previous document-activity page; missing-route baseline above | [Dark](final-dark-wide.png), [light](final-light-wide.png) | 14rem rail, timeline and 18rem insight column; semantic color and radius tokens |
| Medium workspace, dark / light | No previous equivalent route | [Dark](final-dark-medium.png), [light](final-light-medium.png) | Insights move below timeline; two-column cards and full-width storage |
| Narrow workspace, dark / light | No previous equivalent route | [Dark](final-dark-narrow.png), [light](final-light-narrow.png) | Horizontal folder navigation, wrapping filters and photos, stacked insights |
| Approval | No existing document access-request component | [Approved](after-approved-final.png) | Controlled pending/approved/declined states, primary/tertiary Button actions, Undo |
| Search and empty recovery | No equivalent route | [Empty search](after-empty.png) | Centered DocumentEmpty with folder icon, explanation and Clear filters |
| Photo and file views | No equivalent route | [Photo preview](after-photo.png), [Files](after-files.png) | Native dialog with Escape/focus return; Next/Previous and file details |
| Upload error and recovery | No equivalent route | [Size error](after-upload-error.png), [recovered local record](after-upload-recovery.png) | Reject files over 10 MB, retain content, allow reselection; no server upload |

All screenshots are real React components rendered in local Chrome, using English fixture data. Final layout captures use 1440×1000, 900×1000 and 390×844 viewports; full-page image height may exceed viewport height. Exact image dimensions and hashes are in [manifest.json](manifest.json). The source supplied only dark desktop; light, responsive and interaction states are explicit extensions.

## UI consistency review

| Lens | Target → peer / owner | Result | Evidence or limit |
| --- | --- | --- | --- |
| Entry behavior | Catalog → existing Knowledge Base docs/template; DocsPage, Sidebar, App and site metadata | checked | Actual baseline navigation, docs → playground and template → docs links exercised |
| Loading | Local document fixture → local Knowledge Base fixture | not applicable | Data and decisions are synchronous, with no network loading state; image assets are local and dimensioned |
| Empty state | Document content region → shared DocumentEmpty for Files and Activity | checked | Search produced an empty region; Clear filters restored full content. No asynchronous failure is represented as empty success |
| Actions | Approval, upload, filters → existing Button / IconButton; date picker → Menu | checked | Existing variants reused. Same-role filters share one pattern; selected view is semantic accent. Approval, decline, undo, menu selection and retry paths exercised |
| Titled scrolling | Document main and preview → normal-flow title in both | checked by code and rendered layout | Nothing scrolls behind a fixed title. No decorative header fade needed. Actual long-page scrolling used for full-page capture; no separate motion recording |
| Icons / color | Nav, timeline, date menu → Icon adapter, currentColor, Oreo semantic tokens | checked | Neutral operations; selected state and storage categories are explicit semantic exceptions. Existing Knowledge Base peer inspected. No cross-product/global claim |

External reference check used the actual supplied image, not search-result metadata: adopted its information hierarchy and attachment/approval composition; mapped colors to Oreo background/text/status/palette tokens, sizes to Tailwind scale, and radii to control/card tokens. Did not copy branding, bitmap UI, exact source metrics or unsupported AI behavior. Existing ActivityCard is the canonical owner of all three insights; AuditTimeline remains a compact audit-log component with a different content role, so it was not expanded with document-only fields.

## Craft corrections

| Before | After | Why |
| --- | --- | --- |
| 48px timeline avatar with connector positioned for 32px | 32px Avatar, centered connector, 12px action glyph | Align the line and avoid covering initials |
| White detail cards on white light background | Existing elevated background token | Keep change summaries and approval payloads visually grouped in both themes |
| Three insights compressed beneath the timeline at 900px | Two cards plus full-width storage | Preserve member labels and metric readability |

The earlier `after-dark-wide.png`, `after-approved.png`, `after-*-wide.png`, `after-*-medium.png` and `after-*-narrow.png` captures are retained history and superseded for layout by `final-*`. `after-approved.png` was captured after a development refresh reset the decision and must not be used as proof of approval; use `after-approved-final.png`. Interaction screenshots precede the final badge/background/medium-grid polish but accurately document the tested interaction states.

## Verification and limits

- TypeScript project build and Vite production build passed. Vite reports the existing large-bundle warning; this task does not change bundling architecture.
- Playwriter exercised approve → undo → decline → undo; Comments filter; unmatched search → empty → Clear filters; photo open → next → Escape; Files/Activity; 30-day range including older records; Finance scope; theme switching; upload >10 MB rejection and successful local-file recovery; reload reset; search keyboard shortcut.
- Inspected final desktop, medium, narrow, light/dark, docs and playground media. No horizontal content overflow in the measured workspace containers. This is browser viewport testing, not physical-device testing.
- Browser extensions emitted wallet-injection and session errors on unrelated and task pages. Interaction steps reported no application exceptions; extension-origin noise is not treated as product evidence.
- One automation assertion expected the photo counter as a single string; the accessibility tree split it into three text nodes. Confirmed the displayed second photo and continued. A development refresh also reset local approval state during an early run; reran approval/decline/undo successfully.
- Recording attempt failed with Chrome `activeTab` permission: “Extension has not been invoked for the current page.” To enable follow-up recording, click the Playwriter extension icon on the task-owned `http://localhost:5187/document-workspace` tab. No new custom motion was introduced; existing Button press scaling is disabled for this dense workspace. Before interaction video is not applicable to a previously missing route.
- No backend, AI search, real permissions, production upload or production deployment is claimed. The original source current metrics are represented as sample component props in docs; template metrics derive from its actual local records and selected folder/date range. Storage remains clearly labeled sample data.

## Delivery

Implementation and local verification complete. PR integration is tracked by the repository and the final chat response, separately from the recording coverage gap. Original dirty checkout is untouched; this task uses `codex/samo-template-20261015` in an isolated worktree.

### Main integration refresh

Rebased onto `8a4af26` after concurrent PR #27 merged. Resolved additive registration conflicts in App, Sidebar, playground registry and site metadata by retaining both Automation Studio and Document Workspace entries. New implementation commit: `ea74fe901833b4290c63289a67c0fb9403c8b81a`. Document components, template, assets and page implementations are byte-identical to the captured implementation; no visual evidence was replaced. TypeScript and production build rechecked after integration.
