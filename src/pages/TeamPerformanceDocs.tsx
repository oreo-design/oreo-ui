import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TeamPerformanceDocs({ nav }: { nav: DocsNav }) {
  const score = nav.active === "performance-score",
    progress = nav.active === "review-progress",
    name = score
      ? "Performance Score"
      : progress
        ? "Review Progress"
        : "Member Performance Table";
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
              {score
                ? "A compact numeric score, a semantic ring and an accessible rating out of 100."
                : progress
                  ? "An exact, mutually exclusive review breakdown with a striped visual track and optional category filtering."
                  : "A controlled team review table with performance scores, change in points, ratings, review states and dates."}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/team-performance"
            >
              Open Team Performance ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                score
                  ? 'import { PerformanceScore } from "@/components/team-performance";\n\n<PerformanceScore value={94} label="Olivia performance" />'
                  : progress
                    ? 'import { ReviewProgress } from "@/components/team-performance";\n\n<ReviewProgress counts={{ Completed: 6, Pending: 4, Overdue: 2 }} selected={status} onSelect={setStatus} />'
                    : 'import { MemberPerformanceTable } from "@/components/team-performance";\n\n<MemberPerformanceTable members={members} sort={sort} onSort={setSort} onOpen={openReview} onReset={resetFilters} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                score
                  ? [
                      {
                        prop: "value",
                        type: "number",
                        desc: "Score from 0 to 100. 90+ Excellent, 80+ Good, 70+ Developing; lower scores Need attention. Invalid/out-of-range values render unavailable rather than an invented score.",
                      },
                      {
                        prop: "label",
                        type: "string",
                        desc: "Accessible meter name. Default Performance. The numeric score and rating remain readable without color.",
                      },
                    ]
                  : progress
                    ? [
                        {
                          prop: "counts",
                          type: "Record<ReviewState, number>",
                          desc: "Exclusive Completed, Pending and Overdue counts. Nonnegative safe integers; invalid individual counts normalize to zero. Completion percentage uses Completed divided by the total; a zero total shows no percentage.",
                        },
                        {
                          prop: "label / selected / onSelect",
                          type: "string / ReviewState / callback",
                          desc: "Optional title and controlled category selection. Without a callback, the legend is text. With one, native toggle buttons expose aria-pressed; host controls the filtering scope.",
                        },
                      ]
                    : [
                        {
                          prop: "members",
                          type: "MemberPerformance[]",
                          desc: "Caller-owned rows with unique IDs, score and previous score, goal counts, review status and ISO date (YYYY-MM-DD) or null. Changes show percentage points. Date display is fixed to UTC.",
                        },
                        {
                          prop: "sort / onSort / onOpen",
                          type: "PerformanceSort / callbacks",
                          desc: "Controlled sort by name, score or change; host sorts data and owns pagination. Member name optionally opens the host's review surface.",
                        },
                        {
                          prop: "loading / error / onReset",
                          type: "boolean / string / callback",
                          desc: "Empty initial loads use static table skeletons. Existing rows remain during refresh. Empty/error states reuse AgentWorkspaceState with optional recovery.",
                        },
                      ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template reuses WorkspaceMetric, Avatar, Tag, Button and Base
              UI Dialog. Summary cards and progress follow the selected month,
              department and name query; review status filters only the table,
              keeping progress context visible. All counts are derived from the
              same sample records. Seven members appear per page; CSV exports
              every filtered row, not just the current page.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Editing validates a score from 0–100 (one decimal place),
              completed goals within the assigned total, and a note up to 500
              characters. Completed reviews use the sample period's final day.
              The latest edit can be undone. Months keep independent edits while
              the page is open; reload resets all data. No HR integration,
              messages or real employee records are involved.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/vektorastudio/status/2110661960425787787"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Vektora Studio ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
