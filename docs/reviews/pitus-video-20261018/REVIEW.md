# Merge Workspace — reference and review

## Scope and source
- Reference: https://x.com/pitus_/status/2111519352503873866 — Phil Pitus, “Generative UI #2 - Merge conflicts”. Public metadata saved in source.json; the actual 30-second video was inspected in Chrome through Playwriter at 2, 8, 10, 12, 15, 18, 20, 22, 25 and 28 seconds. Original reference captures are retained. 12s is a blurred source transition, not an implementation defect.
- Baseline: 00f5790314b6cf03b12ea6d2fc445521322590e5, freshly fetched origin/main. Isolated branch codex/pitus-video-20261018. Original dirty checkout untouched.
- Environment: local real React components, Chrome/Playwriter session 5, localhost:5182, English, 1440 × 1000 baseline. No backend or live Git actions in the template.
- Pre-change /merge-workspace navigated to the existing Button playground at /. See before-route.png. This is an actual missing-route baseline, not an existing equivalent workspace. New components have no prior equivalent.

## Reference decomposition (before implementation)
1. Inline PR card with title, number, open/merged status, and a compact branching commit graph.
2. Amber conflict markers/counts on affected main commits; blue feature lane, teal secondary lane; the feature lane becomes purple after merge.
3. Resolve action inserts a merge commit and advances a progress footer. Checks appear before a separate explicit Merge action. Completion remains in the transcript.
4. Compact PR status and change-count capsules above the composer. Check chips expose short details.
5. Complete template: user request, worked disclosure, stateful card, assistant explanation, status capsules and composer. There is no manual code-conflict editor in the supplied clip.

## Pre-edit reuse map
| Target | Same-role Oreo peer | Decision and difference | Evidence |
| --- | --- | --- | --- |
| PR change inspection | src/components/code-diff, src/pages/CodeDiffDocs.tsx | Reuse CodeDiff for disclosed patch; preserve mint/error semantics | before-code-diff.png inspected |
| PR card actions and completion | src/components/confirmation, src/pages/ConfirmationDocs.tsx | Reuse Button and footer hierarchy; new graph needs its own container, not a duplicate approval component | before-confirmation.png inspected |
| Composer | src/components/prompt-box | Reuse actual PromptBox, host-owned submit/running state | source-only at this point; template rendering pending |
| Progress and empty/error | src/components/automation AgentWorkspaceState; engineering-handoff reducer | Reuse shared empty state; explicit state machine and cancelable timers follow existing workspace pattern | source-only; no visual equivalence claimed |
| Branch graph | searched code-diff, branch-picker, tree-stepper, engineering-handoff | New smallest composition: caller-provided commit lanes/parents and selectable rows; existing branch picker is a selector, not history | source + actual supplied video |

External reference check: the user-supplied video is the concrete same-task reference. Preserve its compact conversational layout; no unrelated visual research needed. Colors, radii, actions, and typography map to Oreo tokens. Responsive stacking and error recovery are extensions, not claims about unseen reference states.

## Six review lenses
| Lens | Canonical owner / comparison | Status before implementation |
| --- | --- | --- |
| Entry | docs navigation → components/template, existing route fallback | checked baseline; final integration pending |
| Loading | content-shaped initial shell; preserve graph while resolving/checking | planned; pending runtime |
| Empty | shared AgentWorkspaceState centered in owning region | source-only; pending runtime |
| Actions | Oreo Button primary/secondary/tertiary, Confirmation peer | checked peer; final pending |
| Titled scroll | header in normal document flow, bounded horizontal patch scroll | planned; no overlay fade needed |
| Icons/color | shared Icon currentColor; semantic amber/blue/mint/purple graph states | checked peers; final pending |

## Evidence and delivery
Implementation pending. Before/after evidence, interaction recording, responsive/theme checks, focused tests and delivery revision will be appended here. Reference images are analysis evidence only; no reference artwork is shipped in the product.

## Completed comparison and corrections
- Reused actual Button/IconButton, PromptBox, CodeDiff and AgentWorkspaceState. New graph and capsules live under one `merge-review` owner; the five playgrounds and the complete template consume that owner.
- The reference's inline branching graph, conflict badges, inserted merge commit, check disclosures and merged purple lane are retained. Oreo's neutral primary buttons replace the reference's blue buttons; sample checks remain explicit local fixtures. Narrow screens, failure/cancellation, notes and commit details extend the reference.
- Dark capture review found mint palette text was too dark on a plain surface. The palette text is intended for mint-filled tags. Corrected bare success labels to Oreo's status-success token in dark mode, and feature labels/nodes to its blue palette token. Filled resolved badges retain the paired mint text/bg tokens. Verified computed tokens and inspected corrected captures. No shared/global token changes.
- Early documentation screenshots caught layout interpolation immediately after switching Code → Preview. Settled captures (`after-docs-branch-history-r2.png`, `after-docs-pull-request-card-r2.png`) supersede these transition-frame captures; history is retained.
- Inspection also caught queued checks describing a passed result; queued/running detail copy now states that no result is available. The docs composition now updates commit markers together with phase/checks.

