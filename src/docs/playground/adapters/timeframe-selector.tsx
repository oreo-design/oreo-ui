/** Family-owned preview adapters and local export bindings. */
import { TimeframeSelector } from "@/components/timeframe-selector";
import { definePlayground as define, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"timeframe-selector": define("Timeframe Selector", { value: select(["1h","4h","24h","3d","1w"],"24h"), disabled: toggle() }, (v,set) => <TimeframeSelector {...v} onValueChange={value=>set("value",value as typeof v.value)} />)
};
const exports = {
"timeframe-selector": { TimeframeSelector }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "timeframe-selector"; spec.exports = exports; }
export default playgrounds;
