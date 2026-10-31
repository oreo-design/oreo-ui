/** Family-owned preview adapters and local export bindings. */
import { Avatar } from "@/components/avatar";
import { GradientMask } from "@/components/gradient-mask";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"gradient-mask": define("Gradient Mask", { direction: select(["top", "right", "bottom", "left"], "bottom"), easing: select(["linear", "ease-in", "ease-out", "ease-in-out"], "ease-in-out"), start: { ...number(0, 0, 100), maxFrom: "end" }, end: { ...number(100, 0, 100), minFrom: "start" }, strength: number(1, 0, 1, .05) }, v =>
    <GradientMask {...v} end={Math.max(v.start, v.end)}><div className="grid grid-cols-3 gap-3 p-4">{PALETTE.filter(c => c !== "default").map(c => <div key={c} className="grid h-24 place-items-center rounded-xl bg-[var(--color-bg-base)]"><Avatar name="Oreo" color={c} size="lg" /></div>)}</div></GradientMask>)
};
const exports = {
"avatar": { Avatar },
"gradient-mask": { GradientMask }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "gradient-mask"; spec.exports = exports; }
export default playgrounds;
