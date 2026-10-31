/** Family-owned preview adapters and local export bindings. */
import { AskAnalytics, InsightSources, type AnalyticsRequest } from "@/components/ask-analytics";
import { SUGGESTIONS, ANALYTICS_SOURCES, ANSWERS, answerFor } from "@/patterns/analytics-assistant/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"ask-analytics": { ...define("Ask Analytics", { question:text(""), status:select(["idle","loading","success","empty","error"],"idle"), emptySuggestions:toggle(false), source:text("") }, (v,set)=>{
    const question=v.question||SUGGESTIONS[0].question;
    const request:AnalyticsRequest=v.status==="idle"?{status:"idle"}:v.status==="success"?{status:"success",question,answer:answerFor(question)??ANSWERS.signups}:v.status==="error"?{status:"error",question,message:"The source is unavailable. Try again."}:{status:v.status,question};
    return <div className="w-full max-w-xl"><AskAnalytics value={v.question} onValueChange={q=>set("question",q)} suggestions={v.emptySuggestions?[]:SUGGESTIONS} request={request} onAsk={q=>{set("question",q);set("status",answerFor(q)?"success":"empty");}} onReset={()=>{set("status","idle");set("source","");}} onSourceSelect={id=>set("source",id)} defaultExpanded/>{v.source&&<p role="status" className="mt-4 text-sm text-text-secondary">{ANALYTICS_SOURCES.find(s=>s.id===v.source)?.description}</p>}</div>;
  }), source:"ask-analytics" },
"insight-sources": { ...define("Insight Sources", { empty:toggle(false), selected:text("") }, (v,set)=><div className="w-full max-w-xl"><InsightSources sources={v.empty?[]:ANALYTICS_SOURCES.slice(0,3)} onSelect={id=>set("selected",id)}/>{v.selected&&<p role="status" className="mt-4 text-sm text-text-secondary">{ANALYTICS_SOURCES.find(s=>s.id===v.selected)?.description}</p>}</div>),source:"ask-analytics" }
};
const exports = {
"ask-analytics": { AskAnalytics, InsightSources }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "ask-analytics"; spec.exports = exports; }
export default playgrounds;
