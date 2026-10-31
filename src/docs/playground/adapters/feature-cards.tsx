/** Family-owned preview adapters and local export bindings. */
import { InvoicePreview, UsageSummary } from "@/components/feature-cards";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"feature-cards": define("Feature Cards", {
    variant: select(["invoice", "usage"], "invoice"), fade: toggle(),
    number: text("INV-456789"), amount: text("$284,342.57"), due: text("Due in 15 days"),
    recipient: text(""), sender: text(""), address: text(""),
    title: text("Spending Limit"), description: text("New users by First user primary channel group"),
    running: number(20, 0, 100), swimming: number(20, 0, 100),
  }, v => <div className="w-full max-w-md">{v.variant === "invoice" ? <InvoicePreview number={v.number} amount={v.amount} due={v.due} recipient={v.recipient || undefined} sender={v.sender || undefined} address={v.address || undefined} fade={v.fade} /> : <UsageSummary title={v.title} description={v.description} fade={v.fade} segments={[{ label: "Running", value: v.running, tone: "purple", detail: "average of 12 minutes" }, { label: "Swimming", value: v.swimming, tone: "blue" }]} />}</div>)
};
const exports = {
"feature-cards": { InvoicePreview, UsageSummary }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "feature-cards"; spec.exports = exports; }
export default playgrounds;
