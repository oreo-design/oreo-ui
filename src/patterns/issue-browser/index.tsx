import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { AgentWorkspaceNav } from "@/components/automation";
import { InlineSearchSelect } from "@/components/inline-search-select";
import {
  IssueQueue,
  IssueReader,
  filterIssues,
  adjacentIssue,
  appendComment,
  type Issue,
  type IssueSort,
} from "@/components/issue-browser";
import { SAMPLE_ISSUES } from "./data";
import "./issue-browser.css";
export function IssueBrowserPage() {
  const [issues, setIssues] = useState(SAMPLE_ISSUES),
    [selected, setSelected] = useState<number | null>(SAMPLE_ISSUES[0].id),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState<Issue["state"]>("open"),
    [label, setLabel] = useState(""),
    [sort, setSort] = useState<IssueSort>("updated"),
    [dark, setDark] = useState(true),
    [drafts, setDrafts] = useState<Record<number, string>>({}),
    [notice, setNotice] = useState(
      "Local sample workspace · changes reset on reload",
    ),
    [creating, setCreating] = useState(false),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState("");
  const root = useRef<HTMLDivElement>(null),
    newButton = useRef<HTMLDivElement>(null),
    search = useRef<HTMLInputElement>(null);
  const visible = filterIssues(issues, query, status, label, sort),
    issue = visible.find((i) => i.id === selected),
    labels = [...new Set(issues.flatMap((i) => i.labels))];
  const focusRow = (id: number | null) =>
    requestAnimationFrame(() => {
      const row = root.current?.querySelector<HTMLButtonElement>(
        `[data-issue-id="${id}"]`,
      );
      row?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: "nearest" });
      if (!row) search.current?.focus();
    });
  const close = () => {
    setSelected(null);
    setCreating(false);
    focusRow(selected);
  };
  const select = (id: number) => {
    setSelected(id);
    setCreating(false);
  };
  const clear = () => {
    setQuery("");
    setLabel("");
    setSelected(null);
  };
  const comment = () => {
    if (!issue || !drafts[issue.id]?.trim()) return;
    setIssues((prev) =>
      appendComment(
        prev,
        issue.id,
        drafts[issue.id],
        crypto.randomUUID(),
        Date.now(),
      ),
    );
    setDrafts((prev) => ({ ...prev, [issue.id]: "" }));
    setNotice(`Comment added to #${issue.id} in this tab.`);
  };
  const copy = async () => {
    if (!issue) return;
    try {
      await navigator.clipboard.writeText(
        `${issue.title} (#${issue.id}) — local sample`,
      );
      setNotice(`Copied #${issue.id} title and number.`);
    } catch {
      setNotice("Copy failed. Select the issue title and copy it manually.");
    }
  };
  return (
    <div
      ref={root}
      className={`issue-browser ${dark ? "theme-dark" : ""}`}
      data-detail={Boolean(issue) || creating || undefined}
      onKeyDown={(e) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const target = e.target as HTMLElement;
        if (
          target.closest(
            "input,textarea,select,[role=combobox],[role=listbox],[contenteditable=true]",
          )
        )
          return;
        if (
          (e.key === "j" ||
            e.key === "k" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowUp") &&
          !creating
        ) {
          e.preventDefault();
          const id = adjacentIssue(
            visible,
            selected,
            e.key === "j" || e.key === "ArrowDown" ? 1 : -1,
          );
          if (id !== null) {
            select(id);
            focusRow(id);
          }
        }
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
        if (e.key === "/" && !creating) {
          e.preventDefault();
          search.current?.focus();
        }
      }}
    >
      <aside className="ib-nav">
        <AgentWorkspaceNav
          brand={
            <>
              <Icon name="github-logo" />
              <strong>Oreo Studio</strong>
            </>
          }
          groups={[
            {
              label: "WORKSPACE",
              items: [
                {
                  label: "Issues",
                  href: "/issue-browser",
                  icon: "circle-dashed",
                  active: true,
                },
                {
                  label: "Activity",
                  href: "/project-feed",
                  icon: "clock-history",
                },
                { label: "Task board", href: "/task-board", icon: "columns" },
              ],
            },
            {
              label: "PINNED",
              items: [
                { label: "Component library", href: "/button", icon: "folder" },
                {
                  label: "Review workspace",
                  href: "/review-workspace",
                  icon: "scan-text",
                },
              ],
            },
          ]}
          footer={
            <>
              <a href="/issue-queue">
                Explore components <Icon name="arrow-up-right" size="sm" />
              </a>
              <div className="ib-user">
                <Avatar name="Alex Morgan" color="purple" size="sm" />
                <span>
                  Alex Morgan<small>Local workspace</small>
                </span>
              </div>
            </>
          }
        />
      </aside>
      <div className="ib-workspace">
        <header className="ib-top">
          <span>
            <Icon name="folder" size="sm" /> oreo <b>/</b>
            <strong>ui</strong>
            <span className="ib-repo-badge">Sample repository</span>
          </span>
          <IconButton
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            type="tertiary"
            size="sm"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <div className="ib-titlebar">
          <div>
            <h1>Issues</h1>
            <span>{issues.length}</span>
          </div>
          <div ref={newButton}>
            <Button
              size="sm"
              tapScale={1}
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => {
                setCreating(true);
                setSelected(null);
              }}
            >
              New issue
            </Button>
          </div>
        </div>
        <div className="ib-toolbar">
          <div className="ib-status-tabs" role="group" aria-label="Issue state">
            {(["open", "closed"] as const).map((s) => (
              <Button
                key={s}
                type={status === s ? "secondary" : "tertiary"}
                size="sm"
                tapScale={1}
                aria-pressed={status === s}
                leadingIcon={
                  <Icon
                    name={s === "open" ? "circle-dashed" : "check"}
                    size="sm"
                  />
                }
                onClick={() => {
                  setStatus(s);
                  setSelected(null);
                  setCreating(false);
                }}
              >
                {s === "open" ? "Open" : "Closed"}{" "}
                <span>{issues.filter((i) => i.state === s).length}</span>
              </Button>
            ))}
          </div>
          <label className="ib-search">
            <Icon name="search" size="sm" />
            <input
              ref={search}
              aria-label="Search issues"
              placeholder="Search issues…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(null);
              }}
            />
            <kbd>/</kbd>
          </label>
          <InlineSearchSelect
            label="Label"
            value={label}
            options={[
              { value: "", label: "All labels" },
              ...labels.map((l) => ({ value: l, label: l })),
            ].map((o) => ({ ...o, icon: <Icon name="hash" size="sm" /> }))}
            onValueChange={(v) => {
              setLabel(v);
              setSelected(null);
            }}
          />
          <InlineSearchSelect
            label="Sort"
            value={sort}
            options={[
              { value: "updated", label: "Recently updated" },
              { value: "newest", label: "Newest" },
              { value: "comments", label: "Most commented" },
            ].map((o) => ({
              ...o,
              icon: <Icon name="sort-descending" size="sm" />,
            }))}
            onValueChange={(v) => setSort(v as IssueSort)}
          />
        </div>
        <div className="ib-split">
          <main className="ib-list-main">
            <IssueQueue
              issues={visible}
              selectedId={selected}
              onSelect={select}
              filtered={Boolean(query || label)}
              onClear={clear}
              footer={
                <>
                  <span>
                    {visible.length} {status} issues
                  </span>
                  <span>
                    <kbd>↑</kbd> <kbd>↓</kbd> Browse
                  </span>
                  <span>
                    <kbd>Esc</kbd> Close
                  </span>
                </>
              }
            />
          </main>
          {issue && (
            <IssueReader
              issue={issue}
              draft={drafts[issue.id] ?? ""}
              onDraftChange={(value) =>
                setDrafts((prev) => ({ ...prev, [issue.id]: value }))
              }
              onComment={comment}
              onClose={close}
              actions={
                <>
                  <IconButton
                    aria-label="Copy issue reference"
                    title="Copy issue title and number"
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    icon={<Icon name="copy" size="sm" />}
                    onClick={copy}
                  />
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    onClick={() => {
                      const next = issue.state === "open" ? "closed" : "open";
                      setIssues((prev) =>
                        prev.map((i) =>
                          i.id === issue.id ? { ...i, state: next } : i,
                        ),
                      );
                      setSelected(null);
                      setNotice(
                        `#${issue.id} ${next === "closed" ? "closed" : "reopened"} locally.`,
                      );
                      focusRow(
                        visible.find((i) => i.id !== issue.id)?.id ?? null,
                      );
                    }}
                  >
                    {issue.state === "open" ? "Close issue" : "Reopen"}
                  </Button>
                </>
              }
            />
          )}
          {creating && (
            <section
              className="ib-reader"
              aria-label="New issue"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  setCreating(false);
                  requestAnimationFrame(() =>
                    newButton.current?.querySelector("button")?.focus(),
                  );
                }
              }}
            >
              <header className="ib-reader-header">
                <strong>New issue</strong>
                <IconButton
                  aria-label="Cancel new issue"
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  icon={<Icon name="x" size="sm" />}
                  onClick={() => {
                    setCreating(false);
                    requestAnimationFrame(() =>
                      newButton.current?.querySelector("button")?.focus(),
                    );
                  }}
                />
              </header>
              <form
                className="ib-new"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!title.trim()) return;
                  const id = Math.max(...issues.map((i) => i.id)) + 1;
                  setIssues((prev) => [
                    {
                      id,
                      title: title.trim(),
                      description:
                        description.trim() || "No description provided.",
                      author: "You",
                      state: "open",
                      labels: [],
                      updated: Date.now(),
                      age: "now",
                      comments: [],
                    },
                    ...prev,
                  ]);
                  setTitle("");
                  setDescription("");
                  setStatus("open");
                  setQuery("");
                  setLabel("");
                  setSelected(id);
                  setCreating(false);
                  setNotice(`Created #${id} locally.`);
                  focusRow(id);
                }}
              >
                <label>
                  Title
                  <input
                    autoFocus
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs attention?"
                  />
                </label>
                <label>
                  Description
                  <textarea
                    rows={10}
                    maxLength={10000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue. Markdown is supported."
                  />
                </label>
                <p>
                  Creates a sample issue in this tab. Nothing is sent to GitHub.
                </p>
                <Button
                  size="sm"
                  tapScale={1}
                  disabled={!title.trim()}
                  onClick={(e) => e.currentTarget.form?.requestSubmit()}
                >
                  Create local issue
                </Button>
              </form>
            </section>
          )}
        </div>
        <div className="ib-notice" role="status">
          {notice}
        </div>
      </div>
    </div>
  );
}
