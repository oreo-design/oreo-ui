import { useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import {
  AgentInboxBoard,
  filterRuns,
  transitionRun,
  RUN_LABELS,
  type InboxRun,
  type RunStatus,
} from "@/components/agent-inbox";
import { INITIAL_RUNS } from "./data";
import "./agent-inbox-page.css";
export function AgentInboxPage() {
  const [runs, setRuns] = useState(INITIAL_RUNS),
    [undo, setUndo] = useState<InboxRun[] | null>(null),
    [view, setView] = useState<"board" | "list">("board"),
    [expanded, setExpanded] = useState<string | null>(null),
    [query, setQuery] = useState(""),
    [dark, setDark] = useState(false),
    [notice, setNotice] = useState("");
  const visible = filterRuns(runs, query);
  function change(id: string, status: RunStatus) {
    const next = transitionRun(runs, id, status, crypto.randomUUID());
    if (next === runs) return;
    setUndo(runs);
    setRuns(next);
    setNotice(
      `${runs.find((r) => r.id === id)?.title}: ${RUN_LABELS[status]}. Demo only.`,
    );
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="ai-page">
        <header className="ai-sitebar">
          <a href="/agent-inbox-board">
            <OreoLogo className="h-5 w-8" />
            <span>
              Oreo UI <span className="text-text-tertiary">/ Templates</span>
            </span>
          </a>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <main className="ai-page-main">
          <div className="ai-intro">
            <div>
              <p className="ai-eyebrow">YOUR AGENTS, AT A GLANCE</p>
              <h2>A little less oversight.</h2>
              <p>Keep work moving. Step in where it matters.</p>
            </div>
            <div className="ai-local">
              <span />
              Local demo · resets on reload
            </div>
          </div>
          <div className="ai-tools">
            <label className="ai-search">
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search agent runs"
                placeholder="Search runs, models, statuses…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span className="text-xs text-text-tertiary">
              {visible.length} of {runs.length} runs
            </span>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              disabled={!undo}
              onClick={() => {
                if (undo) {
                  setRuns(undo);
                  setUndo(null);
                  setNotice("Previous demo change restored.");
                }
              }}
            >
              Undo
            </Button>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={() => {
                setUndo(runs);
                setRuns(INITIAL_RUNS);
                setQuery("");
                setExpanded(null);
                setNotice("Demo reset. Undo is available.");
              }}
            >
              Reset demo
            </Button>
          </div>
          <AgentInboxBoard
            runs={visible}
            view={view}
            onViewChange={setView}
            expandedId={expanded}
            onExpandedChange={setExpanded}
            onStatusChange={change}
            filtered={!!query.trim()}
            onClearFilters={() => setQuery("")}
          />
          <p className="ai-notice" role="status">
            {notice ||
              "Open a run for activity and actions. Drag its handle to change groups."}
          </p>
          <footer className="ai-page-footer">
            <span>Sample runs · no connected agents or external actions</span>
            <a
              href="https://x.com/componest/status/2110750797755773328"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by @flohoeller via Componest ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
