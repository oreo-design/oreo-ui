import { useState } from "react";
import {
  CommentThread,
  type CommentThreadData,
  type ThreadComment,
} from "@/components/comment-thread";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { currentAuthor, initialThreads } from "./data";

export function CommentWorkspace({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [threads, setThreads] = useState(initialThreads);
  const [selected, setSelected] = useState(initialThreads[0].id);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [query, setQuery] = useState("");
  const [deleted, setDeleted] = useState<{
    threadId: string;
    comment: ThreadComment;
    index: number;
    resolution: boolean;
  } | null>(null);
  const active = threads.find((t) => t.id === selected)!;
  const open = threads.filter((t) => !t.resolved).length;
  const visible = threads.filter(
    (t) =>
      (filter === "all" || t.resolved === (filter === "resolved")) &&
      `${t.title} ${t.section} ${t.comments.map((c) => c.body).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const participants = [
    ...new Map(active.comments.map((c) => [c.author.id, c.author])).values(),
  ];
  function update(next: CommentThreadData) {
    setThreads((all) =>
      all.map((t) => (t.id === next.id ? { ...t, ...next } : t)),
    );
  }
  function remove(id: string) {
    const index = active.comments.findIndex((c) => c.id === id);
    if (index < 1) return;
    setDeleted({
      threadId: active.id,
      comment: active.comments[index],
      index,
      resolution: active.resolutionId === id,
    });
    update({
      ...active,
      comments: active.comments.filter((c) => c.id !== id),
      resolutionId:
        active.resolutionId === id ? undefined : active.resolutionId,
    });
  }
  function undo() {
    if (!deleted) return;
    setThreads((all) =>
      all.map((t) => {
        if (t.id !== deleted.threadId) return t;
        const comments = [...t.comments];
        comments.splice(deleted.index, 0, deleted.comment);
        return {
          ...t,
          comments,
          resolutionId: deleted.resolution
            ? deleted.comment.id
            : t.resolutionId,
        };
      }),
    );
    setDeleted(null);
  }
  return (
    <div className="overflow-hidden rounded-card-medium border border-border-default bg-bg-base shadow-(--shadow-default)">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-control bg-bg-inverse text-text-on-inverse">
            <Icon name="chat" />
          </span>
          <div>
            <h1 className="text-sm font-semibold">Form & function</h1>
            <p className="mt-0.5 text-xs text-text-tertiary">
              Product discussions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary">
            A little clarity, together.
          </span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={onToggleTheme}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </div>
      </header>
      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside
          className="border-b border-border-subtle bg-bg-elevated lg:border-r lg:border-b-0"
          aria-label="Discussions"
        >
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Discussions
              </h2>
              <span className="rounded-capsule bg-state-press px-2 py-0.5 text-xs text-text-secondary">
                {threads.length}
              </span>
            </div>
            <label className="flex items-center gap-2 rounded-control border border-border-subtle bg-bg-base px-3 py-2 text-text-secondary">
              <Icon name="search" size="sm" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search discussions"
                placeholder="Find a discussion…"
                className="min-w-0 w-full bg-transparent text-xs text-text-primary outline-none placeholder:text-text-placeholder"
              />
            </label>
            <div
              className="mt-4 flex gap-1"
              role="group"
              aria-label="Filter discussions"
            >
              {(["all", "open", "resolved"] as const).map((value) => (
                <Button
                  key={value}
                  size="sm"
                  type={filter === value ? "secondary" : "tertiary"}
                  tapScale={1}
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {value === "all"
                    ? "All"
                    : value === "open"
                      ? `Open ${open}`
                      : `Resolved ${threads.length - open}`}
                </Button>
              ))}
            </div>
          </div>
          <nav
            aria-label="Discussion threads"
            className="max-h-80 space-y-1 overflow-y-auto px-3 pb-5 lg:max-h-none"
          >
            {visible.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-current={selected === t.id ? "true" : undefined}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "w-full rounded-card-small p-3 text-left outline-offset-2",
                  selected === t.id
                    ? "border border-border-subtle bg-bg-base shadow-(--shadow-default)"
                    : "border border-transparent hover:bg-state-hover",
                )}
              >
                <span className="flex items-start gap-2">
                  <Icon
                    name={t.resolved ? "chat-check" : "chat"}
                    size="sm"
                    className="mt-0.5 shrink-0 text-text-secondary"
                  />
                  <span className="text-sm font-medium leading-5">
                    {t.title}
                  </span>
                </span>
                <span className="mt-3 flex items-center justify-between pl-6 text-xs text-text-tertiary">
                  <span>{t.section}</span>
                  <span>
                    {t.comments.length - 1}{" "}
                    {t.comments.length === 2 ? "reply" : "replies"}
                  </span>
                </span>
              </button>
            ))}
            {!visible.length && (
              <div className="flex min-h-48 flex-col items-center justify-center gap-2 px-4 text-center">
                <Icon name="search" className="text-text-secondary" />
                <p className="text-sm font-medium">No discussions found</p>
                <p className="text-xs leading-5 text-text-secondary">
                  Try another phrase or show all discussions.
                </p>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </nav>
          <p className="border-t border-border-subtle px-5 py-4 text-xs leading-5 text-text-tertiary">
            A shared place for questions,
            <br />
            decisions, and what comes next.
          </p>
        </aside>
        <main className="min-w-0 bg-bg-base px-4 py-8 sm:px-10 lg:min-h-[48rem] lg:py-10">
          <div className="mx-auto max-w-2xl">
            <div className="mb-7">
              <p className="flex items-center gap-2 text-xs text-text-tertiary">
                <Icon name="folder" size="sm" />
                Workspace redesign<span>/</span>
                {active.section}
              </p>
              <h2 className="mt-5 text-2xl font-medium tracking-tight sm:text-3xl">
                {active.title}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                <AvatarGroup size="xs">
                  {participants.map((p) => (
                    <Avatar
                      key={p.id}
                      name={p.name}
                      color={p.color}
                      size="xs"
                    />
                  ))}
                </AvatarGroup>
                <span>{participants.length} collaborators</span>
                <span className="text-border-default">/</span>
                <span>{active.resolved ? "Resolved" : "Open discussion"}</span>
              </div>
            </div>
            <CommentThread
              key={active.id}
              thread={active}
              onChange={update}
              currentUserId={currentAuthor.id}
              onDeleteComment={remove}
              onReply={async (body) => {
                const threadId = active.id;
                await new Promise((resolve) => setTimeout(resolve, 450));
                setThreads((all) =>
                  all.map((t) =>
                    t.id === threadId
                      ? {
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
                        }
                      : t,
                  ),
                );
              }}
            />
            {deleted && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-control border border-border-subtle px-4 py-2 text-xs">
                <span role="status">Comment deleted.</span>
                <Button type="tertiary" size="sm" tapScale={1} onClick={undo}>
                  Undo
                </Button>
              </div>
            )}
            <div className="mt-7 flex items-start gap-2 text-xs leading-5 text-text-tertiary">
              <Icon name="checks" size="sm" className="mt-0.5 shrink-0" />
              <p>
                Found the answer? Mark a reply as the resolution.
                <br />
                Finished the conversation? Resolve the thread from its menu.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
