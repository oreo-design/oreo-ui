/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
tag: define("Tag", { children: { ...text("Design"), label: "Label" }, color, size: select(["sm", "md"], "sm"), hash: toggle(), icon: toggle() }, v =>
    <Tag {...v} icon={v.icon ? <Icon name="sparkle" /> : undefined}>{v.children}</Tag>)
};
const exports = {
"icon": { Icon },
"tag": { Tag }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "tag"; spec.exports = exports; }
export default playgrounds;
