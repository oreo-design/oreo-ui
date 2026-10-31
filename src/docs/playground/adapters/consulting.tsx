/** Family-owned preview adapters and local export bindings. */
import { EscalationCard, SourceConflictCard, KnowledgeSourceTable, ConversationActivity } from "@/components/consulting";
import { CASES, SOURCES, CONFLICTS, DAYS } from "@/patterns/consulting-workspace/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"escalation-card": {...define("Escalation Card",{open:toggle(true),caseIndex:number(0,0,CASES.length-1,1)},(v,set)=><div className="w-full p-4"><EscalationCard item={CASES[Math.round(v.caseIndex)]??CASES[0]} open={v.open} onOpenChange={open=>set("open",open)}/></div>),source:"consulting"},
"source-conflict-card": {...define("Source Conflict Card",{resolution:select(["unresolved","s2","s3","ask"],"unresolved"),disabled:toggle()},(v,set)=><div className="w-full p-4"><SourceConflictCard conflict={{...CONFLICTS[0],resolution:v.resolution==="unresolved"?undefined:v.resolution}} disabled={v.disabled} onResolve={choice=>set("resolution",choice==="s2"?"s2":choice==="s3"?"s3":"ask")}/></div>),source:"consulting"},
"knowledge-source-table": {...define("Knowledge Source Table",{state:select(["ready","loading","refreshing","empty","error"],"ready")},(v,set)=><div className="w-full min-w-0 p-4"><KnowledgeSourceTable sources={v.state==="ready"||v.state==="refreshing"?SOURCES:[]} conflicts={CONFLICTS} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The source preview is unavailable.":undefined} onRetry={()=>set("state","ready")} onClear={()=>set("state","ready")}/></div>),source:"consulting"},
"conversation-activity": {...define("Conversation Activity",{empty:toggle()},v=><div className="w-full max-w-md p-4"><ConversationActivity days={v.empty?[]:DAYS}/></div>),source:"consulting"}
};
const exports = {
"consulting": { EscalationCard, SourceConflictCard, KnowledgeSourceTable, ConversationActivity }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "consulting"; spec.exports = exports; }
export default playgrounds;
