import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  AudioClip,
  ChatBubble,
  CollaborationComposer,
  type AudioSeek,
  type ChatDraft,
} from "@/components/project-chat";
import { AgentWorkspaceState } from "@/components/automation";
import {
  InboxFilters,
  InboxGroup,
  InboxNotification,
  type InboxFilter,
  type InboxItem,
} from "@/components/studio-inbox";
import { NOTIFICATIONS, PROJECTS } from "./data";
import "./studio-inbox.css";

type Reply = { id: string; text: string; files: string[] };
function Discussion({
  project,
  active,
  item,
  onBack,
  onArchive,
  approved,
  onApprove,
}: {
  project: string;
  active: boolean;
  item: InboxItem;
  onBack: () => void;
  onArchive: () => void;
  approved: boolean;
  onApprove: () => void;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [seek, setSeek] = useState<AudioSeek>();
  const [liked, setLiked] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (active && window.matchMedia("(max-width: 760px)").matches)
      title.current?.focus();
  }, [active, item.id]);
  useEffect(() => {
    if (replies.length) end.current?.scrollIntoView({ block: "nearest" });
  }, [replies.length]);
  function send(draft: ChatDraft) {
    setReplies((r) => [
      ...r,
      {
        id: crypto.randomUUID(),
        text: draft.text,
        files: draft.files.map((f) => f.name),
      },
    ]);
  }
  const author = { id: item.id, name: item.author };
  return (
    <section
      hidden={!active}
      className="si-discussion"
      aria-label={`${project} discussion`}
    >
      <header className="si-detail-header">
        <IconButton
          className="si-back"
          type="tertiary"
          tapScale={1}
          aria-label="Back to inbox"
          icon={<Icon name="chevron-left" />}
          onClick={onBack}
        />
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full bg-status-progress text-white"
          aria-hidden
        >
          ♫
        </span>
        <h2
          ref={title}
          tabIndex={-1}
          className="min-w-0 flex-1 truncate text-sm font-semibold"
        >
          {project}
        </h2>
        <span className="si-project-status">
          {approved
            ? "Approved"
            : project === "So Long"
              ? "In review"
              : "In progress"}
        </span>
        <IconButton
          type="tertiary"
          tapScale={1}
          size="sm"
          aria-label="Archive notification"
          icon={<Icon name="check" />}
          onClick={onArchive}
        />
      </header>
      <div
        className="si-transcript"
        role="log"
        aria-label={`${project} messages`}
        aria-live="polite"
      >
        {project === "On My Mind" && (
          <>
            <ChatBubble
              author={{ id: "theo", name: "Theo Adeyemi" }}
              time="2h ago"
            >
              The sub is masking the kick here — it needs to duck a little
              harder so the drop keeps its punch.
            </ChatBubble>
            <div className="si-audio">
              <AudioClip
                src="/examples/music-workspace/mix-demo.wav"
                title="Drop preview"
                duration={238}
                seek={seek}
                active={active}
              />
              <button
                type="button"
                aria-pressed={liked}
                className="si-reaction"
                onClick={() => setLiked((v) => !v)}
              >
                <Icon name="thumbs-up" className="size-3" />
                {liked ? 2 : 1}
                <span className="sr-only"> Like preview</span>
              </button>
            </div>
            <ChatBubble
              author={{ id: "kai", name: "Kai Hoshino" }}
              time="1h ago"
            >
              Yep, the sub is clashing with the kick. I’ll sidechain it harder
              and re-bounce.
            </ChatBubble>
            <div className="si-new">
              <span />
              New
              <span />
            </div>
          </>
        )}
        <ChatBubble author={author} time={item.time}>
          {item.preview}
          {project === "On My Mind" && (
            <button
              type="button"
              className="si-timestamp"
              onClick={() => setSeek({ seconds: 84, request: Date.now() })}
            >
              Jump to 1:24
            </button>
          )}
        </ChatBubble>
        {item.category === "Approvals" && (
          <div className="si-approval">
            <p className="text-sm font-medium">Final master · v6</p>
            <p className="mt-1 mb-3 text-xs text-text-secondary">
              Your sign-off is saved in this demo only.
            </p>
            <Button
              size="sm"
              type="secondary"
              tapScale={1}
              disabled={approved}
              onClick={onApprove}
            >
              {approved ? "Master approved" : "Approve master"}
            </Button>
          </div>
        )}
        {item.category === "Versions" && (
          <div className="si-audio">
            <AudioClip
              src="/examples/music-workspace/mix-demo.wav"
              title="Version preview"
              duration={238}
              active={active}
            />
            <p className="mt-2 text-xs text-text-tertiary">
              Sample audio · original files are not included.
            </p>
          </div>
        )}
        {replies.map((reply) => (
          <ChatBubble key={reply.id} outgoing receipt="Saved locally">
            {reply.text}
            {reply.files.map((file, i) => (
              <p key={i} className="mt-1 text-xs text-text-secondary">
                {file} · local attachment
              </p>
            ))}
          </ChatBubble>
        ))}
        <div ref={end} />
      </div>
      <div className="si-compose">
        <CollaborationComposer
          onSend={send}
          note="Local demo · replies and files stay in this page"
        />
      </div>
    </section>
  );
}
export function StudioInbox() {
  const [dark, setDark] = useState(true);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [items, setItems] = useState(NOTIFICATIONS);
  const [selected, setSelected] = useState("dez");
  const [filter, setFilter] = useState<InboxFilter>("All");
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("All projects");
  const [unread, setUnread] = useState(false);
  const [archived, setArchived] = useState<string[]>([]);
  const [undo, setUndo] = useState<string>();
  const [approved, setApproved] = useState(false);
  const [detail, setDetail] = useState(false);
  const [notice, setNotice] = useState("");
  const listTitle = useRef<HTMLHeadingElement>(null);
  const shown = items.filter(
    (n) =>
      !archived.includes(n.id) &&
      (filter === "All" || n.category === filter) &&
      (!unread || n.unread) &&
      (project === "All projects" || n.project === project) &&
      `${n.author} ${n.project} ${n.preview}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const current = items.find((n) => n.id === selected)!;
  const count = items.filter(
    (n) => n.unread && !archived.includes(n.id),
  ).length;
  function reset() {
    setFilter("All");
    setQuery("");
    setProject("All projects");
    setUnread(false);
    setDetail(false);
  }
  function select(id: string) {
    setSelected(id);
    setDetail(true);
    setItems((all) =>
      all.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  }
  function archive() {
    setArchived((a) => [...a, selected]);
    setUndo(selected);
    setNotice("Notification archived.");
    setDetail(false);
    const next = shown.find((n) => n.id !== selected);
    if (next) setSelected(next.id);
    listTitle.current?.focus();
  }
  const available = !archived.includes(selected);
  return (
    <div className={`studio-inbox ${dark ? "theme-dark" : ""}`}>
      <header className="si-topbar">
        <a
          href="/studio-inbox-components"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Icon name="chevron-left" className="size-4" />
          Oreo UI{" "}
          <span className="text-text-tertiary font-normal">/ Templates</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary">
            Local demo · resets on reload
          </span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark((v) => !v)}
          />
        </div>
      </header>
      <main className={`si-shell ${detail ? "si-show-detail" : ""}`}>
        <aside className="si-sidebar">
          <div className="si-identity">
            <Avatar name="Allagi" size="sm" color="purple" />
            <span className="font-medium text-sm">Allagi</span>
            <span className="ml-auto text-xs text-text-tertiary">Studio</span>
          </div>
          <nav aria-label="Studio navigation">
            <button
              type="button"
              className="si-nav-item si-nav-active"
              onClick={reset}
            >
              <Icon name="bell" />
              Inbox <span className="si-count">{count}</span>
            </button>
            <a className="si-nav-item" href="/music-workspace">
              <Icon name="folder" />
              Projects
              <Icon className="ml-auto" name="arrow-up-right" />
            </a>
          </nav>
          <div className="si-project-nav">
            <p className="mb-3 px-3 text-xs text-text-tertiary">FAVORITES</p>
            <div role="group" aria-label="Project filter">
              {["All projects", ...PROJECTS].map((p) => (
                <button
                  type="button"
                  key={p}
                  aria-pressed={project === p}
                  className="si-nav-item"
                  onClick={() => {
                    setProject(p);
                    setDetail(false);
                  }}
                >
                  <span aria-hidden>♫</span>
                  <span className="truncate">{p}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="si-sidebar-foot">
            <span className="inline-block size-1.5 rounded-full bg-status-success mr-2" />
            Everything in its own rhythm.
          </div>
        </aside>
        <section className="si-content" aria-label="Inbox workspace">
          <header className="si-inbox-header">
            <h1
              ref={listTitle}
              tabIndex={-1}
              className="flex items-center gap-2 font-semibold text-base"
            >
              <Icon name="bell" className="size-4 text-text-secondary" />
              Inbox{" "}
              <span className="font-normal text-text-tertiary">{count}</span>
            </h1>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              disabled={!count}
              onClick={() => {
                setItems((all) => all.map((n) => ({ ...n, unread: false })));
                setNotice("All notifications marked as read.");
              }}
            >
              Mark all read
            </Button>
          </header>
          <InboxFilters
            value={filter}
            onChange={(v) => {
              setFilter(v);
              setDetail(false);
            }}
          />
          <div className="si-panes">
            <section className="si-list" aria-label="Notifications">
              <div className="si-search">
                <label className="si-search-input">
                  <Icon
                    name="search"
                    className="size-4 shrink-0 text-text-tertiary"
                  />
                  <input
                    type="search"
                    aria-label="Search inbox"
                    placeholder="Search inbox…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  aria-pressed={unread}
                  className="si-unread-filter"
                  onClick={() => setUnread((v) => !v)}
                >
                  Unread
                </button>
              </div>
              <div className="si-results">
                <p className="sr-only" role="status">
                  {shown.length} notifications
                </p>
                {["Today", "Yesterday"].map((day) => {
                  const group = shown.filter((n) => n.day === day);
                  return group.length ? (
                    <InboxGroup key={day} title={day} count={group.length}>
                      {group.map((n) => (
                        <InboxNotification
                          key={n.id}
                          item={n}
                          selected={selected === n.id}
                          onSelect={select}
                        />
                      ))}
                    </InboxGroup>
                  ) : null;
                })}
                {!shown.length && (
                  <AgentWorkspaceState
                    title="All quiet here"
                    description="No notifications match these filters."
                    actionLabel="Clear filters"
                    onAction={reset}
                  />
                )}
              </div>
            </section>
            <div className="si-detail">
              {PROJECTS.map((p) => (
                <Discussion
                  key={p}
                  project={p}
                  active={
                    available && current.project === p && (!narrow || detail)
                  }
                  item={
                    current.project === p
                      ? current
                      : NOTIFICATIONS.find((n) => n.project === p)!
                  }
                  onBack={() => {
                    setDetail(false);
                    listTitle.current?.focus();
                  }}
                  onArchive={archive}
                  approved={approved && p === "So Long"}
                  onApprove={() => {
                    setApproved(true);
                    setNotice("Master approved in this local demo.");
                  }}
                />
              ))}
              {!available && (
                <AgentWorkspaceState
                  title="You’re all caught up"
                  description="Select another notification, or undo the last archive."
                />
              )}
            </div>
          </div>
          <div className="si-notice">
            <p role="status">
              {notice || "A little less noise. A little more music."}
            </p>
            {undo && (
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                onClick={() => {
                  setArchived((a) => a.filter((id) => id !== undo));
                  setSelected(undo);
                  setUndo(undefined);
                  setNotice("Notification restored.");
                }}
              >
                Undo archive
              </Button>
            )}
          </div>
        </section>
      </main>
      <footer className="si-footer">
        <span>Studio Inbox · Built with Oreo UI</span>
        <a
          href="https://x.com/designflyio/status/2110486258640372119"
          target="_blank"
          rel="noreferrer"
        >
          Reference by Brad / @designflyio ↗
        </a>
      </footer>
    </div>
  );
}
