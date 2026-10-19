import type {
  QueueTask,
  QueueQuestion,
} from "@/components/agent-task-queue/model";
export const QUEUE_QUESTIONS: QueueQuestion[] = [
  {
    id: "placement",
    prompt: "Where should the gradient show?",
    options: ["On the title", "Across the row", "Behind the dot"],
  },
  {
    id: "speed",
    prompt: "How fast should it move?",
    options: ["Slow", "Medium", "Fast"],
  },
  {
    id: "direction",
    prompt: "Which direction should it move?",
    options: ["Left to right", "Right to left"],
  },
];
export const QUEUE_TASKS: QueueTask[] = [
  {
    id: "height",
    title: "Make the preview 80% of the viewport height",
    status: "queued",
    context: "Keep the toolbar visible above the canvas.",
    answers: {},
    progress: 0,
  },
  {
    id: "gradient",
    title: "Use a moving gradient while the agent is working",
    status: "queued",
    context: "Replace the static working label with a subtle visual signal.",
    questions: QUEUE_QUESTIONS,
    answers: {},
    progress: 0,
  },
  {
    id: "flat",
    title: "Keep main tasks at the top level",
    status: "queued",
    context:
      "The queue stays flat. Reordering must never turn a task into a subtask.",
    answers: {},
    progress: 0,
  },
  {
    id: "reorder",
    title: "Move tasks in real time while dragging",
    status: "queued",
    context: "Preserve keyboard ordering and reduced motion.",
    answers: {},
    progress: 0,
  },
  {
    id: "later",
    title: "Polish the empty state",
    status: "paused",
    context: "Pick this up after the first preview is ready.",
    answers: {},
    progress: 0,
  },
];
export const newQueueTask = (
  id: string,
  title: string,
  context = "",
): QueueTask => ({
  id,
  title,
  status: "queued",
  context,
  answers: {},
  progress: 0,
});
