/** Family-owned preview adapters and local export bindings. */
import { CallbackPriority, CallbackCard, CallbackBoard } from "@/components/callback";
import { INITIAL_CALLBACKS, PEOPLE as CALLBACK_PEOPLE } from "@/patterns/callback-workspace/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"callback-priority": { ...define("Callback Priority", {priority:select(["Low","Medium","High","Critical"],"Critical")},v=><CallbackPriority {...v}/>),source:"callback" },
"callback-card": { ...define("Callback Card", {customer:text("Hillside Dental"),priority:select(["Low","Medium","High","Critical"],"Critical"),cost:number(1280,0,10000,10),showBranch:toggle(true)},v=><div className="w-full max-w-sm rounded-3xl bg-bg-elevated p-4"><CallbackCard callback={{...INITIAL_CALLBACKS[4],customer:v.customer,priority:v.priority,cost:v.cost}} person={CALLBACK_PEOPLE[1]} showBranch={v.showBranch} onOpen={()=>{window.location.href="/callback-workspace";}}/></div>),source:"callback" },
"callback-board": { ...define("Callback Board", {empty:toggle(false),showBranch:toggle(false)},v=><div className="w-full"><CallbackBoard callbacks={v.empty?[]:INITIAL_CALLBACKS} people={CALLBACK_PEOPLE} showBranch={v.showBranch} onOpen={()=>{window.location.href="/callback-workspace";}}/></div>),source:"callback" }
};
const exports = {
"callback": { CallbackPriority, CallbackCard, CallbackBoard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "callback"; spec.exports = exports; }
export default playgrounds;
