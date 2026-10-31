/** Family-owned preview adapters and local export bindings. */
import { BudgetCapControl, BudgetOutcome, MonthlyBudgetCard } from "@/components/agent-budget";
import { DEMO_BUDGET } from "@/patterns/agent-budget/data";
import { definePlayground as define, toggle, number } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"budget-cap-control":{...define("Budget Cap Control",{value:number(120000,64000,200000,1000),disabled:toggle(false)},(v,set)=><div className="w-full max-w-xl p-6"><BudgetCapControl value={v.value} spent={64000} planMax={200000} disabled={v.disabled} onChange={n=>set("value",n)}/></div>),source:"agent-budget"},
"budget-outcome":{...define("Budget Outcome",{cap:number(120000,64000,200000,1000),dailySpend:number(4000,0,10000,1000),invalid:toggle(false)},v=><div className="w-full max-w-xl p-6"><BudgetOutcome budget={{...DEMO_BUDGET,cap:v.cap,dailySpend:v.dailySpend,costPerRun:v.invalid?0:25}}/></div>),source:"agent-budget"},
"monthly-budget-card":{...define("Monthly Budget Card",{cap:number(120000,64000,200000,1000),saved:number(120000,64000,200000,1000),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><MonthlyBudgetCard budget={{...DEMO_BUDGET,cap:v.cap}} disabled={v.disabled} dirty={v.cap!==v.saved} onChange={n=>set("cap",n)} onSave={()=>set("saved",v.cap)} onCancel={()=>set("cap",v.saved)}/></div>),source:"agent-budget"}
};
const exports = {
"agent-budget": { BudgetCapControl, BudgetOutcome, MonthlyBudgetCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-budget"; spec.exports = exports; }
export default playgrounds;

playgrounds["budget-cap-control"].exportRecipe = values => {
  const spec = playgrounds["budget-cap-control"];
  const example = playgroundCode(spec.render(values, () => {}), exports, { "BudgetCapControl.value": "cap", "BudgetCapControl.onChange": "setCap" });
  return { ...example, imports: [...example.imports, 'import { useState } from "react";'], setup: [...example.setup, `const [cap, setCap] = useState(${JSON.stringify(values.value)});`] };
};
playgrounds["monthly-budget-card"].exportRecipe = values => {
  const spec = playgrounds["monthly-budget-card"];
  const example = playgroundCode(spec.render(values, () => {}), exports, {
    "MonthlyBudgetCard.budget": `{ ...${JSON.stringify(DEMO_BUDGET)}, cap }`,
    "MonthlyBudgetCard.dirty": "cap !== saved", "MonthlyBudgetCard.onChange": "setCap",
    "MonthlyBudgetCard.onSave": "() => setSaved(cap)", "MonthlyBudgetCard.onCancel": "() => setCap(saved)",
  });
  return { ...example, imports: [...example.imports, 'import { useState } from "react";'],
    setup: [...example.setup, `const [cap, setCap] = useState(${JSON.stringify(values.cap)});`, `const [saved, setSaved] = useState(${JSON.stringify(values.saved)});`],
    jsx: `<div>\n  <p>Local example. Save changes local state only; connect persistence in your application.</p>\n${example.jsx}\n</div>`,
    notes: ["Local draft/save example only. No billing or server persistence occurs."] };
};
