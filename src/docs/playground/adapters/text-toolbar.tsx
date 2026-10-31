/** Family-owned preview adapters and local export bindings. */
import { TextToolbar, DEFAULT_TEXT_FORMAT, type TextColor, type TextFont, type TextAlignment } from "@/components/text-toolbar";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, toggle, number, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
"text-toolbar": define("Text Toolbar", { bold: toggle(), italic: toggle(), underline: toggle(), strikethrough: toggle(), code: toggle(), highlight: toggle(), color: select(["ink","mint","pink","blue","purple","orange","brown"],"ink"), font: select(["sans","serif","hand","mono"],"hand"), size: number(22,12,72,1), align: select(["left","center","right"],"center"), disabled: toggle() }, (v,set) => <TextToolbar disabled={v.disabled} value={{...DEFAULT_TEXT_FORMAT,...v,color:v.color as TextColor,font:v.font as TextFont,align:v.align as TextAlignment}} onValueChange={value=>{for(const key of Object.keys(DEFAULT_TEXT_FORMAT) as (keyof typeof DEFAULT_TEXT_FORMAT)[]) set(key,value[key]);}} />)
};
const exports = {
"text-toolbar": { TextToolbar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "text-toolbar"; spec.exports = exports; }
export default playgrounds;
