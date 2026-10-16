import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function AgentRunsDocs({ nav }: { nav: DocsNav }) {
  const card = nav.active === "agent-runs-card",
    title = card ? "Agent Runs Card" : "Weekly Heatmap";
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
              {card
                ? "Weekly agent activity, calculated summaries, metric selection and a day-by-hour heatmap."
                : "A seven-day, 24-hour matrix with roving keyboard focus, exact-value inspection and controlled selection."}
            </p>
            <a
              href="/agent-runs"
              className="mt-4 inline-block underline text-sm"
            >
              Open Agent Runs ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`<${card ? "AgentRunsCard" : "WeeklyHeatmap"}\n  data={buckets} metric={metric}\n  value={selectedHour} onValueChange={setSelectedHour}${card ? "\n  previousData={lastWeek} onMetricChange={setMetric}" : ""}\n/>`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "data",
                  type: "HourBucket[]",
                  desc: "Unique day (0=Monday…6=Sunday) and hour (0…23) coordinates. Nonnegative safe-integer runs, credits, failures and total durationSeconds. Missing hours are zero; [] means no dataset.",
                },
                {
                  prop: "metric",
                  type: "runs | credits | failures",
                  desc: "Controls cell intensity, peak and morning insight. Legend scale uses the selected metric maximum; it rescales with filters.",
                },
                {
                  prop: "value / onValueChange",
                  type: "number / callback?",
                  desc: "Controlled slot index, day × 24 + hour (0…167). Arrow keys move focus; Enter, Space or tap selects. Home/End move within a day; Ctrl+Home/End span the week. Escape dismisses inspection.",
                },
                {
                  prop: "loading / error / onRetry",
                  type: "state / callback?",
                  desc: "Static cell skeleton for initial loading, existing cells retained on refresh, shared empty/error recovery.",
                },
                ...(card
                  ? [
                      {
                        prop: "previousData / onMetricChange",
                        type: "HourBucket[]? / callback?",
                        desc: "Comparison to the supplied previous week. No percentage shown for a zero denominator. Omitted metric callback leaves the selector disabled.",
                      },
                      {
                        prop: "title / description",
                        type: "string?",
                        desc: "Host-owned heading and date/agent/timezone context.",
                      },
                    ]
                  : []),
              ]}
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Import from @/components/agent-runs. The template reuses Button,
              Tag, Icon and AgentWorkspaceState. All values are local
              deterministic samples. Credits are usage units, not a currency or
              current provider pricing. Average duration is weighted by runs,
              and failure rate uses total runs. No backend or production
              connection is implied.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The two static source images establish light and dark appearance.
              Keyboard navigation, filtering, accessible data tables and CSV
              export are additions. The grid scrolls horizontally at small
              widths; text and table values keep the data available
              independently of color. No custom timed animation is added.
            </p>
            <a
              className="mt-4 inline-block underline text-sm"
              href="https://x.com/shokhnur_says/status/2110657757850263727"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Shokhnur ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
