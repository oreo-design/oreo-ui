import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "budget-cap-control": {
    name: "BudgetCapControl",
    description:
      "A bounded, controlled cap with a visible spent floor, native slider and clear boundary explanations.",
    code: "<BudgetCapControl value={cap} spent={64000} planMax={200000}\n onChange={setCap} step={5000} />",
    rows: [
      {
        prop: "value / spent / planMax",
        type: "number",
        desc: "Integer USD cents. 0 ≤ spent ≤ value ≤ planMax; planMax must be positive. Invalid input renders the shared error state.",
      },
      {
        prop: "onChange / step",
        type: "callback / number",
        desc: "Controlled cap. Step defaults to 5,000 cents ($50). Native pointer input snaps to the step; exact spent floor and plan maximum remain reachable. Home/End reach bounds; arrows and Page keys use one step.",
      },
      {
        prop: "disabled",
        type: "boolean",
        desc: "Disables slider and both step buttons. Boundary buttons remain operable when enabled so their constraint can be explained.",
      },
    ],
  },
  "budget-outcome": {
    name: "BudgetOutcome",
    description:
      "Translate remaining allowance into affordable whole runs and time at the current pace.",
    code: "<BudgetOutcome budget={{cap:120000, spent:64000, planMax:200000,\n costPerRun:25, dailySpend:4000, daysToReset:16}} />",
    rows: [
      {
        prop: "budget",
        type: "BudgetInputs",
        desc: "Money uses integer USD cents. costPerRun > 0, dailySpend ≥ 0, daysToReset > 0. Remaining = cap − spent; runs = floor(remaining / costPerRun). Days = remaining / dailySpend.",
      },
      {
        prop: "Zero pace / no affordable runs",
        type: "derived state",
        desc: "Zero daily pace shows No recent spend, never Infinity. No affordable whole run shows Paused. Through reset means the current pace fits the remaining reset horizon, not a guarantee.",
      },
    ],
  },
  "monthly-budget-card": {
    name: "MonthlyBudgetCard",
    description:
      "Compose cap editing, run/time estimates, reset metadata and explicit draft/save actions.",
    code: "<MonthlyBudgetCard budget={draftBudget} onChange={setCap}\n dirty={cap !== savedCap} onSave={saveBudget} onCancel={discardDraft} />",
    rows: [
      {
        prop: "budget / onChange",
        type: "BudgetInputs / callback",
        desc: "Host owns draft cap and actual spend. Composes BudgetCapControl and BudgetOutcome.",
      },
      {
        prop: "dirty / onSave / onCancel",
        type: "boolean / callback / optional callback",
        desc: "Save is enabled only for a changed valid draft. Host owns persistence and failures. Cancel appears for a dirty draft when provided.",
      },
      {
        prop: "resetLabel / disabled",
        type: "string / boolean",
        desc: "Human-readable reset label (Nov 1 by default), and interaction lock. This component does not schedule resets or perform billing.",
      },
    ],
  },
};
export function AgentBudgetDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["monthly-budget-card"];
  const title = s.name.replace(/([a-z])([A-Z])/g, "$1 $2");
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <a
              href="/agent-budget"
              className="mt-4 inline-block text-sm underline"
            >
              Open Agent Budget ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name} } from "@/components/agent-budget";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template separates saved and draft caps. Sample runs consume
              the saved allowance only, with integer-cent arithmetic and no
              overspending. Changing a cap does not change actual spend. Daily
              pace changes estimates only. Export includes saved and draft
              values; reset and reload return to the local fixture. No live
              charges, billing integration or scheduled reset is performed.
              Numeric feedback is immediate, without rolling or blurred figures.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/HeyAnantJ/status/2110652330110779622"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Anant ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}
