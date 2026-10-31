/** Family-owned preview adapters and local export bindings. */
import { CanvasToolbar, type CanvasMode } from "@/components/canvas-toolbar";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"canvas-toolbar": define("Canvas Toolbar", { zoom: number(95,10,200,5), mode: select(["pan","select"],"select"), disabled: toggle() }, (v,set) => <CanvasToolbar zoom={v.zoom} onZoomChange={zoom=>set("zoom",zoom)} mode={v.mode as CanvasMode} onModeChange={mode=>set("mode",mode)} disabled={v.disabled} onFit={()=>set("zoom",95)} />)
};
const exports = {
"canvas-toolbar": { CanvasToolbar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "canvas-toolbar"; spec.exports = exports; }
export default playgrounds;
