/** Family-owned preview adapters and local export bindings. */
import { ProgressiveSteps } from "@/components/progressive-steps";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"progressive-steps": {...define("Progressive Steps",{variant:select(["expanded","compact"],"expanded"),count:select(["4","6"],"4"),step:number(1,1,6,1),completed:toggle(),disabled:toggle(),empty:toggle()},(v,set)=>{const labels=v.count==="6"?["Profile","Email","Phone","ID photo","Selfie","Review"]:["Cart","Details","Payment","Review"];const index=Math.max(0,Math.min(labels.length-1,Math.floor(v.step)-1));const steps=labels.map((label,i)=>({id:String(i+1),label}));return <div className="w-full max-w-lg p-6"><ProgressiveSteps steps={v.empty?[]:steps} value={v.completed?"":String(index+1)} completed={steps.slice(0,v.completed?steps.length:index).map(s=>s.id)} variant={v.variant as "expanded"|"compact"} disabled={v.disabled} onValueChange={id=>set("step",Number(id))}/></div>;}),source:"progressive-steps"}
};
const exports = {
"progressive-steps": { ProgressiveSteps }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "progressive-steps"; spec.exports = exports; }
export default playgrounds;
