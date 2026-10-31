/** Family-owned preview adapters and local export bindings. */
import { AgentResultCard } from "@/components/automation";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"automation-components": { ...define("Agent Result", { title: text("Selected account and ad sets"), status: select(["ready", "running", "error", "reviewed"], "ready"), open: toggle(false), details: text("Oreo Store · Weekend essentials · $200 daily budget") }, (v, set) => <div className="w-full max-w-xl"><AgentResultCard title={v.title} status={v.status} open={v.open} onOpenChange={open => set("open", open)}>{v.details}</AgentResultCard></div>), source: "automation" }
};
const exports = {
"automation": { AgentResultCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "automation"; spec.exports = exports; }
export default playgrounds;
