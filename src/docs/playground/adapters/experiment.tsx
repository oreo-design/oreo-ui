/** Family-owned preview adapters and local export bindings. */
import { ExperimentChart, VariantResults, ExperimentDecision, summarizeExperiment } from "@/components/experiment";
import { SAMPLE_DAYS } from "@/patterns/experiment-workspace/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"experiment-chart": {...define("Experiment Chart",{mode:select(["cumulative","daily"],"cumulative"),empty:toggle(false)},v=><div className="w-full max-w-xl p-6"><ExperimentChart days={v.empty?[]:SAMPLE_DAYS} mode={v.mode}/></div>),source:"experiment"},
"variant-results": {...define("Variant Results",{a:text("Design that ships."),b:text("Interfaces people get at a glance."),empty:toggle(false)},v=><div className="w-full max-w-xl p-6"><VariantResults a={v.empty?{visitors:0,conversions:0}:summarizeExperiment(SAMPLE_DAYS).a} b={v.empty?{visitors:0,conversions:0}:summarizeExperiment(SAMPLE_DAYS).b} labels={[v.a,v.b]}/></div>),source:"experiment"},
"experiment-decision": {...define("Experiment Decision",{state:select(["ready","collecting","decided"],"ready"),confidence:number(96,0,100,1)},v=><div className="w-full max-w-lg p-6"><ExperimentDecision state={v.state} confidence={v.confidence}/></div>),source:"experiment"}
};
const exports = {
"experiment": { ExperimentChart, VariantResults, ExperimentDecision }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "experiment"; spec.exports = exports; }
export default playgrounds;
