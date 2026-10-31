/** Family-owned preview adapters and local export bindings. */
import { LoadingSequence } from "@/components/loading-sequence";
import { loadingSequencePlayground } from "../loading-sequence.preview";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"loading-sequence": loadingSequencePlayground
};
const exports = {
"loading-sequence": { LoadingSequence }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "loading-sequence"; spec.exports = exports; }
export default playgrounds;
