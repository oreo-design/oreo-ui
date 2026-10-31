import { SourceReference } from "@/docs/SourceReference";
import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, Segmented, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { CodeBlock, CodeBlockAction } from "@/components/code-block";
import { Icon } from "@/components/icon";

const TOC: TocItem[] = [
  { id: "code-block", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "basic", label: "Basic" },
  { id: "filename", label: "Filename & actions" },
  { id: "wrap", label: "Line wrap" },
  { id: "bare", label: "Bare" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "code", type: "string", desc: "The source text to display and copy." },
  { prop: "language", type: "string", desc: "Language label in the header, e.g. \"tsx\"." },
  { prop: "title", type: "string", desc: "Filename — replaces the language label when set." },
  { prop: "header", type: "boolean", def: "true", desc: "Hide for a bare code surface." },
  { prop: "wrap", type: "boolean", def: "false", desc: "Soft-wrap long lines instead of scrolling." },
  { prop: "copyable", type: "boolean", def: "true", desc: "Show the copy button (copy → check swap)." },
  { prop: "highlight", type: "boolean", def: "true", desc: "Lazy shiki syntax highlighting when language is set; plain text if the grammar can't load." },
  { prop: "actions", type: "ReactNode", desc: "Extra header actions before the copy button." },
];

const SAMPLE = `export function greet(name: string) {
  const message = \`Hello, \${name}! Welcome to Oreo UI.\`;
  return message;
}`;

const LONG_LINE = `const config = { theme: "oreo", tokens: { radius: 8, spacing: [2, 4, 6, 8, 12], palette: ["mint", "pink", "blue", "purple", "orange", "brown"] } };`;

const CODE_BASIC = `import { CodeBlock } from "@/components/code-block";

<CodeBlock language="tsx" code={source} />`;

const CODE_TITLE = `<CodeBlock
  title="greet.ts"
  actions={<CodeBlockAction aria-label="Expand">…</CodeBlockAction>}
  code={source}
/>`;

function WrapDemo() {
  const [wrap, setWrap] = useState<"wrap" | "scroll">("wrap");
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Segmented label="Overflow" value={wrap} options={["wrap", "scroll"] as const} onChange={setWrap} />
      <CodeBlock language="ts" code={LONG_LINE} wrap={wrap === "wrap"} />
    </div>
  );
}

export function CodeBlockDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Code Block"]} nav={nav}>
      {() => (
        <>
          <header id="code-block" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Code Block</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A code surface for assistant responses and docs. Intentionally dark in both themes so code
              always reads the same, with a quiet header for the language or filename and a copy action
              with a copy → check swap.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="code-block" />
          </Section>

          <Section id="basic" title="Basic" description="Language label left, copy right. The body scrolls horizontally by default.">
            <PreviewTabs
              code={CODE_BASIC}
              preview={<CodeBlock language="tsx" code={SAMPLE} className="w-full max-w-xl" />}
            />
          </Section>

          <Section
            id="filename"
            title="Filename & actions"
            description="Set title to show a filename instead of the language. Extra header actions slot in before copy."
          >
            <PreviewTabs
              code={CODE_TITLE}
              preview={
                <CodeBlock
                  title="greet.ts"
                  code={SAMPLE}
                  className="w-full max-w-xl"
                  actions={
                    <CodeBlockAction aria-label="Expand">
                      <Icon name="expand" size="sm" />
                    </CodeBlockAction>
                  }
                />
              }
            />
          </Section>

          <Section id="wrap" title="Line wrap" description="Long lines scroll by default; wrap soft-wraps them for prose-adjacent code.">
            <PreviewTabs code={`<CodeBlock wrap code={longLine} />`} preview={<WrapDemo />} />
          </Section>

          <Section id="bare" title="Bare" description="Drop the header for inline snippets inside a Response or a tool result.">
            <PreviewTabs
              code={`<CodeBlock header={false} code={source} />`}
              preview={<CodeBlock header={false} code={SAMPLE} className="w-full max-w-xl" />}
            />
          </Section>

          <Section id="api" title="API Reference" description="CodeBlock extends native <div> props.">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
