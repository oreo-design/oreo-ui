/** Family-owned preview adapters and local export bindings. */
import { ClientSummary, ClientContactStrip, ClientFinanceSummary } from "@/components/client";
import { CLIENT, CLIENT_INVOICES, CLIENT_DATE } from "@/patterns/client-workspace/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"client-summary": {...define("Client Summary",{name:text("Acme Corporation"),active:toggle(true)},v=><div className="w-full p-4"><ClientSummary client={{...CLIENT,...v}} projectCount={6} activeProjects={3} revenueCents={7970000}/></div>),source:"client"},
"client-contact-strip": {...define("Client Contact Strip",{location:text(CLIENT.location),email:text(CLIENT.email)},v=><div className="w-full p-4"><ClientContactStrip client={{...CLIENT,...v}}/></div>),source:"client"},
"client-finance-summary": {...define("Client Finance Summary",{empty:toggle(false),currency:select(["USD","EUR"],"USD")},v=><div className="w-full p-4"><ClientFinanceSummary invoices={v.empty?[]:CLIENT_INVOICES} asOf={CLIENT_DATE} currency={v.currency}/></div>),source:"client"}
};
const exports = {
"client": { ClientSummary, ClientContactStrip, ClientFinanceSummary }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "client"; spec.exports = exports; }
export default playgrounds;
