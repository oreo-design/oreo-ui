/** Family-owned preview adapters and local export bindings. */
import { AssistantModal } from "@/components/assistant-modal";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"assistant-modal": define("Assistant Modal", { label: text("Open assistant"), open: toggle(true), children: { ...text("How can I help you today?", true), label: "Content" } }, (v, set) =>
    <div className="relative h-128 w-full"><AssistantModal className="start-4 flex justify-end" panelClassName="h-96 max-w-full" label={v.label} open={v.open} onOpenChange={open => set("open", open)} inline><div className="p-6 text-sm">{v.children}</div></AssistantModal></div>)
};
const exports = {
"assistant-modal": { AssistantModal }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "assistant-modal"; spec.exports = exports; }
export default playgrounds;
