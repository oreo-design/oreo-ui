import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState } from "react";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { ProjectChatDemo } from "./ProjectChatDemo";
import { collaborators, songs } from "./data";
import "./music-workspace.css";

export function MusicWorkspace() {
  const [dark, setDark] = useThemeMode(false);
  const [active, setActive] = useState("on-my-mind");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All projects");
  const [openRequest, setOpenRequest] = useState(0);
  const shown = songs.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All projects" || s.status === filter),
  );
  return (
    <div
      className={cn(
        "music-workspace min-h-screen bg-bg-elevated text-text-primary",
        dark && "theme-dark",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <a
          href="/project-chat"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Icon name="chevron-left" className="size-4" />
          Oreo UI{" "}
          <span className="font-normal text-text-tertiary">/ Templates</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary">
            Local demo · changes reset on reload
          </span>
          <IconButton
            tapScale={1}
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark((v) => !v)}
          />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-10 flex items-center gap-4">
          <div
            className="grid size-12 place-items-center rounded-card-small bg-bg-inverse text-xl text-text-on-inverse"
            aria-hidden
          >
            ✳
          </div>
          <div>
            <p className="mb-1 text-xs text-text-tertiary">
              ALLAGI’S WORKSPACE
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Good things take a few takes.
            </h1>
          </div>
        </div>
        <div className="music-stage relative rounded-3xl border border-border-subtle bg-bg-base p-4 shadow-default sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Projects{" "}
                <span className="ml-1 text-sm font-normal text-text-tertiary">
                  {songs.length}
                </span>
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                From the first idea to the final master.
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-control border border-border-subtle px-3 py-2 text-text-tertiary">
              <Icon name="search" className="size-4" />
              <input
                aria-label="Search projects"
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-40 bg-transparent text-sm text-text-primary outline-none"
              />
            </label>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {["All projects", "In progress", "In review", "Complete"].map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-control px-3 py-1.5 text-xs font-medium",
                    filter === f
                      ? "bg-state-press text-text-primary"
                      : "text-text-secondary",
                  )}
                >
                  {f}
                </button>
              ),
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="music-table w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-xs text-text-tertiary">
                  <th className="py-3 font-normal">Song</th>
                  <th className="font-normal">Stage</th>
                  <th className="font-normal">Tasks</th>
                  <th className="font-normal">Notes</th>
                  <th className="font-normal">Collaborators</th>
                  <th className="font-normal">Status</th>
                  <th className="font-normal">Updated</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((s, i) => (
                  <tr
                    key={s.id}
                    className={cn(
                      "border-b border-border-subtle",
                      active === s.id && "bg-status-progress-subtle",
                    )}
                  >
                    <td className="py-5 pl-2">
                      <button
                        type="button"
                        aria-label={`Open ${s.name} conversation`}
                        onClick={() => {
                          setActive(s.id);
                          setOpenRequest((n) => n + 1);
                        }}
                        className="flex items-center gap-3 font-medium"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "grid size-9 place-items-center rounded-control",
                            i % 2
                              ? "bg-palette-purple-bg text-palette-purple-text"
                              : "bg-palette-brown-bg text-palette-brown-text",
                          )}
                        >
                          ♫
                        </span>
                        {s.name}
                      </button>
                    </td>
                    <td className="text-text-secondary">{s.phase}</td>
                    <td className="text-text-secondary">{s.tasks} tasks</td>
                    <td className="text-text-secondary">{s.notes} notes</td>
                    <td>
                      <AvatarGroup size="xs">
                        {collaborators
                          .slice(0, s.id === "so-long" ? 2 : 3)
                          .map((p) => (
                            <Avatar
                              key={p.id}
                              name={p.name}
                              size="xs"
                              color="brown"
                            />
                          ))}
                      </AvatarGroup>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 rounded-control border border-border-subtle bg-bg-base px-2 py-1 text-xs">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            s.status === "Complete"
                              ? "bg-status-success"
                              : s.status === "In review"
                                ? "bg-status-progress"
                                : "bg-palette-orange-text",
                          )}
                        />
                        {s.status}
                      </span>
                    </td>
                    <td className="text-text-tertiary">{s.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!shown.length && (
            <div className="py-10 text-center">
              <p className="text-sm text-text-secondary">
                No projects match these filters.
              </p>
              <Button
                className="mt-3"
                size="sm"
                type="secondary"
                tapScale={1}
                onClick={() => {
                  setQuery("");
                  setFilter("All projects");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
          <div className="music-chat-dock">
            <ProjectChatDemo
              openRequest={openRequest}
              active={active}
              onActiveChange={setActive}
            />
          </div>
        </div>
        <footer className="mt-5 flex flex-wrap justify-between gap-3 text-xs text-text-tertiary">
          <span>Music Workspace · Built with Oreo UI</span>
          <a
            href="https://x.com/designflyio/status/2110182813714805096"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Design reference by Brad / @designflyio ↗
          </a>
        </footer>
      </main>
    </div>
  );
}
