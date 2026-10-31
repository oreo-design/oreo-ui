/** Family-owned preview adapters and local export bindings. */
import { InlineQuickMenu } from "@/components/inline-quick-menu";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"inline-quick-menu": define("Inline Quick Menu", { value: select(["private", "public"], "private"), open: toggle(), label: text("Visibility"), disabled: toggle() }, (v, set) => <div className="flex min-h-80 w-full items-center justify-center rounded-card-medium border border-border-subtle bg-bg-base"><InlineQuickMenu {...v} onValueChange={value => { if (value === "private" || value === "public") set("value", value); }} onOpenChange={open => set("open", open)} /></div>)
};
const exports = {
"inline-quick-menu": { InlineQuickMenu }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "inline-quick-menu"; spec.exports = exports; }
export default playgrounds;
