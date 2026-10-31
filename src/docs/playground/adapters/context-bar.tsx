/** Family-owned preview adapters and local export bindings. */
import { ContextBar, ContextBarLabel } from "@/components/context-bar";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"context-bar": define("Context Bar", { children: { ...text("Reviewing your workspace"), label: "Label" }, status: select(["default", "progress", "loading", "waiting", "done", "queue"], "default"), muted: toggle(), position: select(["detached", "header", "footer"], "detached") }, v =>
    <ContextBar position={v.position}><ContextBarLabel status={v.status} muted={v.muted}>{v.children}</ContextBarLabel></ContextBar>)
};
const exports = {
"context-bar": { ContextBar, ContextBarLabel }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "context-bar"; spec.exports = exports; }
export default playgrounds;
