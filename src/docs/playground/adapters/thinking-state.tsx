/** Family-owned preview adapters and local export bindings. */
import { ThinkingState, ThinkingTimeline, THINKING_STATES } from "@/components/thinking-state";
import { STEPS as THINKING_STEPS } from "@/patterns/thinking-workspace/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"thinking-state": { ...define("Thinking State", {phase:select(THINKING_STATES,"thinking"),active:toggle(true),shape:select(["square","circle"],"square"),tone:select(["neutral","mint","purple","orange"],"mint"),speed:number(1,.5,2,.25),grid:toggle(true),shimmer:toggle(false)},v=><ThinkingState {...v}/>),source:"thinking-state" },
"thinking-timeline": { ...define("Thinking Timeline", {empty:toggle(false),current:number(2,0,5,1),status:select(["idle","running","paused","complete","error","stopped"],"running"),tone:select(["neutral","mint","purple","orange"],"mint"),shape:select(["square","circle"],"square")},v=><div className="w-full max-w-sm p-6"><ThinkingTimeline steps={v.empty?[]:THINKING_STEPS} current={v.current} status={v.status} tone={v.tone} shape={v.shape}/></div>),source:"thinking-state" }
};
const exports = {
"thinking-state": { ThinkingState, ThinkingTimeline }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "thinking-state"; spec.exports = exports; }
export default playgrounds;
