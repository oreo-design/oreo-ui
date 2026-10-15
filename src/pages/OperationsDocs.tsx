import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "operations-map": {
    name: "Operations Map",
    description:
      "Selectable event and vehicle markers on an original schematic district. Host-owned selection synchronizes a list and detail panel.",
    code: "<OperationsMap points={points} selectedId={selected} onSelect={setSelected} route={route} />",
    rows: [
      {
        prop: "points",
        type: "OperationPoint[]",
        desc: "Unique id, label, x/y percentage coordinates and info/warning/success/danger tone. Coordinates are clamped to 4–96; nonfinite values center at 50. Label remains available to assistive technology.",
      },
      {
        prop: "selectedId / onSelect",
        type: "string / (id: string) => void",
        desc: "Controlled selection. Markers are native buttons with pressed state; without callback they are disabled. The host keeps selection in sync with filtered lists.",
      },
      {
        prop: "route / label",
        type: "{x:number;y:number}[] / string",
        desc: "Optional illustrative route and accessible figure name. This component does not calculate routes, distances or real geography.",
      },
    ],
  },
  "operations-feed": {
    name: "Operations Feed",
    description:
      "A compact, selectable feed shared by fleet directories, incident lists and validation history.",
    code: "<OperationsFeed items={events} selectedId={selected} onSelect={setSelected} onClear={clearFilters} />",
    rows: [
      {
        prop: "items",
        type: "OperationEvent[]",
        desc: "Unique id, title, detail, time, tone and optional status. Status is textual; color is not the only signal.",
      },
      {
        prop: "selectedId / onSelect",
        type: "string / (id:string) => void",
        desc: "Optional controlled selection. Omitting onSelect renders static entries rather than inert buttons.",
      },
      {
        prop: "emptyTitle / onClear",
        type: "string / () => void",
        desc: "Shared AgentWorkspaceState handles no matches. Clear filters is exposed only with an action.",
      },
    ],
  },
  "health-meters": {
    name: "Health Meters",
    description:
      "Segmented operational readings with numerical values and explicit status text.",
    code: '<HealthMeters readings={[{label:"Schema match",value:100,status:"All fields match",tone:"success"}]} />',
    rows: [
      {
        prop: "readings",
        type: "HealthReading[]",
        desc: "Label, value (percentage), status and tone. Finite values clamp to 0–100. Nonfinite values display Unavailable. Host owns measurement and threshold semantics.",
      },
    ],
  },
  "route-timeline": {
    name: "Route Timeline",
    description:
      "Completed checkpoints, the current stop and upcoming arrivals in a compact vertical route.",
    code: "<RouteTimeline stops={stops} />",
    rows: [
      {
        prop: "stops",
        type: "RouteStop[]",
        desc: "Ordered unique id, label, detail and complete/current/upcoming state. Current receives aria-current=step. Host owns timeline ordering and state.",
      },
    ],
  },
  "pipeline-file": {
    name: "Pipeline File",
    description:
      "A read-only source panel with line numbers, lightweight token coloring and host-supplied annotations.",
    code: '<PipelineFile name="feature_pipeline.py" source={source} annotations={[{line:10,label:"within SLA",tone:"success"}]} />',
    rows: [
      {
        prop: "name / source",
        type: "string / string",
        desc: "File name and plain text source. Rendered as React text, never evaluated or injected as HTML. Coloring is illustrative, not a parser or language server.",
      },
      {
        prop: "annotations",
        type: "{line:number;label:string;tone:OperationTone}[]",
        desc: "Optional one-based line notes. Hidden visually below 600px to preserve code space. The source itself scrolls horizontally with keyboard access.",
      },
    ],
  },
  "camera-checkpoint": {
    name: "Camera Checkpoint",
    description:
      "An explicitly illustrated camera location thumbnail with a selectable state.",
    code: '<CameraCheckpoint label="North Avenue" selected={selected} onSelect={selectCamera} />',
    rows: [
      {
        prop: "label / selected / onSelect",
        type: "string / boolean / () => void",
        desc: "Location name, pressed state and selection callback. Without callback the button is disabled. Original SVG illustration, not a live feed or photograph.",
      },
    ],
  },
};
export function OperationsDocs({ nav }: { nav: DocsNav }) {
  const e =
    entries[nav.active as keyof typeof entries] ?? entries["operations-map"];
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
            <div className="mt-4 flex flex-wrap gap-4 text-sm underline">
              <a href="/fleet-control">Fleet Control ↗</a>
              <a href="/pipeline-workspace">Pipeline Workspace ↗</a>
              <a href="/incident-monitor">Incident Monitor ↗</a>
            </div>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${e.name.replaceAll(" ", "")} } from "@/components/operations";\n\n${e.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={e.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Three complete local templates adapt Lumeo Studio’s fleet,
              machine-learning and incident-monitor references. Shared Oreo
              Button, IconButton, AgentWorkspaceState, MonitorPanel and Base UI
              tabs retain product conventions. Dark/light themes and narrow
              layouts are supported. All records, route geometry and camera
              illustrations are fictional demos. No live dispatch, maps,
              cameras, model execution or persistence is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/lumeodstudio/status/2110370181365076323"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Lumeo Studio ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
