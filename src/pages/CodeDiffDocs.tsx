import { SourceReference } from "@/docs/SourceReference";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { CodeDiff, type DiffLine } from "@/components/code-diff";

const TOC: TocItem[] = [
  { id: "code-diff", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "basic", label: "Basic" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "title", type: "ReactNode", desc: "Filename in the header." },
  { prop: "lines", type: "DiffLine[]", desc: `{ type: "add" | "remove" | "context", content } — the +N −N tally is derived.` },
];

const LINES: DiffLine[] = [
  { type: "context", content: "export function Button({" },
  { type: "remove", content: "  type = 'primary'," },
  { type: "add", content: "  type = 'secondary'," },
  { type: "add", content: "  size = 'md'," },
  { type: "context", content: "  ...rest" },
  { type: "context", content: "}: ButtonProps) {" },
];

const CODE = `import { CodeDiff } from "@/components/code-diff";

<CodeDiff
  title="src/components/button/button.tsx"
  lines={[
    { type: "context", content: "export function Button({" },
    { type: "remove", content: "  type = 'primary'," },
    { type: "add", content: "  type = 'secondary'," },
  ]}
/>`;

export function CodeDiffDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Code Diff"]} nav={nav}>
      {() => (
        <>
          <header id="code-diff" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Code Diff</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A proposed change as a compact unified diff — the natural payload for a Confirmation
              detail slot or an editing tool result. Light surface so the add/remove tints read, with
              the tally derived from the lines.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="code-diff" />
          </Section>

          <Section id="basic" title="Basic" description="Adds tint mint, removals tint the error palette, context stays quiet.">
            <PreviewTabs
              code={CODE}
              preview={<CodeDiff title="src/components/button/button.tsx" lines={LINES} className="max-w-xl" />}
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
