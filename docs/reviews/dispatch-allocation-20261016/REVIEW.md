# Dispatch Allocation review

## Scope and baseline
Reference: https://x.com/maybepratikk/status/2110717643322015819 by Pratik. Actual browser-rendered video inspected at 3, 6, 9 seconds: resource rows against hourly columns; route bars above horizontally scrolling unassigned jobs; pickup expands into a full route card, successful placement contracts into a scheduled bar and decrements the backlog. The rocket is the desktop wallpaper / opening frame, not the requested interface.

Baseline: `1f6e834d55343d8e27331b2ee5479b35a54ef639`. Local fixture at http://localhost:5253, Chromium Playwriter session 10, 1440×1080, English. Before editing: new route `/dispatch-allocation` normalized to `/` Button playground, captured as before-entry.png. No prior allocation page existed. Changelog before captured separately. Reference frames retained in reference-before.png, reference-drag.png, reference-after.png.

## Pre-edit comparison map
| Target | Same-role peer and evidence | Canonical owner / decision |
| --- | --- | --- |
| Draggable route cards | src/components/kanban/kanban.tsx; peer-kanban.png | Reuse dnd-kit sensors, drag overlay, cancellation; Button/Icon/Avatar and semantic surfaces. New time-slot semantics require a dedicated owner rather than status columns. |
| Driver/vehicle identities | src/patterns/operations-suite/index.tsx; peer-fleet.png | Reuse fleet domain, small avatar identities and local-demo scope. Fleet tracking map remains unchanged; new allocation grid is a different task. |
| Assignment editor | Writing Folders Base UI Dialog, source-only comparison | Same bounded dialog, explicit labels, recovery and safe final focus. |
| Empty/error | AgentWorkspaceState, source-only comparison | Center within owning region; filtered recovery differs from all jobs scheduled. |
| Docs/changelog | before-entry.png / before-changelog.png | Existing docs playground/metadata/sidebar and release list. |

Tokens: Oreo neutral button hierarchy replaces reference's pink CTA. Existing status-progress/success/error, border-subtle/default, bg-base/elevated, text-primary/secondary/tertiary, rounded-xl/2xl, spacing scale. Resource column and hour-cell widths are layout geometry needed for timed placement, not new global design tokens. Do not copy reference branding or wallpaper.

## Coverage (to complete)
Entry, loading, empty, actions, titled scroll surfaces, icons/color: pending after implementation. Drag recording unavailable in direct headless Playwriter; extension sessions timed out repeatedly. Static frames do not verify motion. No live dispatch or production deployment is claimed.

## Implemented and checked
Two exported components (`RouteJobCard`, `AllocationTimeline`) and the `/dispatch-allocation` template. Date and category/search filters; driver/vehicle labels; draggable pending and allocated jobs; form-based keyboard allocation; validation of overlap, day bounds and seats; dispatch confirmation and locking; unassign; one-step undo; full JSON export. Site routes, sidebar, metadata, playgrounds, docs and changelog are included. All data is a local fixture.

Browser checks (actual production components, Playwriter session 10):
- J-30355 drag to Amara at 13:00: schedule 2→3, pending 6→5. Repeated after the drag-handle accessibility change.
- Escape while dragging: pending remains 6. No changes are committed until a valid drop.
- Form allocation to Ethan rejects 8 passengers / 4 seats. Switching to Amara recovers successfully.
- J-40466 overlapping Amara's 08:00–10:00 booking rejects at 09:00; original schedule retained.
- Undo restores the prior jobs snapshot. Dispatch review shows both draft jobs; confirmation locks them. Opening a dispatched job shows disabled fields and no save/unassign action. Undo reverses dispatch.
- Mobile editor saves J-30355 to Noah at 12:00 with Enter. Enter on a drag handle opens the keyboard editor; Escape dismisses it.
- Search with no matches shows a centered recovery state; Clear filters restores jobs. Playground loading, error/retry, empty and JSX export inspected.
- Desktop, 768px tablet and 390px mobile light/dark screenshots captured. Native date controls now inherit color-scheme. Initial captures with primary-colored drag handles were corrected to tertiary controls.

