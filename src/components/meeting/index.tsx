import { useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Icon } from "@/components/icon";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuCheckboxItem,
} from "@/components/menu";
import {
  MultiSelectMenu,
  type MultiSelectOption,
} from "@/components/multi-select-menu";
import { cn } from "@/lib/cn";
export type MeetingResponseValue = "yes" | "no" | "maybe";
export type MeetingPerson = { id: string; name: string; organizer?: boolean };
export type MeetingData = {
  id: string;
  title: string;
  start: string;
  duration: number;
  attendees: MeetingPerson[];
  categories: string[];
  response: MeetingResponseValue;
  flexible: boolean;
  location: string;
};
export type MeetingTime = { id: string; label: string; start: string };
export function meetingDate(start: string, duration: number) {
  const date = new Date(start);
  if (Number.isNaN(date.getTime())) return "Date to be confirmed";
  const day = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time.format(date)} – ${time.format(new Date(date.getTime() + duration * 60000))}`;
}
export function MeetingResponse({
  value,
  onValueChange,
  disabled = false,
}: {
  value: MeetingResponseValue;
  onValueChange: (value: MeetingResponseValue) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Your response"
      className="flex flex-wrap gap-2"
    >
      {(["yes", "no", "maybe"] as const).map((response) => (
        <Button
          key={response}
          type="secondary"
          size="lg"
          tapScale={1}
          disabled={disabled}
          aria-pressed={value === response}
          className={cn(
            "min-w-20",
            value === response &&
              !disabled &&
              "ring-status-success text-status-success",
          )}
          onClick={() => onValueChange(response)}
        >
          {response[0].toUpperCase() + response.slice(1)}
        </Button>
      ))}
    </div>
  );
}
export function RescheduleSuggestions({
  suggestions,
  onSelect,
  onFindMore,
  disabled = false,
}: {
  suggestions: MeetingTime[];
  onSelect: (suggestion: MeetingTime) => void;
  onFindMore?: () => void;
  disabled?: boolean;
}) {
  return (
    <section aria-label="Reschedule suggestions">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-status-success">
        <Icon name="sparkle" size="sm" />
        Reschedule suggestions
      </h3>
      {suggestions.length ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              size="sm"
              type="tertiary"
              tapScale={1}
              disabled={disabled}
              className="rounded-full bg-state-press text-text-secondary"
              onClick={() => onSelect(suggestion)}
            >
              {suggestion.label}
            </Button>
          ))}
          {onFindMore && (
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              className="rounded-full bg-state-press"
              onClick={onFindMore}
              disabled={disabled}
            >
              Find more times
            </Button>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">No suggestions available.</p>
      )}
    </section>
  );
}
export function AttendeeCalendars({ people }: { people: MeetingPerson[] }) {
  return (
    <div className="rounded-card-small bg-bg-elevated p-3">
      <p className="mb-3 text-xs text-text-secondary">
        Sample availability · 9 am to 5 pm
      </p>
      <ul className="space-y-3">
        {people.map((person, index) => (
          <li key={person.id}>
            <div className="mb-2 flex items-center gap-2 text-xs">
              <Avatar name={person.name} size="xs" />
              <span>{person.name}</span>
              {person.organizer && (
                <span className="text-text-tertiary">Organizer</span>
              )}
            </div>
            <div
              className="grid grid-cols-8 gap-1"
              aria-label={`${person.name}: illustrative availability`}
              role="img"
            >
              {Array.from({ length: 8 }, (_, hour) => (
                <span
                  key={hour}
                  className={cn(
                    "h-3 rounded-sm",
                    (hour + index) % 3 === 0
                      ? "bg-status-success/30"
                      : "bg-state-press",
                  )}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function MeetingCard({
  meeting,
  categories,
  suggestions,
  onCategoriesChange,
  onResponseChange,
  onFlexibleChange,
  onReschedule,
  onEditCategories,
  onEdit,
  onDelete,
  onDismiss,
  onJoin,
  onFindMore,
  footer,
}: {
  meeting: MeetingData;
  categories: MultiSelectOption[];
  suggestions: MeetingTime[];
  onCategoriesChange: (value: string[]) => void;
  onResponseChange: (value: MeetingResponseValue) => void;
  onFlexibleChange: (value: boolean) => void;
  onReschedule: (suggestion: MeetingTime) => void;
  onEditCategories?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDismiss?: () => void;
  onJoin?: () => void;
  onFindMore?: () => void;
  footer?: ReactNode;
}) {
  const container = useRef<HTMLElement>(null);
  const [showCalendars, setShowCalendars] = useState(false);
  const id = useId();
  return (
    <section
      ref={container}
      aria-labelledby={id}
      className="w-full max-w-md overflow-hidden rounded-card-medium border border-border-subtle bg-bg-surface text-text-primary shadow-[var(--shadow-panel)]"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-4">
        <Button
          tapScale={1}
          disabled={!onJoin}
          onClick={onJoin}
          className="bg-status-success text-bg-base"
          leadingIcon={<Icon name="camera" size="sm" />}
        >
          Join meeting
        </Button>
        <div className="flex items-center gap-1">
          {onEdit && (
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label="Edit meeting"
              icon={<Icon name="pencil" />}
              onClick={onEdit}
            />
          )}
          {onDelete && (
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label="Delete meeting"
              icon={<Icon name="trash" />}
              onClick={onDelete}
            />
          )}
          {onDismiss && (
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label="Close meeting"
              icon={<Icon name="x" />}
              onClick={onDismiss}
            />
          )}
        </div>
      </header>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-control bg-palette-orange-bg text-palette-orange-text">
            <Icon name="calendar" />
          </span>
          <h2
            id={id}
            className="min-w-0 pt-0.5 text-xl font-semibold tracking-tight break-words"
          >
            {meeting.title}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {meetingDate(meeting.start, meeting.duration)}
        </p>
        <p className="mt-1 text-xs text-text-tertiary">{meeting.location}</p>
        <div className="mt-4 flex items-center gap-2">
          <AvatarGroup size="sm">
            {meeting.attendees.map((person) => (
              <Avatar
                key={person.id}
                name={person.name}
                size="sm"
                color={person.organizer ? "blue" : "purple"}
              />
            ))}
          </AvatarGroup>
          <span className="text-xs text-text-tertiary">
            {meeting.attendees.length} attendees
          </span>
        </div>
        <div className="my-4 h-px bg-border-subtle" />
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-card-small px-3 py-3 text-left text-sm font-medium hover:bg-state-hover"
          aria-expanded={showCalendars}
          aria-controls={`${id}-calendars`}
          onClick={() => setShowCalendars(!showCalendars)}
        >
          <Icon name="users" className="text-text-secondary" />
          <span className="flex-1">
            {showCalendars ? "Hide" : "Show"} attendees’ calendars
          </span>
          <Icon
            name={showCalendars ? "chevron-up" : "chevron-down"}
            size="sm"
            className="text-text-tertiary"
          />
        </button>
        {showCalendars && (
          <div id={`${id}-calendars`} className="mt-2">
            <AttendeeCalendars people={meeting.attendees} />
          </div>
        )}
        <div className="my-3 h-px bg-border-subtle" />
        <Menu>
          <MenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-card-small px-3 py-3 text-left text-sm font-medium hover:bg-state-hover"
              />
            }
          >
            <Icon name="gear" className="text-text-secondary" />
            <span className="flex-1">Flexibility settings</span>
            {meeting.flexible && (
              <Icon name="checks" size="sm" className="text-text-secondary" />
            )}
            <Icon
              name="chevron-right"
              size="sm"
              className="text-text-tertiary"
            />
          </MenuTrigger>
          <MenuPopup container={container}>
            <MenuCheckboxItem
              checked={meeting.flexible}
              onCheckedChange={onFlexibleChange}
              icon={<Icon name="clock-history" />}
            >
              Allow reschedule suggestions
            </MenuCheckboxItem>
          </MenuPopup>
        </Menu>
        <MultiSelectMenu
          options={categories}
          value={meeting.categories}
          onValueChange={onCategoriesChange}
          onEdit={onEditCategories}
          side="right"
          align="center"
        />
        <div className="my-4 h-px bg-border-subtle" />
        {meeting.flexible ? (
          <RescheduleSuggestions
            suggestions={suggestions}
            onSelect={onReschedule}
            onFindMore={onFindMore}
          />
        ) : (
          <p className="text-sm text-text-secondary">
            This meeting has a fixed time. Enable flexibility to see
            suggestions.
          </p>
        )}
      </div>
      <footer className="border-t border-border-subtle bg-bg-elevated px-4 py-4">
        <MeetingResponse
          value={meeting.response}
          onValueChange={onResponseChange}
        />
        {footer}
      </footer>
    </section>
  );
}
