/** Family-owned preview adapters and local export bindings. */
import { ProspectMetric, ScoreMeter, BuyingSignal, ProspectAction, SIGNAL_TYPES } from "@/components/prospecting";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"prospecting-components": { ...define("Prospecting", {
    preview: select(["metric", "score", "signal", "action"], "metric"),
    label: text("Prospects discovered"), value: text("1,284"), change: text("+18%"), description: text("vs. 1,088 prior 7 days"),
    trend: select(["up", "down"], "up"), score: number(92, 0, 100), signal: select(SIGNAL_TYPES, "funding"), signalText: text("Raised $40M Series B"), disabled: toggle(),
  }, v => v.preview === "score" ? <ScoreMeter value={v.score} /> : v.preview === "signal" ? <BuyingSignal type={v.signal}>{v.signalText}</BuyingSignal> : v.preview === "action" ? <ProspectAction disabled={v.disabled} /> : <ProspectMetric label={v.label} value={v.value} change={v.change} description={v.description} trend={v.trend} className="w-full max-w-md rounded-card-medium border border-border-subtle" />), source: "prospecting" }
};
const exports = {
"prospecting": { ProspectMetric, ScoreMeter, BuyingSignal, ProspectAction }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "prospecting"; spec.exports = exports; }
export default playgrounds;
