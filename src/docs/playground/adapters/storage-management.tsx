/** Family-owned preview adapters and local export bindings. */
import { StorageUsageCard, StorageModuleTable, RetentionPolicyRow } from "@/components/storage-management";
import { initialStorage } from "@/patterns/storage-manager/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"storage-usage-card":{...define("Storage Usage Card",{capacity:number(20,1,100,1),recycled:number(0,0,10,.1)},v=><div className="w-full p-6"><StorageUsageCard modules={initialStorage.modules} capacity={v.capacity*1e9} recycledBytes={Math.round(v.recycled*1e9)}/></div>),source:"storage-management"},
"storage-module-table":{...define("Storage Module Table",{empty:toggle(false),selected:text("")},(v,set)=><div className="w-full p-6"><StorageModuleTable modules={v.empty?[]:initialStorage.modules} totalUsed={18800000000} selected={v.selected?v.selected.split(","):[]} onSelectionChange={ids=>set("selected",ids.join(","))}/></div>),source:"storage-management"},
"retention-policy-row":{...define("Retention Policy Row",{days:select(["7","30","90","180","365","0"],"30"),disabled:toggle(false)},(v,set)=><div className="w-full p-6"><RetentionPolicyRow title="Recycle bin retention" description="Keep deleted records recoverable." icon="trash" value={Number(v.days)} onChange={days=>set("days",String(days) as typeof v.days)} disabled={v.disabled}/></div>),source:"storage-management"}
};
const exports = {
"storage-management": { StorageUsageCard, StorageModuleTable, RetentionPolicyRow }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "storage-management"; spec.exports = exports; }
export default playgrounds;
