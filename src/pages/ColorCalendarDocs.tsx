import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "calendar-event-block": {
    name: "Calendar Event Block",
    description:
      "A dense event tile with a calendar accent, timing, source identity and controlled selection.",
    code: "<CalendarEventBlock event={event} source={calendar}\n  selected={selectedId === event.id} onOpen={openEvent} />",
    rows: [
      {
        prop: "event / source",
        type: "CalendarEvent / CalendarSource",
        desc: "Date is YYYY-MM-DD; start/end are wall-clock minutes on the same day. Source supplies the default color; event.color is an optional override. Host validates inputs.",
      },
      {
        prop: "onOpen / selected / compact",
        type: "callback / boolean / boolean",
        desc: "With onOpen renders a native button; otherwise a static article. Compact mode shows title only visually; the full accessible name retains date, timing and source.",
      },
    ],
  },
  "calendar-color-picker": {
    name: "Calendar Color Picker",
    description:
      "A named token palette with native radio-keyboard behavior and optional color inheritance.",
    code: "<CalendarColorPicker value={color} onChange={setColor} allowInherit />",
    rows: [
      {
        prop: "value / onChange",
        type: "CalendarColor | undefined / callback",
        desc: "Controlled palette: blue, mint, pink, purple, orange, brown, default. Undefined inherits the owning calendar when allowInherit is enabled.",
      },
      {
        prop: "allowInherit / disabled",
        type: "boolean",
        desc: "Optional inherit radio; disabled fieldset blocks changes. Every swatch has a readable name; color is never the only control label.",
      },
    ],
  },
  "calendar-source-list": {
    name: "Calendar Source List",
    description:
      "Calendar names with controlled visibility checkboxes and optional per-calendar editing.",
    code: "<CalendarSourceList sources={sources}\n  onVisibilityChange={toggleSource} onEdit={editSourceColor} />",
    rows: [
      {
        prop: "sources",
        type: "CalendarSource[]",
        desc: "Unique id, name, palette color and visible state.",
      },
      {
        prop: "onVisibilityChange / onEdit",
        type: "callbacks",
        desc: "Host owns visibility, persistence and edits. Optional onEdit exposes a named action beside the visibility control.",
      },
    ],
  },
  "calendar-week-grid": {
    name: "Calendar Week Grid",
    description:
      "An explicit-date schedule with all-day events, overlap lanes, sticky day labels and a protected time gutter.",
    code: "<CalendarWeekGrid dates={weekDates(date, 5)} events={events}\n  sources={sources} onOpen={openEvent} onEmptyAction={resetView} />",
    rows: [
      {
        prop: "dates / events / sources",
        type: "string[] / CalendarEvent[] / CalendarSource[]",
        desc: "Supply valid unique dates, unique event/source IDs and valid same-day time intervals (at least 15 minutes). Host owns filtering. Use filterEvents to apply visible sources, dates and search; unknown sources are omitted.",
      },
      {
        prop: "onOpen / selectedId",
        type: "callback / string",
        desc: "Event details/editing live in the host. Overlapping half-open intervals use separate columns; adjacent events share a lane. Grid expands beyond 8 AM–9 PM when needed.",
      },
      {
        prop: "loading / error / onRetry / onEmptyAction",
        type: "state props / callbacks",
        desc: "Initial content-shaped loading, aria-busy refresh retaining events, explicit failure and centered empty recovery. Small screens can pass one date; the template defaults to day view on mobile.",
      },
    ],
  },
};
export function ColorCalendarDocs({ nav }: { nav: DocsNav }) {
  const spec = specs[nav.active] ?? specs["calendar-week-grid"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", spec.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {spec.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {spec.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/color-calendar"
            >
              Open Color Calendar ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${spec.name.replaceAll(" ", "")} } from "@/components/color-calendar";\n\n${spec.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              This template is a fixed October 2026 wall-clock calendar. It does
              not perform timezone conversion, recurring-series edits, calendar
              synchronization or invitations. Source colors propagate to
              inherited events; explicit overrides remain unchanged. Edit/delete
              operations apply to one event only. One-step undo restores the
              previous local event/source snapshot. Changes reset on reload.
              Search and calendar visibility filter the schedule and JSON export
              together. The week begins on Monday; weekends can be shown
              explicitly. Demo today returns to October 19, 2026.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/yishanzh/status/2110495231972090314"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Yishan Zhang ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
