import type { CapsuleTask, CapsulePerson } from "@/components/task-capsule";
export const CAPSULE_PEOPLE: CapsulePerson[] = [
  { id: "maya", name: "Maya", color: "mint" },
  { id: "jules", name: "Jules", color: "purple" },
  { id: "priya", name: "Priya", color: "blue" },
];
export const CAPSULE_TASKS: CapsuleTask[] = [
  {
    id: "DES-024",
    title: "Onboarding flow",
    description:
      "Make the first five minutes feel effortless. A short path from welcome to a workspace ready for the team.",
    status: "progress",
    due: "Oct 24",
    people: CAPSULE_PEOPLE,
    items: [
      { id: "welcome", title: "Welcome screen", done: true },
      { id: "workspace", title: "Workspace setup", done: true },
      {
        id: "invite",
        title: "Invite teammates",
        done: true,
        assigneeId: "maya",
      },
      {
        id: "checklist",
        title: "First-run checklist",
        done: false,
        assigneeId: "priya",
      },
      { id: "emails", title: "Lifecycle emails", done: false },
    ],
  },
  {
    id: "DES-025",
    title: "Design system",
    description: "A small, reliable foundation for the next release.",
    status: "review",
    due: "Oct 28",
    people: CAPSULE_PEOPLE.slice(0, 2),
    items: [
      { id: "tokens", title: "Audit foundation tokens", done: true },
      { id: "states", title: "Review interaction states", done: true },
      { id: "docs", title: "Document usage patterns", done: false },
    ],
  },
  {
    id: "DES-026",
    title: "Release notes",
    description: "A clear account of what changed and why it matters.",
    status: "todo",
    due: "Oct 30",
    people: CAPSULE_PEOPLE.slice(2),
    items: [
      { id: "draft", title: "Write the first draft", done: false },
      { id: "review", title: "Editorial review", done: false },
    ],
  },
];
