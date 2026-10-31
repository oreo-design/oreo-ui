/** Family-owned preview adapters and local export bindings. */
import { Reasoning } from "@/components/reasoning";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
reasoning: define("Reasoning", { label: text("Thought process"), status: select(["running", "finished"], "finished"), container: toggle(true), open: toggle(true), children: { ...text("Start with the existing components and keep the interaction familiar.", true), label: "Content" } }, (v, set) =>
    <Reasoning {...v} onOpenChange={open => set("open", open)}>{v.children}</Reasoning>)
};
const exports = {
"reasoning": { Reasoning }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "reasoning"; spec.exports = exports; }
export default playgrounds;
