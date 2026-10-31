/** Family-owned preview adapters and local export bindings. */
import { AgentTaskQueue, QueueTaskRow, TaskClarification, QueuedRequestStack } from "@/components/agent-task-queue";
import { QUEUE_TASKS, QUEUE_QUESTIONS } from "@/patterns/agent-task-queue/data";
import { Button } from "@/components/button";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec } from "../schema";
function queueAnswers(raw:string):Record<string,string>{try{const value=JSON.parse(raw);return value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).filter((entry):entry is [string,string]=>typeof entry[1]==="string")):{};}catch{return {};}}
const playgrounds: Record<string, PlaygroundSpec> = {
"queue-task-row":{...define("Queue Task Row",{title:text(QUEUE_TASKS[0].title),status:select(["queued","running","paused","needs-context","done"],"running"),expanded:toggle(false),suspended:toggle(false),removed:toggle(false)},(v,set)=><div className="w-full max-w-xl p-6">{v.removed?<Button type="secondary" onClick={()=>set("removed",false)}>Undo removal</Button>:<QueueTaskRow task={{...QUEUE_TASKS[0],title:v.title,status:v.status}} expanded={v.expanded} suspended={v.suspended} onToggle={()=>set("expanded",!v.expanded)} onPause={()=>set("status","paused")} onResume={()=>set("status","queued")} onRemove={()=>set("removed",true)}><p className="text-sm text-text-secondary">Context is supplied by the host application.</p></QueueTaskRow>}</div>),source:"agent-task-queue"},
"queued-request-stack":{...define("Queued Request Stack",{expanded:toggle(false),count:number(5,0,5,1)},(v,set)=><div className="w-full max-w-lg p-6"><QueuedRequestStack requests={QUEUE_TASKS.slice(0,v.count)} expanded={v.expanded} onExpandedChange={value=>set("expanded",value)}/></div>),source:"agent-task-queue"},
"task-clarification":{...define("Task Clarification",{step:number(0,0,2,1),answers:text("{}",true),pending:toggle(false),error:text(""),saved:toggle(false)},(v,set)=><div className="w-full max-w-md p-6"><TaskClarification questions={QUEUE_QUESTIONS} answers={queueAnswers(v.answers)} step={v.step} onChange={answers=>{set("answers",JSON.stringify(answers));set("saved",false);}} onStepChange={step=>set("step",step)} onSubmit={()=>set("saved",true)} pending={v.pending} error={v.error}/>{v.saved&&<p role="status" className="text-sm mt-3">Answers saved in this local preview.</p>}</div>),source:"agent-task-queue"},
"agent-task-queue":{...define("Agent Task Queue",{scenario:select(["ready","loading","refreshing","empty","error"],"ready"),active:text("height"),expanded:text(""),order:text(QUEUE_TASKS.map(t=>t.id).join(",")),paused:text("later"),removed:text(""),needsContext:toggle(true),suspended:toggle(false)},(v,set)=>{const ids=[...new Set([...v.order.split(","),...QUEUE_TASKS.map(t=>t.id)])],tasks=ids.flatMap(id=>{const task=QUEUE_TASKS.find(t=>t.id===id);return task&&!v.removed.split(",").includes(id)?[{...task,status:v.active===id?"running" as const:v.paused.split(",").includes(id)?"paused" as const:id==="gradient"&&v.needsContext?"needs-context" as const:"queued" as const}]:[];});return <div className="w-full max-w-xl p-6"><AgentTaskQueue tasks={v.scenario==="empty"||v.scenario==="loading"?[]:tasks} expandedId={v.expanded} onExpand={id=>set("expanded",id??"")} onMove={(id,over)=>{const next=[...ids],from=next.indexOf(id),to=next.indexOf(over);next.splice(from,1);next.splice(to,0,id);set("order",next.join(","));}} onPause={id=>{set("paused",[...v.paused.split(","),id].join(","));if(v.active===id)set("active","");}} onResume={id=>set("paused",v.paused.split(",").filter(item=>item!==id).join(","))} onRemove={id=>set("removed",[...v.removed.split(","),id].join(","))} suspended={v.suspended} loading={v.scenario==="loading"||v.scenario==="refreshing"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")} onReset={()=>{set("removed","");set("scenario","ready");}} renderDetail={task=><p className="text-sm text-text-secondary">{task.context}</p>}/></div>;}),source:"agent-task-queue"}
};
const exports = {
"agent-task-queue": { AgentTaskQueue, QueueTaskRow, TaskClarification, QueuedRequestStack },
"button": { Button }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-task-queue"; spec.exports = exports; }
export default playgrounds;

playgrounds["agent-task-queue"].exportRecipe = values => {
  const spec = playgrounds["agent-task-queue"];
  const example = playgroundCode(spec.render(values, () => {}), exports, {
    "AgentTaskQueue.expandedId": "expandedId", "AgentTaskQueue.onExpand": "setExpandedId",
    "AgentTaskQueue.renderDetail": 'task => <p className="text-sm text-text-secondary">{task.context}</p>',
  });
  return { ...example, imports: [...example.imports, 'import { useState } from "react";'],
    setup: [...example.setup, `const [expandedId, setExpandedId] = useState<string | null>(${JSON.stringify(values.expanded || null)});`],
    notes: [...example.notes, "Local task fixtures and detail disclosure. Connect queue operations to your host before use; this example does not run agents."] };
};
