/** Family-owned preview adapters and local export bindings. */
import { RegionTrafficMap, RegionSpotlight, IncidentRecommendation } from "@/components/edge-monitor";
import { REGIONS, latencySamples } from "@/patterns/edge-observatory/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"region-spotlight":{...define("Region Spotlight",{selected:select(REGIONS.map(r=>r.id),"sin1"),trend:toggle(true)},v=><div className="w-96 max-w-full"><RegionSpotlight region={REGIONS.find(r=>r.id===v.selected)!} samples={v.trend?latencySamples("24h",REGIONS.find(r=>r.id===v.selected)):[]}/></div>),source:"edge-monitor"},
"incident-recommendation":{...define("Incident Recommendation",{share:number(30,1,50,1),action:text("")},(v,set)=><div className="w-full max-w-lg"><IncidentRecommendation source={REGIONS[6]} baseline={38} target={REGIONS[7]} headroom={41} share={v.share} onReview={()=>set("action","Review requested. The complete template opens a local routing draft.")} onTrace={()=>set("action","Trace requested. Open the template to inspect the sample requests.")}/><p role="status" className="px-3 text-sm text-text-secondary">{v.action}</p></div>),source:"edge-monitor"},
"edge-monitor": define("Region Traffic Map", { selected: select(REGIONS.map(r=>r.id), "sin1"), empty: toggle() }, (v,set) => <div className="w-full max-w-3xl rounded-card-medium border border-border-subtle bg-bg-elevated"><RegionTrafficMap regions={v.empty?[]:REGIONS} selected={v.selected} onSelect={id=>set("selected",id)}/></div>)
};
const exports = {
"edge-monitor": { RegionTrafficMap, RegionSpotlight, IncidentRecommendation }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "edge-monitor"; spec.exports = exports; }
export default playgrounds;
