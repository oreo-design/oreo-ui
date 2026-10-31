/** Family-owned preview adapters and local export bindings. */
import { Avatar } from "@/components/avatar";
import { PALETTE } from "@/lib/palette";
import { definePlayground as define, text, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const color = select(PALETTE, "default");
const playgrounds: Record<string, PlaygroundSpec> = {
avatar: define("Avatar", { name: text("Alex Morgan"), size: select(["xs", "sm", "md", "lg"], "md"), color: select([...PALETTE, "black", "white"], "default"), agent: select(["none", "nova", "void", "jade", "bloom", "silk", "flare"], "none") }, v =>
    <Avatar {...v} agent={v.agent === "none" ? undefined : v.agent} />)
};
const exports = {
"avatar": { Avatar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "avatar"; spec.exports = exports; }
export default playgrounds;
