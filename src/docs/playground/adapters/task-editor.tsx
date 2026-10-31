/** Family-owned preview adapters and local export bindings. */
import { TaskProperties, TaskSubtasks, TaskDetailPanel, type TaskDetails } from "@/components/task-editor";
import { CAMPAIGN_TASKS, TASK_PEOPLE } from "@/patterns/task-board/data";
import { Button } from "@/components/button";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"task-properties":{...define("Task Properties",{task:text(JSON.stringify(CAMPAIGN_TASKS[1]))},(v,set)=>{let task:TaskDetails;try{task=JSON.parse(v.task);if(!task||["id","title","status","priority","assigneeId","start","due","repeat","estimate","blockedBy"].some(k=>typeof task[k as keyof TaskDetails]!=="string")||!Array.isArray(task.labels)||task.labels.some((l:unknown)=>typeof l!=="string"))throw new Error();}catch{return <p role="alert">Enter a valid TaskDetails JSON object.</p>}return <div className="w-full max-w-md p-6"><TaskProperties task={task} people={TASK_PEOPLE} dependencies={CAMPAIGN_TASKS} onChange={patch=>set("task",JSON.stringify({...task,...patch}))}/></div>;}),source:"task-editor"},
"task-subtasks":{...define("Task Subtasks",{items:text(JSON.stringify(CAMPAIGN_TASKS[4].subtasks))},(v,set)=>{let items;try{items=JSON.parse(v.items);if(!Array.isArray(items)||items.some(x=>typeof x.id!=="string"||typeof x.title!=="string"||typeof x.done!=="boolean"))throw new Error();}catch{return <p role="alert">Enter a valid Subtask array.</p>}return <div className="w-full max-w-md p-6"><TaskSubtasks items={items} onChange={next=>set("items",JSON.stringify(next))}/></div>;}),source:"task-editor"},
"task-detail-panel":{...define("Task Detail Panel",{title:text("Paid social creatives"),complete:toggle(false),open:toggle(true)},(v,set)=>v.open?<div className="h-[32rem] w-full max-w-md"><TaskDetailPanel taskId="MKT-109" title={v.title} complete={v.complete} onComplete={()=>set("complete",!v.complete)} onClose={()=>set("open",false)}><p className="text-sm text-text-secondary">Compose task properties, checklists and discussions here.</p></TaskDetailPanel></div>:<Button type="secondary" onClick={()=>set("open",true)}>Open task details</Button>),source:"task-editor"}
};
const exports = {
"task-editor": { TaskProperties, TaskSubtasks, TaskDetailPanel },
"button": { Button }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "task-editor"; spec.exports = exports; }
export default playgrounds;
