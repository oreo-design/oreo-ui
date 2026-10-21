import { CodeFocus, SheetTimeline, SHEET_CODE } from "@/components/motion-code";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

export function MotionCodeDocs({ nav }: { nav: DocsNav }) {
  const focus = nav.active === "code-focus";
  const title = focus ? "Code Focus" : "Sheet Timeline";
  return <DocsPage nav={nav} breadcrumb={["Components", title]} toc={[{id:"overview",label:"Overview"},{id:"usage",label:"Usage"},{id:"api",label:"API"},{id:"behavior",label:"Behavior"}]}>{() => <>
    <header id="overview" className="pb-8"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-4 text-sm leading-7 text-text-secondary">{focus ? "A vertical focus window that resolves code as you explore. Dimmed character noise preserves the shape of the surrounding source." : "A seekable phone diagram that explains a bottom sheet’s entrance, overshoot and settle."}</p><a className="mt-4 inline-block text-sm underline" href="/motion-code-studio">Open Motion Code Studio ↗</a></header>
    <Section id="usage" title="Usage" description="Copy the motion-code folder. Uses Oreo tokens, cn and Motion’s reduced-motion hook; no additional dependency."><CodeBlock code={focus ? 'import { CodeFocus, SHEET_CODE } from "@/components/motion-code";\n\n<CodeFocus code={SHEET_CODE} value={focus}\n  onValueChange={setFocus} focusLines={5} />' : 'import { SheetTimeline } from "@/components/motion-code";\n\n<SheetTimeline progress={60} guides />'} /></Section>
    <Section id="api" title="API"><PropsTable rows={focus ? [
      {prop:"code",type:"string",desc:"Plain source; CRLF is normalized. Empty source shows a centered explanation and removes the slider. Keep snippets short enough for their containing view."},
      {prop:"value / defaultValue",type:"number (0–100)",desc:"Controlled or initial vertical focus. Nonfinite values become zero; finite values clamp. Controlled value remains authoritative."},
      {prop:"onValueChange",type:"(value: number) => void",desc:"Continuous focus changes. Keyboard arrows step a row; Page Up/Down step a band; Home/End select edges. Callbacks carry normalized focus, not CSS animation time."},
      {prop:"focusLines",type:"number = 5",desc:"Independent band size; rounded and clamped to the available lines."},
      {prop:"scramble",type:"boolean = true",desc:"Stable noise outside focus. Three bounded text updates resolve a changed row within 120ms. False keeps real code visible."},
      {prop:"disabled / label / className",type:"boolean / string / string",desc:"Disabled removes input and tab stop; label names the slider. The complete untouched source remains available to assistive technology."},
    ] : [
      {prop:"progress",type:"number = 60",desc:"0–100, clamped. The sheet moves 100% → -4% → 0 at 0/60/100. Opacity reaches one at 60. This is a diagram, not a real modal or drawer."},
      {prop:"guides",type:"boolean = true",desc:"Independent timeline ruler, resting guide and blue position markers."},
      {prop:"label / className",type:"string / string",desc:"Accessible figure label and normal layout classes. Custom content is deliberately outside this explanatory diagram’s scope."},
    ]} /></Section>
    <Section id="behavior" title="Interaction & composition"><div className="rounded-card-medium border border-border-subtle bg-bg-elevated p-4">{focus ? <CodeFocus code={SHEET_CODE} /> : <SheetTimeline progress={60} />}</div><p className="mt-4 text-sm leading-7 text-text-secondary">{focus ? "Mouse movement follows vertical position on fine pointers. Touch and pen require a primary-pointer drag with capture; cancellation restores the starting value. The ns-resize cursor denotes scrubbing, rather than text editing. Keyboard and reduced-motion input resolve instantly. Source text never changes: scrambled visuals are hidden from assistive technology." : "The host owns progress. The Studio pairs this figure with CodeFocus, explicit playback and a native range control. Reduced motion replaces sheet movement with opacity; blue moving markers are removed. No device interaction or network data is simulated."}</p><p className="mt-3 text-sm leading-7 text-text-secondary">The Studio has no autoplay or loop. Playback pauses when the document is hidden, manual input interrupts immediately, and toggles preserve the current position. Read source provides a readable, copyable alternative. These are explanatory states, with no loading, permission or asynchronous failure states.</p><a className="mt-4 inline-block text-sm underline" href="https://x.com/emilkowalski/status/2112146246299259017" target="_blank" rel="noreferrer">Video reference by Emil Kowalski ↗</a></Section>
  </>}</DocsPage>;
}
