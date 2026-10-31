/** Family-owned preview adapters and local export bindings. */
import { statusIconDemo } from "../status-icon.demo";
import { StatusIcon, STATUS_ICON_STATES, STATUS_ICON_PROGRESS } from "@/components/status-icon";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"status-icon": {
    ...define("Status Icon", { status: select(STATUS_ICON_STATES, "todo"), progress: select(STATUS_ICON_PROGRESS, "half"), size: select(["sm", "md", "lg", "xl"], "xl"), monochrome: toggle(), animated: toggle(true), "aria-label": text("Task status") }, v => <StatusIcon {...v} />),
    demo: statusIconDemo,
  }
};
const exports = {
"status-icon": { StatusIcon }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "status-icon"; spec.exports = exports; }
export default playgrounds;
