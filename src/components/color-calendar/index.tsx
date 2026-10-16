import { useId, type CSSProperties } from "react";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import {
  CALENDAR_COLORS,
  dateLabel,
  timeLabel,
  placeEvents,
  type CalendarColor,
  type CalendarEvent,
  type CalendarSource,
} from "./model";
import "./color-calendar.css";
export * from "./model";
export function CalendarColorPicker({
  value,
  onChange,
  allowInherit = false,
  disabled = false,
  label = "Event color",
}: {
  value: CalendarColor | undefined;
  onChange: (color: CalendarColor | undefined) => void;
  allowInherit?: boolean;
  disabled?: boolean;
  label?: string;
}) {
  const name = useId();
  return (
    <fieldset className="ce-colors" disabled={disabled}>
      <legend>{label}</legend>
      {allowInherit && (
        <label className="ce-inherit">
          <input
            type="radio"
            name={name}
            checked={value === undefined}
            onChange={() => onChange(undefined)}
          />
          Use calendar color
        </label>
      )}
      <div>
        {CALENDAR_COLORS.map((color) => (
          <label
            key={color}
            data-color={color}
            className="ce-tone"
            title={color}
          >
            <input
              type="radio"
              name={name}
              aria-label={color}
              checked={value === color}
              onChange={() => onChange(color)}
            />
            <span>
              <Icon name="check" size="sm" />
            </span>
            <small>{color}</small>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function CalendarSourceList({
  sources,
  onVisibilityChange,
  onEdit,
}: {
  sources: CalendarSource[];
  onVisibilityChange: (id: string, visible: boolean) => void;
  onEdit?: (source: CalendarSource) => void;
}) {
  return (
    <ul className="ce-sources" aria-label="Calendars">
      {sources.map((source) => (
        <li key={source.id}>
          <label className="ce-tone" data-color={source.color}>
            <input
              type="checkbox"
              checked={source.visible}
              onChange={(e) => onVisibilityChange(source.id, e.target.checked)}
            />
            <span>{source.name}</span>
          </label>
          {onEdit && (
            <IconButton
              type="tertiary"
              size="sm"
              tapScale={1}
              aria-label={`Change ${source.name} color`}
              onClick={() => onEdit(source)}
              icon={<Icon name="ellipsis" size="sm" />}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
export function CalendarEventBlock({
  event,
  source,
  selected = false,
  onOpen,
  compact = false,
}: {
  event: CalendarEvent;
  source: CalendarSource;
  selected?: boolean;
  onOpen?: (event: CalendarEvent) => void;
  compact?: boolean;
}) {
  const body = (
    <>
      <strong>{event.title}</strong>
      <span>
        {event.allDay
          ? "All day"
          : `${timeLabel(event.start)} – ${timeLabel(event.end)}`}
      </span>
      <small>{source.name}</small>
    </>
  );
  const props = {
    className: `ce-event ce-tone${compact ? " ce-event-compact" : ""}`,
    "data-color": event.color ?? source.color,
    "data-selected": selected,
    "aria-label": `${event.title}, ${dateLabel(event.date)}, ${event.allDay ? "all day" : timeLabel(event.start) + " to " + timeLabel(event.end)}, ${source.name}`,
  };
  return onOpen ? (
    <button
      type="button"
      {...props}
      aria-pressed={selected}
      onClick={() => onOpen(event)}
    >
      {body}
    </button>
  ) : (
    <article {...props}>{body}</article>
  );
}
export function CalendarWeekGrid({
  dates,
  events,
  sources,
  onOpen,
  selectedId,
  loading = false,
  error,
  onRetry,
  onEmptyAction,
}: {
  dates: string[];
  events: CalendarEvent[];
  sources: CalendarSource[];
  onOpen?: (event: CalendarEvent) => void;
  selectedId?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onEmptyAction?: () => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Calendar unavailable"
        description={error}
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  if (loading && !events.length)
    return (
      <div
        className="ce-grid-skeleton"
        role="status"
        aria-label="Loading calendar"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i}>
            <i />
            <i />
            <i />
          </div>
        ))}
      </div>
    );
  const visible = events.filter(
    (e) => dates.includes(e.date) && sources.some((s) => s.id === e.sourceId),
  );
  if (!visible.length)
    return (
      <AgentWorkspaceState
        title="Nothing on this calendar"
        description="Choose another date, show a calendar or clear your search."
        actionLabel={onEmptyAction ? "Reset view" : undefined}
        onAction={onEmptyAction}
      />
    );
  const timed = visible.filter((e) => !e.allDay);
  const start = Math.min(8, ...timed.map((e) => Math.floor(e.start / 60))),
    end = Math.max(21, ...timed.map((e) => Math.ceil(e.end / 60)));
  const hours = Array.from({ length: end - start }, (_, i) => start + i);
  const style = {
    "--ce-days": dates.length,
    "--ce-hours": end - start,
  } as CSSProperties;
  return (
    <div
      className={`ce-grid-scroll${dates.length === 1 ? " ce-grid-day" : ""}`}
      role="region"
      aria-label="Calendar schedule"
      tabIndex={0}
      aria-busy={loading}
    >
      <div className="ce-grid" style={style}>
        <div className="ce-grid-head">
          <span>Demo time</span>
          {dates.map((date) => (
            <div key={date}>
              <span>{dateLabel(date, { weekday: "short" })}</span>
              <strong>{dateLabel(date, { day: "numeric" })}</strong>
            </div>
          ))}
        </div>
        <div className="ce-all-day">
          <span>All-day</span>
          {dates.map((date) => (
            <div key={date}>
              {visible
                .filter((e) => e.date === date && e.allDay)
                .map((e) => (
                  <CalendarEventBlock
                    key={e.id}
                    compact
                    event={e}
                    source={sources.find((s) => s.id === e.sourceId)!}
                    selected={selectedId === e.id}
                    onOpen={onOpen}
                  />
                ))}
            </div>
          ))}
        </div>
        <div className="ce-time-body">
          <div className="ce-time-axis">
            {hours.map((h) => (
              <span key={h}>{timeLabel(h * 60)}</span>
            ))}
          </div>
          {dates.map((date) => (
            <div
              className="ce-day-column"
              key={date}
              aria-label={dateLabel(date)}
            >
              {placeEvents(visible.filter((e) => e.date === date)).map(
                ({ event, column, columns }) => (
                  <div
                    key={event.id}
                    className="ce-event-position"
                    style={{
                      top: `${((event.start - start * 60) / 60) * 64}px`,
                      height: `${((event.end - event.start) / 60) * 64}px`,
                      left: `${(column / columns) * 100}%`,
                      width: `${100 / columns}%`,
                    }}
                  >
                    <CalendarEventBlock
                      event={event}
                      source={sources.find((s) => s.id === event.sourceId)!}
                      compact={event.end - event.start <= 30}
                      selected={selectedId === event.id}
                      onOpen={onOpen}
                    />
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
