/** Family-owned preview adapters and local export bindings. */
import { TypeScale } from "@/components/type-scale";
import { definePlayground as define, text, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"type-scale": define("Type Scale", { base:number(16,12,24,1), ratio:number(1.25,1.125,1.5,.025), sample:text("") }, v=><div className="w-full max-w-3xl"><TypeScale {...v}/></div>)
};
const exports = {
"type-scale": { TypeScale }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "type-scale"; spec.exports = exports; }
export default playgrounds;
