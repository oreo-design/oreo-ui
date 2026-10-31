/** Family-owned preview adapters and local export bindings. */
import { PresenceStack, PresenceBadge } from "@/components/presence";
import { ROOM_PEOPLE } from "@/patterns/presence-room/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"presence-stack": { ...define("Presence Stack", { count:number(5,0,7,1), max:number(4,1,6,1), animate:toggle(true) }, v=><PresenceStack people={ROOM_PEOPLE.slice(0,v.count)} selfId="you" max={v.max} animate={v.animate} />), source:"presence" },
"presence-badge": { ...define("Presence Badge", { status:select(["online","away","typing"],"typing"), animate:toggle(true) }, v=><div className="flex items-center gap-3 text-sm"><PresenceBadge {...v} /><span>{v.status}</span></div>), source:"presence" }
};
const exports = {
"presence": { PresenceStack, PresenceBadge }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "presence"; spec.exports = exports; }
export default playgrounds;
