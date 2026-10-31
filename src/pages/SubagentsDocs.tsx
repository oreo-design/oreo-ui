import { SourceReference } from "@/docs/SourceReference";
import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { SubagentList, Subagent } from "@/components/subagents";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "subagents", label: "Introduction" },
  { id: "installation", label: "Source" },
  { id: "fanout", label: "Fan-out" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "name", type: "ReactNode", desc: "What the agent is doing." },
  { prop: "meta", type: "ReactNode", desc: "Right-edge caption — model, role, duration." },
  { prop: "status", type: `"running" | "done" | "error"`, def: `"running"`, desc: "Spinner, mint check, or error warning; tints the bar." },
  { prop: "progress", type: "number", desc: "0–100; defaults to 0 running / 100 settled." },
];

const AGENTS = [
  { name: "Audit color contrast", meta: "haiku" },
  { name: "Sweep unused exports", meta: "sonnet" },
  { name: "Draft migration notes", meta: "sonnet" },
] as const;

const CODE = `import { SubagentList, Subagent } from "@/components/subagents";

<SubagentList>
  <Subagent name="Audit color contrast" meta="haiku" status="done" />
  <Subagent name="Sweep unused exports" meta="sonnet" status="running" progress={60} />
</SubagentList>`;

function Demo() {
  const [tick, setTick] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setTick(0);
    timer.current = window.setInterval(() => {
      setTick((t) => {
        if (t >= 12) {
          window.clearInterval(timer.current);
          return t;
        }
        return t + 1;
      });
    }, 500);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
  }, []);

  // Each agent advances at its own pace; done at different times.
  const speeds = [3.4, 2.1, 1.4];
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <SubagentList>
        {AGENTS.map((agent, i) => {
          const value = Math.min(100, Math.round(tick * speeds[i] * 3.2));
          return (
            <Subagent
              key={agent.name}
              name={agent.name}
              meta={agent.meta}
              status={value >= 100 ? "done" : "running"}
              progress={value}
            />
          );
        })}
      </SubagentList>
      <Button type="secondary" size="sm" onClick={play} disabled={tick < 12}>
        Replay
      </Button>
    </div>
  );
}

export function SubagentsDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Subagents"]} nav={nav}>
      {() => (
        <>
          <header id="subagents" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Subagents</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              Parallel delegated work as a stack of agent cards — status, task, model, and an eased
              progress bar per agent. Complements Plan: Plan is one agent's checklist, Subagents is
              the fan-out.
            </p>
          </header>

          <Section id="installation" title="Source" description="Use the source from this internal repository.">
            <SourceReference source="subagents" />
          </Section>

          <Section id="fanout" title="Fan-out" description="Agents advance at their own pace; checks land as each finishes.">
            <PreviewTabs code={CODE} preview={<Demo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
