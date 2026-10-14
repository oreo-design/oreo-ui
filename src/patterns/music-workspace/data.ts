import type { Collaborator } from "@/components/project-chat";
export const collaborators: Collaborator[] = [
  { id: "allagi", name: "Allagi", online: true },
  { id: "sophia", name: "Sophia", online: true },
  { id: "ravi", name: "Ravi" },
];
export const songs = [
  {
    id: "on-my-mind",
    name: "On My Mind",
    phase: "Idea",
    tasks: 8,
    notes: 12,
    status: "In progress",
    updated: "2h ago",
    unread: 0,
  },
  {
    id: "so-long",
    name: "So Long",
    phase: "Composition",
    tasks: 9,
    notes: 8,
    status: "In progress",
    updated: "5h ago",
    unread: 3,
  },
  {
    id: "isolation",
    name: "Isolation",
    phase: "Mastering",
    tasks: 8,
    notes: 15,
    status: "In review",
    updated: "Yesterday",
    unread: 1,
  },
  {
    id: "escape",
    name: "Escape",
    phase: "Artwork",
    tasks: 6,
    notes: 4,
    status: "In review",
    updated: "Yesterday",
    unread: 0,
  },
  {
    id: "after-hours",
    name: "After Hours",
    phase: "Released",
    tasks: 0,
    notes: 21,
    status: "Complete",
    updated: "Oct 10",
    unread: 0,
  },
];
export type Song = (typeof songs)[number];
