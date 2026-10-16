# Engineering Handoff — review record

Reference: https://x.com/planepowers/status/2110763968792780851. 31.233-second video, inspected in a task-owned browser video tab at 0.5, 3, 8, 11, 15, 21, 23 and 29 seconds. Retained original browser frame captures. Video shows work item context, @Claude suggestion, connection/status heading, progress, awaiting clarification, scoped reply and completed PR summary. It does not demonstrate real code execution or authorize reproducing a live integration.

Baseline 128d257ae80a354d124cf074625d18608e557c12. /engineering-handoff is absent and redirects to Button home: before-entry.png. New template; no prior downstream session state exists. Fixture-only browser preview: http://localhost:5249, en-US.

## Before-edit comparison map

- Mention input → CommentComposer and PromptBox (source), existing comment-thread owner; smallest new composition is a plain textarea plus one controlled agent selection and accessible suggestion list. No rich-text editor or duplicated full chat system.
- Session messages → CommentItem; use identical author/avatar/time/body rows. Session card adds connected-agent header and lifecycle, a distinct work-item execution role.
- Progress → ThinkingState / ThinkingWorkspace (peer-thinking.png); reuse existing indicator, respect its reduced-motion behavior. New workflow must distinguish awaiting a person, execution, failure, stopped and ready for review.
- Result → AgentResultCard; same disclosure and neutral buttons. Demo review opens a local sample artifact; never a fake remote PR or unperformed test claim.
- Work item → existing project/task template semantics and Button/Tag/Avatar tokens. Dense top metadata and right properties from supplied reference; mobile properties become an inline disclosure.
- Loading/empty/error → AgentWorkspaceState and static content-shaped skeleton. Standalone fixtures permit error/retry and disconnect states without live service changes.

| Lens | Before-edit result |
| --- | --- |
| Entry | New route baseline captured; docs and sample-result modal to reuse existing app / Base UI patterns |
| Loading | Source comparison; shape pending runtime capture |
| Empty | Shared AgentWorkspaceState identified; pending runtime |
| Actions | Button/IconButton identified; ThinkingWorkspace peer rendered |
| Titled scroll | Opaque sample-result header/footer and work-item header planned; pending runtime |
| Icons/color | Shared Icon/Tag/Avatar; neutral operation icons, status only uses color |

Implementation and evidence are separate. All new execution messages/results are explicitly local simulation. No live agent, repository edits, messages or real pull requests are triggered by the template.

## Implemented surfaces and evidence

All captures are local React fixtures in Chromium via Playwriter, en-US, light theme unless named `dark`. Desktop 1440×1000; mobile 390×844; tablet 768×1024. Screenshots use CSS-pixel scale. Original reference captures remain unchanged.

| Scenario | Before | After / verification |
| --- | --- | --- |
| Template entry | [Missing route → Button home](before-entry.png) | [Complete new work item](after-entry.png), [mobile entry](after-mobile-entry.png) |
| Agent selection | No prior component; source [@Claude](reference-03.png) | [Keyboard mention](after-mention.png), [no matches](after-mention-empty.png), [disabled](after-mention-disabled.png) |
| Execution and clarification | No prior session; source [working](reference-8.png), [awaiting](reference-11.png) | [Analyzing](after-running.png), [awaiting + reply](after-awaiting.png) |
| Result review | No prior review; source [completed](reference-21.png) | [Patch dialog](after-patch.png), [mobile dark dialog](after-mobile-patch-dark.png), [reviewed result dark](after-completed-dark.png), [tablet completed](after-tablet-completed-dark.png) |
| Empty/loading | No prior component | [Empty sessions mobile](after-mobile-empty.png), [component skeleton](after-session-loading.png) |
| Failure and recovery | No prior session | [Failed context load mobile](after-mobile-error.png); Retry → clarification → reply → review → completed verified in browser |
| Stopped / disconnected | No prior session | [Stopped](after-stopped.png), [disconnected agent picker](after-disconnected.png); ordinary comments still work offline; delayed work stays stopped |
| Rejected second delegation | No prior component | [Retained draft and error](after-retained-draft.png); selected agent and comment remain intact |
| Documentation | New routes; no separate prior docs capture | [Session docs](after-session-docs.png); both component playgrounds and source modules registered |
| Download | New action | [Actual downloaded JSON](export-handoff.json): completed sample run, 4 messages, Done work item. Browser download event succeeded; Playwriter saveAs failed to find its relay temporary file, so the actual browser Downloads file was copied and parsed. |

