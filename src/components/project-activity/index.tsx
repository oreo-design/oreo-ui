import { Avatar } from "@/components/avatar";
import { AgentWorkspaceState } from "@/components/automation";
import {
  actionVerb,
  activityTime,
  groupActivity,
  validEvents,
  type ActivityEvent,
} from "./model";
import "./activity.css";
export * from "./model";
export function ActivityEventRow({
  event,
  now,
  currentUserId,
  unread = false,
  selected = false,
  onOpen,
}: {
  event: ActivityEvent;
  now: string;
  currentUserId?: string;
  unread?: boolean;
  selected?: boolean;
  onOpen?: (event: ActivityEvent) => void;
}) {
  const content = (
    <>
      <span aria-hidden>
        <Avatar name={event.actor.name} color={event.actor.color} size="xs" />
      </span>
      <span className="paf-event-copy">
        <strong>
          {event.actor.id === currentUserId ? "You" : event.actor.name}
        </strong>{" "}
        <span>{actionVerb[event.action]}</span> <b>{event.subject}</b>
        {event.next && event.action !== "completed" && (
          <>
            {" "}
            <span>to</span> <b>{event.next}</b>
          </>
        )}
        {event.action !== "project" && (
          <>
            {" "}
            <span>in {event.project.name}</span>
          </>
        )}
      </span>
      <time dateTime={event.at} title={new Date(event.at).toUTCString()}>
        {activityTime(event.at, now)}
      </time>
      <span className="paf-unread" data-unread={unread || undefined}>
        <span className="sr-only">{unread ? "Unread" : "Read"}</span>
      </span>
    </>
  );
  return onOpen ? (
    <button
      type="button"
      className="paf-event"
      data-selected={selected || undefined}
      onClick={() => onOpen(event)}
    >
      {content}
    </button>
  ) : (
    <div className="paf-event">{content}</div>
  );
}
export function GroupedActivityFeed({
  events,
  now,
  currentUserId,
  readIds = [],
  selectedId,
  onOpen,
  loading = false,
  error,
  onReset,
}: {
  events: ActivityEvent[];
  now: string;
  currentUserId?: string;
  readIds?: string[];
  selectedId?: string;
  onOpen?: (event: ActivityEvent) => void;
  loading?: boolean;
  error?: string;
  onReset?: () => void;
}) {
  const valid = validEvents(events) && Number.isFinite(Date.parse(now));
  return (
    <div className="paf-feed" aria-busy={loading || undefined}>
      {error || !valid ? (
        <AgentWorkspaceState
          title="Activity unavailable"
          description={error ?? "Check event IDs, actors and timestamps."}
          error
          actionLabel={onReset ? "Try again" : undefined}
          onAction={onReset}
        />
      ) : loading && !events.length ? (
        <div className="paf-skeleton" aria-label="Loading activity">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <i />
              <span />
              <small />
            </div>
          ))}
        </div>
      ) : !events.length ? (
        <AgentWorkspaceState
          title="No activity found"
          description="No activity matches this view. Try another project or clear your filters."
          actionLabel={onReset ? "Clear filters" : undefined}
          onAction={onReset}
        />
      ) : (
        groupActivity(events, now).map((group) => (
          <section key={group.label} aria-label={group.label}>
            <h2>{group.label}</h2>
            <ol>
              {group.events.map((event) => (
                <li key={event.id}>
                  <ActivityEventRow
                    event={event}
                    now={now}
                    currentUserId={currentUserId}
                    unread={!readIds.includes(event.id)}
                    selected={event.id === selectedId}
                    onOpen={onOpen}
                  />
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
