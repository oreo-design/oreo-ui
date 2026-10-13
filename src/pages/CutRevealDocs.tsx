import { useState } from "react";
import { CutReveal } from "@/components/cut-reveal";
import { Button } from "@/components/button";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable, type PropRow } from "@/docs/primitives";

const PROPS: PropRow[] = [
  { prop: "wordmark", type: "ReactNode", desc: "Non-interactive artwork on the upper curtain." },
  { prop: "children", type: "ReactNode", desc: "The content revealed by the opening. Remains mounted and inert until revealed." },
  { prop: "duration", type: "number", def: "5200", desc: "Curtain timeline in milliseconds, clamped to 1000–12000. Not actual loading progress." },
  { prop: "skipLabel", type: "string", def: '"Skip intro"', desc: "Accessible label for the skip button." },
  { prop: "onReveal", type: "() => void", desc: "Called once when the intro ends or is skipped." },
  { prop: "className / style", type: "string / CSSProperties", desc: "Size the container and customize --cut-color / --cut-ink." },
];

export function CutRevealDocs({ nav }: { nav: DocsNav }) {
  const [replay, setReplay] = useState(0);
  return <DocsPage nav={nav} breadcrumb={["Components", "Cut Reveal"]} toc={[{ id: "intro", label: "Introduction" }, { id: "preview", label: "Preview" }, { id: "usage", label: "Usage" }, { id: "api", label: "API reference" }]}>
    {() => <>
      <header id="intro" className="pb-8"><h1 className="text-[32px] font-semibold tracking-tight">Cut Reveal</h1><p className="mt-3 max-w-prose text-[15px] leading-7 text-text-secondary">A little anticipation. A clean cut. Two sheets part to reveal what comes next.</p><p className="mt-3 text-xs text-text-tertiary">Inspired by <a href="https://x.com/awwwards/status/2109917839805001781" className="underline" target="_blank" rel="noreferrer">Neutomni’s opening, featured by Awwwards</a>. Independently implemented in React and CSS.</p></header>
      <Section id="preview" title="Cut along the line" description="A one-time brand introduction, with an always-available skip action.">
        <CutReveal key={replay} wordmark={<div className="text-[clamp(48px,10vw,120px)] font-semibold leading-none tracking-tighter">OREO®</div>} className="rounded-card-medium border border-border-subtle">
          <div className="flex min-h-96 flex-col items-center justify-center gap-4 bg-bg-surface p-8 text-center"><span className="text-xs uppercase tracking-widest text-text-secondary">Made to be yours</span><h2 className="text-4xl font-medium tracking-tight">Good things inside.</h2><a href="/neutomni-intro" className="mt-4 rounded-full bg-bg-inverse px-5 py-3 text-sm text-text-on-inverse">Open the reference demo ↗</a></div>
        </CutReveal>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><Button type="secondary" size="sm" onClick={() => setReplay(value => value + 1)}>Replay intro</Button><a href="/neutomni-intro" className="text-sm underline underline-offset-4">Full Neutomni recreation ↗</a></div>
      </Section>
      <Section id="usage" title="Usage" description="Copy src/components/cut-reveal and the cn utility. React and your existing Oreo tokens are all it needs."><CodeBlock code={`import { CutReveal } from "@/components/cut-reveal";

<CutReveal
  key={replayCount}
  duration={5200}
  wordmark={<YourWordmark />}
  onReveal={() => console.log("Ready")}
>
  <YourPage />
</CutReveal>`} /><p className="mt-4 text-sm leading-6 text-text-secondary">Set a new React key to replay. The counter describes the intro timeline, not resource loading. Keep the content’s dimensions stable while the curtain opens. Reduced motion replaces the cutting sequence with a brief fade; Skip reveals the content immediately and moves focus into it.</p></Section>
      <Section id="api" title="API reference"><div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Cut Reveal properties"><div className="min-w-2xl"><PropsTable rows={PROPS} /></div></div><p className="mt-4 text-sm leading-6 text-text-secondary">The default surface follows Oreo’s light and dark themes. Override --cut-color and --cut-ink on the component to create a brand skin. The Neutomni example keeps its original red and white art direction in both themes.</p></Section>
      <footer className="border-t border-border-subtle py-8 text-xs leading-6 text-text-secondary">The full example uses Neutomni’s wordmark, project still and hosted showreel for visual reference. These brand assets are separate from the reusable component. Studio links lead to the original site.</footer>
    </>}
  </DocsPage>;
}
