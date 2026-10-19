import { useEffect, useReducer, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { CodeDiff } from "@/components/code-diff";
import {
  TestResults,
  initialTestRun,
  testRunReducer,
  summarizeTests,
  type TestCase,
} from "@/components/test-results";
import { SAMPLE_TESTS, FIX_LINES } from "./data";
import "./workspace.css";
export function TestWorkspacePage() {
  const [run, dispatch] = useReducer(
    testRunReducer,
    SAMPLE_TESTS,
    initialTestRun,
  );
  const [dark, setDark] = useState(false),
    [unavailable, setUnavailable] = useState(false),
    [fixed, setFixed] = useState<string[]>([]),
    [proposal, setProposal] = useState<readonly TestCase[]>([]);
  const busy = run.phase === "running",
    summary = summarizeTests(run.tests);
  useEffect(() => {
    if (!busy) return;
    const current = run.tests.find((t) => t.status === "running");
    if (!current) return;
    const timer = setTimeout(() => {
      if (unavailable) {
        dispatch({
          type: "error",
          runId: run.id,
          message:
            "The sample runner connection was interrupted. Retry to reconnect and run the suite.",
        });
        return;
      }
      const sample = SAMPLE_TESTS.find((t) => t.id === current.id)!;
      const result = fixed.includes(sample.id)
        ? {
            ...sample,
            status: "passed" as const,
            durationMs: 12,
            failure: undefined,
          }
        : sample;
      dispatch({
        type: "result",
        runId: run.id,
        result,
        elapsedMs: run.elapsedMs + (result.durationMs ?? 0),
      });
    }, 260);
    return () => clearTimeout(timer);
  }, [busy, run, unavailable, fixed]);
  function start(scope: "all" | "failed" = "all") {
    setProposal([]);
    dispatch({ type: "start", scope });
  }
  function reset() {
    dispatch({ type: "reset", tests: SAMPLE_TESTS });
    setFixed([]);
    setProposal([]);
    setUnavailable(false);
  }
  function applyFix() {
    setFixed((current) => [
      ...new Set([...current, ...proposal.map((t) => t.id)]),
    ]);
    setProposal([]);
    dispatch({ type: "start", scope: "failed" });
  }
  return (
    <div className={`test-workspace ${dark ? "theme-dark" : ""}`}>
      <header className="testws-header">
        <a href="/" aria-label="Oreo UI home" className="testws-brand">
          o.
        </a>
        <span className="testws-repo">
          <Icon name="folder" size="sm" />
          acme-store<span className="testws-divider">/</span>
          <span>Test session</span>
        </span>
        <div className="testws-header-actions">
          <span className="testws-demo-label">Local demo</span>
          <a href="/test-results">Components</a>
          <IconButton
            type="tertiary"
            size="sm"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => setDark((v) => !v)}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </div>
      </header>
      <main className="testws-main">
        <div className="testws-intro">
          <p className="testws-eyebrow">AGENT WORKSPACE / QUALITY</p>
          <h1>From failure to clarity.</h1>
          <p>A test run with the context to take the next step.</p>
        </div>
        <div className="testws-session-meta">
          <span>
            <Icon name="list-checks" size="sm" />
            Vitest · 5 files · 20 tests
          </span>
          <code>feat/cart-checkout</code>
        </div>
        {run.phase === "idle" ? (
          <div className="testws-empty">
            <AgentWorkspaceState
              title="Ready when you are"
              description="Run a sample suite, inspect failures, and explore a local fix and rerun."
              actionLabel="Run test suite"
              onAction={() => start()}
            />
          </div>
        ) : (
          <div className="testws-conversation">
            <div className="testws-user-message">
              Run the tests and show me what needs attention.
            </div>
            <div className="testws-assistant-intro">
              <span className="testws-agent-avatar">
                <Icon name="sparkle" size="sm" />
              </span>
              <p>
                {busy
                  ? "Running the suite. Results will appear below."
                  : run.phase === "stopped"
                    ? "Run stopped. Completed results are still available."
                    : run.phase === "error"
                      ? "The runner needs to reconnect."
                      : summary.failed
                        ? "The suite finished. Let’s look at the failures."
                        : "The suite finished. No failing tests remain."}
              </p>
            </div>
            <TestResults
              key={run.id}
              run={run}
              onRerun={() => start()}
              onRerunFailed={() => start("failed")}
              onStop={() => dispatch({ type: "stop" })}
              onAskFix={setProposal}
              onRetry={() => {
                setUnavailable(false);
                start();
              }}
            />
            {!!proposal.length && (
              <section className="testws-proposal" aria-label="Proposed sample fix">
                <h2>
                  <Icon name="sparkle" size="sm" />A focused fix
                </h2>
                <ul>
                  {proposal.map((test) => (
                    <li key={test.id}>
                      <strong>{test.name}</strong>
                      <p>
                        {test.failure?.kind === "timeout"
                          ? "Use an explicit cross-tab event in the test fixture instead of waiting for jsdom to emit a storage event."
                          : "Make applying a coupon idempotent so recalculating the cart does not apply the same discount twice."}
                      </p>
                    </li>
                  ))}
                </ul>
                {proposal.some((t) => t.failure?.kind === "assertion") && (
                  <CodeDiff
                    title="pricing.ts · illustrative patch"
                    lines={FIX_LINES}
                  />
                )}
                <p className="testws-fixture-note">
                  This demo updates local sample outcomes. It does not edit a
                  repository or run a real test process.
                </p>
                <div className="testws-proposal-actions">
                  <Button type="primary" size="sm" onClick={applyFix}>
                    Apply sample fix & rerun
                  </Button>
                  <Button
                    type="tertiary"
                    size="sm"
                    onClick={() => setProposal([])}
                  >
                    Dismiss
                  </Button>
                </div>
              </section>
            )}
            {run.phase === "complete" && (
              <p className="testws-result-note" role="status">
                {summary.failed
                  ? `${summary.failed} tests need attention. Inspect their expected values and source context, or ask for a focused sample fix.`
                  : `${summary.passed} passed${summary.skipped ? `, ${summary.skipped} intentionally skipped` : ""}. Expand the summary to review individual tests.`}
              </p>
            )}
          </div>
        )}
        <div className="testws-demo-controls">
          <label>
            <input
              type="checkbox"
              checked={unavailable}
              disabled={busy}
              onChange={(e) => setUnavailable(e.target.checked)}
            />
            Simulate unavailable runner
          </label>
          <Button type="tertiary" size="sm" onClick={reset}>
            Reset demo
          </Button>
        </div>
        <footer className="testws-footer">
          <span>Sample data · local interactions</span>
          <a
            href="https://x.com/preetsuthar17/status/2111694212857266430"
            target="_blank"
            rel="noreferrer"
          >
            Inspired by Preet Suthar <Icon name="arrow-up-right" size="sm" />
          </a>
        </footer>
      </main>
    </div>
  );
}
