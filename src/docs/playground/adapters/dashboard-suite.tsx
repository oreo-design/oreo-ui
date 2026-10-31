/** Family-owned preview adapters and local export bindings. */
import { DashboardStatCard, ComparisonBarChart, TrendAreaChart, ChannelBreakdown } from "@/components/dashboard-suite";
import { DEMO_POINTS } from "@/patterns/dashboard-suite/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"dashboard-stat-card":{...define("Dashboard Stat Card",{variant:select(["footer","header","plain"],"header"),label:text("Total revenue"),value:text("$42,800"),change:number(12.4,-100,100,.1)},v=><div className="w-80"><DashboardStatCard {...v}/></div>),source:"dashboard-suite"},
"comparison-bar-chart":{...define("Comparison Bar Chart",{mode:select(["stacked","grouped"],"stacked"),state:select(["ready","zero","empty","invalid"],"ready")},v=><div className="w-full p-6"><ComparisonBarChart mode={v.mode} series={["New","Returning"]} points={v.state==="empty"?[]:v.state==="invalid"?[{label:"Invalid",values:[-1,2]}]:v.state==="zero"?[{label:"Oct 16",values:[0,0]}]:DEMO_POINTS}/></div>),source:"dashboard-suite"},
"trend-area-chart":{...define("Trend Area Chart",{state:select(["ready","single","zero","empty","invalid"],"ready")},v=><div className="w-full p-6"><TrendAreaChart points={v.state==="empty"?[]:v.state==="invalid"?[{label:"Invalid",values:[-1]}]:v.state==="zero"?[{label:"Oct 16",values:[0]}]:v.state==="single"?[{label:"Oct 16",values:[120]}]:DEMO_POINTS.map(p=>({...p,values:[p.values[0]+p.values[1]]}))}/></div>),source:"dashboard-suite"},
"channel-breakdown":{...define("Channel Breakdown",{selected:text(""),empty:toggle(false)},(v,set)=><div className="w-80 p-4"><ChannelBreakdown channels={v.empty?[]:[{id:"organic",label:"Organic search",value:4200},{id:"direct",label:"Direct",value:2900},{id:"social",label:"Social",value:1600}]} selected={v.selected} onSelect={id=>set("selected",id)}/></div>),source:"dashboard-suite"}
};
const exports = {
"dashboard-suite": { DashboardStatCard, ComparisonBarChart, TrendAreaChart, ChannelBreakdown }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "dashboard-suite"; spec.exports = exports; }
export default playgrounds;
