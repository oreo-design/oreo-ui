/** Family-owned preview adapters and local export bindings. */
import { ProjectSummary } from "@/components/project-summary";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"project-summary": define("Project Summary", { title:text("Website redesign"), description:text("A clearer story, from first visit to first customer."), completed:number(3,0,18,1), total:number(12,0,18,1), status:select(["On track","At risk","Planning"],"On track"), due:text("Oct 30") }, v=><div className="w-full max-w-md"><ProjectSummary {...v} people={[{name:"Alex Morgan",color:"purple"},{name:"Sam Chen",color:"pink"},{name:"Jules Carter",color:"blue"},{name:"Maya Wilson",color:"mint"}]}/></div>)
};
const exports = {
"project-summary": { ProjectSummary }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "project-summary"; spec.exports = exports; }
export default playgrounds;
