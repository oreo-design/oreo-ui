import { useId, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { InlineQuickMenu } from "@/components/inline-quick-menu";
import { AgentWorkspaceState } from "@/components/automation";
import { easeOut } from "@/lib/motion";
import "./place-map.css";

export const MAP_STYLES = ["meadow", "sage", "apricot", "paper", "midnight"] as const;
export type MapStyle = typeof MAP_STYLES[number];
export type MapPoint = { x: number; y: number };
export type PlaceResult = {
  id: string; name: string; category: string; minutes: number; rating: number;
  address: string; description: string; amenities: { label: string; icon: IconName }[];
  point: MapPoint; route: MapPoint[]; illustration?: "lake" | "bakery" | "studio";
};
const styleName = (style: MapStyle) => style[0].toUpperCase() + style.slice(1);
export function MapStylePicker({ value, onValueChange }: { value: MapStyle; onValueChange: (style: MapStyle) => void }) {
  return <InlineQuickMenu label="Map style" value={value} onValueChange={next => { if (MAP_STYLES.includes(next as MapStyle)) onValueChange(next as MapStyle); }} options={MAP_STYLES.map(style => ({value: style, label: styleName(style), icon:<span className="place-style-swatch place-palette" data-map-style={style}/> }))} className="place-style-picker"/>;
}

/** Original illustrative geography. Coordinates use percentages of the 1000 × 560 scene. */
export function ParkMapArtwork() {
  return <g aria-hidden="true">
    <rect width="1000" height="560" fill="var(--map-block)"/>
    <g transform="rotate(-8 500 280)">
      {Array.from({length:10},(_,i)=><path key={`v${i}`} d={`M ${i*124-60} -200 V 800`} stroke="var(--map-road)" strokeWidth="14"/>)}
      {Array.from({length:7},(_,i)=><path key={`h${i}`} d={`M -200 ${i*94-40} H 1200`} stroke="var(--map-road)" strokeWidth="12"/>)}
      <rect x="190" y="70" width="650" height="335" rx="12" fill="var(--map-park)" stroke="var(--map-road)" strokeWidth="10"/>
      <path d="M207 117Q260 64 304 106T400 95Q432 76 454 117Q474 147 425 168Q450 214 397 234Q380 280 320 256Q275 296 228 247Q188 224 219 186Q192 164 207 117Z" fill="var(--map-lawn)"/>
      <g fill="var(--map-tree)">
        {[[220,91,12],[330,96,18],[402,130,25],[480,95,23],[530,90,20],[686,96,25],[755,106,30],[800,150,22],[809,229,17],[782,300,26],[735,354,25],[620,373,20],[495,366,17],[408,354,24],[345,375,20],[220,335,17],[231,292,14]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r}/>)}
      </g>
      <path d="M416 212C448 109 685 90 746 179C807 276 692 356 574 350C465 350 388 297 416 212Z" fill="none" stroke="var(--map-road)" strokeWidth="4"/>
      <path d="M442 218C474 127 670 114 723 188C771 262 677 330 575 327C487 326 421 286 442 218Z" fill="var(--map-water)"/>
      <ellipse cx="646" cy="238" rx="26" ry="29" fill="var(--map-park)"/>
      <ellipse cx="301" cy="334" rx="46" ry="29" fill="var(--map-water)"/>
      <path d="M203 280Q297 296 409 254M505 349L482 405M745 195L837 194" fill="none" stroke="var(--map-road)" strokeWidth="4"/>
    </g>
    <g fill="var(--map-label)" fontSize="17" fontWeight="500" textAnchor="middle"><text x="308" y="270">Willow Park</text><text x="593" y="239">Willow Lake</text></g>
    <g fill="var(--map-street-label)" fontSize="12" textAnchor="middle"><text x="520" y="55" transform="rotate(-8 520 55)">North Avenue</text><text x="633" y="474" transform="rotate(-8 633 474)">Parkside Walk</text></g>
  </g>;
}
const clamp = (n:number) => Number.isFinite(n) ? Math.max(0,Math.min(100,n)) : 50;
export function PlaceMap({ places, selectedId, onSelect, mapStyle = "meadow", origin = {x:25,y:78}, artwork, toolbar, footer, label = "Places around Willow Park" }: {
  places: PlaceResult[]; selectedId?: string; onSelect: (id: string, instant: boolean) => void; mapStyle?: MapStyle; origin?: MapPoint; artwork?: ReactNode; toolbar?: ReactNode; footer?: ReactNode; label?: string;
}) {
  const id=useId();
  const selected=places.find(p=>p.id===selectedId)??places[0];
  if(!selected) return <div className="place-map-empty"><AgentWorkspaceState title="No places to show" description="Try a different search or clear your filters to explore the neighborhood."/></div>;
  const route = [origin,...selected.route,selected.point].map(p=>`${clamp(p.x)*10},${clamp(p.y)*5.6}`).join(" ");
  return <section className="place-map place-palette" data-map-style={mapStyle} aria-label={label}>
    {toolbar && <div className="place-map-toolbar">{toolbar}</div>}
    <div className="place-map-scene">
      <svg className="place-map-art" viewBox="0 0 1000 560" aria-hidden="true">{artwork??<ParkMapArtwork/>}
        <g><polyline points={route} fill="none" stroke="var(--map-road)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/><polyline points={route} fill="none" stroke="var(--map-route)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></g>
      </svg>
      <span className="place-origin" style={{left:`${clamp(origin.x)}%`,top:`${clamp(origin.y)}%`}} role="img" aria-label="Sample starting point"/>
      <div className="place-map-pins" role="group" aria-label="Choose a place">{places.map(place=><div key={place.id} className="place-map-marker" data-edge={place.point.x<25?"left":place.point.x>75?"right":undefined} style={{left:`${clamp(place.point.x)}%`,top:`${clamp(place.point.y)}%`}}>
        <button type="button" aria-pressed={selected.id===place.id} aria-controls={`${id}-selection`} onClick={e=>onSelect(place.id,e.detail===0)}><span>{place.name}</span><span className="place-map-minutes">{place.minutes} min</span></button><i aria-hidden="true"/>
      </div>)}</div>
    </div>
    <div id={`${id}-selection`} className="sr-only" role="status">{selected.name}, {selected.minutes} minute walk, rated {selected.rating} out of 5.</div>
    {footer&&<div className="place-map-footer">{footer}</div>}
    <div className="place-map-caption"><span><i/> Starting point</span><span>Illustrated map · Not for navigation</span></div>
  </section>;
}

