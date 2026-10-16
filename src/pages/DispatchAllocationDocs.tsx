import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function DispatchAllocationDocs({ nav }: { nav: DocsNav }) {
  const card = nav.active === "route-job-card",
    name = card ? "Route Job Card" : "Allocation Timeline";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {card
                ? "A transport job with pickup, destination, duration, passengers and luggage, ready for a host-owned allocation action."
                : "A controlled resource schedule with hourly drop targets, compact route bars and an unassigned job tray."}
            </p>
            <a
              href="/dispatch-allocation"
              className="mt-4 inline-block text-sm underline"
            >
              Open Dispatch Allocation ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                card
                  ? 'import { RouteJobCard } from "@/components/dispatch-allocation";\n\n<RouteJobCard job={job} onOpen={() => openEditor(job)} />'
                  : 'import { AllocationTimeline, assignJob } from "@/components/dispatch-allocation";\n\n<AllocationTimeline jobs={jobs} resources={drivers} date="2026-10-16"\n  onOpen={openEditor}\n  onAssign={(id, allocation) => {\n    try { setJobs(assignJob(jobs, drivers, id, allocation)); }\n    catch (error) { showError(error.message); }\n  }} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                card
                  ? [
                      {
                        prop: "job",
                        type: "RouteJob",
                        desc: "Unique ID, customer, route, category, integer duration in hours, passenger and luggage counts; optional allocation and dispatched status.",
                      },
                      {
                        prop: "onOpen / dragHandle",
                        type: "callback / ReactNode",
                        desc: "Optional action and host-owned drag handle. Without onOpen no action button is rendered.",
                      },
                    ]
                  : [
                      {
                        prop: "jobs / resources / date",
                        type: "RouteJob[] / AllocationResource[] / ISO date",
                        desc: "Controlled schedule data. Resource IDs must be unique. This composition displays 08:00–18:00 with one-hour drop slots.",
                      },
                      {
                        prop: "onAssign / onOpen",
                        type: "callbacks",
                        desc: "Host owns validation and committing drops. assignJob rejects overlaps, insufficient seats, out-of-hours jobs and dispatched edits. Supply both callbacks for drag support; use onOpen for keyboard and touch assignment.",
                      },
                      {
                        prop: "query / category / resourceView",
                        type: "string / string / driver | vehicle",
                        desc: "Optional view filters. Conflict checking uses the complete jobs collection, including hidden jobs.",
                      },
                      {
                        prop: "loading / error / onRetry",
                        type: "boolean / string / callback",
                        desc: "Static content-shaped skeleton and explicit retry surface. onClearFilters resets a no-match state.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template supports drag allocation, form-based
              assignment, date selection, driver or vehicle labels, route search
              and category filters, unassign, one-step undo, dispatch review and
              full JSON export. Dispatch only marks local sample jobs and locks
              their allocation. Reload resets the demo. The component uses
              pointer/touch drag; keyboard users use the allocation editor.
              Escape and dropping outside the grid cancel without changing data.
              Reduced motion disables drop animation.
            </p>
            <a
              href="https://x.com/maybepratikk/status/2110717643322015819"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Pratik ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
