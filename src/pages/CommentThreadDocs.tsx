import { useState } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
import { Button } from "@/components/button";
import {
  CommentThread,
  CommentComposer,
  type CommentThreadData,
} from "@/components/comment-thread";
import {
  currentAuthor,
  initialThreads,
} from "@/patterns/comment-workspace/data";

export function CommentThreadExample({
  initialState = "open",
}: {
  initialState?: "open" | "resolution" | "resolved";
}) {
  const [thread, setThread] = useState<CommentThreadData>({
    ...initialThreads[0],
    resolved: initialState === "resolved",
    resolutionId: initialState === "open" ? undefined : "r5",
  });
  return (
    <div className="w-full max-w-xl">
      <CommentThread
        thread={thread}
        onChange={setThread}
        onReply={(body) =>
          setThread((t) => ({
            ...t,
            resolved: false,
            comments: [
              ...t.comments,
              {
                id: crypto.randomUUID(),
                author: currentAuthor,
                body,
                time: "just now",
              },
            ],
          }))
        }
      />
    </div>
  );
}
function FailureExample() {
  const [fail, setFail] = useState(true);
  const [sent, setSent] = useState("");
  return (
    <div className="max-w-xl space-y-4">
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => setFail(e.target.checked)}
        />
        Simulate send failure
      </label>
      <div className="overflow-hidden rounded-card-medium border border-border-subtle bg-bg-surface">
        <CommentComposer
          onSend={async (text) => {
            await new Promise((resolve) => setTimeout(resolve, 900));
            if (fail) throw new Error("Demo failure");
            setSent(text);
          }}
        />
      </div>
      <p role="status" className="text-xs text-text-secondary">
        {sent
          ? `Sent: ${sent}`
          : "Try a reply, then turn off the failure and retry. Shift+Enter adds a line."}
      </p>
    </div>
  );
}
export function CommentThreadDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Chat", "Comment Thread"]}
      toc={[
        { id: "introduction", label: "Introduction" },
        { id: "thread", label: "Interactive thread" },
        { id: "states", label: "Resolution & resolved" },
        { id: "recovery", label: "Reply & recovery" },
        { id: "usage", label: "Composition" },
        { id: "api", label: "API reference" },
      ]}
    >
      {() => (
        <>
          <header id="introduction" className="pb-8">
            <p className="mb-3 text-xs uppercase tracking-wider text-text-tertiary">
              From conversation to clarity
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Comment Thread
            </h1>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              Keep the question, the discussion and the answer together.
              Collapse the noise without losing the context.
            </p>
            <div className="mt-5">
              <Button render={<a href="/comment-workspace" />} tapScale={1}>
                Open Comment Workspace ↗
              </Button>
            </div>
            <p className="mt-4 text-xs leading-6 text-text-tertiary">
              Inspired by{" "}
              <a
                href="https://x.com/justvasi/status/2110388408061444136"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Vas’s comment-thread video
              </a>
              . The open → resolution → resolved sequence is independently
              implemented with Oreo Avatar, Menu, IconButton and tokens. The
              workspace, light theme, mobile layout and retry flow extend the
              reference.
            </p>
          </header>
          <Section
            id="thread"
            title="A conversation with a clear answer"
            description="Open a reply’s menu and mark it as the resolution. The question and selected answer stay visible while the other replies fold away. Resolve the entire thread from the question’s menu."
          >
            <CommentThreadExample />
          </Section>
          <Section
            id="states"
            title="Two different kinds of done"
            description="A resolution identifies the answer. A resolved thread closes the discussion. Both keep the full history within reach."
          >
            <div className="grid items-start gap-5 xl:grid-cols-2">
              <div>
                <p className="mb-3 text-xs text-text-secondary">
                  01 / Resolution highlighted
                </p>
                <CommentThreadExample initialState="resolution" />
              </div>
              <div>
                <p className="mb-3 text-xs text-text-secondary">
                  02 / Thread resolved
                </p>
                <CommentThreadExample initialState="resolved" />
              </div>
            </div>
          </Section>
          <Section
            id="recovery"
            title="A reply that won’t disappear"
            description="Whitespace is not sent. Pending requests block duplicate submissions; a rejected request retains the draft. Enter sends, Shift+Enter adds a line, and IME composition is respected."
          >
            <FailureExample />
          </Section>
          <Section id="usage" title="Compose a thread">
            <CodeBlock
              code={`import { CommentThread } from "@/components/comment-thread";\n\n<CommentThread\n  thread={thread}\n  onChange={setThread}\n  onReply={async text => {\n    const comment = await saveReply(text);\n    setThread(t => ({ ...t, comments: [...t.comments, comment] }));\n  }}\n/>\n\n// Complete local template\nimport { CommentWorkspace } from "@/patterns/comment-workspace";\n<CommentWorkspace dark={dark} onToggleTheme={toggleTheme} />`}
            />
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              Copy components/comment-thread and its Oreo dependencies. Add
              patterns/comment-workspace for the complete fixture. Data is
              controlled by the host; resolution and resolved status remain
              independent. Mount a new keyed thread when changing conversations.
              The example workspace reopens a resolved thread when a reply is
              sent, supports deletion of your own replies with Undo, and resets
              on reload. No collaboration server is connected.
            </p>
          </Section>
          <Section id="api" title="API reference">
            <PropsTable
              rows={[
                {
                  prop: "CommentThread",
                  type: "thread; onChange; onReply?; currentUserId?; onDeleteComment?; defaultExpanded?",
                  desc: "Controlled data, local disclosure state. The first comment is the question; resolutionId identifies a reply. Omit onReply to hide reply entry and omit deletion callback to hide deletion.",
                },
                {
                  prop: "CommentThreadData",
                  type: "id; comments: ThreadComment[]; resolutionId?; resolved: boolean",
                  desc: "Stable unique IDs. Only one reply is the resolution. Deleting that reply should clear resolutionId.",
                },
                {
                  prop: "ThreadComment",
                  type: "id; author: { id, name, avatar?, color? }; body; time",
                  desc: "Plain text with preserved newlines; time is a display string supplied by the host.",
                },
                {
                  prop: "CommentItem",
                  type: "comment; badge?; actions?: ReactNode",
                  desc: "Author, Avatar, time, multiline body and an optional action slot.",
                },
                {
                  prop: "CommentSummary",
                  type: "comments; expanded; resolved?; native button props",
                  desc: "Unique participants, accurate comment count and aria-expanded. Pass aria-controls and onClick to connect a disclosure.",
                },
                {
                  prop: "CommentComposer",
                  type: "onSend: (text) => void | Promise<void>; placeholder?; disabled?",
                  desc: "Reject to retain the draft and expose retry. Resolving clears it. 4,000-character limit; no file upload or formatting dependency.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}
