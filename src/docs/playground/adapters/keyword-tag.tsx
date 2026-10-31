/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { KeywordTag } from "@/components/keyword-tag";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"keyword-tag": define("Keyword Tag", { children: { ...text("Create image"), label: "Label" }, color: select(["surface", "mint", "pink", "blue", "purple", "orange"], "purple"), icon: toggle(true) }, v => <KeywordTag color={v.color} icon={v.icon ? <Icon name="sparkle" /> : undefined}>{v.children}</KeywordTag>)
};
const exports = {
"icon": { Icon },
"keyword-tag": { KeywordTag }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "keyword-tag"; spec.exports = exports; }
export default playgrounds;
