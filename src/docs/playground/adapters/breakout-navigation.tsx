/** Family-owned preview adapters and local export bindings. */
import { BreakoutNavigator, DestinationProgress, RecoveryMessage, BREAKOUT_DESTINATIONS } from "@/components/breakout-navigation";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"breakout-navigator":{...define("Breakout Navigator",{goal:number(8,1,12,1),speed:select(["calm","brisk"],"calm"),trail:toggle(true),count:number(6,0,6,1),resetKey:number(0,0,99,1)},v=><div className="w-full p-5"><BreakoutNavigator destinations={BREAKOUT_DESTINATIONS.slice(0,v.count)} goal={v.goal} speed={v.speed} trail={v.trail} resetKey={v.resetKey}/></div>),source:"breakout-navigation"},
"destination-progress":{...define("Destination Progress",{hits:number(3,0,8,1),goal:number(8,1,12,1),compact:toggle(false),count:number(6,0,6,1)},v=><div className="w-full max-w-md p-6"><DestinationProgress destinations={BREAKOUT_DESTINATIONS.slice(0,v.count)} hits={Object.fromEntries(BREAKOUT_DESTINATIONS.map(d=>[d.id,v.hits]))} goal={v.goal} compact={v.compact}/></div>),source:"breakout-navigation"},
"recovery-message":{...define("Recovery Message",{title:text("Breakout of the 404 maze"),description:text("This page is missing. Take a detour, or go straight to"),linkLabel:text("components"),eyebrow:text("404 · PAGE NOT FOUND")},v=><div className="w-full p-8"><RecoveryMessage title={v.title} description={v.description} href="/button" linkLabel={v.linkLabel} eyebrow={v.eyebrow}/></div>),source:"breakout-navigation"}
};
const exports = {
"breakout-navigation": { BreakoutNavigator, DestinationProgress, RecoveryMessage }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "breakout-navigation"; spec.exports = exports; }
export default playgrounds;
