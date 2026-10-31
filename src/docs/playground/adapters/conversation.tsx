/** Family-owned preview adapters and local export bindings. */
import { Message, MessageContent } from "@/components/message";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/conversation";
import { definePlayground as define, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const promptText = "Help me design a thoughtful workspace.";
const playgrounds: Record<string, PlaygroundSpec> = {
conversation: define("Conversation", { autoScroll: toggle(true), count: { ...number(5, 2, 20), label: "Message count" } }, v =>
    <Conversation autoScroll={v.autoScroll} className="h-96 w-full"><ConversationContent>{Array.from({ length: v.count }, (_, i) => <Message key={i} role={i % 2 ? "assistant" : "user"}><MessageContent>{i % 2 ? "Let's start with the existing Oreo components." : `Step ${Math.floor(i / 2) + 1}: ${promptText}`}</MessageContent></Message>)}</ConversationContent><ConversationScrollButton /></Conversation>)
};
const exports = {
"message": { Message, MessageContent },
"conversation": { Conversation, ConversationContent, ConversationScrollButton }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "conversation"; spec.exports = exports; }
export default playgrounds;
