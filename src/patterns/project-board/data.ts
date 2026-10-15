import type {
  BoardProject,
  BoardPerson,
  ProjectStage,
} from "@/components/project-board";
import type { KanbanCard } from "@/components/kanban";
export const BOARD_PEOPLE: BoardPerson[] = [
  { id: "navneet", name: "Navneet Singh" },
  { id: "maya", name: "Maya Patel" },
  { id: "alex", name: "Alex Johnson" },
  { id: "jules", name: "Jules Chen" },
];
export const CATEGORIES = ["Websites", "Apps", "Dashboard"] as const;
export const BOARD_PROJECTS: BoardProject[] = [
  {
    id: "PRJ-101",
    title: "Helsinki Tech",
    description: "A clearer website for a new generation of builders.",
    stage: "progress",
    category: "Websites",
    priority: "Low",
    due: "2026-10-28",
    completed: 7,
    total: 10,
    assigneeId: "navneet",
  },
  {
    id: "PRJ-102",
    title: "Prostech identity",
    description: "Bring the new visual language into the product.",
    stage: "progress",
    category: "Apps",
    priority: "High",
    due: "2026-10-20",
    completed: 3,
    total: 12,
    assigneeId: "alex",
  },
  {
    id: "PRJ-103",
    title: "Fieldwork mobile",
    description: "A focused companion for work away from the desk.",
    stage: "progress",
    category: "Apps",
    priority: "Medium",
    due: "2026-11-04",
    completed: 5,
    total: 11,
    assigneeId: "maya",
  },
  {
    id: "PRJ-104",
    title: "Gencamp Co.",
    description: "Review the final experience with the client team.",
    stage: "review",
    category: "Websites",
    priority: "Low",
    due: "2026-10-24",
    completed: 8,
    total: 9,
    assigneeId: "jules",
  },
  {
    id: "PRJ-105",
    title: "Marketing analytics",
    description: "Make the important numbers easy to understand.",
    stage: "review",
    category: "Dashboard",
    priority: "High",
    due: "2026-10-22",
    completed: 6,
    total: 8,
    assigneeId: "alex",
  },
  {
    id: "PRJ-106",
    title: "Redchamps Co.",
    description: "A fresh home for a team that moves things forward.",
    stage: "done",
    category: "Websites",
    priority: "Low",
    due: "2026-10-12",
    completed: 12,
    total: 12,
    assigneeId: "maya",
  },
  {
    id: "PRJ-107",
    title: "Yelltech workspace",
    description: "Keep conversations and decisions in one place.",
    stage: "done",
    category: "Dashboard",
    priority: "High",
    due: "2026-10-14",
    completed: 8,
    total: 8,
    assigneeId: "navneet",
  },
];
export function asKanban(project: BoardProject): KanbanCard {
  return {
    id: project.id,
    title: project.title,
    columnId: project.stage,
    assigneeId: project.assigneeId,
    label: {
      name: project.priority,
      color:
        project.priority === "High"
          ? "orange"
          : project.priority === "Low"
            ? "mint"
            : "purple",
    },
    date: project.due,
    checklist: { done: project.completed, total: project.total },
  };
}
export function applyBoardChanges(
  all: BoardProject[],
  visibleIds: string[],
  cards: KanbanCard[],
  category: string,
): BoardProject[] {
  const visible = new Set(visibleIds);
  const updated = cards.map((card) => {
    const old = all.find((p) => p.id === card.id);
    const total = old?.total ?? 10;
    const stage = card.columnId as ProjectStage;
    return {
      ...(old ?? {
        id: card.id,
        title: card.title,
        description: "Add a brief to give your team a little context.",
        category: category === "All projects" ? "Websites" : category,
        priority: "Medium" as const,
        due: "",
        completed: 0,
        total,
        assigneeId: "",
      }),
      title: card.title,
      stage,
      assigneeId: card.assigneeId ?? "",
      completed: stage === "done" ? total : (old?.completed ?? 0),
    };
  });
  return [...all.filter((p) => !visible.has(p.id)), ...updated];
}
