/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { CommandSearch, WorkspaceMetric, DeploymentRow } from "@/components/command-search";
import { DEPLOYMENTS } from "@/patterns/command-dashboard/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"command-search": { ...define("Command Search", { empty:toggle(false), disabled:toggle(false), selected:text("") }, (v,set)=><div className="w-full max-w-sm"><CommandSearch groups={v.empty?[]:[{label:"Platform",items:[{id:"overview",label:"Overview",icon:"columns"},{id:"deployments",label:"Deployments",keywords:"build release",icon:"plane",disabled:v.disabled}]},{label:"Actions",items:[{id:"theme",label:"Switch theme",icon:"moon"}]}]} onSelect={command=>set("selected",command.label)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.selected?`Selected: ${v.selected}`:"Choose an action to see the host callback. Global shortcuts are off in this preview."}</p></div>), source:"command-search" },
"workspace-metric": { ...define("Workspace Metric", {label:text("Requests"),value:text("181.2k"),detail:text("Across the last 7 days")},v=><div className="w-full max-w-sm"><WorkspaceMetric {...v} icon={<Icon name="chart-bar"/>}/></div>),source:"command-search" },
"deployment-row": { ...define("Deployment Row", {status:select(["ready","failed"],"ready"),opened:toggle(false)},(v,set)=><div className="w-full"><DeploymentRow deployment={{...DEPLOYMENTS[0],status:v.status}} onOpen={()=>set("opened",true)}/><p className="mt-4 text-xs text-text-secondary" role="status">{v.opened?"Host callback: open dpl-1042":"Activate the row to emit an open callback."}</p></div>),source:"command-search" }
};
const exports = {
"command-search": { CommandSearch, WorkspaceMetric, DeploymentRow },
"icon": { Icon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "command-search"; spec.exports = exports; }
export default playgrounds;
