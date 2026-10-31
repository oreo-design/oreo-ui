/** Family-owned preview adapters and local export bindings. */
import { UpgradePrompt } from "@/components/upgrade-prompt";
import { definePlayground as define, text } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"upgrade-prompt": define("Upgrade Prompt", { prompt:text("Review Oreo UI PR #43 and the components used in my project. Preserve local customizations and propose only relevant changes. https://github.com/oreo-design/oreo-ui/pull/43") }, v=><div className="w-full max-w-lg"><UpgradePrompt {...v} /></div>)
};
const exports = {
"upgrade-prompt": { UpgradePrompt }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "upgrade-prompt"; spec.exports = exports; }
export default playgrounds;
