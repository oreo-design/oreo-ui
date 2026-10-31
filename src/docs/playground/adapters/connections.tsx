/** Family-owned preview adapters and local export bindings. */
import { ConnectionGroup, ConnectionRow, ConnectionSetup, ProjectIdentity } from "@/components/connections";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"connection-components": define("Connections", { direction: select(["readers", "sources"], "readers"), open: toggle(true), project: text("vercel-site"), connectedProject: text("browser-api") }, (v, set) => {
    const project = { id: "prj_demo_source", name: v.project };
    const target = { id: "prj_demo_target", name: v.connectedProject, mark: "flame" as const, tone: "orange" as const };
    return <div className="w-full max-w-2xl"><ConnectionGroup project={project} direction={v.direction}><ConnectionRow project={target} open={v.open} onOpenChange={open => set("open", open)}><ConnectionSetup source={v.direction === "readers" ? project : target} target={v.direction === "readers" ? target : project} /></ConnectionRow></ConnectionGroup></div>;
  })
};
const exports = {
"connections": { ConnectionGroup, ConnectionRow, ConnectionSetup, ProjectIdentity }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "connections"; spec.exports = exports; }
export default playgrounds;
