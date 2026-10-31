/** Family-owned preview adapters and local export bindings. */
import { QueryFilterBar, TraceTable, TRACE_FIELDS, type QueryCondition } from "@/components/trace-query";
import { SAMPLE_TRACES } from "@/patterns/trace-explorer/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"query-filter-bar": {...define("Query Filter Bar",{conditions:text("[]"),disabled:toggle()},(v,set)=><div className="w-full p-4"><QueryFilterBar fields={TRACE_FIELDS} value={(()=>{try{const data=JSON.parse(v.conditions);return Array.isArray(data)?data.filter(c=>c&&typeof c.id==="string"&&typeof c.field==="string"&&typeof c.value==="string"&&["eq","neq","contains","gte","lte"].includes(c.operator)) as QueryCondition[]:[];}catch{return [];}})()} onChange={value=>set("conditions",JSON.stringify(value))} disabled={v.disabled}/></div>),source:"trace-query"},
"trace-table": {...define("Trace Table",{state:select(["ready","loading","refreshing","empty","error"],"ready"),selected:text("")},(v,set)=><div className="w-full min-w-0 p-4"><TraceTable traces={v.state==="ready"||v.state==="refreshing"?SAMPLE_TRACES.slice(0,5):[]} loading={v.state==="loading"||v.state==="refreshing"} error={v.state==="error"?"The trace service could not be reached.":undefined} selectedId={v.selected} onSelect={trace=>set("selected",trace.id)} onRetry={()=>set("state","ready")} onClear={()=>set("state","ready")}/>{v.selected&&<p className="mt-4 text-sm" role="status">Selected: {v.selected} · <a className="underline" href="/trace-explorer">Open complete template</a></p>}</div>),source:"trace-query"}
};
const exports = {
"trace-query": { QueryFilterBar, TraceTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "trace-query"; spec.exports = exports; }
export default playgrounds;
