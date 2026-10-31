/** Family-owned preview adapters and local export bindings. */
import { RevenueMatrix, PipelineFunnel, DealStageBadge, DealTable, salesSummary } from "@/components/sales";
import { SALES_DEALS, REVENUE_DAYS } from "@/patterns/sales-workspace/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"revenue-matrix": {...define("Revenue Matrix",{period:select(["7","14","28"],"28"),state:select(["ready","empty","invalid"],"ready")},v=><div className="w-full max-w-2xl p-6"><RevenueMatrix days={v.state==="empty"?[]:v.state==="invalid"?[{date:"Sep 1",value:-1}]:REVENUE_DAYS.slice(-Number(v.period))}/></div>),source:"sales"},
"pipeline-funnel": {...define("Pipeline Funnel",{state:select(["ready","empty","zero"],"ready")},v=><div className="w-full max-w-md p-6"><PipelineFunnel stages={v.state==="empty"?[]:salesSummary(SALES_DEALS).stages.map(s=>({...s,value:v.state==="zero"?0:s.value}))}/></div>),source:"sales"},
"deal-stage-badge": {...define("Deal Stage Badge",{stage:select(["New","Contacted","Qualified","Negotiation","Won"],"Negotiation")},v=><DealStageBadge stage={v.stage}/>),source:"sales"},
"deal-table": {...define("Deal Table",{empty:toggle(false)},v=><div className="w-full p-4"><DealTable deals={v.empty?[]:SALES_DEALS}/></div>),source:"sales"}
};
const exports = {
"sales": { RevenueMatrix, PipelineFunnel, DealStageBadge, DealTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "sales"; spec.exports = exports; }
export default playgrounds;
