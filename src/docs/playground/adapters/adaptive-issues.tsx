/** Family-owned preview adapters and local export bindings. */
import { AdaptiveIssueTable, AdaptiveIssueRow, PullRequestPill, ResizeFrame } from "@/components/adaptive-issues";
import { ADAPTIVE_ISSUES } from "@/patterns/adaptive-issues/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"pull-request-pill": {...define("Pull Request Pill",{state:select(["open","draft","closed","merged"],"open"),number:number(1184,1,99999,1)},v=><PullRequestPill number={v.number} state={v.state}/>),source:"adaptive-issues"},
"adaptive-issue-row": {...define("Adaptive Issue Row",{width:number(840,320,1120,10),selected:toggle(false)},(v,set)=><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><div className="adapt-table"><ul className="adapt-rows"><AdaptiveIssueRow issue={ADAPTIVE_ISSUES[0]} selected={v.selected} onOpen={()=>set("selected",!v.selected)}/></ul></div></ResizeFrame>),source:"adaptive-issues"},
"adaptive-issue-table": {...define("Adaptive Issue Table",{width:number(1120,320,1120,10),scenario:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full p-4"><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><AdaptiveIssueTable issues={v.scenario==="empty"||v.scenario==="loading"?[]:ADAPTIVE_ISSUES} loading={v.scenario==="loading"} error={v.scenario==="error"?"Sample connection interrupted.":undefined} onRetry={()=>set("scenario","ready")}/></ResizeFrame></div>),source:"adaptive-issues"},
"resize-frame": {...define("Resize Frame",{width:number(640,320,1120,10)},(v,set)=><div className="w-full p-4"><ResizeFrame width={v.width} onWidthChange={w=>set("width",w)}><div className="rounded-xl border border-border-default p-8 text-sm">Drag the right edge, or focus it and use arrow keys. Requested width: {v.width}px.</div></ResizeFrame></div>),source:"adaptive-issues"}
};
const exports = {
"adaptive-issues": { AdaptiveIssueTable, AdaptiveIssueRow, PullRequestPill, ResizeFrame }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "adaptive-issues"; spec.exports = exports; }
export default playgrounds;
