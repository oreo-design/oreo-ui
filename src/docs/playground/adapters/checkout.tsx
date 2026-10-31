/** Family-owned preview adapters and local export bindings. */
import { SavedPaymentMethods, DiscountCodeField, CheckoutSummary, quoteCheckout } from "@/components/checkout";
import { SAMPLE_METHODS } from "@/patterns/plan-upgrade/data";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"saved-payment-methods": {...define("Saved Payment Methods",{value:select(["visa","mastercard","wallet"],"visa"),state:select(["ready","loading","refreshing","empty","error"],"ready"),disabled:toggle()},(v,set)=><div className="w-full max-w-lg p-6"><SavedPaymentMethods methods={["ready","refreshing"].includes(v.state)?SAMPLE_METHODS:[]} value={v.value} onValueChange={id=>set("value",id as typeof v.value)} loading={["loading","refreshing"].includes(v.state)} disabled={v.disabled} error={v.state==="error"?"The sample service is unavailable.":undefined} onRetry={()=>set("state","ready")} onAdd={()=>set("state","ready")}/></div>),source:"checkout"},
"discount-code-field": {...define("Discount Code Field",{value:text("FRIENDS"),applied:text(""),error:text(""),disabled:toggle()},(v,set)=><div className="w-full max-w-md p-6"><DiscountCodeField value={v.value} applied={v.applied} error={v.error} disabled={v.disabled} onValueChange={code=>{set("value",code);set("applied","");set("error","");}} onApply={()=>{const ok=v.value.trim().toUpperCase()==="FRIENDS";set("applied",ok?"FRIENDS":"");set("error",ok?"":"Try FRIENDS for this demo.");}} onRemove={()=>{set("value","");set("applied","");set("error","");}}/></div>),source:"checkout"},
"checkout-summary": {...define("Checkout Summary",{seats:number(4,1,100,1),discount:toggle(true),taxBasis:select(["subtotal","discounted"],"subtotal")},v=><div className="w-full max-w-md p-6"><CheckoutSummary item={`${v.seats} × Pro licenses (annual)`} period="12 months · billed annually" quote={quoteCheckout(11520,Math.max(1,Math.min(100,Math.round(v.seats))),v.discount?2000:0,1000,v.taxBasis as "subtotal"|"discounted")}/></div>),source:"checkout"}
};
const exports = {
"checkout": { SavedPaymentMethods, DiscountCodeField, CheckoutSummary }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "checkout"; spec.exports = exports; }
export default playgrounds;
