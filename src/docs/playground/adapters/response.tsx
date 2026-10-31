/** Family-owned preview adapters and local export bindings. */
import { Response } from "@/components/response";
import { definePlayground as define, text } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
response: define("Response", { children: { ...text("### A thoughtful workspace\n\nStart with **familiar components**.\n\n- Clear hierarchy\n- Accessible controls\n- Room to focus", true), label: "Markdown" } }, v => <Response>{v.children}</Response>)
};
const exports = {
"response": { Response }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "response"; spec.exports = exports; }
export default playgrounds;
