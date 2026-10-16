import type { PaletteColor } from "@/lib/palette";
export type ActivityAction =
  | "created"
  | "completed"
  | "moved"
  | "commented"
  | "priority"
  | "assigned"
  | "attached"
  | "project";
export type ActivityEvent = {
  id: string;
  actor: { id: string; name: string; color?: PaletteColor };
  project: { id: string; name: string };
  subjectId: string;
  subject: string;
  action: ActivityAction;
  at: string;
  previous?: string;
  next?: string;
  body?: string;
  filename?: string;
};
export type ActivityFilter = "all" | "status" | "comments" | "projects";
export const ACTIVITY_FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "status", label: "Status changes" },
  { value: "comments", label: "Comments" },
  { value: "projects", label: "Projects" },
];
export const actionVerb: Record<ActivityAction, string> = {
  created: "created",
  completed: "completed",
  moved: "moved",
  commented: "commented on",
  priority: "changed priority of",
  assigned: "assigned",
  attached: "added a file to",
  project: "created project",
};
export function validEvents(events: ActivityEvent[]) {
  return (
    new Set(events.map((e) => e.id)).size === events.length &&
    events.every(
      (e) =>
        e.id &&
        e.subjectId &&
        e.subject.trim() &&
        e.actor.id &&
        e.actor.name &&
        e.project.id &&
        e.project.name &&
        Number.isFinite(Date.parse(e.at)) &&
        e.action in actionVerb,
    )
  );
}
export function filterActivity(
  events: ActivityEvent[],
  filters: {
    kind?: ActivityFilter;
    actor?: string;
    project?: string;
    query?: string;
    unreadOnly?: boolean;
    readIds?: string[];
  },
) {
  const query = (filters.query ?? "").trim().toLowerCase();
  return events
    .filter(
      (e) =>
        (!filters.actor ||
          filters.actor === "all" ||
          e.actor.id === filters.actor) &&
        (!filters.project ||
          filters.project === "all" ||
          e.project.id === filters.project) &&
        (!filters.unreadOnly || !filters.readIds?.includes(e.id)) &&
        (!filters.kind ||
          filters.kind === "all" ||
          (filters.kind === "comments"
            ? e.action === "commented"
            : filters.kind === "projects"
              ? e.action === "project"
              : ["completed", "moved", "priority", "assigned"].includes(
                  e.action,
                ))) &&
        `${e.actor.name} ${e.subject} ${e.project.name} ${e.body ?? ""} ${e.filename ?? ""}`
          .toLowerCase()
          .includes(query),
    )
    .sort(
      (a, b) => Date.parse(b.at) - Date.parse(a.at) || a.id.localeCompare(b.id),
    );
}
export function groupActivity(events: ActivityEvent[], now: string) {
  const ref = new Date(now);
  if (!Number.isFinite(+ref))
    throw new RangeError("A valid reference time is required.");
  const day = Date.UTC(
      ref.getUTCFullYear(),
      ref.getUTCMonth(),
      ref.getUTCDate(),
    ),
    week = day - ((ref.getUTCDay() + 6) % 7) * 86400000;
  const groups = new Map<string, ActivityEvent[]>();
  for (const event of [...events].sort(
    (a, b) => Date.parse(b.at) - Date.parse(a.at) || a.id.localeCompare(b.id),
  )) {
    const date = Date.parse(event.at),
      label =
        date > +ref
          ? "Upcoming"
          : date >= day
            ? "Today"
            : date >= day - 86400000
              ? "Yesterday"
              : date >= week
                ? "This week"
                : "Earlier";
    groups.set(label, [...(groups.get(label) ?? []), event]);
  }
  return [...groups].map(([label, events]) => ({ label, events }));
}
export function activityTime(at: string, now: string) {
  const seconds = Math.max(0, (Date.parse(now) - Date.parse(at)) / 1000);
  if (Date.parse(at) > Date.parse(now)) return "Scheduled";
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
export function appendComment(
  events: ActivityEvent[],
  parent: ActivityEvent,
  body: string,
  actor: ActivityEvent["actor"],
  at: string,
  id: string,
) {
  const text = body.trim();
  if (!text || text.length > 500)
    throw new RangeError("Write a comment between 1 and 500 characters.");
  if (
    events.some((e) => e.id === id) ||
    !id ||
    !Number.isFinite(Date.parse(at))
  )
    throw new RangeError(
      "A unique comment ID and valid timestamp are required.",
    );
  return [
    {
      id,
      actor,
      project: parent.project,
      subjectId: parent.subjectId,
      subject: parent.subject,
      action: "commented" as const,
      at,
      body: text,
    },
    ...events,
  ];
}
