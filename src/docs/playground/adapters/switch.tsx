/** Family-owned preview adapters and local export bindings. */
import { Switch } from "@/components/switch";
import { definePlayground as define, toggle, select } from "../schema";
import { playgroundCode } from "../code";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
switch: define("Switch", { checked: toggle(false), variant: select(["default", "stretch"], "stretch"), disabled: toggle(), readOnly: toggle() }, (v,set) => <Switch aria-label="Stretch motion" checked={v.checked} onCheckedChange={checked=>set("checked",checked)} variant={v.variant} disabled={v.disabled} readOnly={v.readOnly} />)
};
const exports = {
"switch": { Switch }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "switch"; spec.exports = exports; }
export default playgrounds;

playgrounds.switch.exportRecipe = values => playgroundCode(
  <Switch aria-label="Stretch motion" defaultChecked={Boolean(values.checked)} variant={values.variant as "default" | "stretch"} disabled={Boolean(values.disabled)} readOnly={Boolean(values.readOnly)} />, exports,
);
