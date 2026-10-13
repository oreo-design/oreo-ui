import { useState } from "react";
import { GradientMask, type GradientMaskEasing, type GradientMaskOptions } from "@/components/gradient-mask";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable, Slider, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";

const PHOTO = "/examples/gradient-mask/kyoto.jpg";
const TOC: TocItem[] = [
  { id: "gradient-mask", label: "Introduction" },
  { id: "playground", label: "Playground" },
  { id: "usage", label: "Usage" },
  { id: "directions", label: "Directions" },
  { id: "api", label: "API Reference" },
];
const PROPS: PropRow[] = [
  { prop: "direction", type: '"top" | "right" | "bottom" | "left"', def: '"bottom"', desc: "The edge to fade toward." },
  { prop: "easing", type: '"linear" | "ease-in" | "ease-out" | "ease-in-out"', def: '"ease-in-out"', desc: "Linear, quadratic in/out, or a smoothstep S-curve." },
  { prop: "start", type: "number", def: "0", desc: "Fade start, as a percentage along the direction." },
  { prop: "end", type: "number", def: "100", desc: "Fade end, clamped between start and 100. Equal values create a hard edge." },
  { prop: "strength", type: "number", def: "1", desc: "0 preserves the content; 1 fully fades the ending edge." },
  { prop: "children", type: "ReactNode", desc: "The image, texture, or decorative content to mask." },
  { prop: "…props", type: "div props", desc: "Native attributes, ref, className and style pass through." },
];

function TravelCard({ easing, start = 0, end = 100, strength = 1 }: GradientMaskOptions) {
  return (
    <article className="relative isolate aspect-[3/4] overflow-hidden rounded-2xl bg-[var(--color-code-bg)] text-[var(--color-code-fg)]">
      <GradientMask easing={easing} start={start} end={end} strength={strength} className="absolute inset-0">
        <img src={PHOTO} alt="Yasaka Pagoda above the streets of Kyoto at dusk" className="h-full w-full object-cover" />
      </GradientMask>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-palette-orange-bg)]">A little further</p>
        <h3 className="mt-2 text-4xl font-semibold tracking-tight">Kyoto</h3>
        <p className="mt-2 max-w-56 text-xs leading-relaxed opacity-80">Quiet streets, lantern light, and a different pace of life.</p>
        <div className="mt-5 flex justify-between border-t border-current/20 pt-3 text-[10px] font-medium uppercase tracking-wider">
          <span>35.0116° N</span><span>Japan</span>
        </div>
      </div>
    </article>
  );
}

function Playground() {
  const [easing, setEasing] = useState<GradientMaskEasing>("ease-in-out");
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [strength, setStrength] = useState(1);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)]">
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6" data-testid="gradient-comparison">
        <figure className="min-w-0">
          <TravelCard easing="linear" start={start} end={end} strength={strength} />
          <figcaption className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-secondary)]"><span>Linear</span><span className="font-mono text-[10px]">constant falloff</span></figcaption>
        </figure>
        <figure className="min-w-0">
          <TravelCard easing={easing} start={start} end={end} strength={strength} />
          <figcaption className="mt-3 flex items-center justify-between text-xs"><span>Eased mask</span><span className="font-mono text-[10px] text-[var(--color-text-secondary)]">{easing}</span></figcaption>
        </figure>
      </div>
      <div className="space-y-4 border-t border-[var(--color-border-subtle)] p-5 sm:p-6">
        <label className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[var(--color-text-secondary)]">
          Opacity curve
          <select value={easing} onChange={(event) => setEasing(event.target.value as GradientMaskEasing)} className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-base)] px-3 py-2 text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2">
            <option value="linear">Linear</option><option value="ease-in">Ease in</option><option value="ease-out">Ease out</option><option value="ease-in-out">Ease in out</option>
          </select>
        </label>
        <Slider label="Fade start" value={start} min={0} max={95} step={1} suffix="%" onChange={(value) => { setStart(value); setEnd((previous) => Math.max(previous, value + 5)); }} />
        <Slider label="Fade end" value={end} min={start + 5} max={100} step={1} suffix="%" onChange={setEnd} />
        <Slider label="Strength" value={strength} min={0} max={1} step={0.05} onChange={setStrength} />
        <p className="text-xs leading-5 text-[var(--color-text-secondary)]">The same photo and fade range. Only the opacity curve changes. These controls update the mask immediately.</p>
      </div>
    </div>
  );
}

