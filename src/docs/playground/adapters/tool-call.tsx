/** Family-owned preview adapters and local export bindings. */
import { ToolCall, ToolCallRow } from "@/components/tool-call";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"tool-call": define("Tool Call", { name: text("Search workspace"), badge: text("components/"), state: select(["running", "complete", "error"], "complete"), open: toggle(true), children: { ...text("Found 12 matching components.", true), label: "Result" } }, (v, set) =>
    <ToolCall name={v.name} badge={v.badge} state={v.state} open={v.open} onOpenChange={open => set("open", open)}><ToolCallRow label="Result">{v.children}</ToolCallRow></ToolCall>)
};
const exports = {
"tool-call": { ToolCall, ToolCallRow }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "tool-call"; spec.exports = exports; }
export default playgrounds;
