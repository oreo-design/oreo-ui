import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { ToolCall, ToolCallRow } from "@/components/tool-call";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "tool-call", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "detail", label: "Request & result" },
  { id: "error", label: "Error" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "name", type: "ReactNode", desc: "Resting label — \"Searched the web\"." },
  { prop: "activeLabel", type: "ReactNode", def: "name", desc: "Shimmered caption while running." },
  { prop: "badge", type: "ReactNode", desc: "Argument chip next to the label — query, path…" },
  { prop: "state", type: `"running" | "complete" | "error"`, def: `"complete"`, desc: "Drives shimmer, check, or error tint." },
  { prop: "open / defaultOpen", type: "boolean", desc: "Controlled / uncontrolled disclosure." },
  { prop: "ToolCallRow", type: "{ label, mono? }", desc: "A labeled block inside the panel; rows are divided by hairlines." },
];

const CODE_LIFECYCLE = `import { ToolCall, ToolCallRow } from "@/components/tool-call";

<ToolCall
  state={running ? "running" : "complete"}
  name="Searched the web"
  activeLabel="Searching the web"
  badge="react 19 forwardRef"
>
  <ToolCallRow label="Request" mono>{request}</ToolCallRow>
  <ToolCallRow label="Result">{result}</ToolCallRow>
</ToolCall>`;

function LifecycleDemo() {
  const [running, setRunning] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearTimeout(timer.current);
    setRunning(true);
    timer.current = window.setTimeout(() => setRunning(false), 2600);
  };

  useEffect(() => {
    play();
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-3">
      <ToolCall
        state={running ? "running" : "complete"}
        name="Searched the web"
        activeLabel="Searching the web"
        badge="react 19 forwardRef"
      >
        <ToolCallRow label="Request" mono>
          {`{ "query": "react 19 forwardRef removal" }`}
        </ToolCallRow>
        <ToolCallRow label="Result">12 pages — ref is now a regular prop in function components.</ToolCallRow>
      </ToolCall>
      <Button type="secondary" size="sm" onClick={play} disabled={running}>
        Replay
      </Button>
    </div>
  );
}

export function ToolCallDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Tool Call"]} nav={nav}>
      {() => (
        <>
          <header id="tool-call" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Tool Call</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              What the agent is doing, as a quiet line in the transcript: a shimmered caption while the
              tool runs, swapping to a resting name with a zoom-in check when it lands. The disclosure
              opens a soft panel for the raw request and result.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="tool-call" />
          </Section>

          <Section
            id="lifecycle"
            title="Lifecycle"
            description="running → complete: the caption shimmers, then width-morphs to the resting name as the check zooms in."
          >
            <PreviewTabs code={CODE_LIFECYCLE} preview={<LifecycleDemo />} />
          </Section>

          <Section id="detail" title="Request & result" description="Rows inside the panel, divided by hairlines. mono suits raw payloads.">
            <PreviewTabs
              code={`<ToolCall defaultOpen name="Read file" badge="src/App.tsx">…</ToolCall>`}
              preview={
                <div className="w-full max-w-xl">
                  <ToolCall defaultOpen name="Read file" badge="src/App.tsx">
                    <ToolCallRow label="Request" mono>
                      {`{ "path": "src/App.tsx", "lines": "1-40" }`}
                    </ToolCallRow>
                    <ToolCallRow label="Result">40 lines — default export renders the docs router.</ToolCallRow>
                  </ToolCall>
                </div>
              }
            />
          </Section>

          <Section id="error" title="Error" description="state='error' tints the line and swaps the check for a warning.">
            <PreviewTabs
              code={`<ToolCall state="error" name="Fetch failed" badge="api.example.com">…</ToolCall>`}
              preview={
                <div className="w-full max-w-xl">
                  <ToolCall state="error" name="Fetch failed" badge="api.example.com">
                    <ToolCallRow label="Error" mono>ECONNREFUSED — connection refused after 3 retries</ToolCallRow>
                  </ToolCall>
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
