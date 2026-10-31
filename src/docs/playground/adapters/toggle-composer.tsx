/** Family-owned preview adapters and local export bindings. */
import { ToggleComposer, ComposerModeSwitch, ComposerFormattingToolbar, EMPTY_COMPOSER, type ComposerMode } from "@/components/toggle-composer";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"toggle-composer": define("Toggle Composer", { mode: select(["quick", "long"], "quick"), surface: select(["solid", "frosted"], "solid"), quick: text("A thought worth sharing."), headline: text("A longer story"), intro: text("Start with a little context."), body: text("Make room for the details."), disabled: toggle() }, (v,set) => <div className="w-full max-w-lg"><ToggleComposer mode={v.mode as ComposerMode} onModeChange={mode=>set("mode",mode)} surface={v.surface} disabled={v.disabled} value={{...EMPTY_COMPOSER,quick:v.quick,headline:v.headline,intro:v.intro,body:v.body}} onValueChange={value=>{for (const key of Object.keys(EMPTY_COMPOSER) as (keyof typeof EMPTY_COMPOSER)[]) set(key,value[key]);}} /></div>)
};
const exports = {
"toggle-composer": { ToggleComposer, ComposerModeSwitch, ComposerFormattingToolbar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "toggle-composer"; spec.exports = exports; }
export default playgrounds;
