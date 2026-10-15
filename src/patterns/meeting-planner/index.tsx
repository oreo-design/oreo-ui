import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  MeetingCard,
  meetingDate,
  type MeetingData,
  type MeetingTime,
} from "@/components/meeting";
import { DocumentEmpty } from "@/components/document-activity";
import { cn } from "@/lib/cn";
import { initialMeetings, meetingCategories, meetingSuggestions } from "./data";
import "./meeting-planner.css";
type Dialog = "edit" | "categories" | "delete" | "join" | "reschedule" | null;
export function MeetingPlanner({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selected, setSelected] = useState<string | null>("design");
  const [categories, setCategories] = useState(meetingCategories);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editDuration, setEditDuration] = useState(60);
  const [candidate, setCandidate] = useState<MeetingTime | null>(null);
  const [deleted, setDeleted] = useState<MeetingData | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const cardFocus = useRef<HTMLDivElement>(null);
  const meeting = meetings.find((item) => item.id === selected);
  const filtered = meetings
    .filter((item) =>
      `${item.title} ${item.attendees.map((person) => person.name).join(" ")} ${item.categories.map((id) => categories.find((category) => category.value === id)?.label).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => a.start.localeCompare(b.start));
  const update = (changes: Partial<MeetingData>) =>
    setMeetings((items) =>
      items.map((item) =>
        item.id === selected ? { ...item, ...changes } : item,
      ),
    );
  const launch = (kind: Dialog) => {
    previousFocus.current = document.activeElement as HTMLElement;
    setError("");
    if (meeting) {
      setEditTitle(meeting.title);
      setEditStart(meeting.start);
      setEditDuration(meeting.duration);
    }
    setDialog(kind);
  };
  const close = () => {
    modal.current?.close();
    setDialog(null);
    setError("");
    const focus = previousFocus.current;
    requestAnimationFrame(() => {
      if (focus?.isConnected) focus.focus();
      else cardFocus.current?.focus();
    });
  };
  useEffect(() => {
    if (dialog && !modal.current?.open) modal.current?.showModal();
  }, [dialog]);
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!editTitle.trim()) {
      setError("Give this meeting a name.");
      return;
    }
    if (!editStart || Number.isNaN(new Date(editStart).getTime())) {
      setError("Choose a valid meeting date and time.");
      return;
    }
    if (
      !Number.isFinite(editDuration) ||
      editDuration < 15 ||
      editDuration > 480
    ) {
      setError("Choose a duration between 15 and 480 minutes.");
      return;
    }
    update({
      title: editTitle.trim(),
      start: editStart,
      duration: editDuration,
    });
    setNotice("Meeting updated in this demo.");
    close();
  };
  const addCategory = (event: FormEvent) => {
    event.preventDefault();
    const label = categoryName.trim();
    if (!label) {
      setError("Enter a category name.");
      return;
    }
    if (
      categories.some(
        (category) => category.label.toLowerCase() === label.toLowerCase(),
      )
    ) {
      setError("That category already exists. Choose another name.");
      return;
    }
    setCategories((items) => [
      ...items,
      { value: crypto.randomUUID(), label, icon: "hash" },
    ]);
    setCategoryName("");
    setError("");
  };
  return (
    <div className="meeting-planner min-h-dvh bg-bg-elevated text-text-primary">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6">
        <a
          href="/meeting-components?view=docs"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <span className="grid size-8 place-items-center rounded-control bg-bg-inverse text-text-on-inverse">
            <Icon name="calendar" size="sm" />
          </span>
          Oreo Calendar
        </a>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary">Local demo</span>
          <a
            href="/meeting-components?view=docs"
            className="text-xs text-text-secondary hover:underline"
          >
            Explore components ↗
          </a>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={onToggleTheme}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-8">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">
            A little more room in your day
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Meetings, thoughtfully arranged.
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-text-secondary">
            Keep the right people, the right context, and a little flexibility.
            Select a meeting to make it yours.
          </p>
        </div>
        <div className="meeting-planner-grid">
          <aside aria-label="Upcoming meetings" className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Upcoming</h2>
              <span className="text-xs text-text-tertiary">
                {meetings.length} events
              </span>
            </div>
            <label className="mb-4 flex items-center gap-2 rounded-control border border-border-default bg-bg-base px-3 py-2 text-text-secondary">
              <Icon name="search" size="sm" />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                type="search"
                aria-label="Find a meeting"
                placeholder="Find a meeting…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            {filtered.length ? (
              <ul className="space-y-2">
                {filtered.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={selected === item.id}
                      className={cn(
                        "w-full rounded-card-small border p-4 text-left",
                        selected === item.id
                          ? "border-border-default bg-bg-base shadow-[var(--shadow-default)]"
                          : "border-transparent hover:bg-state-hover",
                      )}
                      onClick={() => {
                        setSelected(item.id);
                        setNotice("");
                      }}
                    >
                      <span className="mb-2 block text-xs text-text-tertiary">
                        {meetingDate(item.start, item.duration)}
                      </span>
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {item.categories.map((id) => {
                          const category = categories.find(
                            (c) => c.value === id,
                          );
                          return (
                            category && (
                              <span
                                key={id}
                                className="rounded-full bg-state-press px-2 py-0.5 text-xs text-text-secondary"
                              >
                                {category.label}
                              </span>
                            )
                          );
                        })}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <DocumentEmpty
                title="No meetings found"
                description="Try a name or a meeting category."
                onReset={query ? () => setQuery("") : undefined}
              />
            )}
            {deleted && (
              <div
                role="status"
                className="mt-4 rounded-card-small border border-border-subtle bg-bg-base p-3 text-sm"
              >
                <p className="mb-3 text-text-secondary">
                  “{deleted.title}” was removed.
                </p>
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={() => {
                    setMeetings((items) => [...items, deleted]);
                    setSelected(deleted.id);
                    setDeleted(null);
                    setNotice("Meeting restored.");
                  }}
                >
                  Undo delete
                </Button>
              </div>
            )}
            <p className="mt-8 text-xs leading-5 text-text-tertiary">
              Sample calendar, June 2026. Changes stay in this tab and reset on
              reload. No invites or calendar updates are sent.
            </p>
          </aside>
          <div ref={cardFocus} tabIndex={-1} className="min-w-0 outline-none">
            <p
              role="status"
              className={
                notice
                  ? "mb-4 max-w-md rounded-control bg-status-success/10 px-3 py-2 text-sm text-text-secondary"
                  : "sr-only"
              }
            >
              {notice}
            </p>
            {meeting ? (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                categories={categories}
                suggestions={meetingSuggestions.filter(
                  (suggestion) => suggestion.start !== meeting.start,
                )}
                onCategoriesChange={(value) => update({ categories: value })}
                onResponseChange={(value) => {
                  update({ response: value });
                  setNotice(`Your response is ${value}. Saved locally.`);
                }}
                onFlexibleChange={(value) => update({ flexible: value })}
                onReschedule={(suggestion) => {
                  setCandidate(suggestion);
                  launch("reschedule");
                }}
                onEditCategories={() => launch("categories")}
                onEdit={() => launch("edit")}
                onDelete={() => launch("delete")}
                onDismiss={() => { setSelected(null); setNotice(""); }}
                onJoin={() => launch("join")}
                onFindMore={() => launch("edit")}
              />
            ) : (
              <div className="max-w-md rounded-card-medium border border-border-subtle bg-bg-base">
                <DocumentEmpty
                  title="Choose a meeting"
                  description="Select an event from Upcoming to see its details."
                />
              </div>
            )}
          </div>
        </div>
      </main>
      {dialog && (
        <dialog
          ref={modal}
          aria-labelledby="meeting-dialog-title"
          className="meeting-dialog m-auto rounded-card-medium border border-border-default bg-bg-base p-6 text-text-primary shadow-[var(--shadow-overlay)]"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <header className="mb-5 flex items-center justify-between gap-4">
            <h2 id="meeting-dialog-title" className="text-lg font-semibold">
              {dialog === "edit"
                ? "Edit meeting"
                : dialog === "categories"
                  ? "Meeting categories"
                  : dialog === "delete"
                    ? "Delete this meeting?"
                    : dialog === "join"
                      ? "Ready when you are"
                      : "Reschedule meeting?"}
            </h2>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label="Close dialog"
              icon={<Icon name="x" />}
              onClick={close}
            />
          </header>
          {dialog === "edit" && (
            <form onSubmit={save} noValidate className="space-y-4">
              <label className="block text-sm">
                Meeting name
                <input
                  className="meeting-input mt-2"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  maxLength={100}
                  autoFocus
                />
              </label>
              <label className="block text-sm">
                Starts at
                <input
                  className="meeting-input mt-2"
                  type="datetime-local"
                  value={editStart}
                  onChange={(event) => setEditStart(event.target.value)}
                />
              </label>
              <label className="block text-sm">
                Duration in minutes
                <input
                  className="meeting-input mt-2"
                  type="number"
                  min={15}
                  max={480}
                  value={editDuration}
                  onChange={(event) =>
                    setEditDuration(event.target.valueAsNumber)
                  }
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-status-error">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button type="secondary" tapScale={1} onClick={close}>
                  Cancel
                </Button>
                <Button tapScale={1} render={<button type="submit" />}>
                  Save changes
                </Button>
              </div>
            </form>
          )}
          {dialog === "categories" && (
            <>
              <p className="mb-4 text-sm leading-6 text-text-secondary">
                Categories are shared by the meetings in this local demo.
              </p>
              <ul className="mb-5 max-h-56 space-y-1 overflow-y-auto">
                {categories.map((category) => (
                  <li
                    key={category.value}
                    className="flex items-center gap-3 rounded-control px-2 py-2"
                  >
                    <Icon
                      name={category.icon ?? "hash"}
                      size="sm"
                      className="text-text-secondary"
                    />
                    <span className="min-w-0 flex-1 break-words text-sm">
                      {category.label}
                    </span>
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      size="sm"
                      aria-label={`Remove ${category.label}`}
                      icon={<Icon name="x" />}
                      onClick={() => {
                        setCategories((items) =>
                          items.filter((item) => item.value !== category.value),
                        );
                        setMeetings((items) =>
                          items.map((item) => ({
                            ...item,
                            categories: item.categories.filter(
                              (id) => id !== category.value,
                            ),
                          })),
                        );
                      }}
                    />
                  </li>
                ))}
              </ul>
              <form onSubmit={addCategory} className="space-y-3" noValidate>
                <label className="block text-sm">
                  New category
                  <input
                    className="meeting-input mt-2"
                    placeholder="e.g. Design critique"
                    maxLength={40}
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                  />
                </label>
                {error && (
                  <p role="alert" className="text-sm text-status-error">
                    {error}
                  </p>
                )}
                <div className="flex justify-between gap-3">
                  <Button
                    type="secondary"
                    tapScale={1}
                    render={<button type="submit" />}
                  >
                    Add category
                  </Button>
                  <Button tapScale={1} onClick={close}>
                    Done
                  </Button>
                </div>
              </form>
            </>
          )}
          {dialog === "delete" && (
            <>
              <p className="mb-6 text-sm leading-6 text-text-secondary">
                Remove “{meeting?.title}” from this demo? You can undo this
                after deleting.
              </p>
              <div className="flex justify-end gap-2">
                <Button type="secondary" tapScale={1} onClick={close}>
                  Keep meeting
                </Button>
                <Button
                  danger
                  tapScale={1}
                  onClick={() => {
                    if (!meeting) return;
                    setDeleted(meeting);
                    setMeetings((items) =>
                      items.filter((item) => item.id !== meeting.id),
                    );
                    setSelected(null);
                    setNotice("");
                    close();
                  }}
                >
                  Delete meeting
                </Button>
              </div>
            </>
          )}
          {dialog === "join" && (
            <>
              <div className="mb-6 rounded-card-small bg-bg-elevated p-5">
                <Icon name="camera" className="mb-3 text-text-secondary" />
                <p className="font-medium">{meeting?.title}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  This demo is not connected to a video service. In your app,
                  connect the Join action to the meeting’s own URL.
                </p>
              </div>
              <Button tapScale={1} onClick={close}>
                Back to meeting
              </Button>
            </>
          )}
          {dialog === "reschedule" && candidate && (
            <>
              <p className="mb-2 text-sm text-text-secondary">
                Move “{meeting?.title}” to:
              </p>
              <p className="mb-6 font-medium">
                {meetingDate(candidate.start, meeting?.duration ?? 60)}
              </p>
              <div className="flex justify-end gap-2">
                <Button type="secondary" tapScale={1} onClick={close}>
                  Keep current time
                </Button>
                <Button
                  tapScale={1}
                  onClick={() => {
                    update({ start: candidate.start });
                    setNotice(
                      "Meeting rescheduled locally. No invitations were sent.",
                    );
                    close();
                  }}
                >
                  Confirm new time
                </Button>
              </div>
            </>
          )}
        </dialog>
      )}
    </div>
  );
}
