/** Family-owned preview adapters and local export bindings. */
import { ReleaseEntry } from "@/components/release-entry";
import { definePlayground as define, text, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"release-entry": define("Release Entry", { title:text("Brand Guide"), description:text("A practical toolkit for colours, typography and signatures."), kind:select(["Added","Updated","Fixed","Breaking"],"Added") }, v=><div className="w-full max-w-lg"><ReleaseEntry {...v} href="/brand-guide" sourceHref="https://github.com/oreo-design/oreo-ui/pull/43" sourceLabel="PR #43" /></div>)
};
const exports = {
"release-entry": { ReleaseEntry }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "release-entry"; spec.exports = exports; }
export default playgrounds;
