import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Terminal, TerminalLine } from "@/components/terminal";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "terminal", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "streaming", label: "Streaming run" },
  { id: "failure", label: "Failure" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "command", type: "string", desc: "The command line after the $ prompt." },
  { prop: "running", type: "boolean", def: "false", desc: "Spinner in the header, pulsing caret after output." },
  { prop: "exitCode", type: "number", def: "0", desc: "Shown when done; non-zero uses the error tone." },
  { prop: "children", type: "ReactNode", desc: "Output — TerminalLine adds a fade-in per streamed line." },
];

const OUTPUT = [
  "vite v6.0.0 building for production...",
  "transforming 214 modules",
  "rendering chunks...",
  "dist/index.html          0.46 kB",
  "✓ built in 1.79s",
] as const;

const CODE = `import { Terminal, TerminalLine } from "@/components/terminal";

<Terminal command="pnpm build" running={running} exitCode={0}>
  {lines.map((line, i) => (
    <TerminalLine key={i}>{line}</TerminalLine>
  ))}
</Terminal>`;

function StreamingDemo() {
  const [count, setCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setCount(0);
    timer.current = window.setInterval(() => {
      setCount((c) => {
        if (c >= OUTPUT.length) {
          window.clearInterval(timer.current);
          return c;
        }
        return c + 1;
      });
    }, 700);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
  }, []);

  const running = count < OUTPUT.length;
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <Terminal command="pnpm build" running={running}>
        {OUTPUT.slice(0, count).map((line, i) => (
          <TerminalLine key={line + i}>{line}</TerminalLine>
        ))}
      </Terminal>
      <Button type="secondary" size="sm" onClick={play} disabled={running}>
        Replay
      </Button>
    </div>
  );
}

export function TerminalDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Terminal"]} nav={nav}>
      {() => (
        <>
          <header id="terminal" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Terminal</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              A shell run in the transcript, on the same ink surface as Code Block: prompt and command
              up top with a live status, dimmed streaming output below, the last line lifted for the
              verdict.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="terminal" />
          </Section>

          <Section id="streaming" title="Streaming run" description="Lines fade in; the caret pulses until the run lands and exit 0 zooms in.">
            <PreviewTabs code={CODE} preview={<StreamingDemo />} />
          </Section>

          <Section id="failure" title="Failure" description="Non-zero exit renders in the error tone.">
            <PreviewTabs
              code={`<Terminal command="pnpm test" exitCode={1}>…</Terminal>`}
              preview={
                <Terminal command="pnpm test" exitCode={1} className="max-w-xl">
                  <TerminalLine>FAIL src/lib/parse.test.ts</TerminalLine>
                  <TerminalLine>  ● parse › handles empty input</TerminalLine>
                  <TerminalLine>Tests: 1 failed, 12 passed</TerminalLine>
                </Terminal>
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
