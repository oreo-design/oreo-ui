import { useEffect, useRef, useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock as Snippet, type PropRow } from "@/docs/primitives";
import type { TocItem } from "@/docs/OnThisPage";
import { Plan, PlanStep } from "@/components/plan";
import { Button } from "@/components/button";

const TOC: TocItem[] = [
  { id: "plan", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "progress", label: "Progress" },
  { id: "api", label: "API Reference" },
];

const PROPS: PropRow[] = [
  { prop: "title", type: "ReactNode", def: `"Plan"`, desc: "Header label; the n of m fraction is derived from steps." },
  { prop: "PlanStep.status", type: `"done" | "active" | "pending"`, def: `"pending"`, desc: "Check (zoom-in), spinner, or dot — also drives the bar." },
];

const STEPS = [
  "Scan components for legacy imports",
  "Rewrite imports to the new package",
  "Update the barrel exports",
  "Run typecheck and tests",
  "Write the migration note",
] as const;

const CODE = `import { Plan, PlanStep } from "@/components/plan";

<Plan title="Migration plan">
  <PlanStep status="done">Scan components for legacy imports</PlanStep>
  <PlanStep status="active">Rewrite imports to the new package</PlanStep>
  <PlanStep>Update the barrel exports</PlanStep>
</Plan>`;

function ProgressDemo() {
  const [current, setCurrent] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearInterval(timer.current);
    setCurrent(0);
    timer.current = window.setInterval(() => {
      setCurrent((c) => {
        if (c >= STEPS.length) {
          window.clearInterval(timer.current);
          return c;
        }
        return c + 1;
      });
    }, 1200);
  };

  useEffect(() => {
    play();
    return () => window.clearInterval(timer.current);
  }, []);

  const done = current >= STEPS.length;
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <Plan title="Migration plan">
        {STEPS.map((step, i) => (
          <PlanStep key={step} status={i < current ? "done" : i === current ? "active" : "pending"}>
            {step}
          </PlanStep>
        ))}
      </Plan>
      <Button type="secondary" size="sm" onClick={play} disabled={!done}>
        Replay
      </Button>
    </div>
  );
}

export function PlanDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage toc={TOC} breadcrumb={["Agent", "Plan"]} nav={nav}>
      {() => (
        <>
          <header id="plan" className="scroll-mt-8">
            <h1 className="text-[32px] font-semibold tracking-tight">Plan</h1>
            <p className="mt-3 max-w-prose text-[15px] leading-7 text-[var(--color-text-secondary)]">
              The agent’s task list: a thin progress bar and a step timeline with done, active, and
              pending states. Progress is derived from the steps themselves — no counters to keep in
              sync with the list.
            </p>
          </header>

          <Section id="installation" title="Installation" description="Copy the source into your project — you own the code.">
            <Snippet lang="bash" code={`npx oreo-ui add plan\n# or copy src/components/plan/* by hand`} />
          </Section>

          <Section
            id="progress"
            title="Progress"
            description="Steps advance: spinner on the active one, checks zoom in as they land, the bar eases to the new fraction."
          >
            <PreviewTabs code={CODE} preview={<ProgressDemo />} />
          </Section>

          <Section id="api" title="API Reference">
            <PropsTable rows={PROPS} />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
