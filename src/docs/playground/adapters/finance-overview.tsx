/** Family-owned preview adapters and local export bindings. */
import { SkeletonReveal, BalanceSparkBars, FinanceAttentionList, BankAccountList } from "@/components/finance-overview";
import { SAMPLE_ACCOUNTS as FINANCE_ACCOUNTS, SAMPLE_NOTICES as FINANCE_NOTICES } from "@/patterns/finance-overview/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"skeleton-reveal":{...define("Skeleton Reveal",{loading:toggle(true),hasData:toggle(false),animate:toggle(true)},v=><div className="w-full p-6"><SkeletonReveal {...v} skeleton={<div className="h-24 rounded-card-small bg-state-hover"/>}><div className="flex h-24 items-center rounded-card-small border border-border-default p-5 text-sm">Your data is ready.</div></SkeletonReveal></div>),source:"finance-overview"},
"balance-spark-bars":{...define("Balance Spark Bars",{state:select(["ready","zero","empty","invalid"],"ready")},v=><BalanceSparkBars values={v.state==="ready"?FINANCE_ACCOUNTS[0].history:v.state==="zero"?[0,0,0,0]:v.state==="invalid"?[-1,2]:[]} label="Sample balance in cents"/>),source:"finance-overview"},
"finance-attention-list":{...define("Finance Attention List",{state:select(["ready","loading","refreshing","empty","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><FinanceAttentionList items={v.state==="ready"||v.state==="refreshing"?FINANCE_NOTICES:[]} loading={v.state==="loading"||v.state==="refreshing"} hasData={v.state==="ready"||v.state==="refreshing"} error={v.state==="error"?"The sample feed could not be loaded.":undefined} onRetry={()=>set("state","ready")} onOpen={item=>set("opened",item.title)}/>{v.opened&&<p role="status" className="mt-3 text-sm">Selected: {v.opened}. Open the template for full details.</p>}</div>),source:"finance-overview"},
"bank-account-list":{...define("Bank Account List",{state:select(["ready","loading","refreshing","empty","filtered","error"],"ready"),opened:text("")},(v,set)=><div className="w-full p-4"><BankAccountList accounts={v.state==="ready"||v.state==="refreshing"?FINANCE_ACCOUNTS:[]} loading={v.state==="loading"||v.state==="refreshing"} hasData={v.state==="ready"||v.state==="refreshing"} error={v.state==="error"?"The sample accounts could not be loaded.":undefined} onRetry={()=>set("state","ready")} onOpen={a=>set("opened",a.name)} onConnect={()=>set("opened","Connect requested. Open the template to add a sample account.")} filtered={v.state==="filtered"} onClear={()=>set("state","ready")}/>{v.opened&&<p role="status" className="mt-3 text-sm">{v.opened}</p>}</div>),source:"finance-overview"}
};
const exports = {
"finance-overview": { SkeletonReveal, BalanceSparkBars, FinanceAttentionList, BankAccountList }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "finance-overview"; spec.exports = exports; }
export default playgrounds;
