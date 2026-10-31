/** Family-owned preview adapters and local export bindings. */
import { InlineSearchSelect } from "@/components/inline-search-select";
import { SAMPLE_ASSETS } from "@/patterns/position-studio/data";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"inline-search-select": define("Inline Search Select", { value: select(["eth","btc","bnb","sol","avax"],"eth"), disabled: toggle(), loading: toggle(), error: toggle() }, (v,set) => <div className="w-48"><InlineSearchSelect options={SAMPLE_ASSETS} label="Token" value={v.value} disabled={v.disabled} loading={v.loading} error={v.error?"The sample catalog is unavailable.":undefined} onRetry={()=>set("error",false)} onValueChange={value=>set("value",value as typeof v.value)} /></div>)
};
const exports = {
"inline-search-select": { InlineSearchSelect }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "inline-search-select"; spec.exports = exports; }
export default playgrounds;
