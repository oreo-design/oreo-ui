# Project Workspace

A local project overview with task list, Kanban, calendar and timeline. Uses the existing TaskRow, ProjectSummary, KanbanBoard, Base UI Dialog, Avatar, Tag and Button components.

- Original reference: https://x.com/zahragr8r/status/2110262138124320955
- Scheduling follow-up: https://x.com/zahragr8r/status/2110776888050524179 and its linked Gr8r demo, inspected read-only. No external source code/assets copied.
- Open All tasks, My tasks or a project, then Calendar / Timeline. Views share filters and task records. Calendar month/week navigation and timeline 2/4-week ranges are independent and retained across view switches.
- New reusable TaskScheduleChip, TaskCalendar and TaskTimeline live in `src/components/task-schedule`, with docs and playgrounds. Existing Color Calendar is an hourly event planner; these components use its UTC date helpers for date-only tasks.
- Calendar groups by due date. Add on a day prefills the existing task editor. Busy days expand after three tasks. Undated or invalid schedule rows remain in Needs scheduling. Timeline uses inclusive start/due bars, clips to visible dates and shows project deadline diamonds. Missing starts are due-only single-day markers, never invented estimates. Four seed tasks include explicit fictional starts.
- Editor validates real calendar dates and start ≤ due, with same-day dates allowed. A start requires a due date. Cancel leaves records untouched; shared completion, archive/undo and filtered board edits keep their previous behavior. Dates have no timezone conversion or time-of-day.
- All records are local React fixtures, fixed sample today October 15, 2026. Reload resets changes. No live account, collaborative schedule, notifications, automatic dependencies or production deployment.
- Token mapping: colors/radii/shadows reuse Oreo variables, dimensions use existing rem spacing/type scale. Calendar 7-column and timeline date-derived grid geometry are content-specific. Horizontal scrolling is contained; timeline date/name headers are protected by opaque sticky surfaces. Frequent navigation/edit actions introduce no animation.

Review: `docs/reviews/project-schedule-20261017/REVIEW.md`. Previous evidence remains in the project-tasks and task-editor review directories.
