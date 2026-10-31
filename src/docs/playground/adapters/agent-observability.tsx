/** Family-owned preview adapters and local export bindings. */
import { PixelMeter, InferenceChart, RegionalTraffic, AgentHealthTable } from "@/components/agent-observability";
import { AGENTS as OBSERVATORY_AGENTS, trafficRegions, inferenceSeries } from "@/patterns/agent-observatory/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"pixel-meter": {...define("Pixel Meter",{value:number(92.6,0,150,.1),max:number(100,1,200,1),label:text("Success rate"),tone:select(["success","warning","neutral"],"success"),unknown:toggle(false)},v=><PixelMeter value={v.unknown?-1:v.value} max={v.max} label={v.label} tone={v.tone}/>),source:"agent-observability"},
"inference-chart": {...define("Inference Chart",{state:select(["ready","loading","empty","error","zero"],"ready")},(v,set)=><div className="w-full max-w-2xl p-6"><InferenceChart points={v.state==="ready"?inferenceSeries(118629,"Last 30 days"):v.state==="zero"?inferenceSeries(0,"Last 30 days"):[]} loading={v.state==="loading"} error={v.state==="error"?"Sample telemetry could not be loaded.":undefined} onRetry={()=>set("state","ready")}/></div>),source:"agent-observability"},
"regional-traffic": {...define("Regional Traffic",{region:select(["all","us-east","eu-central","ap-south"],"all"),state:select(["ready","empty","invalid"],"ready")},(v,set)=><div className="w-full max-w-xl p-6"><RegionalTraffic regions={v.state==="empty"?[]:trafficRegions(OBSERVATORY_AGENTS).map(r=>({...r,requests:v.state==="invalid"?-1:r.requests}))} value={v.region} onValueChange={id=>set("region",id as "all")}/></div>),source:"agent-observability"},
"agent-health-table": {...define("Agent Health Table",{state:select(["ready","loading","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><AgentHealthTable agents={v.state==="ready"?OBSERVATORY_AGENTS:[]} loading={v.state==="loading"} filtered={v.state==="filtered"} error={v.state==="error"?"Sample agent health could not be loaded.":undefined} onReset={()=>set("state","ready")} onOpen={a=>set("opened",a.name)}/>{v.opened&&<p className="mt-4 text-sm" role="status">Selected {v.opened}. Open the template for full details.</p>}</div>),source:"agent-observability"}
};
const exports = {
"agent-observability": { PixelMeter, InferenceChart, RegionalTraffic, AgentHealthTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "agent-observability"; spec.exports = exports; }
export default playgrounds;
