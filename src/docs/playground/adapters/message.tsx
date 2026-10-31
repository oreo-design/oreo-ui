/** Family-owned preview adapters and local export bindings. */
import { Avatar } from "@/components/avatar";
import { Message, MessageContent } from "@/components/message";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const promptText = "Help me design a thoughtful workspace.";
const playgrounds: Record<string, PlaygroundSpec> = {
message: define("Message", { role: select(["user", "assistant"], "user"), variant: select(["bubble", "flat"], "bubble"), children: { ...text(promptText, true), label: "Content" }, avatar: toggle() }, v =>
    <Message role={v.role} variant={v.variant} avatar={v.avatar ? <Avatar name="Alex Morgan" size="sm" /> : undefined}><MessageContent>{v.children}</MessageContent></Message>)
};
const exports = {
"avatar": { Avatar },
"message": { Message, MessageContent }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "message"; spec.exports = exports; }
export default playgrounds;
