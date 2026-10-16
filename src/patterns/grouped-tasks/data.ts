import type { GroupedTask, TaskMember } from "@/components/grouped-tasks";
export const MEMBERS: TaskMember[] = [
  { id: "alex", name: "Alex Morgan", color: "purple" },
  { id: "sam", name: "Sam Chen", color: "pink" },
  { id: "jules", name: "Jules Carter", color: "blue" },
  { id: "maya", name: "Maya Wilson", color: "mint" },
];
export const LISTS = [
  "UXR",
  "Research",
  "Marketing",
  "UI Design",
  "Big Picture",
  "Beta Testing",
];
const names = [
  "Craft user personas",
  "Analyze market trends",
  "Collect user feedback",
  "Enhance content strategy",
  "Evaluate user engagement",
  "Chart user journeys",
  "Examine traffic sources",
  "Perform usability testing",
  "Design wireframes",
  "Review the navigation flow",
  "Create feature roadmap",
  "Ship the first prototype",
  "Complete A/B test",
  "Plan the next release",
];
export const SAMPLE_TASKS: GroupedTask[] = names.map((title, i) => ({
  id: `ORE-${101 + i}`,
  title,
  status: i < 5 ? "backlog" : i < 8 ? "progress" : i < 11 ? "review" : "done",
  priority:
    i % 4 === 0
      ? "High"
      : i % 4 === 1
        ? "Medium"
        : i % 4 === 2
          ? "Low"
          : undefined,
  list: LISTS[i % LISTS.length],
  tags: [i % 3 === 0 ? "Sprint 24" : `Week ${(i % 2) + 1}`],
  due: `2026-10-${String(19 + (i % 8)).padStart(2, "0")}`,
  assigneeIds:
    i === 4 ? [] : MEMBERS.slice(i % 3, (i % 3) + 2).map((p) => p.id),
}));
