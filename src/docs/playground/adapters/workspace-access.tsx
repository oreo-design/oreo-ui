/** Family-owned preview adapters and local export bindings. */
import { WorkspaceSetup, ToolAccessRow, MemberAccessTable, WorkspaceInvitation } from "@/components/workspace-access";
import { ACCESS_TOOLS, ACCESS_MEMBERS, SETUP_STEPS } from "@/patterns/access-workspace/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"workspace-setup": {...define("Workspace Setup",{complete:toggle(false),empty:toggle(false)},v=><div className="w-full p-6"><WorkspaceSetup steps={v.empty?[]:SETUP_STEPS.map(s=>({...s,complete:v.complete||s.complete}))}/></div>),source:"workspace-access"},
"tool-access-row": {...define("Tool Access Row",{name:text("Claude"),detail:text("4 people have access")},v=><div className="w-full max-w-lg p-6"><ToolAccessRow tool={{...ACCESS_TOOLS[0],name:v.name}} detail={v.detail}/></div>),source:"workspace-access"},
"member-access-table": {...define("Member Access Table",{empty:toggle(false),active:toggle(true)},v=><div className="w-full p-4"><MemberAccessTable members={v.empty?[]:ACCESS_MEMBERS} tools={ACCESS_TOOLS} activeMemberIds={v.active?["sophia","maya"]:[]}/></div>),source:"workspace-access"},
"workspace-invitation": {...define("Workspace Invitation",{status:select(["pending","accepted","expired"],"pending"),email:text("riley@studio.example"),empty:toggle(false)},(v,set)=><div className="w-full"><WorkspaceInvitation inviter="Sophia" workspace="Studio workspace" email={v.email} tools={v.empty?[]:ACCESS_TOOLS.slice(0,3)} status={v.status} onAccept={()=>set("status","accepted")}/></div>),source:"workspace-access"}
};
const exports = {
"workspace-access": { WorkspaceSetup, ToolAccessRow, MemberAccessTable, WorkspaceInvitation }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "workspace-access"; spec.exports = exports; }
export default playgrounds;
