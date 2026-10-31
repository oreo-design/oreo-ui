/** Family-owned preview adapters and local export bindings. */
import { ActivityCard, BudgetMeter } from "@/components/activity";
import { definePlayground as define, text, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"activity-components": { source: "activity", ...define("Activity", { title: text("Billing"), description: text("Invoiced monthly"), used: number(6516.17, 0, 20000, .01), limit: number(10000, 0, 20000, 100), label: text("Workspace limit") }, v => <ActivityCard title={v.title} description={v.description} className="w-full max-w-sm"><BudgetMeter used={v.used} limit={v.limit} label={v.label} /></ActivityCard>) }
};
const exports = {
"activity": { ActivityCard, BudgetMeter }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "activity"; spec.exports = exports; }
export default playgrounds;
