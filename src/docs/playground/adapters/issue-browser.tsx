/** Family-owned preview adapters and local export bindings. */
import { IssueRow, IssueQueue, IssueReader } from "@/components/issue-browser";
import { SAMPLE_ISSUES } from "@/patterns/issue-browser/data";
import { Button } from "@/components/button";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"issue-row":{...define("Issue Row",{selected:toggle(true),state:select(["open","closed"],"open"),title:text(SAMPLE_ISSUES[0].title)},(v,set)=><div className="w-full max-w-2xl"><IssueRow issue={{...SAMPLE_ISSUES[0],title:v.title,state:v.state}} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>),source:"issue-browser"},
"issue-queue":{...define("Issue Queue",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),selected:number(8428,8400,8500,1)},(v,set)=><div className="w-full max-w-2xl h-96"><IssueQueue issues={v.state==="ready"||v.state==="refreshing"?SAMPLE_ISSUES.slice(0,5):[]} selectedId={v.selected} onSelect={id=>set("selected",id)} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The sample request failed. Try again to restore the list.":undefined} onRetry={()=>set("state","ready")} filtered={v.state==="filtered"} onClear={()=>set("state","ready")}/></div>),source:"issue-browser"},
"issue-reader":{...define("Issue Reader",{draft:text(""),open:toggle(true),posted:text("")},(v,set)=>v.open?<div className="w-full max-w-md h-[38rem]"><IssueReader issue={{...SAMPLE_ISSUES[0],comments:[...SAMPLE_ISSUES[0].comments,...(v.posted?[{id:"local",author:"You",body:v.posted,date:"Just now"}]:[])]}} draft={v.draft} onDraftChange={draft=>set("draft",draft)} onComment={()=>{set("posted",v.draft.trim());set("draft","");}} onClose={()=>set("open",false)}/></div>:<Button onClick={()=>set("open",true)} tapScale={1}>Open issue reader</Button>),source:"issue-browser"}
};
const exports = {
"issue-browser": { IssueRow, IssueQueue, IssueReader },
"button": { Button }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "issue-browser"; spec.exports = exports; }
export default playgrounds;
