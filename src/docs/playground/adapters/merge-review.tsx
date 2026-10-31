/** Family-owned preview adapters and local export bindings. */
import { BranchHistory, MergeStatusBadge, MergeChecks, ChangeSummary, PullRequestCard, initialMergeRun } from "@/components/merge-review";
import { COMMITS as MERGE_COMMITS, MERGE_TITLE, SAMPLE_DIFF as MERGE_DIFF, commitsFor, checksFor } from "@/patterns/merge-workspace/data";
import { CodeDiff } from "@/components/code-diff";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"branch-history": {...define("Branch History", {empty:toggle(false),merged:toggle(false),selected:text("")}, (v,set)=><div className="w-full max-w-3xl p-4"><BranchHistory commits={v.empty?[]:MERGE_COMMITS} merged={v.merged} selectedId={v.selected} onSelect={commit=>set("selected",commit.id)}/></div>),source:"merge-review"},
"merge-status-badge": {...define("Merge Status Badge", {phase:select(["creating","conflicts","resolving","checking","ready","merging","merged","error"],"conflicts"),number:number(128,1,9999),conflicts:number(3,0,99)},v=><MergeStatusBadge phase={v.phase} number={v.number} conflicts={v.conflicts}/>),source:"merge-review"},
"merge-checks": {...define("Merge Checks", {phase:select(["checking","ready","error"],"ready")},v=><MergeChecks checks={checksFor({...initialMergeRun,phase:v.phase,checksPassed:v.phase==="ready"?4:1,resolved:3})}/>),source:"merge-review"},
"change-summary": {...define("Change Summary", {additions:number(48,0,999),deletions:number(7,0,999),disclosure:toggle(true)},v=><div className="w-full max-w-2xl p-4"><ChangeSummary additions={v.additions} deletions={v.deletions}>{v.disclosure?<CodeDiff title="middleware.ts · sample excerpt" lines={MERGE_DIFF}/>:undefined}</ChangeSummary></div>),source:"merge-review"},
"pull-request-card": {...define("Pull Request Card", {title:text(MERGE_TITLE),phase:select(["conflicts","creating","resolving","checking","ready","merging","merged","error"],"conflicts")},(v,set)=>{const run={...initialMergeRun,phase:v.phase,resolved:["checking","ready","merging","merged","error"].includes(v.phase)?3:0,checksPassed:["ready","merging","merged"].includes(v.phase)?4:v.phase==="error"?1:0};return <div className="w-full max-w-3xl p-4"><PullRequestCard title={v.title} number={128} phase={v.phase} commits={commitsFor(run)} checks={checksFor(run)} resolved={run.resolved} onResolve={()=>set("phase","ready")} onMerge={()=>set("phase","merged")} onRetry={()=>set("phase","ready")} onCancel={()=>set("phase","conflicts")}/></div>;}),source:"merge-review"}
};
const exports = {
"merge-review": { BranchHistory, MergeStatusBadge, MergeChecks, ChangeSummary, PullRequestCard },
"code-diff": { CodeDiff }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "merge-review"; spec.exports = exports; }
export default playgrounds;
