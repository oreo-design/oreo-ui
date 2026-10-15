import { useId, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { ActivityCard } from "@/components/activity";
import { cn } from "@/lib/cn";

export const DOCUMENT_ACTIONS = [
  "Uploads",
  "Edits",
  "Shares",
  "Comments",
  "Access",
] as const;
export type DocumentAction = (typeof DOCUMENT_ACTIONS)[number];
const actionIcons: Record<DocumentAction, IconName> = {
  Uploads: "arrow-up",
  Edits: "pencil",
  Shares: "arrow-up-right",
  Comments: "chat",
  Access: "lock",
};
export type DocumentEvent = {
  id: string;
  actor: string;
  action: DocumentAction;
  verb: string;
  target: string;
  location: string;
  time: string;
  dateTime: string;
  detail?: ReactNode;
};

export function DocumentEmpty({
  title = "No activity found",
  description = "Try another folder or clear your filters.",
  onReset,
}: {
  title?: string;
  description?: string;
  onReset?: () => void;
}) {
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <span className="rounded-full bg-bg-surface p-3 text-text-secondary">
        <Icon name="folder" />
      </span>
      <h3 className="font-medium">{title}</h3>
      <p className="max-w-xs text-sm text-text-secondary">{description}</p>
      {onReset && (
        <Button type="secondary" onClick={onReset} tapScale={1}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
export function DocumentTimeline({
  events,
  label = "Today",
  empty,
}: {
  events: DocumentEvent[];
  label?: string;
  empty?: ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id}>
      <div className="mb-6 flex items-center gap-4">
        <h2
          id={id}
          className="text-xs font-medium uppercase tracking-wide text-text-tertiary"
        >
          {label}
        </h2>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>
      {events.length ? (
        <ol>
          {events.map((event, index) => (
            <li key={event.id} className="relative flex gap-4 pb-7">
              {index < events.length - 1 && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-4 top-9 w-px bg-border-subtle"
                />
              )}
              <span className="relative h-fit shrink-0">
                <Avatar name={event.actor} size="sm" />
                <span className="absolute -bottom-1 -right-1 rounded-full border border-bg-base bg-bg-surface p-0.5 text-text-secondary">
                  <Icon name={actionIcons[event.action]} size="sm" className="size-3" />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 sm:text-base">
                  <strong className="font-semibold">{event.actor}</strong>{" "}
                  <span className="text-text-secondary">{event.verb}</span>{" "}
                  <strong className="font-medium break-words">
                    {event.target}
                  </strong>
                </p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {event.location} ·{" "}
                  <time dateTime={event.dateTime}>{event.time}</time>
                </p>
                {event.detail && <div className="mt-3">{event.detail}</div>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        (empty ?? <DocumentEmpty />)
      )}
    </section>
  );
}
export type DocumentPhoto = { src: string; alt: string };
export function DocumentPhotoStrip({
  photos,
  total = photos.length,
  onOpen,
}: {
  photos: DocumentPhoto[];
  total?: number;
  onOpen?: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {photos.slice(0, 5).map((photo, index) => {
        const overflow = index === 4 && total > 5;
        const content = (
          <>
            <img
              src={photo.src}
              alt={onOpen ? "" : photo.alt}
              className="size-full object-cover"
            />
            {overflow && (
              <span className="absolute inset-0 flex items-center justify-center bg-code-bg/70 font-medium text-code-fg">
                +{total - 4}
              </span>
            )}
          </>
        );
        return onOpen ? (
          <button
            key={photo.src}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={
              overflow ? `View all ${total} photos` : `View ${photo.alt}`
            }
            className="relative size-16 overflow-hidden rounded-card-small bg-bg-surface sm:size-18"
          >
            {content}
          </button>
        ) : (
          <span
            key={photo.src}
            className="relative size-16 overflow-hidden rounded-card-small bg-bg-surface sm:size-18"
          >
            {content}
          </span>
        );
      })}
    </div>
  );
}
export function FileChangeCard({
  description,
  version,
  onOpen,
}: {
  description: string;
  version: string;
  onOpen?: () => void;
}) {
  const content = (
    <>
      <span className="text-text-secondary">
        <Icon name="scan-text" size="sm" />
      </span>
      <span className="min-w-0 flex-1 break-words">{description}</span>
      <span className="text-xs text-text-tertiary">{version}</span>
    </>
  );
  const className =
    "flex w-full max-w-md items-center gap-3 rounded-card-small bg-bg-elevated px-4 py-3 text-left text-sm";
  return onOpen ? (
    <button type="button" className={className} onClick={onOpen}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
export type AccessDecision = "pending" | "approved" | "declined";
export function DocumentAccessRequest({
  status = "pending",
  onDecision,
  onUndo,
}: {
  status?: AccessDecision;
  onDecision: (decision: "approved" | "declined") => void;
  onUndo?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card-small bg-bg-elevated p-3">
      <span className="text-text-secondary">
        <Icon name={status === "approved" ? "check" : "lock"} size="sm" />
      </span>
      <p
        role="status"
        className="min-w-40 flex-1 text-xs leading-5 text-text-secondary"
      >
        {status === "pending"
          ? "Needs owner approval for a private folder"
          : status === "approved"
            ? "Access approved · Can view"
            : "Access request declined"}
      </p>
      {status === "pending" ? (
        <div className="flex gap-2">
          <Button
            type="tertiary"
            tapScale={1}
            onClick={() => onDecision("declined")}
          >
            Decline
          </Button>
          <Button tapScale={1} onClick={() => onDecision("approved")}>
            Approve
          </Button>
        </div>
      ) : (
        onUndo && (
          <Button type="tertiary" tapScale={1} onClick={onUndo}>
            Undo
          </Button>
        )
      )}
    </div>
  );
}
export function DocumentSummary({
  metrics,
  period = "This week",
}: {
  metrics: {
    label: string;
    value: number;
    change?: string;
    positive?: boolean;
  }[];
  period?: string;
}) {
  return (
    <ActivityCard title={period}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-xs text-text-secondary">{metric.label}</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-2xl font-medium tabular-nums">
                {metric.value}
              </span>
              {metric.change && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    metric.positive
                      ? "bg-status-success/10 text-status-success"
                      : "bg-state-press text-text-secondary",
                  )}
                >
                  {metric.change}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </ActivityCard>
  );
}
export function MemberActivity({
  members,
}: {
  members: { name: string; count: number }[];
}) {
  const max = Math.max(1, ...members.map((member) => member.count));
  return (
    <ActivityCard title="Most active">
      {members.length ? (
        <ol className="space-y-4">
          {[...members]
            .sort((a, b) => b.count - a.count)
            .map((member) => (
              <li key={member.name}>
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <Avatar name={member.name} size="xs" />
                  <span className="flex-1 truncate">{member.name}</span>
                  <span className="text-xs tabular-nums text-text-secondary">
                    {member.count}
                  </span>
                </div>
                <div
                  aria-hidden
                  className="h-1 overflow-hidden rounded-full bg-state-press"
                >
                  <div
                    className="h-full rounded-full bg-status-progress"
                    style={{
                      width: `${(Math.max(0, member.count) / max) * 100}%`,
                    }}
                  />
                </div>
              </li>
            ))}
        </ol>
      ) : (
        <p className="text-sm text-text-secondary">No member activity yet.</p>
      )}
    </ActivityCard>
  );
}
export type StorageSegment = {
  label: string;
  value: number;
  tone: "photos" | "documents" | "video";
};
const storageColors = {
  photos: "bg-status-progress",
  documents: "bg-palette-purple-text",
  video: "bg-palette-orange-text",
};
export function DocumentStorage({
  segments,
  capacity,
}: {
  segments: StorageSegment[];
  capacity: number;
}) {
  const safe = segments.map((segment) => ({
    ...segment,
    value: Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0,
  }));
  const used = safe.reduce((sum, segment) => sum + segment.value, 0);
  const valid = Number.isFinite(capacity) && capacity > 0;
  const denominator = Math.max(used, valid ? capacity : 1);
  return (
    <ActivityCard title="Storage">
      <p className="-mt-3 mb-4 text-xs text-text-secondary">
        {valid
          ? `${Number(used.toFixed(1))} of ${capacity} GB${used > capacity ? " · Over capacity" : ""}`
          : "Capacity not set"}
      </p>
      <div
        role="meter"
        aria-label="Storage used"
        aria-valuemin={0}
        aria-valuemax={valid ? capacity : 1}
        aria-valuenow={valid ? Math.min(used, capacity) : 0}
        aria-valuetext={
          valid ? `${used} of ${capacity} GB` : "Capacity not set"
        }
        className="flex h-2 overflow-hidden rounded-full bg-state-press"
      >
        {safe.map((segment) => (
          <span
            key={segment.label}
            className={cn(
              "h-full border-r border-bg-surface",
              storageColors[segment.tone],
            )}
            style={{ width: `${(segment.value / denominator) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
        {safe.map((segment) => (
          <li key={segment.label} className="flex items-center gap-1.5">
            <span
              className={cn("size-2 rounded-full", storageColors[segment.tone])}
            />
            {segment.label}
          </li>
        ))}
      </ul>
    </ActivityCard>
  );
}