/** An original vector thumbnail, not a photograph of the sample venue. */
export function PlaceIllustration({variant="lake"}:{variant?:PlaceResult["illustration"]}) {
  return <svg viewBox="0 0 96 96" aria-hidden="true" className="place-illustration">
    <rect width="96" height="96" rx="12" fill="var(--place-art-warm)"/>
    <rect x="8" y="8" width="80" height="55" rx="4" fill="var(--place-art-cream)"/>
    <rect x="17" y="14" width="62" height="43" rx="2" fill="var(--place-art-blue)"/>
    <path d="M17 43Q40 28 79 38V57H17Z" fill="var(--place-art-green)"/>
    <path d="M48 14V57M17 35H79" stroke="var(--color-palette-brown-text)" strokeWidth="3"/>
    <path d="M8 63H88V71H8Z" fill="var(--color-palette-brown-text)"/>
    {variant==="bakery"?<><ellipse cx="47" cy="60" rx="23" ry="5" fill="var(--color-text-on-accent)"/><path d="M28 58Q32 42 41 54Q50 39 58 54Q65 43 70 58Z" fill="var(--place-art-accent)"/></>:<><path d="M35 44H58V60Q46 69 35 60Z" fill="var(--color-text-on-accent)"/><path d="M58 47Q70 46 66 55Q63 59 58 57" fill="none" stroke="var(--color-text-on-accent)" strokeWidth="4"/>{variant==="studio"&&<path d="M19 67L27 51H34L28 67Z" fill="var(--color-palette-purple-text)"/>}</>}
    <path d="M17 73V96M79 73V96" stroke="var(--color-palette-brown-text)" strokeWidth="5"/><path d="M4 84H27M69 84H92" stroke="var(--place-art-accent)" strokeWidth="6"/>
  </svg>;
}
export function PlaceDetailCard({place, index=0, total=1, onPrevious, onNext, onCopy, copyLabel="Copy itinerary", onSave, saved=false, instant=false}:{place:PlaceResult;index?:number;total?:number;onPrevious?:(event:MouseEvent<HTMLButtonElement>)=>void;onNext?:(event:MouseEvent<HTMLButtonElement>)=>void;onCopy?:()=>void;copyLabel?:string;onSave?:()=>void;saved?:boolean;instant?:boolean}) {
  const reduce=useReducedMotion();
  return <article className="place-detail-card" aria-label={`Details for ${place.name}`}>
    <motion.div key={place.id} className="place-detail-content" initial={instant?false:{opacity:0,transform:reduce?"translateY(0px)":"translateY(4px)"}} animate={{opacity:1,transform:"translateY(0px)"}} transition={{duration:instant?0:.16,ease:easeOut}}>
      <PlaceIllustration variant={place.illustration}/><div className="place-detail-info"><div className="place-detail-heading"><h3>{place.name}</h3><span className="place-rating"><Icon name="star" size="sm" weight="fill"/>{place.rating}<span className="sr-only">out of 5</span></span></div><p>{place.category} · {place.minutes} min walk</p><ul className="place-amenities">{place.amenities.map(amenity=><li key={amenity.label}><Icon name={amenity.icon} size="sm"/>{amenity.label}</li>)}</ul></div>
    </motion.div>
    <div className="place-detail-actions"><div className="place-detail-pager"><IconButton type="tertiary" size="sm" tapScale={1} aria-label="Previous place" disabled={total<=1||!onPrevious} onClick={onPrevious} icon={<Icon name="chevron-left" size="sm"/>}/><span aria-label={`Place ${index+1} of ${total}`}>{index+1} / {total}</span><IconButton type="tertiary" size="sm" tapScale={1} aria-label="Next place" disabled={total<=1||!onNext} onClick={onNext} icon={<Icon name="chevron-right" size="sm"/>}/></div><div className="flex items-center gap-2">{onSave&&<IconButton type="secondary" tapScale={1} aria-label={saved?`Unsave ${place.name}`:`Save ${place.name}`} aria-pressed={saved} onClick={onSave} icon={<Icon name="star" size="sm" weight={saved?"fill":"regular"}/>}/>} {onCopy&&<Button type="secondary" tapScale={1} onClick={onCopy} leadingIcon={<Icon name={copyLabel==="Copied"?"check":"copy"} size="sm"/>}>{copyLabel}</Button>}</div></div>
  </article>;
}
