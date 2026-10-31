/** Family-owned preview adapters and local export bindings. */
import { TaskStatusGroup, TaskListRow, GroupedTaskList } from "@/components/grouped-tasks";
import { SAMPLE_TASKS, MEMBERS } from "@/patterns/grouped-tasks/data";
import type { TaskStatus } from "@/components/task-row";
import { definePlayground as define, text, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"task-status-group": {...define("Task Status Group",{open:toggle(true),count:number(3,0,20,1)},(v,set)=><div className="w-full p-4"><TaskStatusGroup status="progress" count={v.count} open={v.open} onOpenChange={open=>set("open",open)}><p className="p-4 text-sm text-text-secondary">The host supplies the group contents.</p></TaskStatusGroup></div>),source:"grouped-tasks"},
"task-list-row": {...define("Task List Row",{selected:toggle()},(v,set)=><div className="w-full min-w-0 p-4"><div className="gt-table-scroll"><table className="gt-table"><thead><tr>{["Name","Priority","List","Tag","Due date","Assignee"].map(t=><th key={t} scope="col">{t}</th>)}</tr></thead><tbody><TaskListRow task={SAMPLE_TASKS[0]} people={MEMBERS} onOpen={()=>set("selected",true)}/></tbody></table></div>{v.selected&&<p role="status" className="mt-4 text-sm">Selected: Craft user personas · <a className="underline" href="/grouped-tasks">Open editable template</a></p>}</div>),source:"grouped-tasks"},
"grouped-task-list": {...define("Grouped Task List",{empty:toggle(),showEmpty:toggle(),collapsed:text(""),selected:text("")},(v,set)=><div className="w-full min-w-0 p-4"><GroupedTaskList tasks={v.empty?[]:SAMPLE_TASKS.slice(0,8)} people={MEMBERS} collapsed={v.collapsed.split(",").filter(Boolean) as TaskStatus[]} onCollapsedChange={statuses=>set("collapsed",statuses.join(","))} onTaskOpen={task=>set("selected",task.title)} showEmpty={v.showEmpty}/>{v.selected&&<p role="status" className="mt-4 text-sm">Selected: {v.selected} · <a className="underline" href="/grouped-tasks">Open editable template</a></p>}</div>),source:"grouped-tasks"}
};
const exports = {
"grouped-tasks": { TaskStatusGroup, TaskListRow, GroupedTaskList }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "grouped-tasks"; spec.exports = exports; }
export default playgrounds;
