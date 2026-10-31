/** Family-owned preview adapters and local export bindings. */
import { WeeklyHeatmap, AgentRunsCard, type RunMetric } from "@/components/agent-runs";
import { selectedWeek } from "@/patterns/agent-runs/data";
import { definePlayground as define, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"weekly-heatmap": {...define("Weekly Heatmap",{metric:select(["runs","credits","failures"],"runs"),slot:number(82,0,167,1),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-6"><WeeklyHeatmap data={v.state==="ready"?selectedWeek():[]} metric={v.metric as RunMetric} value={Math.floor(v.slot)} onValueChange={i=>set("slot",i)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-runs"},
"agent-runs-card": {...define("Agent Runs Card",{metric:select(["runs","credits","failures"],"runs"),slot:number(82,0,167,1),agent:select(["all","triage","research","digest"],"all"),state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-6"><AgentRunsCard data={v.state==="ready"?selectedWeek(v.agent):[]} previousData={selectedWeek(v.agent,true)} description={`${v.agent === "all" ? "All agents" : v.agent} · Oct 5–11, 2026 · UTC`} metric={v.metric as RunMetric} onMetricChange={m=>set("metric",m)} value={Math.floor(v.slot)} onValueChange={i=>set("slot",i)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-runs"}
};
const exports = {
"agent-runs": { WeeklyHeatmap, AgentRunsCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-runs"; spec.exports = exports; }
export default playgrounds;
