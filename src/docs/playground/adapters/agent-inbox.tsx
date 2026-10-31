/** Family-owned preview adapters and local export bindings. */
import { AgentRunCard, AgentRunActivity, AgentInboxBoard } from "@/components/agent-inbox";
import { INITIAL_RUNS as INBOX_RUNS } from "@/patterns/agent-inbox/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"agent-run-card":{...define("Agent Run Card",{expanded:toggle(true),status:select(["waiting","failed","running","done"],"waiting")},(v,set)=><div className="w-full max-w-sm p-4"><AgentRunCard run={{...INBOX_RUNS[0],status:v.status}} expanded={v.expanded} onExpandedChange={open=>set("expanded",open)} onStatusChange={status=>set("status",status)}/></div>),source:"agent-inbox"},
"agent-run-activity":{...define("Agent Run Activity",{empty:toggle(false)},v=><div className="w-full max-w-sm p-6"><AgentRunActivity model={INBOX_RUNS[0].model} items={v.empty?[]:INBOX_RUNS[0].activity}/></div>),source:"agent-inbox"},
"agent-inbox-board":{...define("Agent Inbox Board",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),view:select(["board","list"],"board"),expanded:text(""),migration:{...select(["waiting","failed","running","done"],"waiting"),group:"Sample run status"},contacts:{...select(["waiting","failed","running","done"],"failed"),group:"Sample run status"},review:{...select(["waiting","failed","running","done"],"running"),group:"Sample run status"},release:{...select(["waiting","failed","running","done"],"running"),group:"Sample run status"},metrics:{...select(["waiting","failed","running","done"],"done"),group:"Sample run status"}},(v,set)=><div className="w-full p-4"><AgentInboxBoard runs={v.state==="ready"||v.state==="refreshing"?INBOX_RUNS.map(r=>({...r,status:v[r.id as "migration"]})):[]} view={v.view} onViewChange={view=>set("view",view)} expandedId={v.expanded} onExpandedChange={id=>set("expanded",id??"")} onStatusChange={(id,status)=>set(id as "migration",status)} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"Sample runs could not be loaded.":undefined} onRetry={()=>set("state","ready")} filtered={v.state==="filtered"} onClearFilters={()=>set("state","ready")}/></div>),source:"agent-inbox"}
};
const exports = {
"agent-inbox": { AgentRunCard, AgentRunActivity, AgentInboxBoard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-inbox"; spec.exports = exports; }
export default playgrounds;
