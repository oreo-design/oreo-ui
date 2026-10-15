import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { TreeStepper, getTreeSteps } from "@/components/tree-stepper";
import { StepProgress } from "@/components/step-progress";
import { AgentWorkspaceState } from "@/components/automation";
import { REVIEW_TREE, CHECK_EVIDENCE } from "./data";
import "./security-review.css";

type ReviewAnswer = { outcome: "clear" | "follow-up"; note: string };
const INITIAL: Record<string, ReviewAnswer> = {
  devices: { outcome: "clear", note: "Sample inventory reviewed." },
  ownership: { outcome: "clear", note: "Shared lab devices assigned to IT." },
  overview: { outcome: "clear", note: "Scope confirmed." },
};
const STEPS = getTreeSteps(REVIEW_TREE);
export function SecurityReview() {
  const [dark, setDark] = useState(true);
  const [value, setValue] = useState("suspicious");
  const [answers, setAnswers] = useState<Record<string, ReviewAnswer>>(INITIAL);
  const [drafts, setDrafts] = useState<Record<string, Partial<ReviewAnswer>>>(
    {},
  );
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const outcomeGroup = useRef<HTMLFieldSetElement>(null);
  const index = STEPS.findIndex((s) => s.node.id === value);
  const step = STEPS[index];
  const branch = step.parents.at(-1)!;
  const branchSteps = STEPS.filter((s) => s.parents.at(-1)?.id === branch.id);
  const evidence = CHECK_EVIDENCE[value];
  const draft = drafts[value] ?? answers[value] ?? {};
  const completed = Object.keys(answers);
  const attention = completed.filter(
    (id) => answers[id].outcome === "follow-up",
  );
  const dirty = Object.keys(drafts).filter(
    (id) =>
      drafts[id].outcome !== answers[id]?.outcome ||
      drafts[id].note !== answers[id]?.note,
  );
  function go(id: string) {
    setValue(id);
    setError("");
    setFinished(false);
    setShowSteps(false);
  }
  useEffect(() => {
    if (finished) result.current?.focus();
    else heading.current?.focus({ preventScroll: true });
  }, [value, finished]);
  function update(next: Partial<ReviewAnswer>) {
    setDrafts((d) => ({ ...d, [value]: { ...draft, ...next } }));
    setError("");
    setNotice("");
  }
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.outcome) {
      setError("Choose an outcome before continuing.");
      outcomeGroup.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    if (draft.outcome === "follow-up" && !draft.note?.trim()) {
      setError("Add a note with the next action for this follow-up.");
      noteInput.current?.focus();
      return;
    }
    const next = {
      ...answers,
      [value]: { outcome: draft.outcome, note: draft.note?.trim() ?? "" },
    };
    setAnswers(next);
    setDrafts((d) => {
      const copy = { ...d };
      delete copy[value];
      return copy;
    });
    setError("");
    setNotice(`${step.node.label} saved in this page.`);
    if (index < STEPS.length - 1) {
      go(STEPS[index + 1].node.id);
      return;
    }
    const pending = STEPS.find(
      (s) =>
        !next[s.node.id] ||
        dirty.some((id) => id === s.node.id && id !== value),
    );
    if (pending) {
      go(pending.node.id);
      setNotice("Continue with the remaining checks before finishing.");
      return;
    }
    setFinished(true);
  }
  function reset() {
    setAnswers({});
    setDrafts({});
    setValue(STEPS[0].node.id);
    setError("");
    setFinished(false);
    setNotice("Practice review restarted.");
    setShowSteps(false);
  }
  return (
    <div className={`security-review ${dark ? "theme-dark" : ""}`}>
      <header className="sr-top">
        <a href="/tree-stepper" className="sr-brand">
          <Icon name="list-checks" />
          <span>
            Oreo UI{" "}
            <span className="text-text-tertiary font-normal">
              / Review workspace
            </span>
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span className="sr-local">Sample workspace</span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark((v) => !v)}
          />
        </div>
      </header>
      <main className="sr-main">
        <div className="sr-intro">
          <div>
            <p className="sr-eyebrow">WORKSPACE REVIEW · 001</p>
            <h1>A clear path through every check.</h1>
            <p>One branch at a time. Keep the important details in view.</p>
          </div>
          <Tag color="mint">In this page only</Tag>
        </div>
        <div className="sr-workspace">
          <aside className="sr-sidebar" aria-label="Review navigation">
            <div className="sr-sidebar-head">
              <div className="flex items-center justify-between gap-3">
                <h2>Security review</h2>
                <button
                  className="sr-mobile-toggle"
                  type="button"
                  aria-expanded={showSteps}
                  aria-controls="review-step-tree"
                  onClick={() => setShowSteps((v) => !v)}
                >
                  {showSteps ? "Hide steps" : "Show steps"}
                  <Icon name="chevron-down" size="sm" />
                </button>
              </div>
              <StepProgress completed={completed.length} total={STEPS.length} />
            </div>
            <div
              id="review-step-tree"
              className={`sr-tree-scroll ${showSteps ? "sr-tree-open" : ""}`}
            >
              <TreeStepper
                nodes={REVIEW_TREE}
                value={value}
                onValueChange={go}
                completed={completed}
                attention={attention}
              />
            </div>
            <div className="sr-sidebar-foot">
              <Icon name="info" size="sm" />
              <p>
                Illustrative checks and evidence.
                <br />
                Nothing is scanned or changed.
              </p>
            </div>
          </aside>
          <section className="sr-content" aria-label="Current check">
            {finished ? (
              <div className="sr-complete">
                <span className="sr-complete-icon">
                  <Icon name="check" />
                </span>
                <h2 ref={result} tabIndex={-1}>
                  Review complete.
                </h2>
                <p>All {STEPS.length} checks have a recorded outcome.</p>
                <div className="sr-result-counts">
                  <div>
                    <strong>{completed.length - attention.length}</strong>
                    <span>Reviewed · clear</span>
                  </div>
                  <div>
                    <strong>{attention.length}</strong>
                    <span>Need follow-up</span>
                  </div>
                </div>
                {attention.length > 0 ? (
                  <div className="sr-followups">
                    <h3>Keep these on your radar</h3>
                    {attention.map((id) => (
                      <button key={id} type="button" onClick={() => go(id)}>
                        <span>
                          {STEPS.find((s) => s.node.id === id)?.node.label}
                        </span>
                        <Icon name="arrow-up-right" size="sm" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <AgentWorkspaceState
                    title="No follow-ups recorded"
                    description="All sample checks were marked clear."
                  />
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => go(STEPS[0].node.id)}
                  >
                    Review answers
                  </Button>
                  <Button type="tertiary" tapScale={1} onClick={reset}>
                    Start fresh
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="sr-check-top">
                  <div className="sr-breadcrumb">
                    {step.parents.map((p) => (
                      <span key={p.id}>{p.label}</span>
                    ))}
                  </div>
                  <span className="sr-check-number">
                    Check{" "}
                    {branchSteps.findIndex((s) => s.node.id === value) + 1} of{" "}
                    {branchSteps.length}
                  </span>
                </div>
                <header className="sr-check-heading">
                  <div className="sr-check-glyph">
                    <Icon name="list-checks" />
                  </div>
                  <div>
                    <h2 ref={heading} tabIndex={-1}>
                      {step.node.label}
                    </h2>
                    <p>{evidence.description}</p>
                  </div>
                </header>
                <div className="sr-evidence">
                  <div className="sr-evidence-title">
                    <h3>Evidence snapshot</h3>
                    <Tag>Sample data</Tag>
                  </div>
                  <dl>
                    {evidence.rows.map(([label, text]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="sr-guidance">
                  <Icon name="info" size="sm" />
                  <p>{evidence.guidance}</p>
                </div>
                <form onSubmit={save} noValidate>
                  <fieldset ref={outcomeGroup} className="sr-outcome">
                    <legend>Your outcome</legend>
                    <div className="sr-outcome-options">
                      {(["clear", "follow-up"] as const).map((outcome) => (
                        <label key={outcome} className="sr-outcome-choice">
                          <input
                            type="radio"
                            name={`outcome-${value}`}
                            checked={draft.outcome === outcome}
                            onChange={() => update({ outcome })}
                          />
                          <span>
                            <strong>
                              {outcome === "clear"
                                ? "Reviewed · clear"
                                : "Needs follow-up"}
                            </strong>
                            <small>
                              {outcome === "clear"
                                ? "No action needed for this sample."
                                : "Keep a next action with this check."}
                            </small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="sr-note-label" htmlFor="review-note">
                    Review note{" "}
                    <span>
                      {draft.outcome === "follow-up"
                        ? "Required for follow-up"
                        : "Optional"}
                    </span>
                  </label>
                  <textarea
                    ref={noteInput}
                    id="review-note"
                    rows={3}
                    maxLength={2000}
                    value={draft.note ?? ""}
                    onChange={(e) => update({ note: e.target.value })}
                    placeholder="Add context, an owner, or a next action…"
                    aria-describedby={error ? "review-error" : undefined}
                  />
                  {error && (
                    <p role="alert" id="review-error" className="sr-form-error">
                      {error}
                    </p>
                  )}
                  <div className="sr-controls">
                    <Button
                      type="secondary"
                      tapScale={1}
                      disabled={index === 0}
                      leadingIcon={<Icon name="chevron-left" size="sm" />}
                      onClick={() => go(STEPS[index - 1].node.id)}
                    >
                      Previous
                    </Button>
                    <span>
                      {drafts[value]
                        ? "Draft kept in this page"
                        : answers[value]
                          ? "Previously reviewed"
                          : "Not reviewed yet"}
                    </span>
                    <Button
                      render={<button type="submit" />}
                      tapScale={1}
                      trailingIcon={
                        <Icon
                          name={
                            index === STEPS.length - 1
                              ? "check"
                              : "chevron-right"
                          }
                          size="sm"
                        />
                      }
                    >
                      {index === STEPS.length - 1
                        ? "Finish review"
                        : "Save & next"}
                    </Button>
                  </div>
                </form>
              </>
            )}
            <p role="status" className="sr-notice">
              {notice}
            </p>
          </section>
        </div>
      </main>
      <footer className="sr-footer">
        <span>Security Review · Local demo · Resets on reload</span>
        <a
          href="https://x.com/FaizalSukaimi/status/2110366307787108463"
          target="_blank"
          rel="noreferrer"
        >
          Tree stepper reference by Faizal ↗
        </a>
      </footer>
    </div>
  );
}
