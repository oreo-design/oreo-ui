import { useState } from "react";
import { StatusIcon, type StatusIconState, type StatusIconProgress } from "@/components/status-icon";
import { Button } from "@/components/button";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { useDemo } from "@/docs/playground/useDemo";
import { statusIconDemo } from "@/docs/playground/status-icon.demo";
import type { PlaygroundSpec } from "@/docs/playground/schema";

const examples: { label: string; status: StatusIconState; progress?: StatusIconProgress }[] = [
  { label: "Backlog", status: "backlog" }, { label: "Planned", status: "planned" }, { label: "To do", status: "todo" },
  { label: "Started", status: "in-progress", progress: "quarter" }, { label: "In progress", status: "in-progress", progress: "half" },
  { label: "In review", status: "in-progress", progress: "three-quarters" }, { label: "Done", status: "done" },
  { label: "Blocked", status: "blocked" }, { label: "Canceled", status: "canceled" },
];
const sequenceSpec: PlaygroundSpec = { title: "Status Icon", controls: {}, render: () => <></>, demo: statusIconDemo };
function StatusDemo() {
  const [selected, setSelected] = useState(2);
  const demo = useDemo(sequenceSpec, values => {
    const index = examples.findIndex(item => item.status === values.status && (values.status !== "in-progress" || item.progress === values.progress));
    if (index !== -1) setSelected(index);
  });
  const example = examples[selected];
  return <div className="rounded-card-medium border border-border-subtle bg-bg-base p-6 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
      <span>Reference sequence · 12.2 s</span>
      <div className="flex gap-1">
        <Button type="tertiary" size="sm" onClick={() => demo.player?.replay()}>Replay sequence</Button>
        <Button type="secondary" size="sm" onClick={() => demo.status === "playing" ? demo.player?.pause() : demo.player?.play()}>{demo.status === "playing" ? "Pause sequence" : demo.status === "paused" ? "Resume sequence" : "Play sequence"}</Button>
      </div>
    </div>
    <div className="flex min-h-48 flex-col items-center justify-center gap-5" aria-live="polite">
      <StatusIcon status={example.status} progress={example.progress} className="size-16" />
      <span className="text-sm text-text-secondary">{example.label}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {examples.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => { demo.player?.stop(); setSelected(index); }}
        className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-control p-2 text-xs text-text-secondary outline-none hover:bg-state-hover focus-visible:ring-2 focus-visible:ring-status-progress aria-pressed:bg-state-press aria-pressed:text-text-primary">
        <StatusIcon status={item.status} progress={item.progress} size="lg" />{item.label}
      </button>)}
    </div>
  </div>;
}

export function StatusIconDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Status Icon"]} toc={[
    { id: "status-icon", label: "Introduction" }, { id: "states", label: "States" }, { id: "usage", label: "Usage" }, { id: "sizes", label: "Sizes & composition" }, { id: "api", label: "API Reference" },
  ]}>{() => <>
    <header id="status-icon" className="scroll-mt-8 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">Status Icon</h1>
      <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">One soft square, nine distinct signals. A compact task status that stays recognizable with or without color.</p>
      <p className="mt-3 text-xs text-text-tertiary">Shape study inspired by <a href="https://x.com/thisuxhq/status/2109622635068109107" target="_blank" rel="noreferrer" className="underline underline-offset-4">ThisUX</a>, adapted to Oreo’s tokens and icon sizes.</p>
    </header>
    <Section id="states" title="A shape for every stage" description="Play the reference’s icon sequence, or choose a state. Gaps join, progress sweeps clockwise, and the final strokes draw and reshape."><StatusDemo /></Section>
    <Section id="usage" title="Usage" description="Copy the status-icon folder with its Oreo cn / tv helpers and design tokens.">
      <CodeBlock code={`import { StatusIcon } from "@/components/status-icon";

<StatusIcon status="in-progress" progress="quarter" aria-label="Started" />
<StatusIcon status="in-progress" progress="half" aria-label="In progress" />
<StatusIcon status="in-progress" progress="three-quarters" aria-label="In review" />
<StatusIcon status="done" aria-label="Done" />

// A neighboring label already describes this decorative icon.
<span><StatusIcon status="blocked" /> Blocked</span>`} />
      <p className="mt-4 text-sm leading-6 text-text-secondary">Icons are decorative by default. Give a standalone icon an aria-label, and put live announcements on the surrounding status message when needed. This is a display component; wrap it in an existing Button or Menu item for interaction.</p>
    </Section>
    <Section id="sizes" title="Small enough to fit" description="The same 16, 20, 24 and 32 px scale as Oreo’s Icon. Monochrome inherits the surrounding text color.">
      <div className="flex flex-wrap items-center gap-8 rounded-card-medium border border-border-subtle bg-bg-base p-6">
        {(["sm", "md", "lg", "xl"] as const).map(size => <div key={size} className="flex items-center gap-2 text-xs text-text-secondary"><StatusIcon status="done" size={size} aria-label="Done" />{size}</div>)}
        <Button type="secondary" leadingIcon={<StatusIcon status="done" monochrome />}>Completed</Button>
      </div>
    </Section>
    <Section id="api" title="API Reference" description="Accepts native SVG attributes and className. No timer or automatic state changes run inside the component.">
      <div className="overflow-x-auto [&_table]:min-w-160"><PropsTable rows={[
        { prop: "status", type: "StatusIconState", def: "todo", desc: "backlog, planned, todo, in-progress, done, blocked or canceled." },
        { prop: "progress", type: "StatusIconProgress", def: "half", desc: "quarter, half or three-quarters. Only applies to in-progress." },
        { prop: "size", type: "sm | md | lg | xl", def: "md", desc: "16, 20, 24 or 32 px. Override with className." },
        { prop: "monochrome", type: "boolean", def: "false", desc: "Inherit currentColor instead of semantic status colors." },
        { prop: "animated", type: "boolean", def: "true", desc: "350 ms outline / progress morphs; completion finishes the sweep then draws a check. Reduced motion sets geometry immediately with an 80 ms color fade." },
        { prop: "aria-label", type: "string", desc: "Accessible name for a standalone icon. Omit when adjacent text supplies the meaning." },
      ]} /></div>
    </Section>
  </>}</DocsPage>;
}
