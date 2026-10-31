/** Family-owned preview adapters and local export bindings. */
import { SpectralGlass } from "@/components/spectral-glass";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"spectral-glass": {...define("Spectral Glass", {tone:select(["violet","clear","amber"],"violet"),composition:select(["stack","orbit","single"],"stack"),roughness:number(.09,0,.6,.01),dispersion:number(.65,0,1,.01),thickness:number(.42,.12,.65,.01),imperfections:number(.35,0,1,.01),rotation:number(0,-180,180,1),playing:toggle(true),label:text("Bevelled optical glass with colored studio reflections")},v=><div className="w-full h-[32rem] p-4"><SpectralGlass {...v}/></div>),source:"spectral-glass"}
};
const exports = {
"spectral-glass": { SpectralGlass }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "spectral-glass"; spec.exports = exports; }
export default playgrounds;
