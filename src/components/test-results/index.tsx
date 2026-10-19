import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { StatusIcon, type StatusIconState } from "@/components/status-icon";
import { CodeBlock } from "@/components/code-block";
import { AgentWorkspaceState } from "@/components/automation";
import {
  summarizeTests,
  matchesTest,
  durationLabel,
  failureText,
  type TestRun,
  type TestStatus,
  type TestCase,
  type TestFilter,
  type StackFrame,
} from "./model";
import "./test-results.css";
export * from "./model";
const states: Record<TestStatus, StatusIconState> = {
  queued: "backlog",
  running: "in-progress",
  passed: "done",
  failed: "canceled",
  skipped: "blocked",
};
const labels: Record<TestStatus, string> = {
  queued: "Queued",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  skipped: "Skipped",
};
function TestMark({ status }: { status: TestStatus }) {
  return (
    <StatusIcon
      status={states[status]}
      monochrome
      size="sm"
      aria-label={labels[status]}
      className="tres-status"
      data-test-status={status}
    />
  );
}
function RollingCount({ value }: { value: number }) {
  const reduced = useReducedMotion();
  return (
    <span className="tres-count" aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: reduced ? 0 : "75%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduced ? 0 : "-75%", opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
/** Summary is controlled. Counts always derive from the same test records as the list. */
export function TestRunSummary({
  run,
  open = true,
  onOpenChange,
  controlsId,
}: {
  run: TestRun;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  controlsId?: string;
}) {
  const s = summarizeTests(run.tests);
  const running = run.phase === "running";
  const status: TestStatus = !s.total
    ? "queued"
    : running
      ? "running"
      : s.failed || run.phase === "error"
        ? "failed"
        : run.phase === "complete" && !s.queued
          ? "passed"
          : "queued";
  const caption = !s.total
    ? "No tests found"
    : running
      ? `Running tests · ${s.completed} of ${s.total}`
      : run.phase === "idle"
        ? `${s.total} tests ready`
        : run.phase === "error"
          ? "Test runner unavailable"
          : `${run.phase === "stopped" ? "Stopped · " : ""}${s.passed} passed${s.failed ? `, ${s.failed} failed` : ""}${s.skipped ? `, ${s.skipped} skipped` : ""}${s.queued ? `, ${s.queued} queued` : ""} in ${durationLabel(run.elapsedMs)}`;
  const content = (
    <>
      <TestMark status={status} />
      <span className="tres-summary-label">
        {running ? (
          <>
            <span aria-hidden="true">
              Running tests · <RollingCount value={s.completed} /> of {s.total}
            </span>
            <span className="sr-only">{caption}</span>
          </>
        ) : (
          caption
        )}
      </span>
      {onOpenChange && (
        <Icon name={open ? "chevron-up" : "chevron-down"} size="sm" />
      )}
    </>
  );
  return (
    <div className="tres-summary">
      {onOpenChange ? (
        <button
          type="button"
          className="tres-summary-trigger"
          onClick={() => onOpenChange(!open)}
          aria-expanded={open}
          aria-controls={controlsId}
        >
          {content}
        </button>
      ) : (
        <div className="tres-summary-trigger">{content}</div>
      )}
      <div
        className="tres-progress"
        role="progressbar"
        aria-label="Test progress"
        aria-valuemin={0}
        aria-valuemax={s.total || 1}
        aria-valuenow={s.completed}
        aria-valuetext={`${s.completed} of ${s.total} completed; ${s.passed} passed, ${s.failed} failed, ${s.skipped} skipped`}
      >
        {(["passed", "failed", "skipped"] as const).map((kind) => (
          <span
            key={kind}
            data-kind={kind}
            style={{ width: `${s.total ? (100 * s[kind]) / s.total : 0}%` }}
          />
        ))}
      </div>
    </div>
  );
}
export function TestResultFilters({
  tests,
  value,
  onChange,
  actions,
}: {
  tests: readonly TestCase[];
  value: TestFilter;
  onChange: (filter: TestFilter) => void;
  actions?: ReactNode;
}) {
  const s = summarizeTests(tests);
  return (
    <div className="tres-toolbar">
      <div className="tres-filters" role="group" aria-label="Show tests">
        {(["all", "failed", "skipped", "slow"] as const).map((filter) => (
          <Button
            key={filter}
            type={value === filter ? "secondary" : "tertiary"}
            size="sm"
            tapScale={1}
            aria-pressed={value === filter}
            onClick={() => onChange(filter)}
          >
            {filter[0].toUpperCase() + filter.slice(1)}{" "}
            <span className="tres-filter-count">
              {filter === "all" ? s.total : s[filter]}
            </span>
          </Button>
        ))}
      </div>
      {actions}
    </div>
  );
}
export function TestStackTrace({ frames }: { frames: readonly StackFrame[] }) {
  const own = frames.filter((f) => !f.framework),
    framework = frames.filter((f) => f.framework);
  const render = (f: StackFrame, i: number) => (
    <li key={`${f.file}:${f.line}:${i}`}>
      <code className="tres-frame-location">
        {f.file}:{f.line}
        {f.column ? `:${f.column}` : ""}
      </code>
      {f.code && (
        <CodeBlock
          title={f.file}
          language="typescript"
          code={f.code}
          copyable={false}
        />
      )}
    </li>
  );
  return (
    <div className="tres-stack">
      <ol aria-label="Application stack frames">{own.map(render)}</ol>
      {!!framework.length && (
        <details className="tres-framework">
          <summary>
            <Icon name="chevron-right" size="sm" />
            {framework.length} framework{" "}
            {framework.length === 1 ? "frame" : "frames"}
          </summary>
          <ol aria-label="Framework stack frames">{framework.map(render)}</ol>
        </details>
      )}
    </div>
  );
}
function CopyFailures({
  tests,
  label = "Copy failures",
}: {
  tests: readonly TestCase[];
  label?: string;
}) {
  const [feedback, setFeedback] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(tests.map(failureText).join("\n\n"));
      setFeedback("Copied");
    } catch {
      setFeedback("Copy unavailable. Select the failure text to copy it.");
    }
  }
  return (
    <span className="tres-copy">
      <IconButton
        type="tertiary"
        size="sm"
        aria-label={label}
        onClick={copy}
        icon={<Icon name="copy" size="sm" />}
      />
      <span
        role="status"
        className={
          feedback.length > 12 ? "tres-copy-error" : "tres-copy-feedback"
        }
      >
        {feedback}
      </span>
    </span>
  );
}
export function TestFailureDetail({
  test,
  onAskFix,
}: {
  test: TestCase;
  onAskFix?: (test: TestCase) => void;
}) {
  const failure = test.failure;
  if (!failure) return null;
  return (
    <div className="tres-failure">
      <p className="tres-error-kind">
        {failure.kind === "timeout"
          ? "Timeout"
          : failure.kind === "snapshot"
            ? "Snapshot mismatch"
            : "Assertion error"}
      </p>
      <p className="tres-error-message">{failure.message}</p>
      {(failure.expected !== undefined || failure.received !== undefined) && (
        <div
          className="tres-comparison"
          aria-label="Expected and received values"
        >
          {failure.expected !== undefined && (
            <div data-kind="expected">
              <span>Expected</span>
              <pre>{failure.expected}</pre>
            </div>
          )}
          {failure.received !== undefined && (
            <div data-kind="received">
              <span>Received</span>
              <pre>{failure.received}</pre>
            </div>
          )}
        </div>
      )}
      <TestStackTrace frames={failure.frames} />
      <div className="tres-failure-actions">
        <CopyFailures tests={[test]} label={`Copy failure: ${test.name}`} />
        {onAskFix && (
          <Button
            type="tertiary"
            size="sm"
            leadingIcon={<Icon name="sparkle" size="sm" />}
            onClick={() => onAskFix(test)}
          >
            Ask to fix
          </Button>
        )}
      </div>
    </div>
  );
}
/** Caller owns disclosure; a user's explicit open/closed choice survives streamed updates. */
export function TestFileGroup({
  file,
  tests,
  filter = "all",
  open,
  onOpenChange,
  onAskFix,
}: {
  file: string;
  tests: readonly TestCase[];
  filter?: TestFilter;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAskFix?: (test: TestCase) => void;
}) {
  const id = useId(),
    s = summarizeTests(tests);
  const visible = tests.filter((t) => matchesTest(t, filter));
  const status: TestStatus = s.running
    ? "running"
    : s.failed
      ? "failed"
      : s.queued
        ? "queued"
        : s.passed
          ? "passed"
          : "skipped";
  if (!visible.length) return null;
  const groups = [...new Set(visible.map((t) => t.group))];
  const time = tests.reduce((total, t) => total + (t.durationMs ?? 0), 0);
  return (
    <section className="tres-file">
      <button
        type="button"
        className="tres-file-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
      >
        <TestMark status={status} />
        <code>{file}</code>
        <span className="tres-file-count">
          {s.failed ? `${s.failed} failed · ` : ""}
          {s.completed < tests.length ? `${s.completed} of ` : ""}
          {tests.length} tests
        </span>
        <span className="tres-duration">
          {time ? durationLabel(time) : "Queued"}
        </span>
        <Icon name={open ? "chevron-up" : "chevron-down"} size="sm" />
      </button>
      <div id={id} hidden={!open} className="tres-file-body">
        {groups.map((group) => (
          <section aria-label={group} key={group} className="tres-test-group">
            <h3>{group}</h3>
            <ul>
              {visible
                .filter((t) => t.group === group)
                .map((test) => (
                  <li key={test.id}>
                    {test.status === "failed" && test.failure ? (
                      <details className="tres-test-failure" open>
                        <summary>
                          <TestMark status={test.status} />
                          <span>{test.name}</span>
                          <span className="tres-duration">
                            {durationLabel(test.durationMs ?? 0)}
                          </span>
                          <Icon name="chevron-down" size="sm" />
                        </summary>
                        <TestFailureDetail test={test} onAskFix={onAskFix} />
                      </details>
                    ) : (
                      <div className="tres-test-row">
                        <TestMark status={test.status} />
                        <span>{test.name}</span>
                        <span className="tres-duration">
                          {test.status === "skipped"
                            ? "Skipped"
                            : test.durationMs !== undefined
                              ? durationLabel(test.durationMs)
                              : labels[test.status]}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
export type TestResultsProps = {
  run: TestRun;
  onRerun?: () => void;
  onRerunFailed?: () => void;
  onStop?: () => void;
  onAskFix?: (tests: readonly TestCase[]) => void;
  onRetry?: () => void;
};
export function TestResults({
  run,
  onRerun,
  onRerunFailed,
  onStop,
  onAskFix,
  onRetry,
}: TestResultsProps) {
  const [filter, setFilter] = useState<TestFilter>("all"),
    [manualOpen, setManualOpen] = useState<boolean | null>(null),
    [fileOpen, setFileOpen] = useState<Record<string, boolean>>({});
  const id = useId(),
    s = summarizeTests(run.tests),
    busy = run.phase === "running";
  const open =
    manualOpen ??
    (!run.tests.length || run.phase !== "complete" || !!s.failed || !!s.queued);
  const failures = run.tests.filter((t) => t.status === "failed"),
    files = [...new Set(run.tests.map((t) => t.file))];
  return (
    <section className="test-results" aria-label="Test results">
      <TestRunSummary
        run={run}
        open={open}
        onOpenChange={setManualOpen}
        controlsId={id}
      />
      <div className="sr-only" role="status">
        {run.phase === "complete"
          ? `Run complete. ${s.passed} passed, ${s.failed} failed, ${s.skipped} skipped.`
          : run.phase === "stopped"
            ? "Test run stopped."
            : busy
              ? "Test run started."
              : ""}
      </div>
      <div id={id} hidden={!open}>
        {run.phase === "error" ? (
          <AgentWorkspaceState
            error
            title="Couldn't start the test runner"
            description={run.error ?? "Please try again."}
            actionLabel={onRetry ? "Retry run" : undefined}
            onAction={onRetry}
          />
        ) : !run.tests.length ? (
          <AgentWorkspaceState
            title="No tests in this run"
            description="Add tests to your suite to see results here."
          />
        ) : (
          <>
            <TestResultFilters
              tests={run.tests}
              value={filter}
              onChange={setFilter}
              actions={
                failures.length ? <CopyFailures tests={failures} /> : undefined
              }
            />
            {!run.tests.some((t) => matchesTest(t, filter)) ? (
              <AgentWorkspaceState
                title={`No ${filter} tests`}
                description={
                  filter === "slow"
                    ? "No completed test took 500ms or longer."
                    : "Try All to see the full suite."
                }
                actionLabel="Show all tests"
                onAction={() => setFilter("all")}
              />
            ) : (
              <div className="tres-files">
                {files.map((file) => {
                  const tests = run.tests.filter((t) => t.file === file);
                  const stats = summarizeTests(tests);
                  return (
                    <TestFileGroup
                      key={file}
                      file={file}
                      tests={tests}
                      filter={filter}
                      open={
                        fileOpen[file] ??
                        (filter !== "all" || !!stats.failed || !!stats.running)
                      }
                      onOpenChange={(value) =>
                        setFileOpen((current) => ({
                          ...current,
                          [file]: value,
                        }))
                      }
                      onAskFix={
                        !busy && onAskFix
                          ? (test) => onAskFix([test])
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <div className="tres-actions">
        {busy ? (
          onStop && (
            <Button type="secondary" size="sm" onClick={onStop}>
              Stop run
            </Button>
          )
        ) : (
          <>
            {onRerun && (
              <Button
                type="secondary"
                size="sm"
                leadingIcon={<Icon name="refresh" size="sm" />}
                onClick={onRerun}
              >
                Run all tests
              </Button>
            )}
            {!!failures.length && onRerunFailed && (
              <Button type="secondary" size="sm" onClick={onRerunFailed}>
                Rerun failed
              </Button>
            )}
            {!!failures.length && onAskFix && (
              <Button
                type="primary"
                size="sm"
                leadingIcon={<Icon name="sparkle" size="sm" />}
                onClick={() => onAskFix(failures)}
              >
                Ask to fix {failures.length === 1 ? "failure" : "failures"}
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
