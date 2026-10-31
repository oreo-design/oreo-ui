/** Family-owned preview adapters and local export bindings. */
import { TestResults, TestRunSummary, TestResultFilters, TestFileGroup, TestFailureDetail, TestStackTrace } from "@/components/test-results";
import { SAMPLE_TESTS as RESULT_TESTS, COMPLETED_RUN as RESULT_RUN } from "@/patterns/test-workspace/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"test-results": {...define("Test Results",{scenario:select(["failed","passed","empty","error"],"failed")},v=><div className="w-full max-w-3xl p-4"><TestResults key={v.scenario} run={{...RESULT_RUN,phase:v.scenario==="error"?"error":"complete",error:"Sample runner disconnected.",tests:v.scenario==="empty"?[]:v.scenario==="passed"?RESULT_TESTS.map(t=>t.status==="failed"?{...t,status:"passed",failure:undefined}:t):RESULT_TESTS}}/></div>),source:"test-results"},
"test-run-summary": {...define("Test Run Summary",{running:toggle(true)},v=><div className="w-full max-w-2xl p-4"><TestRunSummary run={{...RESULT_RUN,phase:v.running?"running":"complete",tests:v.running?RESULT_TESTS.map((t,i)=>i<8?t:{...t,status:i===8?"running":"queued",durationMs:undefined,failure:undefined}):RESULT_TESTS}}/></div>),source:"test-results"},
"test-result-filters": {...define("Test Result Filters",{filter:select(["all","failed","skipped","slow"],"all")},(v,set)=><TestResultFilters tests={RESULT_TESTS} value={v.filter} onChange={next=>set("filter",next)}/>),source:"test-results"},
"test-file-group": {...define("Test File Group",{open:toggle(true),filter:select(["all","failed","skipped","slow"],"all")},(v,set)=><div className="w-full max-w-3xl p-4"><TestFileGroup file={RESULT_TESTS[0].file} tests={RESULT_TESTS.slice(0,4)} filter={v.filter} open={v.open} onOpenChange={next=>set("open",next)}/></div>),source:"test-results"},
"test-failure-detail": {...define("Test Failure Detail",{kind:select(["assertion","timeout"],"assertion")},v=><div className="w-full max-w-2xl p-4"><TestFailureDetail test={RESULT_TESTS.find(t=>t.failure?.kind===v.kind)!}/></div>),source:"test-results"},
"test-stack-trace": {...define("Test Stack Trace",{framework:toggle(true)},v=><div className="w-full max-w-2xl p-4"><TestStackTrace frames={RESULT_TESTS[1].failure!.frames.filter(f=>v.framework||!f.framework)}/></div>),source:"test-results"}
};
const exports = {
"test-results": { TestResults, TestRunSummary, TestResultFilters, TestFileGroup, TestFailureDetail, TestStackTrace }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "test-results"; spec.exports = exports; }
export default playgrounds;
