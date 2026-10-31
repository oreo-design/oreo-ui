/** Family-owned preview adapters and local export bindings. */
import { StreamingText } from "@/components/streaming-text";
import { definePlayground as define, text, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"streaming-text": define("Streaming Text", { children: { ...text("A little clarity makes room for great work.", true), label: "Text" }, variant: select(["plain", "fade", "gradient"], "fade") }, v => <StreamingText variant={v.variant}>{v.children}</StreamingText>)
};
const exports = {
"streaming-text": { StreamingText }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "streaming-text"; spec.exports = exports; }
export default playgrounds;
