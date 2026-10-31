/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { Chip } from "@/components/chip";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const spring = { bounce: { ...number(.4, 0, 1, .05), group: "Press spring" }, duration: { ...number(.3, .1, 1, .05), group: "Press spring" }, tapScale: { ...number(.96, .8, 1, .01), group: "Press spring" } };
const playgrounds: Record<string, PlaygroundSpec> = {
chip: define("Chip", { children: { ...text("Summarize this page"), label: "Label" }, size: select(["sm", "md"], "md"), selected: toggle(), disabled: toggle(), icon: toggle(true), ...spring }, (v, set) =>
    <Chip {...v} icon={v.icon ? <Icon name="sparkle" /> : undefined} onClick={() => set("selected", !v.selected)}>{v.children}</Chip>)
};
const exports = {
"icon": { Icon },
"chip": { Chip }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "chip"; spec.exports = exports; }
export default playgrounds;
