import { IconReveal } from "@/components/icon-reveal";
import { OreoLogo } from "@/docs/OreoLogo";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";

export function IconRevealDocs({ nav }: { nav: DocsNav }) {
  return <DocsPage nav={nav} breadcrumb={["Components", "Icon Reveal"]} toc={[
    { id: "introduction", label: "Introduction" }, { id: "footer", label: "Footer" }, { id: "usage", label: "Usage" }, { id: "api", label: "API Reference" },
  ]}>{() => <>
    <header id="introduction" className="scroll-mt-8 pb-8">
      <h1 className="text-3xl font-semibold tracking-tight">Icon Reveal</h1>
      <p className="mt-3 max-w-prose text-sm leading-7 text-text-secondary">A quiet wordmark with a little more inside. Move across the letters to uncover a field of icons; move away and let it settle.</p>
      <p className="mt-3 text-xs text-text-tertiary">Inspired by <a href="https://x.com/nexvyn/status/2109637850702729417" target="_blank" rel="noreferrer" className="underline underline-offset-4">Nexvyn’s Rune Icons footer</a>. Rebuilt with Oreo’s icon vocabulary and theme tokens.</p>
    </header>
    <Section id="footer" title="A finishing touch" description="Hover over the wordmark, tab to focus, or tap on a touch screen.">
      <footer className="overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base p-6 sm:p-8">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="max-w-60"><OreoLogo className="h-4 w-auto" /><p className="mt-4 text-sm leading-6 text-text-secondary">Thoughtful components.<br />A little joy in the details.</p></div>
          <nav aria-label="Example footer" className="flex gap-8 text-xs">
            <div className="space-y-3"><p className="font-medium">Explore</p><a className="block text-text-secondary hover:text-text-primary" href="/button">Components</a><a className="block text-text-secondary hover:text-text-primary" href="/settings">Patterns</a></div>
            <div className="space-y-3"><p className="font-medium">Create</p><a className="block text-text-secondary hover:text-text-primary" href="/icon-reveal">Playground</a><a className="block text-text-secondary hover:text-text-primary" href="#usage">Get started</a></div>
          </nav>
        </div>
        <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-border-subtle pt-4 text-xs text-text-tertiary"><span>Made to be yours.</span><span>Oreo UI · Components for the details</span></div>
        <IconReveal className="mt-6" />
      </footer>
    </Section>
    <Section id="usage" title="Usage" description="Copy the icon-reveal folder alongside Oreo’s Icon adapter, cn helper and theme tokens.">
      <CodeBlock code={'import { IconReveal } from "@/components/icon-reveal";\n\n<IconReveal text="Oreo UI" radius="md" density="regular" />'} />
      <p className="mt-4 text-sm leading-6 text-text-secondary">Use it as a decorative wordmark in a footer or hero. It contains no links or network calls. Focus reveals the full texture; touch toggles it without blocking page scrolling. Reduced motion removes pointer lag and fades. Multiple instances keep their masks separate.</p>
    </Section>
    <Section id="api" title="API Reference" description="Accepts div attributes and className. The wordmark scales to its container and fits long labels automatically.">
      <div className="overflow-x-auto rounded-card-small outline-none focus-visible:ring-2 focus-visible:ring-status-progress" role="region" aria-label="Icon Reveal properties" tabIndex={0}><div className="min-w-2xl"><PropsTable rows={[
        { prop: "text", type: "string", def: "Oreo UI", desc: "The wordmark, rendered as real SVG text using the project font." },
        { prop: "radius", type: '"sm" | "md" | "lg"', def: "md", desc: "The spotlight size, relative to the wordmark." },
        { prop: "density", type: '"fine" | "regular" | "coarse"', def: "regular", desc: "Icon spacing and size within the letters." },
        { prop: "revealed", type: "boolean", def: "false", desc: "Show the complete icon texture." },
        { prop: "animated", type: "boolean", def: "true", desc: "Enable the soft pointer follow and enter/leave fades. Respects reduced motion." },
      ]} /></div></div>
    </Section>
  </>}</DocsPage>;
}
