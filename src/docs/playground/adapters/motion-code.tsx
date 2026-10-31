/** Family-owned preview adapters and local export bindings. */
import { CodeFocus, SheetTimeline, SHEET_CODE } from "@/components/motion-code";
import { definePlayground as define, text, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"code-focus": {...define("Code Focus", {code:text(SHEET_CODE,true),value:number(36,0,100,1),focusLines:number(5,1,12,1),scramble:toggle(true),disabled:toggle(false),label:text("Code focus")},(v,set)=><div className="w-full max-w-2xl overflow-hidden p-4"><CodeFocus {...v} onValueChange={value=>set("value",value)} /></div>),source:"motion-code"},
"sheet-timeline": {...define("Sheet Timeline", {progress:number(60,0,100,1),guides:toggle(true),label:text("Bottom sheet motion preview")},v=><div className="p-8"><SheetTimeline {...v} /></div>),source:"motion-code"}
};
const exports = {
"motion-code": { CodeFocus, SheetTimeline }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "motion-code"; spec.exports = exports; }
export default playgrounds;
