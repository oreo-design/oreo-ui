/** Family-owned preview adapters and local export bindings. */
import { ModelTrendChart, ModelUsageRing, AgentUsageRow, type UsageMetric } from "@/components/model-usage";
import { MODELS, sampleDays } from "@/patterns/model-costs/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"model-trend-chart": {...define("Model Trend Chart",{metric:select(["costCents","tokens","requests"],"costCents"),highlight:text(""),state:select(["ready","empty","loading","error"],"ready")},(v,set)=><div className="w-full max-w-3xl p-6"><ModelTrendChart days={v.state==="ready"?sampleDays("production"):[]} models={MODELS} metric={v.metric as UsageMetric} highlighted={v.highlight} onHighlight={id=>set("highlight",id)} loading={v.state==="loading"} error={v.state==="error"?"Sample usage is unavailable.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"model-usage"},
"model-usage-ring": {...define("Model Usage Ring",{highlight:text(""),empty:toggle()},(v,set)=><div className="w-full max-w-md p-6"><ModelUsageRing days={v.empty?[]:sampleDays("production")} models={MODELS} value={v.highlight} onValueChange={id=>set("highlight",id)}/></div>),source:"model-usage"},
"agent-usage-row": {...define("Agent Usage Row",{status:select(["active","paused","complete"],"active"),notice:text("")},(v,set)=><div className="w-full max-w-2xl p-6"><AgentUsageRow title="Support triage" description="Classifies tickets and drafts helpful replies." model="GPT-4o" tokens={1842} costCents={5} status={v.status as "active"|"paused"|"complete"} time="09:42" onOpen={()=>set("notice","Inspect requested. Open Model Costs for the complete flow.")} onRun={()=>set("notice","Sample run requested. The host owns execution.")}/><p role="status" className="mt-4 text-sm text-text-secondary">{v.notice}</p></div>),source:"model-usage"}
};
const exports = {
"model-usage": { ModelTrendChart, ModelUsageRing, AgentUsageRow }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "model-usage"; spec.exports = exports; }
export default playgrounds;
