/** Family-owned preview adapters and local export bindings. */
import { WorkflowStatusBadge, WorkflowRunBars, WorkflowTable } from "@/components/workflow-table";
import { WORKFLOWS } from "@/patterns/workflow-directory/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"workflow-status-badge": {...define("Workflow Status Badge",{status:select(["Live","Degraded","Failing","Draft","Paused","Archived"],"Live")},v=><WorkflowStatusBadge status={v.status}/>),source:"workflow-table"},
"workflow-run-bars": {...define("Workflow Run Bars",{total:number(4812,0,10000),failing:toggle(false)},v=><WorkflowRunBars values={[4,6,7,6,8,7,10]} total={v.total} failing={v.failing}/>),source:"workflow-table"},
"workflow-table": {...define("Workflow Table",{state:select(["ready","loading","empty","error"],"ready"),selection:text("")},(v,set)=><div className="w-full p-4"><WorkflowTable rows={v.state==="ready"?WORKFLOWS.slice(0,5):[]} selected={v.selection.split(",").filter(Boolean)} onSelectionChange={ids=>set("selection",ids.join(","))} loading={v.state==="loading"} error={v.state==="error"?"Sample request failed.":undefined} onReset={()=>set("state","ready")}/></div>),source:"workflow-table"}
};
const exports = {
"workflow-table": { WorkflowStatusBadge, WorkflowRunBars, WorkflowTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "workflow-table"; spec.exports = exports; }
export default playgrounds;
