/** Family-owned preview adapters and local export bindings. */
import { PlaceMap, PlaceDetailCard, MapStylePicker, MAP_STYLES } from "@/components/place-map";
import { SAMPLE_PLACES } from "@/patterns/place-explorer/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"place-map": { ...define("Place Map", { selected:select(["lakehouse","juniper","northlight"],"lakehouse"), mapStyle:select(MAP_STYLES,"meadow"), empty:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><PlaceMap places={v.empty?[]:SAMPLE_PLACES} selectedId={v.selected} mapStyle={v.mapStyle} onSelect={id=>{if(id==="lakehouse"||id==="juniper"||id==="northlight")set("selected",id);}} toolbar={<MapStylePicker value={v.mapStyle} onValueChange={style=>set("mapStyle",style)}/>}/></div>), source:"place-map" },
"place-detail-card": { ...define("Place Detail Card", { place:select(["lakehouse","juniper","northlight"],"lakehouse"), saved:toggle(false) }, (v,set)=><div className="w-full max-w-4xl"><PlaceDetailCard place={SAMPLE_PLACES.find(p=>p.id===v.place)!} index={SAMPLE_PLACES.findIndex(p=>p.id===v.place)} total={3} instant onPrevious={()=>{const i=SAMPLE_PLACES.findIndex(p=>p.id===v.place);set("place",["lakehouse","juniper","northlight"][(i+2)%3] as typeof v.place);}} onNext={()=>{const i=SAMPLE_PLACES.findIndex(p=>p.id===v.place);set("place",["lakehouse","juniper","northlight"][(i+1)%3] as typeof v.place);}} saved={v.saved} onSave={()=>set("saved",!v.saved)}/></div>), source:"place-map" },
"map-style-picker": { ...define("Map Style Picker", { value:select(MAP_STYLES,"meadow") }, (v,set)=><MapStylePicker value={v.value} onValueChange={value=>set("value",value)}/>), source:"place-map" }
};
const exports = {
"place-map": { PlaceMap, PlaceDetailCard, MapStylePicker }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "place-map"; spec.exports = exports; }
export default playgrounds;
