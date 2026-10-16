import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  RegionTrafficMap,
  RegionHealthList,
  LatencyChart,
  DeploymentFeed,
  MonitorPanel,
} from "@/components/edge-monitor";
import {
  REGIONS,
  DEPLOYMENTS,
  latencySamples,
} from "@/patterns/edge-observatory/data";
export function EdgeMonitorDocs({ nav }: { nav: DocsNav }) {
  const [region, setRegion] = useState("sin1");
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Edge Monitor"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "regions", label: "Regional health" },
        { id: "latency", label: "Latency" },
        { id: "deployments", label: "Deployments" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">
              Every region. One clear picture.
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              A compact monitoring family: metric tiles, a selectable traffic
              map, regional health, percentile latency and deployment history.
            </p>
            <p className="mt-3 text-sm text-text-tertiary">
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/augustasdesign/status/2110393766754341153"
                target="_blank"
                rel="noreferrer"
              >
                Augustas’s infrastructure dashboard
              </a>
              . Built with Oreo tokens, ActivityBars, Avatar, Button and the
              shared empty state.
            </p>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              The animated follow-up adds{" "}
              <a href="/monitor-reveal" className="underline">
                MonitorReveal
              </a>
              ,{" "}
              <a href="/region-spotlight" className="underline">
                RegionSpotlight
              </a>{" "}
              and{" "}
              <a href="/incident-recommendation" className="underline">
                IncidentRecommendation
              </a>
              . Explore them in the template with a local routing review.
            </p>
            <Button
              className="my-6"
              tapScale={1}
              render={<a href="/edge-observatory" />}
            >
              Open Edge Observatory ↗
            </Button>
            <MonitorPanel
              title="Traffic by region"
              icon="globe"
              detail="Select a location"
            >
              <RegionTrafficMap
                regions={REGIONS}
                selected={region}
                onSelect={setRegion}
              />
            </MonitorPanel>
          </header>
          <Section
            id="regions"
            title="Regional health"
            description="The map and list share the same controlled selection. Every marker is keyboard reachable; small screens use uncluttered markers and the full region list."
          >
            <RegionHealthList
              regions={REGIONS}
              selected={region}
              onSelect={setRegion}
            />
          </Section>
          <Section
            id="latency"
            title="Inspect the spike"
            description="Three percentile series with a keyboard-accessible sample scrubber. Charts update immediately so data stays readable."
          >
            <LatencyChart
              key={region}
              samples={latencySamples(
                "24h",
                REGIONS.find((r) => r.id === region),
              )}
              label={REGIONS.find((r) => r.id === region)?.city}
            />
          </Section>
          <Section
            id="deployments"
            title="Release context"
            description="A compact release feed with author, revision, relative time and attention state. Supply onSelect to open your own detail surface."
          >
            <DeploymentFeed entries={DEPLOYMENTS} />
          </Section>
          <Section id="api" title="Compose your monitor">
            <CodeBlock
              code={
                '<RegionTrafficMap regions={regions}\n  selected={regionId} onSelect={setRegionId} />\n<RegionHealthList regions={regions}\n  selected={regionId} onSelect={setRegionId} />\n<LatencyChart samples={samples} label="Singapore" />'
              }
            />
            <PropsTable
              rows={[
                {
                  prop: "EdgeMetric",
                  type: "label, value, unit?, detail, warning?, icon, bars",
                  desc: "A metric tile with existing ActivityBars; textual context accompanies warning color.",
                },
                {
                  prop: "RegionTrafficMap",
                  type: "regions, selected?, onSelect, samples?, detailPlacement?, reveal?",
                  desc: "Controlled selection. Optional spotlight trend/desktop overlay and nonblocking reveal. Below-map detail remains the default. x/y coordinates are schematic percentages, not GIS data.",
                },
                {
                  prop: "RegionHealthList",
                  type: "regions, selected?, onSelect",
                  desc: "Traffic-relative bars and p95 milliseconds. Values of 80 ms or more receive elevated styling.",
                },
                {
                  prop: "LatencyChart",
                  type: "samples: LatencySample[], label?",
                  desc: "Nonnegative p50/p95/p99 data with labels. Invalid samples are omitted; empty input uses the shared empty state.",
                },
                {
                  prop: "DeploymentFeed",
                  type: "entries, onSelect?",
                  desc: "Static rows or semantic buttons. The template uses a Base UI dialog for focus and dismissal.",
                },
                {
                  prop: "MonitorPanel",
                  type: "title, icon, detail?, action?, children",
                  desc: "Named card region with a shared compact header.",
                },
              ]}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              The template contains sample data only. Time range changes
              aggregate request volume and chart samples; region selection also
              filters logs. Simulate deploy adds a local history entry and never
              publishes a release.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
