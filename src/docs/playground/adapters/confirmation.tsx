/** Family-owned preview adapters and local export bindings. */
import { Confirmation } from "@/components/confirmation";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
confirmation: define("Confirmation", { title: text("Apply these changes?"), description: text("Update the selected component in this local preview.", true), state: select(["pending", "approved", "denied"], "pending"), danger: toggle(), approveLabel: text("Approve"), denyLabel: text("Deny") }, (v, set) =>
    <Confirmation {...v} onApprove={() => set("state", "approved")} onDeny={() => set("state", "denied")} />)
};
const exports = {
"confirmation": { Confirmation }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "confirmation"; spec.exports = exports; }
export default playgrounds;
