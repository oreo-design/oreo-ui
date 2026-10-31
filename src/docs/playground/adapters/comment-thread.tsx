/** Family-owned preview adapters and local export bindings. */
import { CommentThread } from "@/components/comment-thread";
import { initialThreads as commentThreadFixtures } from "@/patterns/comment-workspace/data";
import { definePlayground as define, text, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"comment-thread": define("Comment Thread", { state: select(["open", "resolution", "resolved"], "open"), resolutionId: text("r5") }, (v, set) => <CommentThread key={v.state} thread={{ id: commentThreadFixtures[0].id, comments: commentThreadFixtures[0].comments, resolved: v.state === "resolved", resolutionId: v.state === "open" ? undefined : v.resolutionId }} onChange={thread => { if (thread.resolutionId) set("resolutionId", thread.resolutionId); set("state", thread.resolved ? "resolved" : thread.resolutionId ? "resolution" : "open"); }} className="w-full max-w-xl" />)
};
const exports = {
"comment-thread": { CommentThread }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "comment-thread"; spec.exports = exports; }
export default playgrounds;
