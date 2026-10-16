# Consulting Workspace — Nizam reference

## Source, scope and environment

Source: https://x.com/nizamdesign/status/2110792824627360225 — Nizam, “Turning Consulting Expertise Into an AI Powered Client Experience.” Read the public post in a task-owned browser tab and inspected all four original 960×1200 images. `oreo-nizam-reference-1.png`/`2.png` are left/right knowledge views; `3.png`/`4.png` are left/right dashboard views. These are four static images, not evidence of source-app interactions. The X web fetch returned 403; the browser rendered the post and its images successfully.

Observed: advisor dashboard with expandable client escalations, question/evidence/human-reason columns, independent-answer vs escalation bars and a client activity list. Knowledge view has a file entry, extraction summary, status filters, a dense source table and two contradictory source claims with an explicit preference or ask-every-time decision.

Implemented four reusable components: EscalationCard, SourceConflictCard, KnowledgeSourceTable and ConversationActivity. `/consulting-workspace` composes Dashboard and Advisor knowledge views with existing Oreo actions, avatars, tags, metrics, progress and empty states. Local response review, queue updates, metadata imports, source approval/archive undo and advisor profile settings are working host interactions. The source's broader five-stage wizard is represented by focused advisor settings and reviewed-source progress rather than nonfunctional navigation; unrelated source sidebar sections are not reproduced. Actual client/knowledge templates are linked as existing peers.

Baseline: `ee01edea9b5411e01901391c6b34b79fffe5549d`. Branch: `codex/consulting-workspace-20261016`, isolated from primary WIP. Final product files and media hashes are in `manifest.json`; source is the PR tree containing this index.

Captures: actual React components at http://localhost:5242 in Chromium through Playwriter session 1. English, no account, deterministic local fixtures. Desktop 1440×1000, tablet 960×1000, mobile 390×844. Light and dark; browser overlays hidden. References captured in a 1000×1240 native image tab. No real file analysis, AI calls, customer messages or production deployment is implied.

## Before / after coverage

| Page/state | Before | After / result |
| --- | --- | --- |
| New template entry | [before-entry](before-entry.png): `/consulting-workspace` normalized to Button playground | [final dashboard light](after-dashboard-light-final.png), [final dark](after-dashboard-dark-corrected.png). No prior equivalent consulting page; entry is the true baseline. |
| Advisor knowledge | New view; no prior source state | [light](after-knowledge-light.png), [dark](after-knowledge-dark-final.png). Unresolved source counts excluded from approved findings; table locally scrolls. |
| Conflict choice | New interaction, static external reference | [resolved policy](after-conflict-resolved.png), [final dark policy dialog](after-source-dialog-dark-corrected.png), [ask-on-use Playground](after-conflict-playground.png). Choosing 2024 makes 2022 duplicate; ask policy preserves both approved and requires a human on use. |
| Response review / validation | New dialog | [review](after-review-response.png), [empty-response error](after-response-error.png), [mobile](after-dialog-mobile.png). Save moves 6→5 open / 1→2 resolved; reopen restores queue. No message sent. |
| Advisor creation | New dialog | [form](after-advisor-form.png). Required name/scope validation, creation, selector and methodology/rules persistence verified in local state. The form capture retains an earlier validation message; successful creation verified by rendered selector/notice. |
| File validation | New upload surface | [mixed valid/invalid selection](after-file-error.png). PDF metadata added unreviewed with zero findings; unsupported extension rejected. Name/size only, no contents read. |
| Empty / failure recovery | New states | [empty](after-source-empty.png), [failure](after-source-error.png), [initial loading fixture](after-source-loading.png). Clear filters and retry restore content; approvals and archive/undo verified. |
| Mobile / tablet | No equivalent template | [light knowledge 390px](after-knowledge-mobile.png), [final dark dashboard 390px](after-dashboard-mobile-dark-final.png), [tablet](after-dashboard-tablet.png). Actual HTML client/scroll widths 390/390 and 960/960. Source table owns horizontal overflow. |
| Public component docs | Routes absent at baseline; not individually recaptured | [source table Playground](after-source-playground.png), [activity Playground](after-activity-playground.png), [docs](after-docs.png). Native keyboard disclosure and exact chart selection values verified. |
| Changelog | [before](before-changelog.png) | Final entry capture added with PR number. Existing release list reused. |

