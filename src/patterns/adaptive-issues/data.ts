import type {
  AdaptiveIssue,
  IssueStage,
  PullRequestState,
} from "@/components/adaptive-issues/model";
const titles = [
  "Cache map tiles for the last region viewed",
  "Write the copy for the location prompt",
  "Larger type in the route sheet",
  "Resolve pin conflicts between devices",
  "Download regions over Wi-Fi only",
  "Invite people to a list by link",
  "Drop deleted pins after thirty days",
  "Rotate the sync service’s signing keys",
  "Check contrast on the night map style",
  "Restore a backup to a fresh account",
  "Measure the tile cache on a nearly full phone",
  "Pick a storage engine for saved places",
  "Decide who can edit a shared list",
];
const categories = [
  "Performance",
  "Design",
  "Design",
  "Bug",
  "Feature",
  "Feature",
  "Sync",
  "Sync",
  "Design",
  "Bug",
  "Performance",
  "Docs",
  "Feature",
];
const names = ["Maya Wilson", "Alex Morgan", "Sam Chen", "Jules Carter"];
export const ADAPTIVE_ISSUES: AdaptiveIssue[] = titles.map((title, i) => ({
  id: 1184 - i * 7,
  title,
  status: (i < 3
    ? "review"
    : i < 6
      ? "progress"
      : i < 10
        ? "todo"
        : "done") as IssueStage,
  pullRequest: {
    number: 1184 - i * 7,
    state: (i >= 10
      ? "merged"
      : i === 5 || i === 7
        ? "closed"
        : i % 3 === 2
          ? "draft"
          : "open") as PullRequestState,
  },
  category: categories[i],
  priority: i === 3 ? "urgent" : i === 9 ? "low" : "normal",
  points: i % 4 === 0 ? 3 : i % 2 === 0 ? 1 : 2,
  due: `2026-10-${String(20 + (i % 9)).padStart(2, "0")}`,
  assignees: [names[i % 4], ...(i % 3 ? [names[(i + 1) % 4]] : [])],
}));
