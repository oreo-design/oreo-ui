import { useMemo, useState } from "react";
import {
  IncomeFlowCard,
  IncomeFlowChart,
  IncomeComparison,
  type IncomePoint,
  type IncomeTone,
} from "@/components/income-flow";
import { INCOME_SOURCES } from "@/patterns/income-flow-workspace/data";
import {
  definePlayground as define,
  select,
  text,
  toggle,
  number,
  type PlaygroundSpec,
} from "../schema";
function demoPoints(source: string, state: string) {
  const points = INCOME_SOURCES.find((s) => s.id === source)!.points;
  return state === "empty"
    ? []
    : state === "invalid"
      ? [...points.slice(0, -1), { ...points.at(-1)!, amount: -1 }]
      : state === "zero"
        ? points.map((p) => ({ ...p, amount: 0 }))
        : state === "single"
          ? points.slice(-1)
          : points;
}
function Demo({
  source,
  state,
  tone,
  label,
  disabled,
  chart = false,
}: {
  source: string;
  state: string;
  tone: IncomeTone;
  label: string;
  disabled: boolean;
  chart?: boolean;
}) {
  const points = useMemo(() => demoPoints(source, state), [source, state]);
  const [index, setIndex] = useState(points.length - 1),
    [preview, setPreview] = useState<number | null>(null);
  return (
    <div className="w-full max-w-md p-6">
      {chart ? (
        <IncomeFlowChart
          points={points}
          value={preview ?? index}
          onPreviewChange={setPreview}
          onValueChange={setIndex}
          tone={tone}
          label={label}
          disabled={disabled}
        />
      ) : (
        <IncomeFlowCard
          points={points}
          tone={tone}
          label={label}
          disabled={disabled}
        />
      )}
    </div>
  );
}
const controls = {
  source: select(["studio", "products", "licensing"] as const, "studio"),
  tone: select(["orange", "purple", "blue"] as const, "orange"),
  state: select(
    ["ready", "empty", "invalid", "zero", "single"] as const,
    "ready",
  ),
  label: text("Income"),
  disabled: toggle(false),
};
const specs: Record<string, PlaygroundSpec> = {};
for (const [slug, title, component] of [
  ["income-flow-card", "Income Flow Card", "IncomeFlowCard"],
  ["income-flow-chart", "Income Flow Chart", "IncomeFlowChart"],
]) {
  specs[slug] = {
    ...define(title, controls, (v) => (
      <Demo
        key={`${v.source}-${v.state}`}
        {...v}
        chart={slug === "income-flow-chart"}
      />
    )),
    exportRecipe: (v) => ({
      imports: [
        'import {useState} from "react";',
        `import {${component},type IncomePoint} from "@/components/income-flow";`,
      ],
      setup: [
        `const points:IncomePoint[] = ${JSON.stringify(demoPoints(String(v.source), String(v.state)))};`,
        ...(component === "IncomeFlowChart"
          ? [
              "const [index,setIndex]=useState(points.length-1);",
              "const [preview,setPreview]=useState<number|null>(null);",
            ]
          : []),
      ],
      jsx: `<${component} points={points} label={${JSON.stringify(v.label)}} tone=${JSON.stringify(v.tone)} disabled={${v.disabled}}${component === "IncomeFlowChart" ? " value={preview??index} onPreviewChange={setPreview} onValueChange={setIndex}" : ""} />`,
      notes: [
        "Amounts are integer USD cents. The four bands are nested representations of a single total, not stacked categories.",
        "Pointer previews a month; month controls commit it. The card restores committed selection when the pointer leaves.",
      ],
    }),
  };
}
specs["income-comparison"] = {
  ...define(
    "Income Comparison",
    {
      current: number(82229, 0, 1000000),
      previous: number(76330, 0, 1000000),
      previousLabel: text("Feb"),
      noHistory: toggle(false),
    },
    (v) => (
      <div className="w-full max-w-md">
        <IncomeComparison
          current={Math.round(v.current * 100)}
          previous={v.noHistory ? undefined : Math.round(v.previous * 100)}
          previousLabel={v.previousLabel}
        />
      </div>
    ),
  ),
  exportRecipe: (v) => ({
    imports: ['import {IncomeComparison} from "@/components/income-flow";'],
    setup: [],
    jsx: `<IncomeComparison current={${Math.round(Number(v.current) * 100)}} previous={${v.noHistory ? "undefined" : Math.round(Number(v.previous) * 100)}} previousLabel={${JSON.stringify(v.previousLabel)}} />`,
    notes: [
      "Playground monetary fields are in dollars; component props use cents. Zero or missing prior income never produces an infinite percentage.",
    ],
  }),
};
for (const spec of Object.values(specs)) {
  spec.source = "income-flow";
  spec.exports = {
    "income-flow": { IncomeFlowCard, IncomeFlowChart, IncomeComparison },
  };
}
export default specs;
