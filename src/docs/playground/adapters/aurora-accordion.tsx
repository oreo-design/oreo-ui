/** Family-owned preview adapters and local export bindings. */
import { AuroraAccordion, AuroraSurface, AURORA_QUESTIONS } from "@/components/aurora-accordion";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"aurora-accordion": {...define("Aurora Accordion",{tone:select(["spectrum","mint","neutral"],"spectrum"),animated:toggle(true),disabled:toggle(false),empty:toggle(false),label:text("Frequently asked questions")},v=><div className="w-full p-8"><AuroraAccordion items={v.empty?[]:AURORA_QUESTIONS} tone={v.tone} animated={v.animated} disabled={v.disabled} label={v.label}/></div>),source:"aurora-accordion"},
"aurora-surface": {...define("Aurora Surface",{active:toggle(true),tone:select(["spectrum","mint","neutral"],"spectrum"),animated:toggle(true),title:text("A little atmosphere"),description:text("Soft color. Quiet detail.")},v=><div className="w-full p-8"><AuroraSurface active={v.active} tone={v.tone} animated={v.animated} className="mx-auto max-w-sm p-6"><h3 className="font-medium">{v.title}</h3><p className="mt-2 text-sm text-text-secondary">{v.description}</p></AuroraSurface></div>),source:"aurora-accordion"}
};
const exports = {
"aurora-accordion": { AuroraAccordion, AuroraSurface }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "aurora-accordion"; spec.exports = exports; }
export default playgrounds;
