# Client Workspace — review index

Reference: [Tanjim](https://x.com/Tanjim38/status/2110407786957795338). Delivery: [PR #56](https://github.com/oreo-design/oreo-ui/pull/56). Local preview: http://localhost:5230/client-workspace.

Baseline: `6570e7c83117f6024642cb053e3bafbb1f56aa72`. Product implementation: `55db33848b42e3ea1df8be500d85d6ef8d3728df`. The subsequent delivery commit adds the Changelog entry and this evidence package; the PR records the exact final source and merge revisions. No production deployment is asserted.

## Reference and decomposition

The reference is a static dark client details composition: company identity/facts, contact information, company activity tabs, four financial totals and an invoice table. Public X access was blocked; public post metadata and the original image were inspected instead. [Metadata](reference-metadata.json), [reference image capture](reference.png). The image establishes layout, not behavior, mobile layouts, loading states or motion.

- `ClientSummary`: company identity, status, project counts, tax ID, paid revenue and team size.
- `ClientContactStrip`: responsive semantic contact definition list. Sample contacts are text, not message-sending actions.
- `ClientFinanceSummary`: invoiced, paid, outstanding and next-payment cards from one invoice array. Container queries adapt the grid to the actual available width, including docs previews.
- `ClientWorkspacePage`: Financial, Projects, Documents, Contacts, Activity and Notes. Local create/edit/duplicate drafts, payment status, deletion/undo, search, status filters, sorting, sample document downloads and note creation.
- `InvoiceTable`: optional `currency` and `clientLabel`; EUR and Client remain defaults. USD uses en-US formatting. Existing EUR consumers retain en-IE formatting, layout, sorting and action behavior.

The supplied image's decorative navigation is adapted to real Oreo pages and the client sections. The company mark is an original letter tile. Project counts derive from six fixtures; financial totals derive from six invoices at **2026-01-16**. Issued $196,350; paid $79,700; outstanding $116,650; next payment $45,000. Drafts are excluded from issued totals. Two unpaid past-due invoices remain overdue; marking the upcoming invoice paid changes paid to $124,700 and outstanding to $71,650, with no upcoming payment.

Existing Oreo colors (`bg-base/elevated/surface`, `text-primary/secondary/tertiary`, `border-default`) and typography/spacing scale own the visual language. Layout widths and breakpoints express this template's rail/sidebar and card-container geometry. No external brand assets, new global palette, dependency or custom animation was added.

## Before / after map

All browser evidence is the real local React application with fixtures, captured through Playwriter session 63 in Chromium. English locale, default font, desktop 1440×1000, medium 768×1024, mobile 390×844; full-page files retain the complete scroll content. Toolbar/cursor overlays are hidden. These are not real client records, payment operations or production captures.

| Changed surface/state | Before | After / evidence | Coverage |
| --- | --- | --- | --- |
| New route entry | [Actual missing-route result](before-entry.png): requesting `/client-workspace` reached Button playground at `/` | [Desktop dark](after-final-desktop-dark.png), [complete page](after-final-complete.png), [desktop light](after-final-desktop-light.png) | New capability; no previous client page to fabricate. |
| Company details and contacts | Same missing-route baseline | [Full mobile dark](after-final-mobile-dark-full.png), [full mobile light](after-final-mobile-light-full.png), [medium light](after-final-medium-light.png) | Responsive rail, facts and wrapping contact information. Medium dark was captured earlier in [this image](after-medium-dark.png); final formatting refinement is covered by light medium plus final dark desktop/mobile. |
| Financial component | No previous standalone component | [Final component preview](after-finance-component-final.png), [API](after-finance-api.png), [zero data](after-finance-empty.png) | Totals and no-upcoming-payment state verified. Zero-data image predates the final container-grid correction; final layout is in the populated component capture. |
| Summary/contact component docs | No previous standalone component | [Summary](after-summary-docs.png), [final contact preview](after-contact-component-final.png) | Docs, controls, route and sidebar registration. |
| Existing EUR table consumer | [Invoice Workspace before](before-invoice-peer.png) | [Invoice Workspace after](after-invoice-peer.png) | 19 rows, EUR caption, unchanged €110,599 shown total. Same viewport/theme/fixture. |
| Empty search and recovery | New client-specific state | [Final empty state](after-final-empty.png), [filter/sort](after-filter-and-sort.png) | Shared centered empty state; clearing filters restores rows. |
| Invoice editor / validation | New client-specific state; existing invoice editor is the behavior peer | [Validation](after-validation-error.png), [invalid amount](after-invalid-amount.png), [final mobile editor](after-final-mobile-dialog.png), [mobile validation](after-mobile-editor-error.png) | Description and positive amount validation; correction/save; Cancel restores create-button focus. |
| Delete and row menu | Canonical existing invoice Menu / confirmation behavior | [Menu](after-row-menu.png), [final danger confirmation](after-delete-danger-final.png), [paid/undo](after-paid-and-undo.png) | Delete confirmed; undo restores record. Duplicate cancellation does not create a draft. |
| Projects / Contacts | No prior client sections | [Projects](after-projects.png), [Contacts](after-contacts.png) | Read-only project progress and contact assignment counts. |
| Documents / Notes / Activity | No prior client sections | [Documents](after-documents.png), [Notes](after-notes.png), [Activity](after-activity.png), [downloaded sample](downloaded-client-brief.txt) | Download event and actual file inspected. Blank note error and successful note creation verified. |
| Horizontal table access | Shared table overflow pattern | [Mobile table end](after-mobile-table-end.png) | Amount/action columns reachable by horizontal scrolling. |
| Changelog | [Before](before-changelog.png) | [After](after-changelog.png) | Added Client Workspace entry with PR #56 and preview link. |
| Interaction sequence | No prior client page | [Recording](client-invoice-flow.mp4) | New invoice → missing-description error → valid fields → save. Existing primitives own press/menu motion; no new custom motion. |

## UI consistency review

Scope is Oreo Web, the new client family and the shared InvoiceTable extension. Product peers inspected in code and live rendering: Invoice Workspace and the standard component playground. Reference image is the focused external composition check; it does not replace product peers.

| Lens | Target → peer | Canonical owner / result | Evidence or gap |
| --- | --- | --- | --- |
| Entry behavior | Client row actions/editor → Invoice Workspace actions/editor; component docs → existing playground | **Checked.** Shared InvoiceTable Menu, Base UI Dialog, explicit return focus. Native ARIA tabs use Arrow/Home/End navigation. | Row menu, editor, keyboard End→Notes, cancel-focus check. No complete screen-reader journey claimed. |
| Loading | Local fixture initialization → existing local Invoice Workspace | **Not applicable.** No asynchronous loading/refresh operation exists in the new template. | No simulated skeleton or fake backend success added. |
| Empty states | No matching invoices → InvoiceTable / AgentWorkspaceState | **Checked.** Shared centered title/description/action. Summary with no invoices shows zero amounts and no upcoming payment. | Final empty capture and clear-filter recovery; zero-data playground. All-invoices-deleted visual capture remains a gap; its dedicated first-invoice action is implemented. |
| Actions | New/create/save/cancel/delete → invoice editor and canonical Button | **Checked.** Shared primary/secondary/tertiary variants. Final delete confirmation uses Button danger like the peer. | Menu and confirmation captures. Double focus outline in the search field was corrected at its local owner. |
| Titled scrolling | Invoice list/editor → shared table and peer dialog | **Checked for captured states.** Table header is opaque/sticky; modal header/footer stay opaque while body scrolls. No extra decorative fade needed. | Mobile dialog/error and horizontal table end. Long (>8 invoices) vertical table top/middle/end coverage remains unverified; shared table behavior is unchanged. |
| Icons/color | Row actions/contact symbols → shared Icon, Menu, Tag | **Checked within this family.** Neutral operation icons inherit text; status tags retain semantic palette; destructive confirmation uses danger. | Actual menu, desktop/mobile themes and peer table. No cross-product/global claim. |

Corrections retained in history: initial US$ prefix caused narrow-screen amount wrapping; USD now uses en-US `$` with explicit USD context. Finance cards initially used viewport breakpoints, which did not fit the docs container; they now use container queries. Contact preview uses auto-fit columns. Dark date-picker controls now opt into the dark color scheme. Earlier screenshots remain as historical captures; use the final files linked above for layout acceptance.

## Verification and limits

- TypeScript and Vite production build pass; [build log](build-final.txt). Vite's existing large-bundle warning remains. Subsequent delivery validation is recorded in [delivery build](build-delivery.txt).
- [Financial checks](finance-checks.txt): fixture totals, draft exclusion, empty data, paid transition, no upcoming payment, EUR default/USD formatting, due-today status, stable next-payment tie-break, nonmutating sort.
- Browser checks: create/save, missing description and invalid amount/recovery, edit, delete/undo, duplicate cancellation, paid totals, search/no results/clear, overdue filter/amount sort, keyboard tab End, note validation/add, documents download, reload reset, docs and light/dark viewport captures. Final reload/actions show no new runtime errors. Historical HMR/import connection failures during file creation are not counted as a passing runtime check.
- Recording is **1440×1000, 30fps, 5.733 seconds**. Playwriter CDP screencast was used because native extension recording previously reported missing activeTab permission in this session. Original 23 frames/timestamps retained in [recording-original.json.xz](recording-original.json.xz); [timing](recording-timing.json). Final frame holds one second, minimum per-frame duration 8ms, no idle trimming. Decoded recording frames were inspected.
- The extension's download `saveAs` returned an artifact-path error, but the download event and actual `~/Downloads/acme-client-brief.txt` succeeded. That exact downloaded file was copied into this review and inspected.
- Missing evidence: matched dark/mobile baseline for the previously missing route, full keyboard-only/screen-reader run, physical touch devices, alternate browsers, every zero/error state at every viewport, long vertical invoice scrolling, and production deployment. Missing media is separate from implementation and authorized merge status.

[Manifest](manifest.json) lists media dimensions and hashes. Historical originals are retained; `after-final-*`, `after-*-component-final.png` and `after-delete-danger-final.png` supersede earlier layout variants. State captures whose behavior was unaffected by later formatting remain useful as labeled above.
