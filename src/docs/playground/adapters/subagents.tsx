/** Family-owned preview adapters and local export bindings. */
import { Subagent } from "@/components/subagents";
import { definePlayground as define, text, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
subagents: define("Subagents", { name: text("Design reviewer"), meta: text("Reviewing components"), status: select(["running", "done", "error"], "running"), progress: number(45, 0, 100) }, v => <Subagent {...v} />)
};
const exports = {
"subagents": { Subagent }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "subagents"; spec.exports = exports; }
export default playgrounds;
