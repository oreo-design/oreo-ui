/** Family-owned preview adapters and local export bindings. */
import { BrandSwatch } from "@/components/brand-swatch";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"brand-swatch": define("Brand Swatch", { name:text("Iris"), hex:select(["#6550b9","#027864","#202020","#ffffff"],"#6550b9"), role:text("Accent colour"), disabled:toggle() }, v=><div className="w-full max-w-xs"><BrandSwatch {...v} onCopy={hex=>navigator.clipboard.writeText(hex).catch(()=>window.prompt("Copy this colour",hex))}/></div>)
};
const exports = {
"brand-swatch": { BrandSwatch }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "brand-swatch"; spec.exports = exports; }
export default playgrounds;
