/** Family-owned preview adapters and local export bindings. */
import { MultiSelectMenu } from "@/components/multi-select-menu";
import { meetingCategories } from "@/patterns/meeting-planner/data";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"meeting-components": { ...define("Multi-select Menu", { label: text("Event category"), heading: text("Meeting category"), disabled: toggle(), empty: toggle(), selected: text("review,brainstorm,interview") }, (v,set) => <div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-3"><MultiSelectMenu label={v.label} heading={v.heading} disabled={v.disabled} options={v.empty ? [] : meetingCategories} value={v.selected.split(",").map(id=>id.trim()).filter(Boolean)} onValueChange={value=>set("selected",value.join(","))} /></div>), source: "multi-select-menu" }
};
const exports = {
"multi-select-menu": { MultiSelectMenu }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "multi-select-menu"; spec.exports = exports; }
export default playgrounds;
