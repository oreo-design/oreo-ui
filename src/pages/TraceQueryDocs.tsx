import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TraceQueryDocs({ nav }: { nav: DocsNav }) {
  const filter = nav.active === "query-filter-bar",
    title = filter ? "Query Filter Bar" : "Trace Table";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {filter
                ? "Composable field, condition and value filters with searchable choices and inline validation."
                : "A dense, accessible trace result table with selectable columns, input previews and host-owned details."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/trace-explorer"
            >
              Open Trace Explorer ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                filter
                  ? 'import { QueryFilterBar, TRACE_FIELDS } from "@/components/trace-query";\n\n<QueryFilterBar fields={TRACE_FIELDS} value={conditions} onChange={setConditions} />'
                  : 'import { TraceTable } from "@/components/trace-query";\n\n<TraceTable traces={results} onSelect={openDetails}\n  selectedId={selected?.id} onClear={resetQuery} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                filter
                  ? [
                      {
                        prop: "fields",
                        type: "QueryField[]",
                        desc: "Unique key, label, text/number/enum type, optional enum options and numeric min/max.",
                      },
                      {
                        prop: "value / onChange",
                        type: "QueryCondition[] / callback",
                        desc: "Controlled array of unique id, field, operator and string value. All conditions are ANDed by the included matchesQuery helper.",
                      },
                      {
                        prop: "disabled",
                        type: "boolean",
                        desc: "Disables adding, editing, clearing and removing conditions.",
                      },
                    ]
                  : [
                      {
                        prop: "traces / onSelect",
                        type: "TraceRecord[] / callback",
                        desc: "Host-filtered, sorted and paginated data. Explicit row detail buttons remain available with any column selection.",
                      },
                      {
                        prop: "columns / selectedId",
                        type: "TraceColumn[] / string?",
                        desc: "Visible columns are rendered in canonical order. An empty column array falls back to primitive name. Selected trace is highlighted.",
                      },
                      {
                        prop: "loading / error / onRetry",
                        type: "boolean / string? / callback?",
                        desc: "Content-shaped initial skeleton; loading with existing rows preserves them. Error takes precedence and offers optional retry.",
                      },
                      {
                        prop: "onClear",
                        type: "callback?",
                        desc: "Optional recovery action for the centered no-results state.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template combines both components with Button, IconButton,
              Tag, InlineSearchSelect, Menu, CodeBlock and AgentWorkspaceState.
              Base UI owns popover, menu and dialog focus. Search, date ranges,
              numeric and enum conditions, sorting, pagination, column
              selection, detail inspection, session-only saved queries and JSON
              export all operate on deterministic local fixtures.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Numeric inputs reject empty, non-finite and out-of-range values.
              Missing scores or feedback never match a condition, including
              inequality; unscored rows sort last. Times use UTC and date ranges
              are relative to the displayed snapshot. Export includes every
              filtered row across pages and an Oreo query schema; it does not
              imply Mastra API compatibility. Refresh or reload resets this
              local sample.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Semantic Oreo tokens own colors, spacing, radii and typography.
              The 980px minimum table width and fixed metadata columns preserve
              readable trace data; narrow screens scroll only the table. Dialogs
              retain an opaque header above a scrolling body. No new timed
              motion is introduced.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/calcsam/status/2110759787814375721"
              target="_blank"
              rel="noreferrer"
            >
              Trace queries reference by Sam Bhagwat ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
