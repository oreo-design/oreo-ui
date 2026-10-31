/** Family-owned preview adapters and local export bindings. */
import { TaskRow } from "@/components/task-row";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"task-row": define("Task Row", { title:text("Finalize navigation"), status:select(["backlog","todo","progress","review","done"],"progress"), priority:select(["Low","Medium","High"],"High"), overdue:toggle(), disabled:toggle() }, (v,set)=><div className="w-full rounded-card-medium border border-border-subtle"><TaskRow {...v} id="WEB-102" project="Website redesign" due="Today" person={{name:"Alex Morgan",color:"purple"}} onOpen={()=>window.location.assign("/project-workspace")} onComplete={done=>set("status",done?"done":"todo")}/></div>)
};
const exports = {
"task-row": { TaskRow }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "task-row"; spec.exports = exports; }
export default playgrounds;
