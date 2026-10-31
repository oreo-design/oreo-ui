/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { AgentConnectCard, QuotaUsage, AgentClientPicker } from "@/components/agent-connect";
import { AGENT_CLIENTS, AGENT_MARKS } from "@/patterns/agent-connections/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"agent-connect-card": { ...define("Agent Connect Card", { title:text("Your workspace, in your AI."), description:text("Connect your favorite tools with Oreo MCP."), actionLabel:text("Set up agents") }, v=><div className="w-full max-w-xs"><AgentConnectCard {...v} marks={AGENT_MARKS} onAction={()=>{window.location.href="/agent-connections";}}/></div>), source:"agent-connect" },
"quota-usage": { ...define("Quota Usage", { label:text("Automations this month"), used:number(54,0,120000,1), limit:number(3000,0,100000,1) }, v=><QuotaUsage {...v}/>), source:"agent-connect" },
"agent-client-picker": { ...define("Agent Client Picker", { value:select(["desktop","editor","terminal","custom"],"desktop"), empty:toggle(false), disableCustom:toggle(false) }, (v,set)=><div className="w-full max-w-xl"><AgentClientPicker clients={v.empty?[]:AGENT_CLIENTS.map(c=>({...c,disabled:c.id==="custom"&&v.disableCustom}))} value={v.value} onValueChange={value=>{if(value==="desktop"||value==="editor"||value==="terminal"||value==="custom") set("value",value);}}/></div>), source:"agent-connect" }
};
const exports = {
"agent-connect": { AgentConnectCard, QuotaUsage, AgentClientPicker },
"icon": { Icon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-connect"; spec.exports = exports; }
export default playgrounds;
