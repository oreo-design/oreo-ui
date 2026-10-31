/** Family-owned preview adapters and local export bindings. */
import { IconReveal } from "@/components/icon-reveal";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"icon-reveal": define("Icon Reveal", {
    text: { ...text("Oreo UI"), label: "Text" },
    radius: { ...select(["sm", "md", "lg"], "md"), label: "Spotlight" },
    density: { ...select(["fine", "regular", "coarse"], "regular"), label: "Icon density" },
    revealed: { ...toggle(), label: "Reveal all" },
    animated: { ...toggle(true), label: "Animate" },
  }, v => <IconReveal {...v} />)
};
const exports = {
"icon-reveal": { IconReveal }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "icon-reveal"; spec.exports = exports; }
export default playgrounds;
