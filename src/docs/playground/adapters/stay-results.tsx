/** Family-owned preview adapters and local export bindings. */
import { StayPriceLabel, StayResultCard, StaySelectionCard, distanceKm } from "@/components/stay-results";
import { STAYS, LANDMARKS } from "@/patterns/landmark-stays/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"stay-price-label": {...define("Stay Price Label",{selected:toggle(true),nightly:number(148,0,500,1)},v=><div className="rounded-full border border-border-subtle bg-bg-inverse text-text-on-inverse px-3 py-2 text-sm"><StayPriceLabel name="Atelier de la Tour" nightly={v.nightly} selected={v.selected}/></div>),source:"stay-results"},
"stay-result-card": {...define("Stay Result Card",{selected:toggle(false),saved:toggle(false)},(v,set)=><StayResultCard stay={STAYS[0]} distance={distanceKm(STAYS[0],LANDMARKS[0])} selected={v.selected} saved={v.saved} onSelect={()=>set("selected",!v.selected)}/>),source:"stay-results"},
"stay-selection-card": {...define("Stay Selection Card",{stay:select(["atelier","jardin","rue"],"atelier"),saved:toggle(false)},(v,set)=>{const index=STAYS.findIndex(stay=>stay.id===v.stay);return <div className="w-full max-w-3xl"><StaySelectionCard stay={STAYS[index]} distance={distanceKm(STAYS[index],LANDMARKS[0])} landmark="Eiffel Tower" index={index} total={3} saved={v.saved} onSave={()=>set("saved",!v.saved)} onPrevious={()=>set("stay",["atelier","jardin","rue"][(index+2)%3] as typeof v.stay)} onNext={()=>set("stay",["atelier","jardin","rue"][(index+1)%3] as typeof v.stay)}/></div>;}),source:"stay-results"}
};
const exports = {
"stay-results": { StayPriceLabel, StayResultCard, StaySelectionCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "stay-results"; spec.exports = exports; }
export default playgrounds;
