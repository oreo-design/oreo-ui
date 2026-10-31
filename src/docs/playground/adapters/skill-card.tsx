/** Family-owned preview adapters and local export bindings. */
import { SkillCard, SkillProviderBadge } from "@/components/skill-card";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"skill-card": define("Skill Card", {
    title: text("Pipeline review"), description: text("Reviews every open deal each Monday, flags the ones with no activity in 14 days and suggests your next move.", true),
    provider: text("Attio"), color, icon: select(["circle-dashed", "sparkle", "chart-line", "calendar"], "circle-dashed"), installed: toggle(), pending: toggle(), disabled: toggle(), error: text(""),
  }, (v, set) => <SkillCard title={v.title} description={v.description} provider={{ name: v.provider, color: v.color }} icon={v.icon} installed={v.installed} pending={v.pending} disabled={v.disabled} error={v.error} onInstalledChange={next => set("installed", next)} className="w-full max-w-md" />)
};
const exports = {
"skill-card": { SkillCard, SkillProviderBadge }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "skill-card"; spec.exports = exports; }
export default playgrounds;
