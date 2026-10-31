/** Family-owned preview adapters and local export bindings. */
import { PlaygroundIcon, Icon } from "@/components/icon";
import { Button, IconButton } from "@/components/button";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const sizes = select(["sm", "md", "lg"], "md");
const emphasis = select(["primary", "secondary", "tertiary"], "primary");
const spring = { bounce: { ...number(.4, 0, 1, .05), group: "Press spring" }, duration: { ...number(.3, .1, 1, .05), group: "Press spring" }, tapScale: { ...number(.96, .8, 1, .01), group: "Press spring" } };
const playgrounds: Record<string, PlaygroundSpec> = {
button: define("Button", { children: { ...text("Continue"), label: "Label" }, type: emphasis, size: sizes, danger: toggle(), disabled: toggle(), leadingIcon: toggle(true), trailingIcon: toggle(), ...spring }, (v) =>
    <Button type={v.type} size={v.size} danger={v.danger} disabled={v.disabled} leadingIcon={v.leadingIcon ? <PlaygroundIcon name="sparkles" /> : undefined} trailingIcon={v.trailingIcon ? <Icon name="chevron-right" /> : undefined} bounce={v.bounce} duration={v.duration} tapScale={v.tapScale}>{v.children}</Button>),
"icon-button": define("Icon Button", { type: emphasis, size: sizes, shape: select(["rounded", "rectangle"], "rounded"), floating: toggle(), danger: toggle(), disabled: toggle(), ...spring }, v =>
    <IconButton aria-label="Add item" icon={<Icon name="plus" />} {...v} />)
};
const exports = {
"button": { Button, IconButton },
"icon": { Icon, PlaygroundIcon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "button"; spec.exports = exports; }
export default playgrounds;
