/** Family-owned preview adapters and local export bindings. */
import { ThreadList, ThreadListItem } from "@/components/thread-list";
import { definePlayground as define, text, toggle } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"thread-list": define("Thread List", { title: text("A new workspace"), meta: text("Just now"), active: toggle(true), unread: toggle() }, (v, set) =>
    <ThreadList><ThreadListItem {...v} onSelect={() => set("active", !v.active)} /><ThreadListItem title="Explore the design system" meta="Yesterday" /></ThreadList>)
};
const exports = {
"thread-list": { ThreadList, ThreadListItem }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "thread-list"; spec.exports = exports; }
export default playgrounds;
