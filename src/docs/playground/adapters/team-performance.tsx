/** Family-owned preview adapters and local export bindings. */
import { PerformanceScore, ReviewProgress, MemberPerformanceTable } from "@/components/team-performance";
import { PERFORMANCE_MEMBERS } from "@/patterns/team-performance/data";
import { definePlayground as define, text, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"performance-score": {...define("Performance Score",{value:number(94,0,100,1),label:text("Performance")},v=><PerformanceScore value={v.value} label={v.label}/>),source:"team-performance"},
"review-progress": {...define("Review Progress",{completed:number(6,0,20,1),pending:number(4,0,20,1),overdue:number(2,0,20,1),selected:select(["none","Completed","Pending","Overdue"],"none")},(v,set)=><div className="w-full p-6"><ReviewProgress counts={{Completed:v.completed,Pending:v.pending,Overdue:v.overdue}} selected={v.selected==="none"?undefined:v.selected as "Completed"} onSelect={s=>set("selected",v.selected===s?"none":s)}/></div>),source:"team-performance"},
"member-performance-table": {...define("Member Performance Table",{state:select(["ready","loading","empty","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><MemberPerformanceTable members={v.state==="ready"?PERFORMANCE_MEMBERS.slice(0,7):[]} loading={v.state==="loading"} error={v.state==="error"?"Sample reviews are unavailable.":undefined} onReset={()=>set("state","ready")} onOpen={m=>set("opened",m.name)}/>{v.opened&&<p role="status" className="mt-4 text-sm">Selected {v.opened}</p>}</div>),source:"team-performance"}
};
const exports = {
"team-performance": { PerformanceScore, ReviewProgress, MemberPerformanceTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "team-performance"; spec.exports = exports; }
export default playgrounds;
