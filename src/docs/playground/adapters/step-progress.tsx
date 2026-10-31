/** Family-owned preview adapters and local export bindings. */
import { StepProgress } from "@/components/step-progress";
import { definePlayground as define, text, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"step-progress": define("Step Progress", { completed:number(3,0,18,1), total:number(18,0,18,1), label:text("Review progress") }, v=><div className="w-full max-w-sm"><StepProgress {...v}/></div>)
};
const exports = {
"step-progress": { StepProgress }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "step-progress"; spec.exports = exports; }
export default playgrounds;
