# Merge Workspace

Reference: [Phil Pitus — Generative UI #2 / Merge conflicts](https://x.com/pitus_/status/2111519352503873866).

The supplied 30-second clip shows a conversational PR card: a branching commit graph, conflict markers, a new merge commit, resolving progress, check disclosures, an explicit Merge action and a persistent merged state. No manual conflict editor is shown. The implementation is independently built on Oreo's own tokens and primitives; reference media is kept only in the review evidence directory.

## Components and routes

| Export | Route | Responsibility |
| --- | --- | --- |
| BranchHistory | `/branch-history` | Caller-assigned lanes and visible parent connections, branch labels, conflict counts and optional selection |
| MergeStatusBadge | `/merge-status-badge` | Compact status with icon, text and PR number |
| ChangeSummary | `/change-summary` | Addition/deletion counters, proportion blocks and optional change disclosure |
| MergeChecks | `/merge-checks` | Passed, running, queued and failed checks with native detail disclosures |
| PullRequestCard | `/pull-request-card` | Controlled composition with title, progress, graph, checks and callbacks |
| MergeWorkspacePage | `/merge-workspace` | Complete local conversational template |

Each component has a live Playground, source-aware code export and API documentation. Copy `src/components/merge-review` and its imports; copy this pattern folder for the full demo. Existing dependencies: React, Motion, Oreo Button/Icon, AgentWorkspaceState, PromptBox and CodeDiff. No new packages.

## Interaction and integration

Create PR → conflicts → Resolve conflicts → three resolution steps → four checks → explicit Merge → merged. Select a commit to inspect its metadata and a clearly labeled representative patch. The change capsule expands a sample diff. The worked disclosure describes the sample operation. The composer saves local review notes; Mention inserts @Lena and attachments display local file names only (contents are not read or uploaded).

The “Simulate a failed check” control is set before creation. Lint fails after Tests; Retry checks applies the sample fix and reruns checks. Cancel invalidates pending work and returns to the conflict state; Reset invalidates pending work and clears the conversation. The reducer ignores stale attempt IDs and cannot merge before every sample check passes. The card independently disables Merge unless its phase is ready and a nonempty set of checks all passed.

Real hosts must supply authoritative Git/CI data and action handlers. `mergeReducer` is a demo driver, not a merge service or authorization layer. The graph does not compute Git topology: supply newest-first commit IDs, lane indices 0–5, and visible parent IDs. Missing parents terminate at the visible graph boundary. Titles are truncated in rows; the interactive template reveals full values in commit details. PR counts and patch excerpt are illustrative sample data.

## Accessibility and visual behavior

Native buttons, disclosures and labels support keyboard input. Status updates are announced politely; errors use an alert. Color is paired with text or counts. Fixed-height rows keep graph edges aligned; mobile hides secondary commit metadata and truncates branch labels, with full values available through row selection. Page headers stay in normal flow; no content scrolls behind them. Reduced motion disables graph/entrance interpolation and animated spinners. Dark mode uses the existing Oreo palette.

## Verification

`node --experimental-strip-types --test src/components/merge-review/model.test.ts`

`./node_modules/.bin/tsc -b` and `./node_modules/.bin/vite build`

See [the single review index](../../../docs/reviews/pitus-video-20261018/REVIEW.md) for baseline, reference frames, browser evidence, coverage limits and delivery status. All check counts inside the template are simulated and are separate from these actual verification results.
