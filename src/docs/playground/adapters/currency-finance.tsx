/** Family-owned preview adapters and local export bindings. */
import { CurrencyBalanceCard, CurrencyBalanceSummary, MoneyActivityList, CashFlowBars, cashFlowDays } from "@/components/currency-finance";
import { INITIAL_WALLET } from "@/patterns/cross-currency/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"currency-balance-card": {...define("Currency Balance Card",{selected:toggle(false),hidden:toggle(false)},(v,set)=><div className="w-64"><CurrencyBalanceCard account={INITIAL_WALLET.accounts[0]} selected={v.selected} hidden={v.hidden} onSelect={()=>set("selected",!v.selected)}/></div>),source:"currency-finance"},
"currency-balance-summary": {...define("Currency Balance Summary",{base:select(["USD","GBP","NGN","GHS","EUR"],"USD"),hidden:toggle(false)},(v,set)=><CurrencyBalanceSummary accounts={INITIAL_WALLET.accounts} base={v.base} hidden={v.hidden} onVisibilityChange={hidden=>set("hidden",hidden)}/>),source:"currency-finance"},
"money-activity-list": {...define("Money Activity List",{state:select(["ready","loading","empty","error"],"ready")},(v,set)=><div className="w-full max-w-2xl"><MoneyActivityList entries={v.state==="ready"?INITIAL_WALLET.entries.slice(0,4):[]} loading={v.state==="loading"} error={v.state==="error"?"The sample activity could not be loaded.":undefined} onRetry={()=>set("state","ready")} onReset={()=>set("state","ready")}/></div>),source:"currency-finance"},
"cash-flow-bars": {...define("Cash Flow Bars",{period:select(["all","week"],"week"),empty:toggle(false)},v=><div className="w-full max-w-3xl"><CashFlowBars days={v.empty?[]:cashFlowDays(INITIAL_WALLET.entries,v.period)}/></div>),source:"currency-finance"}
};
const exports = {
"currency-finance": { CurrencyBalanceCard, CurrencyBalanceSummary, MoneyActivityList, CashFlowBars }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "currency-finance"; spec.exports = exports; }
export default playgrounds;
