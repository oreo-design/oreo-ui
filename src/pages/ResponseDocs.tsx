import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Response } from "@/components/response";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "response", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "basic", label: "Basic" },
  { id: "streaming", label: "Streaming" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "children", type: "string", desc: "Markdown source — pass the growing string while streaming." },
  { prop: "components", type: "Components", desc: "Override or extend the element renderers (react-markdown map)." },
];

const SAMPLE = `### Comparing state options

React state can live in **three places**, each with a trade-off:

1. *Component state* — fast, local, gone on unmount
2. *Context* — shared, but re-renders every consumer
3. *External store* — precise subscriptions, more setup

> Rule of thumb: start local, lift only when two components disagree.

| Option | Re-renders | Persistence |
| --- | --- | --- |
| useState | component | none |
| Context | consumers | none |
| Store | subscribers | optional |

Use \`useSyncExternalStore\` when reading a store:

\`\`\`tsx
const value = useSyncExternalStore(store.subscribe, store.read);
\`\`\`

See the [React docs](https://react.dev) for details.`;

const STREAM_SAMPLE = `**Streaming works mid-markdown.** The renderer tolerates incomplete
syntax, so you can re-render on every token:

- lists grow item by item
- \`inline code\` appears when its backtick closes
- even tables fill in row by row

\`\`\`ts
const answer = await stream(prompt);
\`\`\`

Done — no flicker, no layout jumps.`;

const CODE_BASIC = `import { Response } from "@/components/response";

<Response>{markdown}</Response>`;

const CODE_STREAM = `// re-render with the growing string as tokens arrive
<Response>{textSoFar}</Response>`;

function StreamingDemo() {
  const words = STREAM_SAMPLE.split(" ");
  const [count, setCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setCount(0);
    timer.current = window.setInterval(() => {
      setCount((c) => {
        if (c >= words.length) {
          window.clearInterval(timer.current);
          return c;
        }
        return c + 2;
      });
    }, 50);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = count >= words.length;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-4">
      <div className="min-h-[280px] w-full">
        <Response>{words.slice(0, count).join(" ")}</Response>
      </div>
      <Button type="secondary" size="sm" onClick={play} disabled={!done}>
        Replay
      </Button>
    </div>
  );
}

export function ResponseDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Chat", "Response"]} nav={nav}>
      {() => (
        <>
          <header id="response" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Response</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Assistant output as markdown, tuned for chat: tighter rhythm and smaller headings than
              document prose, GFM tables and lists, and fenced code routed into the Oreo Code Block.
              Purely presentational — feed it the streamed string and re-render as tokens arrive.
            </p>
          </header>

          <Section id="installation" title="Source" description="Depends on react-markdown + remark-gfm and the Oreo Code Block.">
            <div className="space-y-4">
              <Snippet lang="bash" code="pnpm add react-markdown remark-gfm" />
              <SourceReference source="response" />
            </div>
          </Section>

          <Section id="basic" title="Basic" description="Headings, lists, quotes, tables, links, inline and fenced code — all on Oreo tokens.">
            <PreviewTabs
              code={CODE_BASIC}
              preview={
                <div className="w-full max-w-xl">
                  <Response>{SAMPLE}</Response>
                </div>
              }
            />
          </Section>

          <Section
            id="streaming"
            title="Streaming"
            description="Markdown renders correctly mid-stream — partial syntax is tolerated, so structure appears as it closes."
          >
            <PreviewTabs code={CODE_STREAM} preview={<StreamingDemo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
