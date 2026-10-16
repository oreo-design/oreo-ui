export type IssueComment = {
  id: string;
  author: string;
  body: string;
  date: string;
};
export type Issue = {
  id: number;
  title: string;
  author: string;
  state: "open" | "closed";
  labels: string[];
  updated: number;
  age: string;
  assignee?: string;
  milestone?: string;
  description: string;
  comments: IssueComment[];
  development?: string;
};
export type IssueSort = "updated" | "newest" | "comments";
export function filterIssues(
  issues: Issue[],
  query: string,
  state: Issue["state"],
  label: string,
  sort: IssueSort,
) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  return issues
    .filter(
      (i) =>
        i.state === state &&
        (!label || i.labels.includes(label)) &&
        `${i.id} ${i.title} ${i.author} ${i.labels.join(" ")}`
          .toLowerCase()
          .includes(q),
    )
    .sort(
      (a, b) =>
        (sort === "comments"
          ? b.comments.length - a.comments.length
          : sort === "newest"
            ? b.id - a.id
            : b.updated - a.updated) || b.id - a.id,
    );
}
/** Bounded movement follows the visible, already sorted queue. */
export function adjacentIssue(
  issues: Issue[],
  selected: number | null,
  direction: -1 | 1,
) {
  if (!issues.length) return null;
  const index = issues.findIndex((i) => i.id === selected);
  if (index < 0) return direction === 1 ? issues[0].id : issues.at(-1)!.id;
  return issues[Math.max(0, Math.min(issues.length - 1, index + direction))].id;
}
export function appendComment(
  issues: Issue[],
  id: number,
  body: string,
  commentId: string,
  now: number,
) {
  if (!body.trim()) return issues;
  return issues.map((i) =>
    i.id === id
      ? {
          ...i,
          updated: now,
          age: "now",
          comments: [
            ...i.comments,
            {
              id: commentId,
              author: "You",
              body: body.trim(),
              date: "Just now",
            },
          ],
        }
      : i,
  );
}
