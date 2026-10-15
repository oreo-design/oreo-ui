import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "forecast-timeline": {
    name: "Forecast Timeline",
    component: "ForecastTimeline",
    description:
      "A selectable account timeline with projected use, exhaustion hatching, reset markers and explicit unforecasted windows.",
    code: "<ForecastTimeline forecasts={forecasts} selectedId={selectedId} onSelect={setSelectedId} days={7} />",
    rows: [
      {
        prop: "forecasts",
        type: "UsageForecast[]",
        desc: "Results from forecastUsage. All rows should share one snapshot time. Invalid and disconnected rows remain selectable without fabricated values.",
      },
      {
        prop: "selectedId / onSelect",
        type: "string / (id: string) => void",
        desc: "Controlled selection through native buttons. The host owns detail content and filters.",
      },
      {
        prop: "days",
        type: "number",
        desc: "Display horizon, clamped to 1–14 whole days. Default 7. Six-hour cells at the default horizon; reset and exhaustion markers retain exact positions.",
      },
    ],
  },
  "usage-projection": {
    name: "Usage Projection",
    component: "UsageProjection",
    description:
      "Observed cumulative usage, a constant-pace projection and an even-pace guide, with an accessible observation table.",
    code: "<UsageProjection forecast={forecastUsage(account, snapshotTime, 1)} />",
    rows: [
      {
        prop: "forecast",
        type: "UsageForecast",
        desc: "A derived forecast. Solid = observed; dashed = scenario; dotted = remaining allowance evenly spread to reset. The chart stops at reset, and use is capped visually at 100%.",
      },
    ],
  },
  "daily-usage-pace": {
    name: "Daily Usage Pace",
    component: "DailyUsagePace",
    description:
      "Observed interval rates compared with the remaining daily allowance. Values use percentage points per day, not a percentage change.",
    code: "<DailyUsagePace forecast={forecast} />",
    rows: [
      {
        prop: "forecast",
        type: "UsageForecast",
        desc: "Observed increments are normalized by interval duration. Scenario changes never rewrite historical bars. A zero baseline and exact data disclosure accompany the visual comparison.",
      },
    ],
  },
};
export function UsageForecastDocs({ nav }: { nav: DocsNav }) {
  const e =
    entries[nav.active as keyof typeof entries] ?? entries["forecast-timeline"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", e.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{e.name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {e.description}
            </p>
            <a
              href="/usage-forecast"
              className="mt-4 inline-block text-sm underline"
            >
              Open Usage Forecast ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${e.component}, forecastUsage } from "@/components/usage-forecast";\n\n${e.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={e.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              forecastUsage(account, now, multiplier) derives daily pace from up
              to the latest three observed intervals. Inputs require a current
              window, at least two ordered cumulative observations between 0 and
              100%, and a latest observation no older than one day. Invalid and
              disconnected data use the shared AgentWorkspaceState.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Account fields: id, name, plan, windowStart, resetAt, observations
              (at and used), connected. Timestamps are milliseconds since epoch.
              Labels use UTC. The scenario multiplier accepts 0–4; the template
              exposes 0–2. Exhaustion exactly at reset is within allowance. No
              future window is forecast.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              This is a deterministic local demonstration, not provider
              telemetry, quota policy or a statistical confidence estimate.
              Provider names are sample labels, with original monograms rather
              than copied logos. No credentials or subscriptions are connected.
              All scenario changes reset on reload.
            </p>
            <a
              href="https://x.com/Niyxuis/status/2110504674143150148"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Reference by nyx ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
