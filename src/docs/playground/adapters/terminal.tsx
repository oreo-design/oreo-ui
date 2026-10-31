/** Family-owned preview adapters and local export bindings. */
import { Terminal } from "@/components/terminal";
import { definePlayground as define, text, toggle, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
terminal: define("Terminal", { command: text("pnpm build"), running: toggle(), exitCode: number(0, 0, 255), children: { ...text("Build complete.", true), label: "Output" } }, v => <Terminal {...v}>{v.children}</Terminal>)
};
const exports = {
"terminal": { Terminal }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "terminal"; spec.exports = exports; }
export default playgrounds;
