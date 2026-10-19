# Test Workspace

Reference: [Preet Suthar / HextaUI Test Results](https://x.com/preetsuthar17/status/2111694212857266430). Independently implemented from visible behavior and the linked public preview; no Pro source or protected registry used.

Open `/test-workspace`. Six documented components: TestResults, TestRunSummary, TestResultFilters, TestFileGroup, TestFailureDetail and TestStackTrace. Each is registered in the editable playground with source export.

The template runs 20 deterministic sample tests across five files. Two fail and one is skipped. Stop preserves completed outcomes. Rerun failed preserves other outcomes. Ask to fix presents a local proposal; Apply sample fix changes fixture outcomes and reruns failures. The runner-error option demonstrates retry. This is frontend simulation, not a real runner, agent, editor or repository mutation.

`model.ts` accepts serial results for stable IDs. Run IDs reject stale events. Consumer owns runner integration; no external report parsers are claimed. File/manual summary expansion survives streaming within a run. A new run resets disclosures via `key={run.id}`. Slow means ≥500 ms, including failed/time-out tests; skipped tests with timing may also match. Counts and durations are derived from the same records. Total elapsed time in this fixture is a simulated serial runner time.

Reuse: Oreo Button/IconButton, StatusIcon, Icon, CodeBlock, CodeDiff, AgentWorkspaceState, docs shell and Motion. CSS uses product tokens and spacing units. Reference-specific layout proportions are scoped to the template. The inline progress meter represents ongoing execution, not initial data loading. The entire document scrolls, so no sticky title or redundant edge fade is needed. Expected/Received uses semantic labels rather than patch counts; values wrap on mobile. Reduced motion disables the count transition and progress interpolation.

Evidence and coverage: [REVIEW.md](../../../docs/reviews/preet-tests-20261019/REVIEW.md).
