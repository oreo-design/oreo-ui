/** Family-owned preview adapters and local export bindings. */
import { RouteJobCard, AllocationTimeline } from "@/components/dispatch-allocation";
import { RESOURCES, SAMPLE_JOBS, DEMO_DATE } from "@/patterns/dispatch-allocation/data";
import { definePlayground as define, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"route-job-card": {...define("Route Job Card", {category:select(["Private hire","Provisional","Contract"],"Private hire"), passengers:number(8,1,16)}, v=><div className="w-full max-w-sm p-4"><RouteJobCard job={{...SAMPLE_JOBS[0],category:v.category,passengers:v.passengers}}/></div>),source:"dispatch-allocation"},
"allocation-timeline": {...define("Allocation Timeline", {view:select(["driver","vehicle"],"driver"),state:select(["ready","loading","empty","filtered","error"],"ready")}, (v,set)=><div className="w-full"><AllocationTimeline jobs={v.state==="empty"||v.state==="loading"?[]:SAMPLE_JOBS} resources={RESOURCES} date={DEMO_DATE} resourceView={v.view} query={v.state==="filtered"?"no-match":""} loading={v.state==="loading"} error={v.state==="error"?"Sample schedule could not be loaded.":undefined} onRetry={()=>set("state","ready")} onClearFilters={()=>set("state","ready")}/></div>),source:"dispatch-allocation"}
};
const exports = {
"dispatch-allocation": { RouteJobCard, AllocationTimeline }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "dispatch-allocation"; spec.exports = exports; }
export default playgrounds;
