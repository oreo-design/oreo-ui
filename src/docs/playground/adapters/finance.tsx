/** Family-owned preview adapters and local export bindings. */
import { BalanceChart, AllocationBar, SpendingGauge, PaymentCard } from "@/components/finance";
import { PERIODS, SAVINGS, SPENDING } from "@/patterns/finance-workspace/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"balance-chart": { ...define("Balance Chart", { period:select(["week","month"],"month"), empty:toggle(false) }, v=><div className="w-full max-w-3xl"><BalanceChart points={v.empty?[]:PERIODS[v.period].points}/></div>), source:"finance" },
"allocation-bar": { ...define("Allocation Bar", { count:number(4,0,4,1) }, v=><div className="w-full max-w-md"><AllocationBar items={SAVINGS.slice(0,v.count)}/></div>), source:"finance" },
"spending-gauge": { ...define("Spending Gauge", { limit:number(2000,0,5000,100), empty:toggle(false) }, v=><div className="w-full max-w-sm"><SpendingGauge items={v.empty?[]:SPENDING} limit={v.limit}/></div>), source:"finance" },
"payment-card": { ...define("Payment Card", { holder:text("ALEX MORGAN"), lastFour:text("1327"), label:text("Everyday card"), frozen:toggle(false) }, v=><div className="w-full max-w-sm"><PaymentCard {...v}/></div>), source:"finance" }
};
const exports = {
"finance": { BalanceChart, AllocationBar, SpendingGauge, PaymentCard }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "finance"; spec.exports = exports; }
export default playgrounds;
