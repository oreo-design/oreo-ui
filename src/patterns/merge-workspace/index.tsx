import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useReducer, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { PromptBox } from "@/components/prompt-box";
import { CodeDiff } from "@/components/code-diff";
import { AgentWorkspaceState } from "@/components/automation";
import {
  PullRequestCard,
  MergeStatusBadge,
  ChangeSummary,
  initialMergeRun,
  mergeReducer,
  isMergeBusy,
  type BranchCommit,
} from "@/components/merge-review";
import { MERGE_TITLE, SAMPLE_DIFF, commitsFor, checksFor } from "./data";
import "./workspace.css";

export function MergeWorkspacePage() {
  const [run, dispatch] = useReducer(mergeReducer, initialMergeRun);
  const [dark, setDark] = useThemeMode(false),
    [failNext, setFailNext] = useState(false),
    [draft, setDraft] = useState("");
  const [selected, setSelected] = useState<BranchCommit | null>(null),
    [notes, setNotes] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const reduced = useReducedMotion(),
    busy = isMergeBusy(run.phase);
  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(
      () => dispatch({ type: "tick", attempt: run.attempt }),
      run.phase === "creating" ? 1400 : 1100,
    );
    return () => clearTimeout(timer);
  }, [busy, run.phase, run.resolved, run.checksPassed, run.attempt]);
  function create() {
    dispatch({ type: "create", failChecks: failNext });
    setSelected(null);
    setNotes([]);
  }
  function submit(value: string) {
    if (!value.trim()) return;
    setDraft("");
    if (run.phase === "idle") {
      create();
    } else {
      setNotes((items) => [...items, value.trim()]);
    }
  }
  const commits = commitsFor(run),
    checks = checksFor(run);
  return (
    <div className={`merge-workspace ${dark ? "theme-dark" : ""}`}>
      <header className="mw-header">
        <a href="/" aria-label="Oreo UI home" className="mw-brand">
          o.
        </a>
        <div>
          <span className="mw-repository">
            <Icon name="folder" size="sm" /> acme-webapp
          </span>
          <span className="mw-slash">/</span>
          <span>Session refresh</span>
        </div>
        <div className="mw-header-actions">
          <span className="mw-local">Local demo</span>
          <a href="/pull-request-card">Components</a>
          <IconButton
            type="tertiary"
            size="sm"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => setDark((d) => !d)}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </div>
      </header>
      <main className="mw-main">
        <div className="mw-intro">
          <span className="mw-eyebrow">GENERATIVE UI / 02</span>
          <h1>A clear path to merge.</h1>
          <p>Follow your branch from conflict to confidence.</p>
        </div>
        <div className="mw-conversation">
          {run.phase === "idle" ? (
            <div className="mw-empty">
              <AgentWorkspaceState
                title="Your branch is ready for review"
                description="Create a sample pull request to explore its history, resolve conflicts and review checks."
                actionLabel="Create PR"
                onAction={create}
              />
            </div>
          ) : (
            <>
              <div className="mw-user-message">Create PR</div>
              <details className="mw-worked">
                <summary>
                  <Icon name="chevron-right" size="sm" />
                  {run.phase === "creating"
                    ? "Working on the pull request"
                    : "Worked for 5s"}
                </summary>
                <p>
                  Compared feat/session-refresh with main, inspected the commit
                  history and prepared a local review. All activity and check
                  results on this page are simulated.
                </p>
              </details>
              <motion.div
                initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
              >
                <PullRequestCard
                  title={MERGE_TITLE}
                  number={128}
                  phase={run.phase}
                  commits={commits}
                  checks={checks}
                  resolved={run.resolved}
                  onResolve={() => {
                    setSelected(null);
                    dispatch({ type: "resolve" });
                  }}
                  onMerge={() => {
                    setSelected(null);
                    dispatch({ type: "merge" });
                  }}
                  onRetry={() => dispatch({ type: "retry" })}
                  onCancel={() => dispatch({ type: "cancel" })}
                  selectedCommit={selected?.id}
                  onSelectCommit={(commit) =>
                    setSelected((current) =>
                      current?.id === commit.id ? null : commit,
                    )
                  }
                >
                  {selected && (
                    <section
                      className="mw-commit-detail"
                      aria-label="Selected commit"
                    >
                      <div>
                        <strong>{selected.title}</strong>
                        <IconButton
                          type="tertiary"
                          size="sm"
                          aria-label="Close commit details"
                          onClick={() => setSelected(null)}
                          icon={<Icon name="x" />}
                        />
                      </div>
                      <p>
                        <code>{selected.id}</code> · {selected.author} ·{" "}
                        {selected.time} · {selected.branch ?? "Commit"}
                      </p>
                      <p>
                        This local example uses a representative patch; it is
                        not the commit’s actual source.
                      </p>
                      <CodeDiff
                        title="middleware.ts · sample patch"
                        lines={SAMPLE_DIFF}
                      />
                    </section>
                  )}
                </PullRequestCard>
              </motion.div>
              {run.phase !== "creating" && (
                <p className="mw-explanation">
                  {run.phase === "merged" ? (
                    <>
                      PR <strong>#128</strong> is merged in this local demo. The
                      branch includes the latest session key changes and all
                      four sample checks passed.
                    </>
                  ) : run.phase === "ready" ? (
                    <>
                      The conflicts are resolved and all checks passed. Review
                      the history, then choose <strong>Merge</strong> when
                      you’re ready.
                    </>
                  ) : run.phase === "error" ? (
                    <>
                      The sample lint check failed. Open <strong>Lint</strong>{" "}
                      for details, then retry the checks.
                    </>
                  ) : (
                    <>
                      PR <strong>#128</strong> is open, but <code>main</code>{" "}
                      moved on while we worked. Lena’s session key rotation
                      changed the same lines in <code>auth.ts</code> and{" "}
                      <code>middleware.ts</code>. I can bring those changes in
                      and resolve them.
                    </>
                  )}
                </p>
              )}
            </>
          )}
          {notes.map((note, i) => (
            <div key={i} className="mw-note">
              <p>{note}</p>
              <span>Saved as a local review note</span>
            </div>
          ))}
          <div className="mw-composer">
            <div className="mw-context">
              {run.phase !== "idle" && (
                <MergeStatusBadge phase={run.phase} number={128} />
              )}
              <ChangeSummary additions={48} deletions={7}>
                <CodeDiff
                  title="middleware.ts · excerpt of sample changes"
                  lines={SAMPLE_DIFF}
                />
              </ChangeSummary>
            </div>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(event) => {
                setFiles(
                  Array.from(event.target.files ?? []).map((file) => file.name),
                );
                event.target.value = "";
              }}
            />
            <PromptBox
              onAttach={() => fileInput.current?.click()}
              onMention={() =>
                setDraft((value) => `${value}${value ? " " : ""}@Lena `)
              }
              attachments={
                files.length ? (
                  <div className="mw-files">
                    {files.map((name, i) => (
                      <span key={`${name}-${i}`}>
                        {name}
                        <IconButton
                          size="sm"
                          type="tertiary"
                          aria-label={`Remove ${name}`}
                          icon={<Icon name="x" />}
                          onClick={() =>
                            setFiles((current) =>
                              current.filter((_, index) => index !== i),
                            )
                          }
                        />
                      </span>
                    ))}
                    <small>File names only · nothing uploaded</small>
                  </div>
                ) : undefined
              }
              value={draft}
              onValueChange={setDraft}
              onSubmit={submit}
              running={busy && run.phase !== "merging"}
              onStop={() => dispatch({ type: "cancel" })}
              submitDisabled={run.phase === "merging"}
              placeholder={
                run.phase === "idle"
                  ? "Describe your pull request…"
                  : "Add a review note…"
              }
              modelSelect={
                <span className="mw-composer-context">
                  <Icon name="folder" size="sm" /> acme-webapp{" "}
                  <span>Local</span>
                </span>
              }
            />
            <div className="mw-demo-controls">
              <label>
                <input
                  type="checkbox"
                  checked={failNext}
                  disabled={run.phase !== "idle"}
                  onChange={(e) => setFailNext(e.target.checked)}
                />{" "}
                Simulate a failed check
              </label>
              <Button
                type="tertiary"
                size="sm"
                onClick={() => {
                  dispatch({ type: "reset" });
                  setSelected(null);
                  setNotes([]);
                  setDraft("");
                  setFiles([]);
                }}
              >
                Reset demo
              </Button>
            </div>
            <p className="mw-disclaimer">
              Sample data only. No repository, pull request or deployment is
              changed.
            </p>
          </div>
        </div>
      </main>
      <footer className="mw-attribution">
        An Oreo UI study of{" "}
        <a
          href="https://x.com/pitus_/status/2111519352503873866"
          target="_blank"
          rel="noreferrer"
        >
          Phil Pitus’s merge conflict interaction{" "}
          <Icon name="arrow-up-right" size="sm" />
        </a>
      </footer>
    </div>
  );
}