The after-entry/mention/running/awaiting and first patch captures precede the additive reviewed result state and generic result-title/icon API. Their pictured states remain unchanged. The final completed dark capture shows the corrected Reviewed label. No screenshots were replaced. New-page baseline is the actual missing-route fallback, not a fabricated prior handoff UI.

## Consistency review outcome

- Entry and actions: template uses existing Button/IconButton/Tag/Avatar and task status vocabulary. Breadcrumbs point to existing workspaces. Comment replies reuse CommentComposer; session messages reuse CommentItem. New mention input adds caret-aware suggestions, one controlled agent, Escape/arrows/Enter, and Cmd/Ctrl+Enter send. It retains drafts on rejection and blocks overlapping submissions.
- Loading/empty/error: static skeleton, AgentWorkspaceState, text-labelled retry and disconnect recovery. Normal, empty and error surfaces rendered, not inferred from source alone.
- Titled scrolling: patch dialog uses Base UI focus management, opaque token-based header/footer, independently scrolling body and code block. Mobile footer stays visible, with content scroll and no page-wide horizontal overflow in inspected captures. Desktop and mobile dialogs inspected.
- Icon/color ownership: shared Icon mapping in both icon libraries, semantic Tag colors and inherited text. No new palette. AgentResultCard owns the new optional `reviewed` state and green dot; existing ready/running/error defaults unchanged. Same-role AutomationStudio consumer inspected in source and ready state visible through the handoff result; standalone loading/docs/ThinkingWorkspace rendered. No cross-project or live-account consistency claim.
- Layout: 72px desktop navigation rail, 280px property column, 920px main maximum width; at ≤800px 56px rail and inline properties; at ≤480px compact breadcrumbs/stacked activity controls. Layout-specific dimensions have no existing work-item shell token; colors, typography, radii, shadows and control spacing use Oreo tokens. Shared comments/results retain their existing spacing.

## Validation and limits

- `node scripts/engineering-handoff/check.mjs` passed: stale run/attempt rejection, stop cancellation, retry, failure, review iteration, completion/reset, message IDs, request validation and mention insertion preserving surrounding prose.
- `npm run build` passed (TypeScript + production build). Existing large-chunk and Node deprecation warnings remain.
- Browser: @Cl → Claude preserves request; @Co → Codex; no-match / unavailable / disabled states; plain comments; duplicate session error retaining draft; context failure/retry; reply; request changes/reply again; mark reviewed; work item Done; stop remains stopped after timer delay; theme switching; mobile and tablet composition; JSON export. Console was clean on completed normal workflow. A missing icon name was found and fixed during initial development, followed by a successful build/reload.
- Some Playwriter operations timed out after viewport/HMR changes on old task tabs; fresh task-owned tabs completed subsequent scenarios. Historical captures retained. Not every responsive state has a separate matched baseline because the entire route/components are new; baseline revision preserved above.
- Recording attempted and blocked: `Extension has not been invoked for the current page (activeTab permission)`. To recover recording, click the Playwriter extension icon on the local handoff tab once. No recording was produced; screenshots do not prove animation timing. Source video frames were inspected directly in a browser; no remote video was downloaded.
- Shared ThinkingState supplies reduced-motion behavior; no new custom motion introduced. Actual timing recording, assistive-technology testing and live integration remain unverified.
- This is a frontend simulation. It does not run code, send messages to real agents, execute the displayed checks, create remote PRs, or persist through reload. Implementation delivery below is separate from these fixture limits and evidence gaps.

## Delivery revisions

Implementation: `7187a6cb2f1ae76aec6e103b8660980b86272955`. PR: https://github.com/oreo-design/oreo-ui/pull/76. Follow-up adds the changelog entry, explicit None playground selection and resultIcon API documentation; final source head is the PR head. Main baseline was fetched again and unchanged before push.

Changelog baseline captured from the preceding Company Directory preview at `http://localhost:5248/changelog` (same main content before this addition), 1440×1000 light: [before](before-changelog.png), [after](after-changelog.png). Final mention playground: [after](after-mention-final.png); earlier mention empty/disabled captures retain a superseded blank selector label, now explicitly labelled None.
