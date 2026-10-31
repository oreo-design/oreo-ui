/** Family-owned preview adapters and local export bindings. */
import { CompanyIdentity, CompanyTable, companyRows, type CompanySort } from "@/components/company";
import { COMPANIES } from "@/patterns/company-directory/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"company-identity": {...define("Company Identity",{name:text("Northstar Labs"),domain:text("northstar.example"),hot:toggle(true)},v=><div className="p-6"><CompanyIdentity name={v.name} domain={v.domain} hot={v.hot}/></div>),source:"company"},
"company-table": {...define("Company Table",{count:number(6,1,23,1),state:select(["ready","loading","empty","error"],"ready"),sort:select(["name","arrCents","employees","lastContact"],"name"),direction:select(["asc","desc"],"asc")},(v,set)=><div className="w-full p-6"><CompanyTable companies={v.state==="ready"?companyRows(COMPANIES.slice(0,Math.floor(v.count)),{sort:{key:v.sort as CompanySort["key"],direction:v.direction as "asc"|"desc"}}):[]} sort={{key:v.sort as CompanySort["key"],direction:v.direction as "asc"|"desc"}} onSort={s=>{set("sort",s.key);set("direction",s.direction);}} loading={v.state==="loading"} error={v.state==="error"?"Sample company data is unavailable.":undefined} onReset={()=>set("state","ready")}/></div>),source:"company"}
};
const exports = {
"company": { CompanyIdentity, CompanyTable }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "company"; spec.exports = exports; }
export default playgrounds;
