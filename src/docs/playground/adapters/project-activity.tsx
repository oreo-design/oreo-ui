/** Family-owned preview adapters and local export bindings. */
import { ActivityEventRow, GroupedActivityFeed } from "@/components/project-activity";
import { FEED_EVENTS, FEED_NOW } from "@/patterns/project-feed/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"activity-event-row": {...define("Activity Event Row",{event:number(1,1,18,1),unread:toggle(true),selected:toggle(),interactive:toggle(true)},(v,set)=><div className="w-full p-6"><ActivityEventRow event={FEED_EVENTS[Math.floor(v.event)-1]} now={FEED_NOW} currentUserId="alex" unread={v.unread} selected={v.selected} onOpen={v.interactive?()=>{set("selected",!v.selected);set("unread",false);}:undefined}/></div>),source:"project-activity"},
"grouped-activity-feed": {...define("Grouped Activity Feed",{count:number(8,1,18,1),state:select(["ready","loading","empty","error"],"ready"),read:toggle(),selected:number(0,0,18,1)},(v,set)=><div className="w-full p-6"><GroupedActivityFeed events={v.state==="ready"?FEED_EVENTS.slice(0,Math.floor(v.count)):[]} now={FEED_NOW} currentUserId="alex" readIds={v.read?FEED_EVENTS.map(e=>e.id):[]} selectedId={v.selected?FEED_EVENTS[Math.floor(v.selected)-1]?.id:undefined} onOpen={event=>set("selected",FEED_EVENTS.findIndex(e=>e.id===event.id)+1)} loading={v.state==="loading"} error={v.state==="error"?"Activity could not be loaded.":undefined} onReset={()=>set("state","ready")}/></div>),source:"project-activity"}
};
const exports = {
"project-activity": { ActivityEventRow, GroupedActivityFeed }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "project-activity"; spec.exports = exports; }
export default playgrounds;
