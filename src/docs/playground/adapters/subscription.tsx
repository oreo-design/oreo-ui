/** Family-owned preview adapters and local export bindings. */
import { ProductPreview } from "@/components/subscription";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"subscription-components": { ...define("Product Preview", {
    variant: select(["social", "assistant", "code"], "social"),
    title: text(""), description: text(""), travel: number(4, 0, 8, 1), motionEnabled: toggle(true),
  }, v => <ProductPreview variant={v.variant} title={v.title || undefined} description={v.description || undefined} travel={v.travel} motionEnabled={v.motionEnabled} className="w-full max-w-xs" />), source: "subscription" }
};
const exports = {
"subscription": { ProductPreview }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "subscription"; spec.exports = exports; }
export default playgrounds;
