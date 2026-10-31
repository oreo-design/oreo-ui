/** Family-owned preview adapters and local export bindings. */
import { AgentLanes, AgentLaneIdentity, AgentTaskBar, AgentTimelineAxis } from "@/components/agent-lanes";
import { LANE_AGENTS, LANE_TASKS } from "@/patterns/agent-lanes/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"agent-lane-identity":{...define("Agent Lane Identity",{name:text("Researcher"),model:text("Research model"),status:select(["running","waiting","idle"],"running")},v=><div className="p-6"><AgentLaneIdentity agent={{id:"research",name:v.name,model:v.model}} status={v.status}/></div>),source:"agent-lanes"},
"agent-task-bar":{...define("Agent Task Bar",{status:select(["running","waiting","done","failed"],"running"),selected:toggle(false),title:text("Customer interviews")},(v,set)=><div className="w-full max-w-lg p-6"><AgentTaskBar task={{...LANE_TASKS[1],title:v.title,status:v.status}} now={0} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"agent-lanes"},
"agent-timeline-axis":{...define("Agent Timeline Axis",{minutes:number(30,5,120,5)},v=><div className="w-full pt-12 pr-8"><AgentTimelineAxis minutes={v.minutes}/></div>),source:"agent-lanes"},
"agent-lanes":{...define("Agent Lanes",{scenario:select(["ready","loading","refreshing","empty","error"],"ready"),minutes:number(30,15,60,15),now:number(0,0,15,1),selected:text("")},(v,set)=><div className="w-full p-4"><AgentLanes agents={LANE_AGENTS} tasks={v.scenario==="empty"||v.scenario==="loading"?[]:LANE_TASKS} now={v.now} minutes={v.minutes} selectedId={v.selected} onSelect={id=>set("selected",id)} loading={v.scenario==="loading"||v.scenario==="refreshing"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}/></div>),source:"agent-lanes"}
};
const exports = {
"agent-lanes": { AgentLanes, AgentLaneIdentity, AgentTaskBar, AgentTimelineAxis }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-lanes"; spec.exports = exports; }
export default playgrounds;
