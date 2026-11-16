import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { StatusView } from "@/components/status-view";
import { TaskDetailPanel, TaskSubtasks } from "@/components/task-editor";
import {
  TaskCapsule,
  TaskStatusChoices,
  type CapsuleTask,
} from "@/components/task-capsule";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { CAPSULE_TASKS } from "./data";
import "./workspace.css";
export function TaskCapsuleWorkspace() {
  const [dark, setDark] = useThemeMode(false),
    [tasks, setTasks] = useState(CAPSULE_TASKS),
    [filter, setFilter] = useState("all"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string | null>(null);
  const launch = useRef<HTMLElement | null>(null),
    search = useRef<HTMLInputElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selected && window.matchMedia("(max-width: 900px)").matches)
      detail.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [selected]);
  const task = tasks.find((t) => t.id === selected);
  const change = (id: string, patch: Partial<CapsuleTask>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => {
      if (launch.current?.isConnected) launch.current.focus();
      else search.current?.focus();
    });
  };
  const shown = tasks.filter(
    (t) =>
      (filter === "all" ||
        (filter === "done" ? t.status === "done" : t.status !== "done")) &&
      t.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="tc-workspace">
      <header className="tc-site-header">
        <a href="/task-capsule">
          Oreo UI <span>/ Task Capsule</span>
        </a>
        <IconButton
          type="secondary"
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          icon={<Icon name={dark ? "sun" : "moon"} />}
          onClick={() => setDark(!dark)}
        />
      </header>
      <div className="tc-workspace-layout" data-detail={!!task || undefined}>
        <section className="tc-overview" aria-label="Project overview">
          <div className="tc-project-heading">
            <p>PROJECT / PRODUCT DESIGN</p>
            <h1>A little progress, every day.</h1>
            <span>Three small projects. One place to keep things moving.</span>
          </div>
          <div className="tc-toolbar">
            <label>
              <Icon name="search" size="sm" />
              <input
                ref={search}
                aria-label="Search projects"
                placeholder="Find a project…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter projects"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All projects</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="tc-project-list">
            {shown.length ? (
              shown.map((t, i) => (
                <TaskCapsule
                  key={t.id}
                  title={t.title}
                  status={t.status}
                  due={t.due}
                  people={t.people}
                  items={t.items}
                  defaultOpen={i === 0}
                  onStatusChange={(status) => change(t.id, { status })}
                  onItemsChange={(items) => change(t.id, { items })}
                  onOpen={() => {
                    launch.current = document.activeElement as HTMLElement;
                    setSelected(t.id);
                  }}
                />
              ))
            ) : (
              <StatusView
                title="No matching projects"
                description="Try another name or show all projects."
                actionLabel="Clear filters"
                onAction={() => {
                  setQuery("");
                  setFilter("all");
                  search.current?.focus();
                }}
              />
            )}
          </div>
          <p className="tc-local-note">
            Local workspace · Changes stay in this tab.
          </p>
        </section>
        {task && (
          <div ref={detail} className="tc-detail">
            <TaskDetailPanel
              taskId={task.id}
              title={task.title}
              complete={task.status === "done"}
              onComplete={() =>
                change(task.id, {
                  status: task.status === "done" ? "todo" : "done",
                })
              }
              onClose={close}
            >
              <p className="tc-description">{task.description}</p>
              <TaskStatusChoices
                value={task.status}
                onChange={(status) => change(task.id, { status })}
              />
              <TaskSubtasks
                items={task.items}
                onChange={(items) => change(task.id, { items })}
              />
              <p className="tc-detail-note">
                Project status and checklist completion are independent.
              </p>
            </TaskDetailPanel>
          </div>
        )}
      </div>
      <footer className="tc-site-footer">
        <a href="/task-capsule">
          Explore the components <Icon name="arrow-up-right" size="sm" />
        </a>
        <a
          href="https://www.pinterest.com/pin/440086194863073715/"
          target="_blank"
          rel="noreferrer"
        >
          View reference
        </a>
      </footer>
    </main>
  );
}
