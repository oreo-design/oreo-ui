import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    source: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "monitor-reveal": {
    name: "MonitorReveal",
    source: "monitor-reveal",
    description:
      "A short, nonblocking introduction for monitoring surfaces. Children stay mounted, data stays accurate, and interacting reveals content immediately.",
    code: '<MonitorReveal play={run} delay={100} variant="rise">\n  <RegionTrafficMap {...mapProps} />\n</MonitorReveal>',
    rows: [
      {
        prop: "play",
        type: "number = 0",
        desc: "Static by default. Change to a positive run number to replay. Set zero to cancel. The template cancels on pointer/keyboard interaction and does not replay on filters or tabs.",
      },
      {
        prop: "variant / delay",
        type: "rise | wipe / milliseconds",
        desc: "Rise: 200ms transform/opacity. Wipe: 260ms clip reveal for charts. Delay clamps 0–400ms. House ease-out. Decorative only, never an indication of data loading.",
      },
      {
        prop: "children / className",
        type: "ReactNode / string",
        desc: "Normal div wrapper, no child remount or inert state. Reduced motion uses a 150ms opacity transition without delay; preference changes or hiding the page cancel the animation.",
      },
    ],
  },
  "region-spotlight": {
    name: "RegionSpotlight",
    source: "edge-monitor",
    description:
      "A compact region detail card with a p95 sparkline, current request rate and error share.",
    code: "<RegionSpotlight region={region} samples={samples} />",
    rows: [
      {
        prop: "region",
        type: "EdgeRegion",
        desc: "Current city, code, nonnegative metrics and schematic position. Elevated latency uses the existing 80ms threshold. The host owns valid regional data.",
      },
      {
        prop: "samples",
        type: "LatencySample[]",
        desc: "Optional p95 history. Invalid/negative samples are excluded; fewer than two points omit the sparkline rather than inventing a trend.",
      },
      {
        prop: "Map composition",
        type: 'detailPlacement="overlay" | "below"',
        desc: "RegionTrafficMap accepts samples and reveal. Below is the backward-compatible default. Overlay appears only above 1250px; smaller screens retain a full-width detail card. Selection updates immediately.",
      },
    ],
  },
  "incident-recommendation": {
    name: "IncidentRecommendation",
    source: "edge-monitor",
    description:
      "An explainable incident summary with a baseline comparison and optional review/trace actions.",
    code: "<IncidentRecommendation source={singapore} baseline={38}\n target={hongKong} headroom={41} share={30}\n onReview={openReview} onTrace={openTrace} />",
    rows: [
      {
        prop: "source / baseline / target / headroom",
        type: "EdgeRegion / number / EdgeRegion / number",
        desc: "Explicit snapshot data. Baseline is milliseconds; headroom is percent. The card does not infer capacity or predict latency improvements.",
      },
      {
        prop: "share / onReview / onTrace",
        type: "number = 30 / callbacks",
        desc: "The action opens the host's review. The template validates source/destination, whole request rates, 1–50% share and capacity; saving only retains a local routing draft with undo.",
      },
    ],
  },
};
export function EdgeMotionDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["monitor-reveal"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", s.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{s.name}</h1>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              href="/edge-observatory"
              className="my-6 inline-block text-sm underline"
            >
              Open Edge Observatory ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name} } from "@/components/${s.source}";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template uses a fixed local snapshot. Intro motion never
              fabricates metric values. Routing drafts are not applied to
              traffic; reload resets them. No backend, real deployment or
              routing service is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/augustasdesign/status/2110944321184620815"
              target="_blank"
              rel="noreferrer"
            >
              Animated reference by Augustas ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
