import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import {
  CalendarSourceList,
  CalendarWeekGrid,
  CalendarColorPicker,
  CalendarEventBlock,
  DEMO_DATE,
  addDays,
  weekDates,
  dateLabel,
  timeValue,
  parseTime,
  validateEvent,
  filterEvents,
  type CalendarEvent,
  type CalendarSource,
} from "@/components/color-calendar";
import { INITIAL_EVENTS, INITIAL_SOURCES } from "./data";
import "./color-calendar.css";
type Snapshot = { events: CalendarEvent[]; sources: CalendarSource[] };
export function ColorCalendarPage() {
  const [data, setData] = useState<Snapshot>({
      events: INITIAL_EVENTS,
      sources: INITIAL_SOURCES,
    }),
    [undo, setUndo] = useState<Snapshot | null>(null),
    [selectedDate, setSelectedDate] = useState(DEMO_DATE),
    [view, setView] = useState<"week" | "day">(() =>
      window.matchMedia("(max-width:700px)").matches ? "day" : "week",
    ),
    [weekends, setWeekends] = useState(false),
    [query, setQuery] = useState(""),
    [dark, setDark] = useState(false),
    [notice, setNotice] = useState(""),
    [mode, setMode] = useState<"event" | "source" | "delete" | null>(null),
    [draft, setDraft] = useState<CalendarEvent | null>(null),
    [sourceDraft, setSourceDraft] = useState<CalendarSource | null>(null),
    [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null),
    title = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const dates =
    view === "day" ? [selectedDate] : weekDates(selectedDate, weekends ? 7 : 5);
  const visible = filterEvents(data.events, data.sources, dates, query);
  const monthFirst = selectedDate.slice(0, 8) + "01",
    monthGrid = weekDates(monthFirst)[0];
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(monthGrid, i));
  const isExisting = !!draft && data.events.some((e) => e.id === draft.id);
  function close() {
    setMode(null);
    setError("");
  }
  function begin() {
    trigger.current = document.activeElement as HTMLElement;
    setError("");
  }
  function edit(event: CalendarEvent) {
    begin();
    setDraft({ ...event });
    setMode("event");
  }
  function create() {
    begin();
    setDraft({
      id: crypto.randomUUID(),
      title: "",
      date: selectedDate,
      start: 600,
      end: 660,
      sourceId: data.sources.find((s) => s.visible)?.id ?? data.sources[0].id,
      location: "",
    });
    setMode("event");
  }
  function change(next: Snapshot, message: string) {
    setUndo(data);
    setData(next);
    setNotice(message);
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const invalid = validateEvent(draft, data.sources);
    if (invalid) {
      setError(invalid);
      return;
    }
    const value = {
      ...draft,
      title: draft.title.trim(),
      location: draft.location?.trim(),
      start: draft.allDay ? 0 : draft.start,
      end: draft.allDay ? 1440 : draft.end,
    };
    change(
      {
        ...data,
        events: isExisting
          ? data.events.map((e) => (e.id === value.id ? value : e))
          : [...data.events, value],
      },
      "Event saved locally.",
    );
    setSelectedDate(value.date);
    if (new Date(value.date + "T12:00:00Z").getUTCDay() % 6 === 0)
      setWeekends(true);
    close();
  }
  function reset() {
    setQuery("");
    setSelectedDate(DEMO_DATE);
    setData((d) => ({
      ...d,
      sources: d.sources.map((s) => ({ ...s, visible: true })),
    }));
    setNotice("Showing the demo week and all calendars.");
  }
  function moveMonth(n: number) {
    const d = new Date(monthFirst + "T12:00:00Z");
    d.setUTCMonth(d.getUTCMonth() + n);
    setSelectedDate(d.toISOString().slice(0, 10));
  }
  function exportVisible() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            demo: true,
            timeBasis: "Fixed wall-clock demo time; no timezone conversion",
            dates,
            query,
            events: visible,
            sources: data.sources.filter((s) => s.visible),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-calendar.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${visible.length} visible events.`);
  }
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="cl-root">
        <aside className="cl-sidebar">
          <a className="cl-brand" href="/calendar-week-grid">
            <OreoLogo className="h-5 w-8" />
            Oreo Calendar
          </a>
          <div className="cl-month-heading">
            <strong>
              {dateLabel(selectedDate, { month: "long", year: "numeric" })}
            </strong>
            <IconButton
              type="tertiary"
              size="sm"
              tapScale={1}
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
              icon={<Icon name="chevron-left" size="sm" />}
            />
            <IconButton
              type="tertiary"
              size="sm"
              tapScale={1}
              aria-label="Next month"
              onClick={() => moveMonth(1)}
              icon={<Icon name="chevron-right" size="sm" />}
            />
          </div>
          <div className="cl-mini-month" aria-label="Choose a day">
            {["M", "T", "W", "T", "F", "S", "S"].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
            {monthDays.map((date) => (
              <button
                key={date}
                type="button"
                data-outside={date.slice(0, 7) !== selectedDate.slice(0, 7)}
                aria-label={dateLabel(date, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                aria-pressed={selectedDate === date}
                data-in-week={dates.includes(date)}
                onClick={() => {
                  setSelectedDate(date);
                  if (new Date(date + "T12:00:00Z").getUTCDay() % 6 === 0)
                    setWeekends(true);
                }}
              >
                {Number(date.slice(8))}
              </button>
            ))}
          </div>
          <div className="cl-sources-heading">
            <h2>My calendars</h2>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  sources: d.sources.map((s) => ({ ...s, visible: true })),
                }))
              }
            >
              Show all
            </Button>
          </div>
          <CalendarSourceList
            sources={data.sources}
            onVisibilityChange={(id, visible) =>
              setData((d) => ({
                ...d,
                sources: d.sources.map((s) =>
                  s.id === id ? { ...s, visible } : s,
                ),
              }))
            }
            onEdit={(source) => {
              begin();
              setSourceDraft({ ...source });
              setMode("source");
            }}
          />
          <p className="cl-hint">A color for every part of your day.</p>
          <div className="cl-sidebar-foot">
            <span>Local demo</span>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
          </div>
        </aside>
        <main className="cl-main">
          <header className="cl-toolbar">
            <div>
              <h1 ref={title} tabIndex={-1}>
                {dateLabel(selectedDate, { month: "long", year: "numeric" })}
              </h1>
              <p>
                {view === "week"
                  ? `${dateLabel(dates[0])} – ${dateLabel(dates[dates.length - 1])}`
                  : dateLabel(selectedDate)}{" "}
                · Demo time
              </p>
            </div>
            <div className="cl-toolbar-actions">
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => setSelectedDate(DEMO_DATE)}
              >
                Demo today
              </Button>
              <IconButton
                type="tertiary"
                tapScale={1}
                aria-label={view === "week" ? "Previous week" : "Previous day"}
                onClick={() =>
                  setSelectedDate((d) => addDays(d, view === "week" ? -7 : -1))
                }
                icon={<Icon name="chevron-left" />}
              />
              <IconButton
                type="tertiary"
                tapScale={1}
                aria-label={view === "week" ? "Next week" : "Next day"}
                onClick={() =>
                  setSelectedDate((d) => addDays(d, view === "week" ? 7 : 1))
                }
                icon={<Icon name="chevron-right" />}
              />
              <label>
                <span className="sr-only">Calendar view</span>
                <select
                  value={view}
                  onChange={(e) => setView(e.target.value as "week" | "day")}
                >
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                </select>
              </label>
              <Button
                tapScale={1}
                leadingIcon={<Icon name="plus" size="sm" />}
                onClick={create}
              >
                New event
              </Button>
            </div>
          </header>
          <div className="cl-filters">
            <label className="cl-search">
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search events"
                placeholder="Search events…"
                value={query}
                maxLength={100}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span>{visible.length} events</span>
            {view === "week" && (
              <label className="cl-weekends">
                <input
                  type="checkbox"
                  checked={weekends}
                  onChange={(e) => setWeekends(e.target.checked)}
                />
                Weekends
              </label>
            )}
            <Button
              type="tertiary"
              tapScale={1}
              size="sm"
              onClick={exportVisible}
            >
              Export
            </Button>
          </div>
          <CalendarWeekGrid
            dates={dates}
            events={visible}
            sources={data.sources}
            onOpen={edit}
            onEmptyAction={reset}
          />
          <div className="cl-notice">
            <p role="status">
              {notice || "Select any event to edit its details or color."}
            </p>
            {undo && (
              <Button
                type="tertiary"
                tapScale={1}
                onClick={() => {
                  setData(undo);
                  setUndo(null);
                  setNotice("Last change undone.");
                }}
              >
                Undo last change
              </Button>
            )}
          </div>
          <footer className="cl-footer">
            <span>
              Fictional October 2026 calendar · Changes reset on reload. No
              invites are sent.
            </span>
            <a href="/calendar-week-grid?view=docs">Explore components ↗</a>
          </footer>
        </main>
        <Dialog.Root
          open={mode !== null}
          onOpenChange={(open) => {
            if (!open) close();
          }}
        >
          <Dialog.Portal container={root}>
            <Dialog.Backdrop className="cl-backdrop" />
            <Dialog.Popup
              className="cl-dialog"
              finalFocus={() =>
                trigger.current?.isConnected ? trigger.current : title.current
              }
            >
              <div className="cl-dialog-heading">
                <Dialog.Title>
                  {mode === "source"
                    ? `${sourceDraft?.name} calendar`
                    : mode === "delete"
                      ? "Delete this event?"
                      : isExisting
                        ? "Edit event"
                        : "New event"}
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      aria-label="Close dialog"
                      icon={<Icon name="x" />}
                    />
                  }
                />
              </div>
              <Dialog.Description>
                {mode === "source"
                  ? "Changes apply to events that use the calendar color. Individual overrides stay the same."
                  : mode === "delete"
                    ? "This removes only the selected local event. You can undo the deletion."
                    : "Keep a little room in your day. This is a local calendar demo."}
              </Dialog.Description>
              {mode === "source" && sourceDraft && (
                <>
                  <CalendarColorPicker
                    label="Calendar color"
                    value={sourceDraft.color}
                    onChange={(color) => {
                      if (color) setSourceDraft({ ...sourceDraft, color });
                    }}
                  />
                  <div className="cl-color-preview">
                    <CalendarEventBlock
                      event={{
                        id: "preview",
                        title: sourceDraft.name + " event",
                        date: selectedDate,
                        start: 600,
                        end: 660,
                        sourceId: sourceDraft.id,
                      }}
                      source={sourceDraft}
                    />
                  </div>
                  <Button
                    tapScale={1}
                    onClick={() => {
                      change(
                        {
                          ...data,
                          sources: data.sources.map((s) =>
                            s.id === sourceDraft.id ? sourceDraft : s,
                          ),
                        },
                        `${sourceDraft.name} color updated.`,
                      );
                      close();
                    }}
                  >
                    Apply calendar color
                  </Button>
                </>
              )}
              {mode === "event" && draft && (
                <form noValidate onSubmit={save}>
                  <label className="cl-field">
                    Title
                    <input
                      autoComplete="off"
                      value={draft.title}
                      maxLength={100}
                      onChange={(e) =>
                        setDraft({ ...draft, title: e.target.value })
                      }
                      placeholder="Give your event a name"
                    />
                  </label>
                  <div className="cl-form-row">
                    <label className="cl-field">
                      Date
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(e) =>
                          setDraft({ ...draft, date: e.target.value })
                        }
                      />
                    </label>
                    <label className="cl-field">
                      Calendar
                      <select
                        value={draft.sourceId}
                        onChange={(e) =>
                          setDraft({ ...draft, sourceId: e.target.value })
                        }
                      >
                        {data.sources.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="cl-check">
                    <input
                      type="checkbox"
                      checked={!!draft.allDay}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          allDay: e.target.checked,
                          start: 600,
                          end: 660,
                        })
                      }
                    />
                    All-day event
                  </label>
                  {!draft.allDay && (
                    <div className="cl-form-row">
                      <label className="cl-field">
                        Start
                        <input
                          type="time"
                          step={900}
                          value={
                            Number.isFinite(draft.start)
                              ? timeValue(draft.start)
                              : ""
                          }
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              start: parseTime(e.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="cl-field">
                        End
                        <input
                          type="time"
                          step={900}
                          value={
                            Number.isFinite(draft.end) && draft.end < 1440
                              ? timeValue(draft.end)
                              : ""
                          }
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              end: parseTime(e.target.value),
                            })
                          }
                        />
                      </label>
                    </div>
                  )}
                  <label className="cl-field">
                    Location
                    <input
                      value={draft.location ?? ""}
                      maxLength={100}
                      onChange={(e) =>
                        setDraft({ ...draft, location: e.target.value })
                      }
                      placeholder="Add a location"
                    />
                  </label>
                  <CalendarColorPicker
                    allowInherit
                    value={draft.color}
                    onChange={(color) => setDraft({ ...draft, color })}
                  />
                  {error && (
                    <p
                      role="alert"
                      tabIndex={-1}
                      ref={errorRef}
                      className="cl-error"
                    >
                      {error}
                    </p>
                  )}
                  <div className="cl-form-actions">
                    {isExisting && (
                      <Button
                        type="tertiary"
                        danger
                        tapScale={1}
                        onClick={() => setMode("delete")}
                      >
                        Delete event
                      </Button>
                    )}
                    <Button type="secondary" tapScale={1} onClick={close}>
                      Cancel
                    </Button>
                    <Button tapScale={1} render={<button type="submit" />}>
                      Save event
                    </Button>
                  </div>
                </form>
              )}
              {mode === "delete" && draft && (
                <>
                  <p className="cl-delete-title">{draft.title}</p>
                  <div className="cl-form-actions">
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() => setMode("event")}
                    >
                      Keep event
                    </Button>
                    <Button
                      danger
                      tapScale={1}
                      onClick={() => {
                        change(
                          {
                            ...data,
                            events: data.events.filter(
                              (e) => e.id !== draft.id,
                            ),
                          },
                          "Event deleted locally.",
                        );
                        close();
                      }}
                    >
                      Delete event
                    </Button>
                  </div>
                </>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
