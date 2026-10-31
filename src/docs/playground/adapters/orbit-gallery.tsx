/** Family-owned preview adapters and local export bindings. */
import { OrbitGallery, ORBIT_LAYOUTS } from "@/components/orbit-gallery";
import { orbitGalleryItems } from "@/patterns/orbit-gallery/items";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"orbit-gallery": define("Orbit Gallery", { layout: select(ORBIT_LAYOUTS, "flat"), label: text("Selected works"), empty: toggle() }, (v, set) => <OrbitGallery items={v.empty ? [] : orbitGalleryItems} layout={v.layout} label={v.label} onLayoutChange={value => set("layout", value)} className="w-full" style={{ height: 560 }} />)
};
const exports = {
"orbit-gallery": { OrbitGallery }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "orbit-gallery"; spec.exports = exports; }
export default playgrounds;
