/** Family-owned preview adapters and local export bindings. */
import { InboxNotification } from "@/components/studio-inbox";
import { NOTIFICATIONS } from "@/patterns/studio-inbox/data";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"studio-inbox-components": define("Inbox Notification", { selected: toggle(true), unread: toggle(true), preview: text(NOTIFICATIONS[0].preview) }, (v,set) => <div className="w-full max-w-md rounded-card-medium border border-border-subtle bg-bg-base p-2"><InboxNotification item={{...NOTIFICATIONS[0], unread:v.unread, preview:v.preview}} selected={v.selected} onSelect={()=>set("selected",!v.selected)}/></div>)
};
const exports = {
"studio-inbox": { InboxNotification }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "studio-inbox"; spec.exports = exports; }
export default playgrounds;