export function GradientMaskDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Components", "Gradient Mask"]} nav={nav}>
      {() => <>
        <header id="gradient-mask" className="scroll-mt-8 pb-8">
          <h1 className="text-[32px] font-semibold tracking-tight">Gradient Mask</h1>
          <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">A softer way to fade. Ease an image into its background while keeping the details that matter. Pure CSS masking, with a curve you can tune.</p>
          <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">Inspired by <a href="https://x.com/bestdesignsonx/status/2106897161212338600" target="_blank" rel="noreferrer" className="underline underline-offset-4">@jh3yy’s Gradient Card</a>. An independent Oreo UI implementation.</p>
        </header>
        <Section id="playground" title="A little easing goes a long way" description="Keep the sky clear. Let the foreground settle gently into the surface.">
          <Playground />
        </Section>
        <Section id="usage" title="Usage" description="Copy src/components/gradient-mask into your project. React is the only dependency.">
          <CodeBlock code={`import { GradientMask } from "@/components/gradient-mask";

<article className="relative overflow-hidden rounded-2xl bg-[var(--color-code-bg)]">
  <GradientMask easing="ease-in-out" start={0} end={100}>
    <img src="/photo.jpg" alt="Kyoto at dusk" className="w-full" />
  </GradientMask>
  {/* Keep readable content outside the mask. */}
  <h3 className="absolute bottom-6 left-6 text-[var(--color-code-fg)]">Kyoto</h3>
</article>`} />
          <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">The mask removes opacity; it adds no color. The parent surface shows through, so the same component works on light, dark, and colored backgrounds. Keep focusable controls outside faded regions: masking does not remove content from keyboard navigation or assistive technology.</p>
        </Section>
        <Section id="directions" title="Every edge, any surface" description="Fade toward an edge. The surrounding surface comes through naturally.">
          <div className="grid grid-cols-2 gap-4">
            {(["top", "right", "bottom", "left"] as const).map((direction) => (
              <figure key={direction} className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-palette-purple-bg)]">
                <GradientMask direction={direction} className="aspect-square sm:aspect-video">
                  <img src={PHOTO} alt="" loading="lazy" className="h-full w-full object-cover" />
                </GradientMask>
                <figcaption className="px-4 py-3 text-xs capitalize text-[var(--color-palette-purple-text)]">{direction}</figcaption>
              </figure>
            ))}
          </div>
        </Section>
        <Section id="api" title="API Reference" description="GradientMask accepts native div props. Numeric options are clamped to their valid ranges.">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Gradient Mask properties"><div className="min-w-2xl"><PropsTable rows={PROPS} /></div></div>
          <p className="my-4 text-sm leading-6 text-[var(--color-text-secondary)]">Need the mask on an existing element? gradientMaskImage accepts the same options and returns a CSS gradient. Set both maskImage and WebkitMaskImage.</p>
          <CodeBlock code={`import { gradientMaskImage } from "@/components/gradient-mask";

const mask = gradientMaskImage({ direction: "right", start: 25 });
<img src="/photo.jpg" alt="Kyoto" style={{ maskImage: mask, WebkitMaskImage: mask }} />`} />
        </Section>
        <footer className="border-t border-[var(--color-border-subtle)] py-8 text-xs leading-6 text-[var(--color-text-secondary)]">Demo photo: <a href="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e" target="_blank" rel="noreferrer" className="underline underline-offset-4">Kyoto, Unsplash</a>. The image is only used by this documentation example.</footer>
      </>}
    </DocsPage>
  );
}
