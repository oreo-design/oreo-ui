/** Family-owned preview adapters and local export bindings. */
import { CodeBlock } from "@/components/code-block";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"code-block": define("Code Block", { code: text('const greeting = "Hello, Oreo";', true), language: select(["tsx", "javascript", "css", "json", "bash", "text"], "tsx"), title: text("example.tsx"), header: toggle(true), copyable: toggle(true), highlight: toggle(true), wrap: toggle() }, v => <CodeBlock {...v} />)
};
const exports = {
"code-block": { CodeBlock }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "code-block"; spec.exports = exports; }
export default playgrounds;
