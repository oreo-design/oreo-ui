import type { LaneTask } from "../../components/agent-lanes/model";
export type LaneDemo = {
  now: number;
  playing: boolean;
  tasks: LaneTask[];
  approvedAt: number | null;
};
export type LaneDemoAction =
  | { type: "play" | "pause" | "tick" | "approve" }
  | { type: "reset"; tasks: LaneTask[] };
export function laneDemoReducer(
  state: LaneDemo,
  action: LaneDemoAction,
): LaneDemo {
  if (action.type === "reset")
    return { now: 0, playing: false, tasks: action.tasks, approvedAt: null };
  if (action.type === "play")
    return {
      ...state,
      playing: state.now < Math.max(18, (state.approvedAt ?? 0) + 4),
    };
  if (action.type === "pause") return { ...state, playing: false };
  if (action.type === "approve") {
    if (!state.tasks.some((t) => t.id === "keys" && t.status === "waiting"))
      return state;
    return {
      ...state,
      approvedAt: state.now,
      tasks: state.tasks.map((t) =>
        t.id === "keys"
          ? {
              ...t,
              status: "running",
              notes: [
                "Sample rotation approved",
                "Checking that dependent services can use the new key",
              ],
            }
          : t,
      ),
    };
  }
  if (!state.playing) return state;
  const limit = Math.max(18, (state.approvedAt ?? 0) + 4),
    now = Math.min(limit, state.now + 1);
  let tasks = state.tasks.map((t) => {
    const end =
      t.id === "draft"
        ? 4
        : t.id === "interviews"
          ? 12
          : t.id === "review-page"
            ? 10
            : t.id === "keys" && state.approvedAt !== null
              ? state.approvedAt + 4
              : Infinity;
    return t.status === "running" && now >= end
      ? {
          ...t,
          status: "done" as const,
          end,
          notes: [...t.notes, "Sample work completed"],
        }
      : t;
  });
  if (now >= 4 && !tasks.some((t) => t.id === "review-page"))
    tasks = [
      ...tasks,
      {
        id: "review-page",
        agentId: "review",
        title: "Review pricing page",
        start: 4,
        end: null,
        status: "running",
        tools: ["Design", "Docs"],
        notes: [
          "Received the completed draft",
          "Checking copy, hierarchy and accessibility",
        ],
        dependsOn: "draft",
      },
    ];
  return { ...state, now, playing: now < limit, tasks };
}
