/** Family-owned preview adapters and local export bindings. */
import { CodeDiff } from "@/components/code-diff";
import { definePlayground as define, text } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"code-diff": define("Code Diff", { title: text("button.tsx"), before: { ...text('<Button>Submit</Button>', true), label: "Removed line" }, after: { ...text('<Button type="primary">Continue</Button>', true), label: "Added line" } }, v =>
    <CodeDiff title={v.title} lines={[...v.before.split("\n").map(content => ({ type: "remove" as const, content })), ...v.after.split("\n").map(content => ({ type: "add" as const, content }))]} />)
};
const exports = {
"code-diff": { CodeDiff }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "code-diff"; spec.exports = exports; }
export default playgrounds;
