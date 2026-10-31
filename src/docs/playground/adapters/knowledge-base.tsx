/** Family-owned preview adapters and local export bindings. */
import { FolderCard, FolderArtwork, FOLDER_TONES } from "@/components/knowledge-base";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"knowledge-components": { ...define("Folder Card", { tone: select(FOLDER_TONES, "violet"), title: text("Onboarding"), description: text("2 files · 2 subfolders"), updated: text("Updated 2h"), selected: toggle(true), disabled: toggle(), members: toggle(true) }, (v, set) => <FolderCard tone={v.tone} title={v.title} description={v.description} updated={v.updated || undefined} selected={v.selected} disabled={v.disabled} members={v.members ? [{ name: "Maya", color: "purple" }, { name: "Alex", color: "mint" }] : []} onClick={() => set("selected", !v.selected)} className="max-w-xs" />), source: "knowledge-base" }
};
const exports = {
"knowledge-base": { FolderCard, FolderArtwork }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "knowledge-base"; spec.exports = exports; }
export default playgrounds;
