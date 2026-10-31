/** Family-owned preview adapters and local export bindings. */
import { CutReveal } from "@/components/cut-reveal";
import { definePlayground as define, text, number } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"cut-reveal": define("Cut Reveal", { duration: number(5200, 1000, 12000, 200), label: text("OREO®"), skipLabel: text("Skip intro") }, v => <CutReveal key={`${v.duration}-${v.label}-${v.skipLabel}`} duration={v.duration} skipLabel={v.skipLabel} wordmark={<div className="text-[clamp(48px,9vw,120px)] font-semibold leading-none tracking-tighter">{v.label}</div>} className="w-full max-w-3xl rounded-card-medium"><div className="flex min-h-96 flex-col items-center justify-center gap-4 bg-bg-surface p-6 text-center"><p className="text-xs uppercase tracking-widest text-text-secondary">Made to be yours</p><h2 className="text-4xl font-medium tracking-tight">Good things inside.</h2><a href="/neutomni-intro" className="text-sm underline underline-offset-4">Open Neutomni demo ↗</a></div></CutReveal>)
};
const exports = {
"cut-reveal": { CutReveal }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "cut-reveal"; spec.exports = exports; }
export default playgrounds;
