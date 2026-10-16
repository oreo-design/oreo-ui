import { createTask, type TaskDetails } from "@/components/task-editor/model";
import type { KanbanPerson } from "@/components/kanban";
export const TASK_PEOPLE: KanbanPerson[] = [
  { id: "emma", name: "Emma Wilson", color: "mint" },
  { id: "leo", name: "Leo Foster", color: "mint" },
  { id: "dan", name: "Daniel Adams", color: "orange" },
  { id: "alex", name: "Alex Morgan", color: "purple" },
];
export const CAMPAIGN_TASKS: TaskDetails[] = [
  {
    ...createTask("MKT-115", "Influencer outreach list", "backlog"),
    labels: ["Growth"],
    assigneeId: "leo",
  },
  {
    ...createTask("MKT-109", "Paid social creatives"),
    priority: "High",
    assigneeId: "emma",
    start: "2026-10-11",
    due: "2026-10-17",
    labels: ["Design", "Growth"],
    estimate: "3d",
  },
  {
    ...createTask("MKT-112", "Email nurture sequence"),
    labels: ["Content"],
    assigneeId: "dan",
    due: "2026-10-18",
  },
  {
    ...createTask("MKT-118", "Launch webinar deck"),
    labels: ["Content"],
    assigneeId: "alex",
    due: "2026-10-24",
  },
  {
    ...createTask("MKT-106", "Landing page experiments", "progress"),
    labels: ["Design"],
    assigneeId: "emma",
    description:
      "Compare two headlines and share the strongest direction with the team.",
    subtasks: [
      { id: "sub1", title: "Draft headline variants", done: true },
      { id: "sub2", title: "Review with the team", done: false },
    ],
  },
  {
    ...createTask("MKT-103", "Campaign brief", "done"),
    labels: ["Growth"],
    assigneeId: "alex",
  },
];
