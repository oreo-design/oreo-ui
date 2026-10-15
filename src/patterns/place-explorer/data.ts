import type { PlaceResult } from "@/components/place-map";
export const SAMPLE_PLACES: PlaceResult[] = [
  {id:"lakehouse",name:"The Lakehouse",category:"Lakeside café",minutes:5,rating:4.8,address:"12 Parkside Walk",description:"Big windows, a quiet upstairs room, and a view across the lake. A comfortable spot for a few focused hours.",amenities:[{label:"Quiet tables",icon:"moon"},{label:"Outlets",icon:"plug"},{label:"Lake view",icon:"sun"}],point:{x:61,y:64},route:[{x:42,y:74},{x:43,y:67},{x:52,y:66}],illustration:"lake"},
  {id:"juniper",name:"Juniper Café",category:"Neighborhood bakery",minutes:4,rating:4.6,address:"8 Willow Lane",description:"A friendly bakery on the city side of the park. Pick up a pastry and settle into a bright window seat.",amenities:[{label:"Bright tables",icon:"sun"},{label:"Outlets",icon:"plug"},{label:"Fresh pastries",icon:"star"}],point:{x:17,y:43},route:[{x:20,y:78},{x:18,y:75},{x:16,y:47}],illustration:"bakery"},
  {id:"northlight",name:"Northlight",category:"Coffee & work studio",minutes:9,rating:4.7,address:"26 North Avenue",description:"A spacious work-friendly coffee shop with fast Wi-Fi, generous desks, and a calm corner for reading.",amenities:[{label:"Fast Wi-Fi",icon:"globe"},{label:"Outlets",icon:"plug"},{label:"Open till 9",icon:"moon"}],point:{x:86,y:34},route:[{x:42,y:74},{x:43,y:67},{x:61,y:64},{x:72,y:56},{x:77,y:36}],illustration:"studio"},
];
export type PlaceFilter="all"|"quiet"|"wifi"|"saved";
export const PLACE_FILTERS: {id:PlaceFilter;label:string;prompt:string}[]=[
  {id:"all",label:"All places",prompt:"Find me a café near the park where I can work for a few hours."},
  {id:"quiet",label:"Quiet corners",prompt:"Show me somewhere quiet to focus near the park."},
  {id:"wifi",label:"Fast Wi-Fi",prompt:"I need a café with fast Wi-Fi for an afternoon of work."},
  {id:"saved",label:"Saved places",prompt:"Show me the places I saved for later."},
];
const normalizeSearch = (text:string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");
export function placeMatches(place:PlaceResult,query:string){
  const words=normalizeSearch(query).split(/\s+/).filter(Boolean);
  const haystack=normalizeSearch(`${place.name} ${place.category} ${place.description} ${place.address} ${place.amenities.map(a=>a.label).join(" ")}`);
  return words.every(word=>word==="cafe"||word==="coffee" ? haystack.includes("cafe")||haystack.includes("coffee") : haystack.includes(word));
}
export function itineraryText(place:PlaceResult){return `${place.name}\n${place.address} · Willow Park (sample city)\n${place.minutes} min walk from the sample starting point\n${place.amenities.map(a=>a.label).join(" · ")}\n\nIllustrative itinerary only; not real navigation directions.`;}
