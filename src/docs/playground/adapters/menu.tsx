/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
menu: define("Menu", { label: text("Open menu"), side: select(["top", "bottom", "left", "right"], "bottom"), align: select(["start", "center", "end"], "start"), sideOffset: number(4, 0, 24), disabled: { ...toggle(), label: "Disable duplicate" } }, v =>
    <Menu><MenuTrigger render={<Button type="secondary" trailingIcon={<Icon name="chevron-down" />} />}>{v.label}</MenuTrigger><MenuPopup side={v.side} align={v.align} sideOffset={v.sideOffset}><MenuItem icon={<Icon name="copy" />} disabled={v.disabled}>Duplicate</MenuItem><MenuItem icon={<Icon name="pencil" />}>Rename</MenuItem></MenuPopup></Menu>)
};
const exports = {
"button": { Button },
"icon": { Icon },
"menu": { Menu, MenuTrigger, MenuPopup, MenuItem }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "menu"; spec.exports = exports; }
export default playgrounds;
