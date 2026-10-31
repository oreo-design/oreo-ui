/** Family-owned preview adapters and local export bindings. */
import { ProjectCreateCard, ProjectBoardOverview } from "@/components/project-board";
import { BOARD_PROJECTS, BOARD_PEOPLE } from "@/patterns/project-board/data";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"project-create-card": {...define("Project Create Card",{title:text("A little room for your next idea."),animated:toggle(true),action:toggle(true)},v=><div className="w-full max-w-xs p-4"><ProjectCreateCard title={v.title} animated={v.animated} onCreate={v.action?()=>{window.location.href="/project-board";}:undefined}/></div>),source:"project-board"},
"project-board-overview": {...define("Project Board Overview",{empty:toggle(false),showCreate:toggle(true)},v=><div className="w-full min-w-0 p-4"><ProjectBoardOverview projects={v.empty?[]:BOARD_PROJECTS} people={BOARD_PEOPLE} showCreate={v.showCreate}/></div>),source:"project-board"}
};
const exports = {
"project-board": { ProjectCreateCard, ProjectBoardOverview }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "project-board"; spec.exports = exports; }
export default playgrounds;
