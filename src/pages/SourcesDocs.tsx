import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Sources, Source } from "@/components/sources";

const TOC: TocItem[] = [
  { id: "sources", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "basic", label: "Basic" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "label", type: "ReactNode", def: `"Sources"`, desc: "Trigger pill label." },
  { prop: "count", type: "number", def: "children count", desc: "Override the derived count." },
  { prop: "open / defaultOpen", type: "boolean", desc: "Controlled / uncontrolled disclosure." },
  { prop: "Source", type: "{ domain, title, icon?, …<a> }", desc: "A citation card — favicon letter, domain, 2-line title. Renders an anchor." },
];

const CODE = `import { Sources, Source } from "@/components/sources";

<Sources defaultOpen>
  <Source domain="react.dev" href="https://react.dev/reference/react/memo" title="memo – React Reference" />
  <Source domain="web.dev" href="https://web.dev/articles/optimize-long-tasks" title="Optimize long tasks" />
</Sources>`;

export function SourcesDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Sources"]} nav={nav}>
      {() => (
        <>
          <header id="sources" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Sources</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Citations behind an answer, tucked into a soft pill with a count. Expanding reveals a grid
              of link cards — favicon letter, domain, and a two-line title — each a plain anchor.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add sources\n# or copy src/components/sources/* by hand`} />
          </Section>

          <Section id="basic" title="Basic" description="Cards lift a pixel on hover. Count is derived from children unless overridden.">
            <PreviewTabs
              code={CODE}
              preview={
                <div className="w-full max-w-xl">
                  <Sources defaultOpen>
                    <Source domain="react.dev" href="https://react.dev/reference/react/memo" title="memo – React Reference" />
                    <Source domain="web.dev" href="https://web.dev/articles/optimize-long-tasks" title="Optimize long tasks: how to schedule work" />
                    <Source domain="developer.mozilla.org" href="https://developer.mozilla.org/docs/Web/API/ResizeObserver" title="ResizeObserver — Web APIs | MDN" />
                    <Source domain="github.com" href="https://github.com/reactwg/react-18/discussions" title="React 18 Working Group discussions" />
                  </Sources>
                </div>
              }
            />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
