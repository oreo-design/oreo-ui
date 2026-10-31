/** Family-owned preview adapters and local export bindings. */
import { RecipientSearch, PaymentRailPicker, RecipientForm, recipientName } from "@/components/recipient";
import { SAMPLE_RECIPIENTS } from "@/patterns/payment-workspace/data";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"recipient-search": {...define("Recipient Search",{query:text(""),selected:text(""),creation:toggle(true),notice:text("")},(v,set)=><div className="w-full max-w-xl p-6"><RecipientSearch recipients={SAMPLE_RECIPIENTS} query={v.query} onQueryChange={q=>set("query",q)} selectedId={v.selected} onSelect={r=>set("selected",r.id)} onCreate={v.creation?name=>set("notice",`Create requested for ${name||"a new recipient"}. Open the full template to fill the form.`):undefined}/><p role="status" className="mt-4 text-xs text-text-secondary">{v.notice}</p></div>),source:"recipient"},
"payment-rail-picker": {...define("Payment Rail Picker",{value:select(["ach","swift","sepa","usdc"],"ach"),disabled:toggle(false)},(v,set)=><div className="w-full max-w-2xl p-6"><PaymentRailPicker value={v.value} disabled={v.disabled} onValueChange={r=>set("value",r)}/></div>),source:"recipient"},
"recipient-form": {...define("Recipient Form",{sample:toggle(true),notice:text("")},(v,set)=><div className="w-full max-w-3xl p-6"><RecipientForm key={String(v.sample)} initialValue={v.sample?SAMPLE_RECIPIENTS[0]:undefined} onSave={r=>set("notice",`Validated ${recipientName(r)}. The host now owns this draft.`)} onCancel={()=>set("notice","Cancel callback received. The playground keeps the form visible.")}/><p role="status" className="mt-4 text-xs text-text-secondary">{v.notice}</p></div>),source:"recipient"}
};
const exports = {
"recipient": { RecipientSearch, PaymentRailPicker, RecipientForm }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "recipient"; spec.exports = exports; }
export default playgrounds;