[Interaction clip](interaction.mp4): actual local response approval and knowledge ask-on-use flow, 1440×1000, 5.64 seconds. Original 38 screencast events are preserved losslessly in `interaction-frames.json.xz`; viewing copy clamps long idle intervals to 2s and holds near-instant frames for 0.1s. It is an interaction illustration, not a timing/performance benchmark. Source images have no motion, and the previous route had no matching workflow. No new timed animation is introduced. Recording predates the final color-only correction; final screenshots show current styling.

Historical originals are preserved. `after-dashboard-light-v1.png` precedes radius-token correction. `after-dashboard-dark.png` and `after-knowledge-dark.png` actually captured light mode after a development hot reload reset; they are **superseded and not dark-mode evidence**. `after-dashboard-dark-final.png` predates neutral avatar/reason-panel corrections and is superseded by `after-dashboard-dark-corrected.png`; source-dialog dark likewise uses the corrected capture. `after-dashboard-mobile.png` is earlier light styling. Final verification uses the explicitly linked corrected files.

## Consistency review

Compared actual [Client Workspace](peer-client.png), source for its dialogs/queue-like records, CallbackCard, shared WorkspaceMetric, Trace Explorer dialogs and AgentWorkspaceState. This is a scoped Oreo surface comparison, not a cross-product or native audit.

| Lens | Peer / shared owner | Result | Evidence / reason |
| --- | --- | --- | --- |
| Entry | App, site metadata, docs Sidebar; Client Workspace navigation | Checked | Standard docs/template registration. Dashboard and knowledge are explicit local views. Links to existing templates navigate normally. |
| Loading | TraceTable / AgentWorkspaceState and table-shaped initial placeholders | Checked in code and new fixture; peer loading screenshot gap | Initial source-table loading uses row-shaped blocks. Refresh preserves rows with aria-busy. Local page has no network loading fiction. |
| Empty | AgentWorkspaceState, used by automation/trace-query/callback | Checked | New empty source filters and failure screenshots, recovery actions. Existing peer empty runtime not separately captured. |
| Actions | Button/IconButton; Client Workspace dialogs | Checked | Canonical variants and sizes, tapScale=1. Read/review primary, optional archive tertiary. Resolve requires a nonempty response; client messages are never dispatched. |
| Titled scroll surfaces | Base UI Dialog; Trace Explorer and Client Workspace modal shells | Checked | Opaque header/footer outside scrolling body; mobile dialog screenshot, Escape dismissal and return focus. Page sections use normal document flow, no redundant decorative fade. |
| Icon/color | Icon, Avatar, Tag, semantic tokens | Checked / corrected | All CSS color/radius references resolve to project tokens. Final correction removes orange identity avatars and the large orange reason fill for clearer dark-mode contrast. Conflict success icon uses mint; ordinary action icons stay neutral. |

External reference maps to data hierarchy and source-choice structure. Rejected copying the source brand, portrait assets, raw orange primary-button styling and unimplemented navigation. Deliberate chart geometry: 128px track/20px bars, token-based capsules; 880px minimum source table allows dense readable rows with local scrolling. New component disclosures/dialogs are immediate, keyboard actions have no new animation, and no hover motion is added. Existing shared component behavior remains owned by its current implementation.

## Verification

- `npm run build` passes TypeScript and production Vite; existing bundle-size advisory remains.
- `node --experimental-strip-types scripts/consulting/check.mjs` passes conflict precedence, preferred/ask policy, immutable changes, approved-only aggregation, invalid choice/no repeat resolution, file extension/size limits and chart count/ID validation.
- Browser: response empty validation, save/resolve/reopen, advisor required fields/create, source preference/ask policy, approve review, protected duplicate approval, archive/undo, mixed valid/invalid imports, no-results, source-error retry, keyboard card disclosure, selectable chart, 390px/960px/1440px layouts, light/dark and dialog Escape tested.
- Direct token scan found no unresolved color or radius variables in new CSS.
- Development emitted transient hot-reload errors while new modules were being written. Fresh page loads after fixes rendered normally with no new page error in the observed verification logs.
- Missing: individual prior screenshots for new component routes, real-service behavior (intentionally absent), physical-device testing and deployed-site validation. These are evidence limits, not claims of completion outside the local fixture.
