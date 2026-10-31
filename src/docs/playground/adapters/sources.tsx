/** Family-owned preview adapters and local export bindings. */
import { Sources, Source } from "@/components/sources";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
sources: define("Sources", { label: text("Sources"), open: toggle(true), title: { ...text("Build interfaces from components"), group: "Source" }, domain: { ...text("react.dev"), group: "Source" } }, (v, set) =>
    <Sources label={v.label} open={v.open} onOpenChange={open => set("open", open)}><Source title={v.title} domain={v.domain} href="https://react.dev/" /></Sources>)
};
const exports = {
"sources": { Sources, Source }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "sources"; spec.exports = exports; }
export default playgrounds;
