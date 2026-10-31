/** Family-owned preview adapters and local export bindings. */
import { Attachment, AttachmentBar } from "@/components/attachment";
import attachmentPreview from "@/components/icon/assets/brands/figma-color.svg";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
attachment: define("Attachment", { label: text("Design brief.pdf"), type: select(["image", "video", "doc", "text", "code", "json", "music", "unknown", "link", "pdf"], "pdf"), size: select(["md", "sm"], "md"), loading: toggle() }, v => <Attachment {...v} src={v.type === "image" || v.type === "video" ? attachmentPreview : undefined} />)
};
const exports = {
"attachment": { Attachment, AttachmentBar }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "attachment"; spec.exports = exports; }
export default playgrounds;
