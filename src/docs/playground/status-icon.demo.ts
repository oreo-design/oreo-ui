import type { Demo } from "./demo";

// Measured from the ThisUX reference at 50 ms intervals. The final ~3 seconds
// of the video are a presentation montage, not another icon state.
export function statusIconDemo(): Demo {
  return { duration: 12200, frames: [
    { at: 0, label: "Backlog", values: { status: "backlog" } },
    { at: 1500, label: "Planned", values: { status: "planned" } },
    { at: 2850, label: "To do", values: { status: "todo" } },
    { at: 4150, label: "Started", values: { status: "in-progress", progress: "quarter" } },
    { at: 5450, label: "In progress", values: { status: "in-progress", progress: "half" } },
    { at: 6800, label: "In review", values: { status: "in-progress", progress: "three-quarters" } },
    { at: 8150, label: "Done", values: { status: "done" } },
    { at: 9500, label: "Canceled", values: { status: "canceled" } },
    { at: 10850, label: "Blocked", values: { status: "blocked" } },
  ] };
}
