/** Family-owned preview adapters and local export bindings. */
import { OutlineWordmark, PathGlyph, FooterLinkGroups, OREO_WORDMARK, STUDIO_WORDMARK, FOOTER_LINK_GROUPS } from "@/components/outline-wordmark";
import { definePlayground as define, text, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"outline-wordmark": {...define("Outline Wordmark",{artwork:select(["oreo","studio"],"oreo"),accent:select(["amber","mint","neutral"],"amber"),nodes:toggle(true),animated:toggle(true),release:number(700,0,1500,50),revealed:toggle(false),empty:toggle(false),resetKey:number(0,0,99,1)},v=><div className="w-full p-8"><OutlineWordmark glyphs={v.empty?[]:v.artwork==="oreo"?OREO_WORDMARK:STUDIO_WORDMARK} label={v.artwork} accent={v.accent} nodes={v.nodes} animated={v.animated} release={v.release} revealed={v.revealed} resetKey={v.resetKey}/></div>),source:"outline-wordmark"},
"path-glyph": {...define("Path Glyph",{active:toggle(false),nodes:toggle(true),accent:select(["amber","mint","neutral"],"amber"),animated:toggle(true),release:number(700,0,1500,50)},v=><div className="w-56 p-8"><PathGlyph active={v.active} nodes={v.nodes} accent={v.accent} animated={v.animated} release={v.release}/></div>),source:"outline-wordmark"},
"footer-link-groups": {...define("Footer Link Groups",{compact:toggle(false),groups:number(2,0,2,1),label:text("Footer navigation")},v=><div className="w-full p-8"><FooterLinkGroups groups={FOOTER_LINK_GROUPS.slice(0,v.groups)} compact={v.compact} label={v.label}/></div>),source:"outline-wordmark"}
};
const exports = {
"outline-wordmark": { OutlineWordmark, PathGlyph, FooterLinkGroups }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "outline-wordmark"; spec.exports = exports; }
export default playgrounds;
