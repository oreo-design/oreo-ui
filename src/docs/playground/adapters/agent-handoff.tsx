/** Family-owned preview adapters and local export bindings. */
import { AgentMentionComposer, AgentSessionCard, type HandoffStatus } from "@/components/agent-handoff";
import { HANDOFF_AGENTS } from "@/patterns/engineering-handoff/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"agent-mention-composer": {...define("Agent Mention Composer",{agent:select(["none","claude","codex"],"none"),disabled:toggle(false),lastComment:text("")},(v,set)=><div className="w-full p-6"><AgentMentionComposer agents={HANDOFF_AGENTS} agentId={v.agent==="none"?"":v.agent} onAgentChange={id=>set("agent",(id||"none") as "none"|"claude"|"codex")} disabled={v.disabled} onSend={(body,id)=>{set("lastComment",`${id?"@"+id+" ":""}${body}`);set("agent","none");}}/>{v.lastComment&&<p className="mt-4 text-sm text-text-secondary" role="status">Local preview: {v.lastComment}</p>}</div>),source:"agent-handoff"},
"agent-session-card": {...define("Agent Session Card",{agent:text("Claude"),status:select(["idle","analyzing","awaiting","implementing","review","completed","failed","stopped"],"awaiting"),loading:toggle(false)},(v,set)=><div className="w-full p-6"><AgentSessionCard agent={v.agent} status={v.status as HandoffStatus} loading={v.loading} messages={v.status==="idle"?[]:[{id:"sample",author:{id:"agent",name:v.agent},body:"Should we use the existing job queue? Keep the change scoped to exports.",time:"Sample message"}]} result={<p className="text-sm">Illustrative export patch. Not executed.</p>} onStop={()=>set("status","stopped")} onRetry={()=>set("status","analyzing")}/></div>),source:"agent-handoff"}
};
const exports = {
"agent-handoff": { AgentMentionComposer, AgentSessionCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-handoff"; spec.exports = exports; }
export default playgrounds;
