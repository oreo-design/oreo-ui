/** Family-owned preview adapters and local export bindings. */
import { RoutingPolicyControl, RoutingFlow, RouteMetrics } from "@/components/model-routing";
import { routesFor } from "@/patterns/model-router/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"routing-policy": { ...define("Routing Policy", {value:select(["cost","balanced","quality"],"balanced"),disabled:toggle(false)},(v,set)=><RoutingPolicyControl {...v} onChange={value=>set("value",value)}/>),source:"model-routing" },
"routing-flow": { ...define("Routing Flow", {policy:select(["cost","balanced","quality"],"balanced"),active:toggle(true),empty:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-xl rounded-2xl bg-bg-elevated p-5"><RoutingFlow routes={v.empty?[]:routesFor(v.policy,333)} active={v.active} selected={v.selected} onSelect={id=>set("selected",v.selected===id?"":id)}/></div>),source:"model-routing" },
"route-metrics": { ...define("Route Metrics", {policy:select(["cost","balanced","quality"],"balanced"),empty:toggle(false),selected:text("")},(v,set)=><div className="w-full max-w-2xl rounded-2xl bg-bg-elevated p-5"><RouteMetrics routes={v.empty?[]:routesFor(v.policy,333)} selected={v.selected} onSelect={id=>set("selected",v.selected===id?"":id)}/></div>),source:"model-routing" }
};
const exports = {
"model-routing": { RoutingPolicyControl, RoutingFlow, RouteMetrics }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "model-routing"; spec.exports = exports; }
export default playgrounds;
