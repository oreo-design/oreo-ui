export type IssueStage = "review" | "progress" | "todo" | "done";
export type PullRequestState = "open" | "draft" | "closed" | "merged";
export type AdaptiveIssue = {
  id: number;
  title: string;
  status: IssueStage;
  pullRequest: { number: number; state: PullRequestState };
  category: string;
  priority: "urgent" | "normal" | "low";
  points: number;
  due: string;
  assignees: string[];
};
export const ISSUE_STAGES: IssueStage[] = [
  "review",
  "progress",
  "todo",
  "done",
];
export const ISSUE_STAGE_LABELS: Record<IssueStage, string> = {
  review: "In review",
  progress: "In progress",
  todo: "To do",
  done: "Done",
};
export const WIDTH_STOPS = [360, 640, 840, 1120] as const;
export function fitWidth(value: number, available: number) {
  const max = Math.max(0, Number.isFinite(available) ? available : 0);
  return Math.round(
    Math.min(
      max,
      Math.max(Math.min(320, max), Number.isFinite(value) ? value : max),
    ),
  );
}
export function snapWidth(value: number, available: number) {
  const fitted = fitWidth(value, available);
  const nearest = [...WIDTH_STOPS, available]
    .map((n) => fitWidth(n, available))
    .sort((a, b) => Math.abs(a - fitted) - Math.abs(b - fitted))[0];
  return Math.abs(nearest - fitted) <= 18 ? nearest : fitted;
}
export function matchingIssues(
  issues: readonly AdaptiveIssue[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  return issues.filter((i) =>
    [i.title, i.id, i.pullRequest.number, i.category, ...i.assignees]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
