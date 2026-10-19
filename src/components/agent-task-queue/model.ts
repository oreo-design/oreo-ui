export type QueueStatus =
  "queued" | "running" | "paused" | "needs-context" | "done";
export type QueueQuestion = {
  id: string;
  prompt: string;
  options: readonly string[];
};
export type QueueTask = {
  id: string;
  title: string;
  status: QueueStatus;
  context: string;
  questions?: readonly QueueQuestion[];
  answers: Record<string, string>;
  progress: number;
};
export const QUEUE_LABELS: Record<QueueStatus, string> = {
  queued: "Queued",
  running: "Working",
  paused: "Paused",
  "needs-context": "Needs context",
  done: "Completed",
};
export type QueueState = {
  tasks: QueueTask[];
  playing: boolean;
  epoch: number;
  notice: string;
  removed: { task: QueueTask; index: number }[];
};
export type QueueAction =
  | { type: "play" }
  | { type: "pause-session" }
  | { type: "undo" }
  | { type: "tick"; epoch: number }
  | { type: "reset"; tasks: QueueTask[] }
  | { type: "add"; task: QueueTask }
  | { type: "pause-task" | "resume-task" | "remove"; id: string }
  | { type: "context"; id: string; value: string }
  | { type: "answer"; id: string; answers: Record<string, string> }
  | { type: "move"; id: string; over: string };
export const hasAnswers = (task: QueueTask) =>
  !task.questions?.length ||
  task.questions.every(
    (q) =>
      !!task.answers[q.id]?.trim() && task.answers[q.id].trim().length <= 500,
  );
/** Only queued, fully specified tasks may start. Missing input never blocks later work. */
function schedule(state: QueueState): QueueState {
  if (!state.playing || state.tasks.some((t) => t.status === "running"))
    return state;
  let started = false;
  const tasks = state.tasks.map((t) => {
    if (started || t.status !== "queued") return t;
    if (!hasAnswers(t)) return { ...t, status: "needs-context" as const };
    started = true;
    return { ...t, status: "running" as const };
  });
  return { ...state, tasks };
}
export function queueReducer(
  state: QueueState,
  action: QueueAction,
): QueueState {
  if (action.type === "reset")
    return {
      tasks: action.tasks.map((t) => ({ ...t, answers: { ...t.answers } })),
      playing: false,
      epoch: state.epoch + 1,
      removed: [],
      notice: "Sample queue restored.",
    };
  if (action.type === "play")
    return schedule({
      ...state,
      playing: true,
      epoch: state.epoch + 1,
      notice: "Session started. Tasks needing context will be skipped.",
    });
  if (action.type === "pause-session")
    return {
      ...state,
      playing: false,
      epoch: state.epoch + 1,
      notice: "Session paused. Progress is preserved.",
    };
  if (action.type === "tick") {
    if (!state.playing || action.epoch !== state.epoch) return state;
    const active = state.tasks.find((t) => t.status === "running");
    if (!active) return schedule(state);
    const complete = active.progress >= 1;
    return schedule({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === active.id
          ? {
              ...t,
              progress: t.progress + 1,
              status: complete ? "done" : "running",
            }
          : t,
      ),
      notice: complete ? `${active.title} completed.` : state.notice,
    });
  }
  if (action.type === "add") {
    if (
      !action.task.title.trim() ||
      action.task.title.trim().length > 500 ||
      state.tasks.some((t) => t.id === action.task.id) ||
      state.removed.some((r) => r.task.id === action.task.id)
    )
      return state;
    return schedule({
      ...state,
      tasks: [
        ...state.tasks,
        {
          ...action.task,
          title: action.task.title.trim(),
          status: "queued",
          progress: 0,
        },
      ],
      notice: "Task added to the queue.",
    });
  }
  if (action.type === "undo") {
    const last = state.removed.at(-1);
    if (!last) return state;
    const tasks = [...state.tasks];
    tasks.splice(Math.min(last.index, tasks.length), 0, {
      ...last.task,
      status: last.task.status === "running" ? "queued" : last.task.status,
    });
    return schedule({
      ...state,
      tasks,
      removed: state.removed.slice(0, -1),
      notice: "Removed task restored.",
    });
  }
  const task = state.tasks.find((t) => t.id === action.id);
  if (!task) return state;
  if (action.type === "remove")
    return schedule({
      ...state,
      tasks: state.tasks.filter((t) => t.id !== task.id),
      removed: [...state.removed, { task, index: state.tasks.indexOf(task) }],
      epoch: state.epoch + 1,
      notice: "Task removed. You can undo this.",
    });
  if (action.type === "move") {
    const from = state.tasks.indexOf(task),
      to = state.tasks.findIndex((t) => t.id === action.over);
    if (to < 0 || from === to) return state;
    const tasks = [...state.tasks];
    tasks.splice(from, 1);
    tasks.splice(to, 0, task);
    return {
      ...state,
      tasks,
      notice: `Moved ${task.title} to position ${to + 1}.`,
    };
  }
  if (action.type === "pause-task") {
    if (task.status !== "running" && task.status !== "queued") return state;
    return schedule({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === task.id ? { ...t, status: "paused" } : t,
      ),
      epoch: state.epoch + 1,
      notice: `Paused ${task.title}. Other tasks can continue.`,
    });
  }
  if (action.type === "resume-task") {
    if (task.status !== "paused") return state;
    return schedule({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === task.id ? { ...t, status: "queued" } : t,
      ),
      notice: `Returned ${task.title} to the queue.`,
    });
  }
  if (action.type === "context") {
    if (action.value.length > 2000) return state;
    return {
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === task.id ? { ...t, context: action.value.trim() } : t,
      ),
      notice: "Context saved for this task.",
    };
  }
  if (action.type === "answer") {
    if (task.status !== "needs-context" || !task.questions?.length)
      return state;
    const answers = Object.fromEntries(
      task.questions.map((q) => [q.id, action.answers[q.id]?.trim() ?? ""]),
    );
    if (!hasAnswers({ ...task, answers })) return state;
    return schedule({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === task.id ? { ...t, answers, status: "queued" } : t,
      ),
      notice: "Answers saved. Task returned to the queue.",
    });
  }
  return state;
}
