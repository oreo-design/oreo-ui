import { useId, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/cn";
import "./studio-inbox.css";

export const INBOX_FILTERS = [
  "All",
  "Mentions",
  "Comments",
  "Approvals",
  "Versions",
  "Releases",
] as const;
export type InboxFilter = (typeof INBOX_FILTERS)[number];
export type InboxItem = {
  id: string;
  author: string;
  action: string;
  preview: string;
  project: string;
  category: Exclude<InboxFilter, "All"> | "Tasks";
  time: string;
  day: "Today" | "Yesterday";
  unread: boolean;
};
/** A controlled notification button; opening/marking read belongs to the consumer. */
export function InboxNotification({
  item,
  selected = false,
  onSelect,
}: {
  item: InboxItem;
  selected?: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn("si-notification", selected && "si-selected")}
      aria-pressed={selected}
      onClick={() => onSelect(item.id)}
    >
      <span
        className={cn("si-unread", item.unread && "si-is-unread")}
        aria-hidden
      />
      <Avatar name={item.author} size="sm" color="brown" />
      <span className="min-w-0 flex-1 text-left">
        <span className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 truncate">
            <strong className="font-medium">{item.author}</strong>
          </span>
          <span className="shrink-0 text-xs text-text-tertiary">
            {item.time}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-text-tertiary">
          {item.action}
          {item.unread && <span className="sr-only"> · Unread</span>}
        </span>
        <span className="mt-1.5 block truncate text-sm text-text-secondary">
          {item.preview}
        </span>
        <span className="mt-1 block truncate text-xs text-text-tertiary">
          {item.project}
        </span>
      </span>
    </button>
  );
}
export function InboxGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="si-group">
      <h3
        id={id}
        className="mb-2 flex items-center gap-2 rounded-control bg-bg-elevated px-3 py-2 text-xs font-medium"
      >
        {title}
        <span className="font-normal text-text-tertiary">{count}</span>
      </h3>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
/** Filter buttons, rather than navigation tabs: each updates the same result list. */
export function InboxFilters({
  value,
  onChange,
}: {
  value: InboxFilter;
  onChange: (filter: InboxFilter) => void;
}) {
  return (
    <div role="group" aria-label="Notification type" className="si-filters">
      {INBOX_FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
          className={cn(
            "rounded-control px-3 py-2 text-sm",
            value === filter
              ? "bg-state-press text-text-primary"
              : "text-text-secondary",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