Focused checks: `node scripts/dispatch-allocation/check.mjs` (time boundaries, overlap, seats, invalid date/resource/ID, immutable assignment, unassign, dispatch locks); `node --test src/docs/playground/schema.test.ts`; `npm run build`. Build succeeds with the existing large-bundle warning.

## Evidence map
All filenames are relative to this index. PNGs are original browser captures, not mockups. Viewports: desktop 1440×1080; tablet 768×1024; mobile 390×844. Full-page captures may be taller.

| Scenario | Before | After / record |
| --- | --- | --- |
| New template entry | before-entry.png (actual fallback to Button docs) | after-desktop-final.png; after-drop-settled.png |
| Reference interaction | reference-before.png | reference-drag.png, reference-after.png |
| Reused product peers | peer-kanban.png; peer-fleet.png | after-desktop-final.png |
| Allocation validation/recovery | New feature; no prior state | after-capacity-error.png; after-conflict.png; after-assigned.png |
| Drag | New feature; reference frames above | after-dragging.png; after-drop.png (in-flight frame); after-drop-settled.png |
| Dispatch lock | New feature | after-dispatched.png |
| Filters | New feature | after-filtered.png |
| Responsive themes | No corresponding prior template; baseline revision preserved | after-mobile-light.png; after-mobile-dark-final.png; after-tablet-light.png; after-tablet-dark.png; after-dark-final.png |
| Mobile editor | New feature | after-mobile-editor.png |
| Component docs | before-entry.png shows existing docs owner | after-card-playground.png; after-timeline-playground.png |
| Loading / error / no jobs | New component states | after-loading.png; after-load-error.png; after-empty-final.png |
| Changelog | before-changelog.png | after-changelog.png |

Superseded: after-desktop.png predates tertiary icon controls. after-dark.png caught transient theme colors; after-dark-final.png is settled. after-mobile-dark.png predates native color-scheme. after-empty.png predates distinct “No jobs yet” copy. after-drop.png is a mid-animation capture, not the settled end state. Preserve all historical originals.

## Six-lens consistency review
| Lens | Status | Evidence / boundary |
| --- | --- | --- |
| Entry | checked | Real missing route baseline, docs navigation, Base UI dialog open/Escape/close and keyboard alternative. No cross-product audit claimed. |
| Loading | checked / partial | Static row skeleton and explicit retry in playground; source preserves data on refresh. No backend loading behavior. |
| Empty | checked | Shared AgentWorkspaceState centered; no jobs, filtered no results and fully allocated are distinct. Fully allocated state source-reviewed, not exhausted interactively. |
| Actions | checked | Shared Button/IconButton; primary dispatch/save, secondary recovery, tertiary icon controls. |
| Titled scroll surfaces | checked / partial | Opaque sticky grid header and resource labels; dialog header/footer stay opaque; independent horizontal grid/tray scrolling. End-of-scroll and long-title stress coverage pending. |
| Icons/color | checked | Neutral action icons; semantic route accents with text labels. Existing Avatar and icon-provider owner reused. Native dark date icon corrected. |

## Motion review (review-animations)
| Before | After | Why |
| --- | --- | --- |
| Generic CSS ease-out on drop | 180ms cubic-bezier(0.23, 1, 0.32, 1) | House strong ease-out curve; short pointer feedback. |
| Primary filled drag handle | Tertiary, tapScale=1 | A neutral operation should not compete with dispatch; no press scale while dragging. |
| Keyboard handle with no action | Enter/Space opens the same allocation form | Keyboard work requires a direct, non-drag path. |

Verdict: Approve source-level motion implementation. Pointer overlay uses dnd-kit transforms, no animated layout dimensions. Reduced motion removes drop travel and rotation. Editor/keyboard transitions are immediate. Actual drag outcomes were exercised; frame timing and interruptibility have no recording evidence, so no frame-rate or animation-fidelity claim is made.

## Remaining evidence limits
Playwriter extension sessions timed out; direct headless session supports screenshots and interactions but not tabCapture recording. Drag recording, physical touch device, matched mobile/tablet pre-change screenshots and automated export-file readback remain gaps. No baseline screenshot was invented. This does not block the authorized merge. Source baseline is preserved above. No production deployment is verified.
