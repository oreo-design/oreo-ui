# Continuous agent queue

Reference: [Isaiah / @eyexayuh](https://x.com/eyexayuh/status/2112042083536236933). The source shows a flat, continuously editable task queue, independent pause, skipped requests needing context, inline editing, and three-step clarification. `/agent-queue-workspace` composes these into a complete local workspace.

## Reusable parts

| Component | Independent contract | Interaction and states | Copy | Composition |
| --- | --- | --- | --- | --- |
| QueueTaskRow | task, expanded, suspended, optional actions and handle | queued/running/paused/needs-context/done; disclosure, pause/resume/remove | task title, context and answers are caller data; default status/action labels are English | one flat timeline item; optional detail slot |
| AgentTaskQueue | controlled tasks, expandedId, reorder and action callbacks, renderDetail | pointer and keyboard sorting, initial loading, refresh, error/retry, empty, removal focus recovery | task content caller-owned; default state messages are English | bounded workspace body; host owns scheduling and undo |
| TaskClarification | questions/options, answers, step, callbacks, pending/error | native radio choices, custom text, validation, next/back/save; drafts retained | questions/options caller-owned; navigation/validation copy is currently English | inline per-task card; no agent execution or persistence |
| QueuedRequestStack | requests, expanded, onExpandedChange | collapsed first request plus remaining count, expanded requests; empty hides | caller-owned request titles | compact queue summary above task list |

Each component has its own route and editable Playground. Complete composition is registered under Templates. Copy the component folder, model and its referenced Oreo Button/Icon, automation state, SkeletonReveal and ShimmerText owners; sorting uses the project's existing dnd-kit packages. Keep shared token/theme CSS. Question and task content are data-driven; translating default component chrome requires adapting its English labels.

## Execution model

The reducer schedules at most one runnable task. Requests with unanswered questions become `needs-context` and do not block later tasks. Individual pause preserves progress; resume does not preempt the active task. Global pause stops timing; epoch guards reject stale ticks after reset/pause/removal. Reordering changes priority without replacing active identity. Undo restores removed items in reverse order; an active item returns queued to avoid concurrent execution. Context saving does not silently resume a paused request.

The template simulates completion after two 1.4-second ticks. It accepts new tasks while running, supports a local attachment/context marker and mention text, theme switching and loading/error recovery. Reset restores the fixture. It does not call an AI service, modify a project, upload files, or persist after reload. The canvas is illustrative, rather than falsely claiming to execute the request text.

Focused model checks: `node --experimental-strip-types --test src/components/agent-task-queue/model.test.mjs`. [Review record and original evidence](../../../docs/reviews/agent-task-queue-20261019/REVIEW.md).
