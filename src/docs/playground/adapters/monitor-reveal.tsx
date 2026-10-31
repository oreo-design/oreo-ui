/** Family-owned preview adapters and local export bindings. */
import { MonitorReveal } from "@/components/monitor-reveal";
import { RegionSpotlight } from "@/components/edge-monitor";
import { REGIONS, latencySamples } from "@/patterns/edge-observatory/data";
import { definePlayground as define, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"monitor-reveal":{...define("Monitor Reveal",{play:number(1,0,100,1),variant:select(["rise","wipe"],"rise"),delay:number(100,0,400,50)},v=><MonitorReveal className="w-96 max-w-full" play={v.play} variant={v.variant} delay={v.delay}><RegionSpotlight region={REGIONS[6]} samples={latencySamples("24h",REGIONS[6])}/></MonitorReveal>),source:"monitor-reveal"}
};
const exports = {
"monitor-reveal": { MonitorReveal },
"edge-monitor": { RegionSpotlight }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "monitor-reveal"; spec.exports = exports; }
export default playgrounds;
