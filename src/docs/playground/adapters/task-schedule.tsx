/** Family-owned preview adapters and local export bindings. */
import { TaskScheduleChip, TaskCalendar, TaskTimeline } from "@/components/task-schedule";
import { INITIAL_TASKS as SCHEDULE_TASKS, PROJECTS as SCHEDULE_PROJECTS, PEOPLE as SCHEDULE_PEOPLE } from "@/patterns/project-workspace/data";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"task-schedule-chip":{...define("Task Schedule Chip",{title:text("Finalize navigation"),status:select(["backlog","todo","progress","review","done"],"progress"),disabled:toggle(),message:text("")},(v,set)=><div className="w-80 max-w-full"><TaskScheduleChip task={{...SCHEDULE_TASKS[1],title:v.title,status:v.status}} project={{id:"website",name:"Website redesign",color:"purple"}} person={SCHEDULE_PEOPLE[0]} disabled={v.disabled} onOpen={()=>set("message","Task opened. The template provides the shared editor.")}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"},
"task-calendar":{...define("Task Calendar",{date:text("2026-10-15"),mode:select(["month","week"],"month"),empty:toggle(),message:text("")},(v,set)=><div className="w-full"><TaskCalendar tasks={v.empty?[]:SCHEDULE_TASKS} projects={SCHEDULE_PROJECTS.map((p,i)=>({...p,color:(["purple","blue","mint"] as const)[i]}))} people={SCHEDULE_PEOPLE} date={v.date} mode={v.mode} today="2026-10-15" onDateChange={d=>set("date",d)} onModeChange={m=>set("mode",m)} onOpen={t=>set("message",`Open ${t.title}`)} onCreate={d=>set("message",`Create task due ${d}`)}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"},
"task-timeline":{...define("Task Timeline",{date:text("2026-10-12"),empty:toggle(),message:text("")},(v,set)=><div className="w-full"><TaskTimeline tasks={v.empty?[]:SCHEDULE_TASKS} projects={SCHEDULE_PROJECTS.map((p,i)=>({...p,color:(["purple","blue","mint"] as const)[i]}))} people={SCHEDULE_PEOPLE} date={v.date} today="2026-10-15" onDateChange={d=>set("date",d)} onOpen={t=>set("message",`Open ${t.title}`)}/><p role="status" className="mt-2 text-xs text-text-secondary">{v.message}</p></div>),source:"task-schedule"}
};
const exports = {
"task-schedule": { TaskScheduleChip, TaskCalendar, TaskTimeline }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "task-schedule"; spec.exports = exports; }
export default playgrounds;
