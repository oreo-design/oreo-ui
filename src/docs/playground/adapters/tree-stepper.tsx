/** Family-owned preview adapters and local export bindings. */
import { Icon } from "@/components/icon";
import { playgroundCode } from "../code";
import { TreeStepper, getTreeSteps } from "@/components/tree-stepper";
import { REVIEW_TREE } from "@/patterns/security-review/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"tree-stepper": define("Tree Stepper", { value: select(getTreeSteps(REVIEW_TREE).map(s=>s.node.id),"suspicious"), disabled: toggle(), empty: toggle(), attention: toggle() }, (v,set)=><div className="w-full max-w-sm rounded-card-medium border border-border-subtle bg-bg-base p-4"><TreeStepper nodes={v.empty?[]:REVIEW_TREE} value={v.value} onValueChange={value => set("value", value)} completed={["devices","ownership","overview"]} attention={v.attention?["overview"]:[]} disabled={v.disabled}/></div>)
};
const exports = {
"tree-stepper": { TreeStepper },
"icon": { Icon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "tree-stepper"; spec.exports = exports; }
export default playgrounds;

playgrounds["tree-stepper"].exportRecipe = values => {
  const spec = playgrounds["tree-stepper"];
  const example = playgroundCode(spec.render(values, () => {}), exports, { "TreeStepper.value": "value", "TreeStepper.onValueChange": "setValue" });
  return { ...example, imports: [...example.imports, 'import { useState } from "react";'], setup: [...example.setup, `const [value, setValue] = useState(${JSON.stringify(values.value)});`] };
};