## Final six-lens pass
| Lens | Result | Evidence / scope |
| --- | --- | --- |
| Entry behavior | checked | Five component routes, each Preview/Code/Documentation, source-aware JSX export and template link; missing-route baseline → complete template. Existing Oreo navigation retained. |
| Loading | checked | Content-shaped initial shell; graph stays visible through resolving/checking; `after-creating.png`, `after-resolving.png`, final flow recording. |
| Empty | checked | Centered AgentWorkspaceState in initial workspace, actual reused component; `after-empty.png`. BranchHistory empty path reuses the same owner. |
| Actions | checked | Canonical buttons; explicit Merge only after checks; tested cancellation, failed-check guard and retry; `after-failed.png`, `after-ready.png`. |
| Titled scrolling | checked / fade not applicable | Workspace header and PR title remain in document flow; horizontal code overflow is bounded; no scrolling under a fixed title. Mobile full-page capture and body inspection showed no horizontal overflow. |
| Icons/color | checked within new family | currentColor icons; semantic conflict/progress/success/merged color. Dark success correction above; final mobile/tablet/wide dark r2 captures. |

## Evidence map
All screenshots are actual local React UI, English, Chrome via Playwriter. Source and reference captures are separate. Full-page screenshots may exceed their viewport height.

| Page/state | Before | After | Notes |
| --- | --- | --- | --- |
| New template entry | [before-route.png](before-route.png) | [after-empty.png](after-empty.png) | Exact new route previously fell back to Button; no prior merge template or baseline interaction existed. 1440×1000 viewport. |
| Card/history/conflicts | [reference-10s.png](reference-10s.png), [before-confirmation.png](before-confirmation.png) | [after-conflicts.png](after-conflicts.png) | Reference + canonical peer, not a fabricated before of new components. |
| Create/resolve/check/merge | No equivalent pre-change flow | [after-flow-r2.mp4](after-flow-r2.mp4), [after-merged-r2.png](after-merged-r2.png) | Final motion, real local interactions. |
| Error and retry | Reference does not show failures | [after-failed.png](after-failed.png) | Lint fails; merge action absent; retry verified back to ready. |
| Commit detail / changes | [before-code-diff.png](before-code-diff.png) | [after-mobile-detail.png](after-mobile-detail.png), [after-change-detail.png](after-change-detail.png) | CodeDiff reused; full commit metadata available on narrow screens. |
| Phone light/dark | No narrow reference supplied | [after-mobile-light.png](after-mobile-light.png), [after-mobile-dark-r2.png](after-mobile-dark-r2.png) | 390×844 viewport. |
| Tablet light/dark | No tablet reference supplied | [after-tablet-light.png](after-tablet-light.png), [after-tablet-dark-r2.png](after-tablet-dark-r2.png) | 768×1024 viewport. |
| Desktop dark | No dark reference supplied | [after-wide-dark-r2.png](after-wide-dark-r2.png) | 1440×1000 viewport. |
| Component playgrounds | No equivalent prior components | after-docs-branch-history-r2.png, after-docs-merge-status-badge.png, after-docs-merge-checks.png, after-docs-change-summary.png, after-docs-pull-request-card-r2.png | Each route and JSX export opened and exercised; API page in after-docs-api.png. |

### Recording provenance
Extension recording was unavailable because this task-owned tab had not been granted activeTab capture permission. Playwriter's CDP screencast recorded the actual browser frames instead. `after-flow-r2-original.mp4` is the complete 1440×1440 recording; `after-flow-r2.mp4` removes only the top 76px containing the automation toolbar/header, giving 1440×1364, 14.13 seconds at 30fps. No product states are generated or speed-adjusted. Inspected sampled frames in flow-contact-sheet-r2.jpg and original frame images. `after-flow.mp4` and flow-contact-sheet.jpg are the first 1440×1200 recording, retained as superseded. Original JPEG frames/timestamps remain locally in flow-frames/ and flow-frames-r2/ (ignored in Git for size); encoded original recordings are committed. No pre-change motion capture is possible because the component/flow did not exist.

### Coverage limits
- Fixture/browser viewport evidence does not establish physical-device behavior or production serving. No real PR, Git, CI or deployment is performed by the demo.
- X's HTML page returned 403. Actual public video playback was inspected through Chrome; metadata from the public FxTwitter endpoint is retained. Reference frames include source player controls.
- The user's Chrome extensions emit wallet injection/session errors on both baseline and new routes. Interactions above completed; no clean-profile claim is made. Production TypeScript/build checks pass separately.
- First-round dark screenshots, after-conflicts-r1.png, early docs screenshots and first motion recording are superseded by the explicitly named corrected captures; none was overwritten.

## Focused validation
- TypeScript build: passed.
- Vite production build: passed; existing large-chunk warning remains (no bundle-architecture changes in scope).
- Four reducer tests: passed (see model-tests.txt): merge admission and explicit action, failed-check recovery, stale timer invalidation, cancellation/idempotence.
- Browser: happy path through merged, resolving cancellation and no delayed advance, failed-check blocks merge, retry to ready, commit details and close, change disclosure, mention, local note, file-name attachment/remove, keyboard Enter disclosure, reduced-motion spinner (`animation-name: none`), five playgrounds and JSX exports.
- Responsive and theme captures above inspected; body horizontal size equals viewport at 390px.

Delivery: local implementation and verification complete; task-scoped PR / remote main verification recorded below when completed.
