/** Family-owned preview adapters and local export bindings. */
import { CalendarEventBlock, CalendarColorPicker, CalendarSourceList, CalendarWeekGrid, weekDates } from "@/components/color-calendar";
import { INITIAL_EVENTS as COLOR_EVENTS, INITIAL_SOURCES as COLOR_SOURCES } from "@/patterns/color-calendar/data";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"calendar-event-block":{...define("Calendar Event Block",{selected:toggle(false),compact:toggle(false),color:select(["blue","mint","pink","purple","orange","brown","default"],"blue")},(v,set)=><div className="w-64 h-24"><CalendarEventBlock event={{...COLOR_EVENTS[0],color:v.color}} source={COLOR_SOURCES[2]} selected={v.selected} compact={v.compact} onOpen={()=>set("selected",!v.selected)}/></div>),source:"color-calendar"},
"calendar-color-picker":{...define("Calendar Color Picker",{color:select(["blue","mint","pink","purple","orange","brown","default"],"blue"),disabled:toggle(false)},(v,set)=><CalendarColorPicker value={v.color} disabled={v.disabled} onChange={color=>{if(color)set("color",color);}}/>),source:"color-calendar"},
"calendar-source-list":{...define("Calendar Source List",{work:toggle(true)},(v,set)=><div className="w-64"><CalendarSourceList sources={[{...COLOR_SOURCES[0],visible:v.work}]} onVisibilityChange={(_,visible)=>set("work",visible)}/></div>),source:"color-calendar"},
"calendar-week-grid":{...define("Calendar Week Grid",{state:select(["ready","loading","empty","error"],"ready"),day:toggle(false)},(v,set)=><div className="w-full"><CalendarWeekGrid dates={v.day?["2026-10-19"]:weekDates("2026-10-19",5)} events={v.state==="ready"?COLOR_EVENTS:[]} sources={COLOR_SOURCES} loading={v.state==="loading"} error={v.state==="error"?"The demo calendar could not be loaded.":undefined} onRetry={()=>set("state","ready")} onEmptyAction={()=>set("state","ready")}/></div>),source:"color-calendar"}
};
const exports = {
"color-calendar": { CalendarEventBlock, CalendarColorPicker, CalendarSourceList, CalendarWeekGrid }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "color-calendar"; spec.exports = exports; }
export default playgrounds;
