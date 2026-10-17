import type { TaskStatus, TaskPriority } from "@/components/task-row";
import type { KanbanPerson } from "@/components/kanban";
export type Project = {
  id: string;
  name: string;
  description: string;
  due: string;
  status: "On track" | "At risk" | "Planning";
};
export type Task = {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  due: string;
  start?: string;
  description: string;
  subtasks: { id: string; title: string; done: boolean }[];
};
export const PEOPLE: KanbanPerson[] = [
  { id: "alex", name: "Alex Morgan", color: "purple" },
  { id: "sam", name: "Sam Chen", color: "pink" },
  { id: "jules", name: "Jules Carter", color: "blue" },
  { id: "maya", name: "Maya Wilson", color: "mint" },
];
export const PROJECTS: Project[] = [
  {
    id: "website",
    name: "Website redesign",
    description: "A clearer story, from first visit to first customer.",
    due: "2026-10-30",
    status: "On track",
  },
  {
    id: "mobile",
    name: "Mobile experience",
    description: "Make the everyday workflow feel effortless on the go.",
    due: "2026-11-12",
    status: "At risk",
  },
  {
    id: "system",
    name: "Design system",
    description: "Thoughtful foundations for everything we build next.",
    due: "2026-11-20",
    status: "Planning",
  },
];
const seed: [
  string,
  string,
  string,
  TaskStatus,
  TaskPriority,
  string,
  string,
][] = [
  [
    "WEB-101",
    "Explore homepage directions",
    "website",
    "done",
    "High",
    "sam",
    "2026-10-13",
  ],
  [
    "WEB-102",
    "Finalize navigation",
    "website",
    "progress",
    "High",
    "alex",
    "2026-10-15",
  ],
  [
    "WEB-103",
    "Create homepage wireframes",
    "website",
    "review",
    "Medium",
    "sam",
    "2026-10-16",
  ],
  [
    "WEB-104",
    "Prepare design tokens",
    "website",
    "todo",
    "Medium",
    "alex",
    "2026-10-19",
  ],
  [
    "WEB-105",
    "Write homepage copy",
    "website",
    "backlog",
    "Low",
    "maya",
    "2026-10-21",
  ],
  [
    "WEB-106",
    "Check keyboard navigation",
    "website",
    "todo",
    "High",
    "jules",
    "2026-10-22",
  ],
  [
    "WEB-107",
    "Fix pricing page links",
    "website",
    "done",
    "Low",
    "jules",
    "2026-10-14",
  ],
  [
    "APP-201",
    "Triage beta feedback",
    "mobile",
    "progress",
    "High",
    "alex",
    "2026-10-14",
  ],
  [
    "APP-202",
    "Prototype onboarding",
    "mobile",
    "review",
    "Medium",
    "maya",
    "2026-10-17",
  ],
  [
    "APP-203",
    "Review offline states",
    "mobile",
    "todo",
    "High",
    "jules",
    "2026-10-20",
  ],
  [
    "APP-204",
    "Map the core journey",
    "mobile",
    "done",
    "Medium",
    "sam",
    "2026-10-12",
  ],
  [
    "DS-301",
    "Audit component usage",
    "system",
    "progress",
    "Medium",
    "alex",
    "2026-10-18",
  ],
  [
    "DS-302",
    "Document input patterns",
    "system",
    "backlog",
    "Low",
    "sam",
    "2026-10-23",
  ],
  [
    "DS-303",
    "Review semantic colors",
    "system",
    "todo",
    "High",
    "maya",
    "2026-10-16",
  ],
];
export const SAMPLE_TODAY = "2026-10-15";
export const INITIAL_TASKS: Task[] = seed.map(
  ([id, title, projectId, status, priority, assigneeId, due]) => ({
    id,
    title,
    projectId,
    status,
    priority,
    assigneeId,
    due,
    start: (
      {
        "WEB-102": "2026-10-12",
        "WEB-103": "2026-10-13",
        "WEB-104": "2026-10-15",
        "WEB-105": "2026-10-19",
      } as Record<string, string>
    )[id],
    description: `Bring the ${PROJECTS.find((p) => p.id === projectId)!.name.toLowerCase()} work one step closer to ready. Capture the key decisions, check the edge cases, and share a clear handoff with the team.`,
    subtasks: [
      { id: `${id}-1`, title: "Review the current experience", done: true },
      {
        id: `${id}-2`,
        title: "Check narrow screens and keyboard use",
        done: status === "done",
      },
      {
        id: `${id}-3`,
        title: "Share the final handoff",
        done: status === "done",
      },
    ],
  }),
);
export function dateLabel(value: string) {
  if (!value) return "No date";
  if (value === SAMPLE_TODAY) return "Today";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value + "T12:00:00"));
}
