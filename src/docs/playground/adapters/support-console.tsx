/** Family-owned preview adapters and local export bindings. */
import { SpendLimitChart, SecretField, ApiKeyTable } from "@/components/support-console";
import { SPEND_DAYS, SAMPLE_KEYS } from "@/patterns/support-console/data";
import { definePlayground as define, text, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"spend-limit-chart": {...define("Spend Limit Chart",{limit:number(70,0,150,5),empty:toggle()},v=><div className="w-full p-4"><SpendLimitChart days={v.empty?[]:SPEND_DAYS} dailyLimitCents={v.limit*100}/></div>),source:"support-console"},
"secret-field": {...define("Secret Field",{value:text("demo_only_0123456789abcdef"),failCopy:toggle()},v=><div className="w-full max-w-lg p-6"><SecretField value={v.value} onCopy={v.failCopy?async()=>{throw new Error("Demo clipboard failure")}:undefined}/></div>),source:"support-console"},
"api-key-table": {...define("API Key Table",{empty:toggle()},v=><div className="w-full p-4"><ApiKeyTable keys={v.empty?[]:SAMPLE_KEYS}/></div>),source:"support-console"}
};
const exports = {
"support-console": { SpendLimitChart, SecretField, ApiKeyTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "support-console"; spec.exports = exports; }
export default playgrounds;
