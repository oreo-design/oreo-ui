/** Family-owned preview adapters and local export bindings. */
import { Shortcut } from "@/components/shortcut";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
shortcut: define("Shortcut", { keys: { ...text("cmd, shift, K"), description: "Separate key names with commas." }, size: select(["sm", "md"], "sm"), combine: toggle() }, v =>
    <Shortcut {...v} keys={v.keys.split(",").map(key => key.trim()).filter(Boolean)} />)
};
const exports = {
"shortcut": { Shortcut }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "shortcut"; spec.exports = exports; }
export default playgrounds;
