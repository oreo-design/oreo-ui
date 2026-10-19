# Agent Lanes Workspace

Reference: [Flo (@flohoeller), Agent lanes component design](https://x.com/flohoeller/status/2111405211478900836). Actual video inspected at 2/6/10 seconds. This implementation maps time geometry, task state strips, dotted handoffs, hover summaries and approval transitions to Oreo's tokens. Agent/model text and tools are illustrative; no third-party logos or live model availability claims.

- Template `/agent-lanes-workspace`; components `/agent-lanes`, `/agent-lane-identity`, `/agent-task-bar`, `/agent-timeline-axis`.
- `AgentLaneIdentity`: independent identity/model/live-state display; clamps names to two lines and model to one line; full values remain in title attributes.
- `AgentTaskBar`: independent state, selection and inspection callback; hover/focus summary, Escape dismiss; native keyboard activation. Title truncates visually while full text stays in accessible name, summary and details.
- `AgentTimelineAxis`: duration-controlled relative ruler, six ticks. Place inside a positioned timeline track. The board owns the identity gutter.
- `AgentLanes`: host-owned agents/tasks/clock/range/selection, shape-preserving initial skeleton, preserved refresh data, explicit error and empty state. Temporal overlap allocates subtracks; invisible source dependencies are omitted rather than misdrawn. Inputs require unique IDs, valid intervals and known agent IDs. Milliseconds must be converted to minutes consistently before use.

```tsx
<AgentLanes
  agents={agents}
  tasks={tasks}
  now={clockMinutes}
  minutes={30}
  selectedId={selectedId}
  onSelect={setSelectedId}
  actions={<TimeRangeControl value={range} onChange={setRange} />}
  loading={loading}
  error={error}
  onRetry={reload}
/>
```

## State and interaction

The sample clock starts paused. Play advances one simulated minute per 1.5 seconds, stops at +18m (or four minutes after a late approval); Pause and Reset ignore late ticks. At +4m the draft completes and hands off to Reviewer; review ends at +10m, interviews at +12m. Approving rotation transitions only a waiting task and completes four simulated minutes after approval. Reset restores fixtures. No account, credential, backend, storage or network actions exist. The template preserves selected details while a task moves out of the visible window. Close returns focus to its task if still mounted, otherwise to the range control.

## Copy, states and layout

English copy is illustrative and host-owned. Status text: Running / Needs you / Completed / Failed; identity shows Idle only when it has no running or waiting task. Long task titles truncate only on bars, tool/summary text remains available in persistent details. A task can be inspected even when no host selection callback is provided. Color never supplies the only accessible status.

Wide and medium layouts use a fixed identity column with a horizontally scalable timeline. Under 640px, identity column narrows; the time region retains a scrollable minimum width. Under 768px, the detail panel and context stack. Opaque sticky identity and ruler protect content while scrolling. The layout's track geometry (64px subtracks, 40px ruler, 80px minimum rows) is intentional time-visualization geometry mapped to Oreo's spacing unit. Running uses Oreo progress tokens, waiting uses orange palette, completed uses neutral; failed background mixes the semantic error token with base (no matching predefined subtle error token).

Buttons, Avatar, Icon, StatusIcon, AgentWorkspacePanel, AgentWorkspaceState, AgentRunActivity and SkeletonReveal are reused. There is no previous Oreo time-lane composition; AgentInbox is the rendered operational peer. Task buttons are temporal visualization marks, not duplicate toolbar buttons; immediate pressed overlay and native focus behavior match that role. Tooltip follows the AgentRuns summary approach, while persistent details provide touch access. Motion is 400ms geometry interpolation; reduced motion disables it. No motion runs until playback is explicitly started.

Evidence and limitations: [REVIEW](../../../docs/reviews/agent-lanes-20261019/REVIEW.md).

Task labels remain sticky within the visible time region during horizontal scroll; on narrow screens the redundant inline waiting badge is hidden while the identity badge and accessible status remain. Running text mixes the progress token with primary text for readable light/dark contrast.

Zero-length/new tasks retain a 48px inspection target at the right edge; this minimum visual footprint is not an extra duration. Handoff paths interpolate alongside task geometry and respect reduced motion.
