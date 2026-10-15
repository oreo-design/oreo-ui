import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ThinkingStateDocs({ nav }: { nav: DocsNav }) {
  const timeline = nav.active === "thinking-timeline";
  const title = timeline ? "Thinking Timeline" : "Thinking State";
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
              {timeline
                ? "A controlled run timeline built from Thinking State and Oreo StatusIcon. The host owns progress, cancellation and recovery. Labels describe observable activity, not private model reasoning."
                : "A tiny pixel signal beside a status label. Six deterministic opacity patterns keep work legible without a per-frame JavaScript timer. Inspired by Purpose Walker’s Thinking State."}
            </p>
            <a
              href="/thinking-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Thinking Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                timeline
                  ? 'import { ThinkingTimeline } from "@/components/thinking-state";\n\n<ThinkingTimeline steps={steps} current={2} status="running" />'
                  : 'import { ThinkingState } from "@/components/thinking-state";\n\n<ThinkingState phase="analyzing" tone="mint" shape="circle" />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                timeline
                  ? [
                      {
                        prop: "steps",
                        type: "ThinkingStep[]",
                        desc: "Unique phase id, visible label and operational detail for each step.",
                      },
                      {
                        prop: "current",
                        type: "number",
                        desc: "Zero-based current step; clamped to the available steps.",
                      },
                      {
                        prop: "status",
                        type: '"idle" | "running" | "paused" | "complete" | "error" | "stopped"',
                        desc: "Host-controlled status. No internal timer or retry behavior.",
                      },
                      {
                        prop: "tone / shape",
                        type: "ThinkingTone / square | circle",
                        desc: "Appearance of the current step’s pixel indicator.",
                      },
                      {
                        prop: "speed",
                        type: "number",
                        desc: "Current indicator speed, clamped to 0.5–2. Default 1; never changes host progress.",
                      },
                    ]
                  : [
                      {
                        prop: "phase",
                        type: '"thinking" | "analyzing" | "debugging" | "searching" | "building" | "pondering"',
                        desc: "Selects a distinct deterministic pixel phase. Default thinking.",
                      },
                      {
                        prop: "label",
                        type: "string",
                        desc: "Visible status text; defaults to the capitalized phase name.",
                      },
                      {
                        prop: "active",
                        type: "boolean",
                        desc: "Default true. False pauses the pixels; update the label to explain paused/completed states.",
                      },
                      {
                        prop: "tone / shape",
                        type: '"neutral" | "mint" | "purple" | "orange" / "square" | "circle"',
                        desc: "Defaults neutral / square. Uses existing palette tokens; text stays neutral.",
                      },
                      {
                        prop: "speed",
                        type: "number",
                        desc: "Multiplier clamped to 0.5–2; default 1. Changes pixel loop duration only, never task progress.",
                      },
                      {
                        prop: "grid / shimmer",
                        type: "boolean",
                        desc: "Faint background grid defaults true. Existing Oreo ShimmerText is opt-in, default false.",
                      },
                      {
                        prop: "announce",
                        type: "boolean",
                        desc: "Default true adds a polite status region. Turn off when a parent announces status to avoid duplicate announcements.",
                      },
                    ]
              }
            />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Pixel animation pauses in hidden documents. Reduced motion renders
              a stable pixel pattern; labels and progress remain readable. Loops
              communicate ongoing work, not a percentage or a duration estimate.
              The template is a timed local demonstration with prewritten sample
              responses.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/purpose_walker/status/2110382989414740308"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Purpose Walker ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
