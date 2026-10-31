/** Family-owned preview adapters and local export bindings. */
import { DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar, type FilterValues } from "@/components/data-operations";
import { workflowRows } from "@/components/workflow-table";
import { WORKFLOWS, SORT_OPTIONS, workflowFilterGroups, FOLDERS } from "@/patterns/workflow-directory/data";
import { Button } from "@/components/button";
import { definePlayground as define, text, number, select } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec } from "../schema";
function parseFilters(raw: string): FilterValues { try { const value = JSON.parse(raw); return value && typeof value === "object" && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].every(v => typeof v === "string"))) : {}; } catch { return {}; } }
const playgrounds: Record<string, PlaygroundSpec> = {
"data-filter-popover": {...define("Data Filter Popover", {selection:text("{}")}, (v,set)=><DataFilterPopover groups={workflowFilterGroups(WORKFLOWS)} value={parseFilters(v.selection)} onApply={next=>set("selection",JSON.stringify(next))} resultCount={draft=>workflowRows(WORKFLOWS,{filters:draft}).length}/>),source:"data-operations"},
"data-sort-menu": {...define("Data Sort Menu", {field:select(["edited","name","runs","success","owner"],"edited"),direction:select(["asc","desc"],"desc")},(v,set)=><DataSortMenu options={SORT_OPTIONS} value={{key:v.field,direction:v.direction}} onChange={s=>{set("field",s.key as "edited" | "name" | "runs" | "success" | "owner");set("direction",s.direction);}}/>),source:"data-operations"},
"row-action-menu": {...define("Row Action Menu", {lastAction:text("None")},(v,set)=><div className="flex items-center gap-4"><span className="text-sm text-text-secondary">Last action: {v.lastAction}</span><RowActionMenu label="Workflow actions" actions={[{id:"open",label:"Open workflow",icon:"columns"},{id:"duplicate",label:"Duplicate",icon:"copy"},{id:"move",label:"Move to folder",icon:"folder",children:FOLDERS.map(f=>({id:f,label:f,icon:"folder" as const}))},{id:"archive",label:"Archive",icon:"folder",danger:true,separatorBefore:true}]} onAction={id=>set("lastAction",id)}/></div>),source:"data-operations"},
"bulk-action-bar": {...define("Bulk Action Bar", {count:number(3,0,15),notice:text("")},(v,set)=><div className="p-4"><BulkActionBar count={v.count} total={15} onSelectAll={()=>set("count",15)} onClear={()=>set("count",0)}><Button type="secondary" size="sm" onClick={()=>set("notice","Paused selected sample rows")}>Pause</Button><Button type="secondary" danger size="sm" onClick={()=>{set("count",0);set("notice","Archived selected sample rows");}}>Archive</Button></BulkActionBar><p role="status" className="mt-3 text-xs text-text-secondary">{v.notice}</p></div>),source:"data-operations"}
};
const exports = {
"data-operations": { DataFilterPopover, DataSortMenu, RowActionMenu, BulkActionBar },
"button": { Button }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "data-operations"; spec.exports = exports; }
export default playgrounds;

export const dataFilterPopoverRecipe: NonNullable<PlaygroundSpec["exportRecipe"]> = values => {
  const spec = playgrounds["data-filter-popover"];
  const example = playgroundCode(spec.render(values, () => {}), exports, {
    "DataFilterPopover.value": "filters", "DataFilterPopover.onApply": "setFilters",
    "DataFilterPopover.resultCount": "draft => workflowRows(sampleWorkflows, { filters: draft }).length",
  });
  return { ...example,
    imports: [...example.imports, 'import { useState } from "react";', 'import type { FilterValues } from "@/components/data-operations";', 'import { workflowRows, type Workflow } from "@/components/workflow-table";'],
    setup: [...example.setup, `const sampleWorkflows: Workflow[] = ${JSON.stringify(WORKFLOWS)};`, `const [filters, setFilters] = useState<FilterValues>(${JSON.stringify(parseFilters(String(values.selection)))});`],
    notes: ["Local sample workflows only. Counts use the same workflowRows filtering as the preview, excluding archived rows by default. No live query or persistence occurs."] };
};

playgrounds["data-filter-popover"].exportRecipe = dataFilterPopoverRecipe;
