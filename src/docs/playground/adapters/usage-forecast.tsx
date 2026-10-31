/** Family-owned preview adapters and local export bindings. */
import { ForecastTimeline, UsageProjection, DailyUsagePace, forecastUsage } from "@/components/usage-forecast";
import { USAGE_ACCOUNTS, FORECAST_NOW } from "@/patterns/usage-forecast/data";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"forecast-timeline": {...define("Forecast Timeline",{selected:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro"),days:number(7,1,14,1),empty:toggle()},(v,set)=><div className="w-full p-6"><ForecastTimeline forecasts={v.empty?[]:USAGE_ACCOUNTS.map(a=>forecastUsage(a,FORECAST_NOW))} selectedId={v.selected} onSelect={id=>set("selected",id)} days={v.days}/></div>),source:"usage-forecast"},
"usage-projection": {...define("Usage Projection",{account:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro"),multiplier:number(1,0,2,.25),invalid:toggle()},v=><div className="w-full max-w-lg p-6"><UsageProjection forecast={forecastUsage({...USAGE_ACCOUNTS.find(a=>a.id===v.account)!,...(v.invalid?{observations:[]}:{} )},FORECAST_NOW,v.multiplier)}/></div>),source:"usage-forecast"},
"daily-usage-pace": {...define("Daily Usage Pace",{account:select(USAGE_ACCOUNTS.map(a=>a.id),"claude-pro")},v=><div className="w-full max-w-lg p-6"><DailyUsagePace forecast={forecastUsage(USAGE_ACCOUNTS.find(a=>a.id===v.account)!,FORECAST_NOW)}/></div>),source:"usage-forecast"}
};
const exports = {
"usage-forecast": { ForecastTimeline, UsageProjection, DailyUsagePace }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "usage-forecast"; spec.exports = exports; }
export default playgrounds;
