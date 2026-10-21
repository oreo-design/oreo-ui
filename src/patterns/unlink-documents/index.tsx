import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useReducer, useRef, useState, useEffect } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { DocumentEmpty } from "@/components/document-activity";
import {
  LinkedDocumentsSelector,
  LinkedDocumentsList,
  LinkedDocumentDetails,
} from "@/components/linked-documents";
import { linkReducer } from "@/components/linked-documents/model";
import { OreoLogo } from "@/docs/OreoLogo";
import { SAMPLE_DOCUMENTS } from "./data";
import "./workspace.css";
export function UnlinkDocumentsPage() {
  const [state, dispatch] = useReducer(linkReducer, {
    documents: SAMPLE_DOCUMENTS,
    selectedId: SAMPLE_DOCUMENTS[0].id,
    removed: [],
    notice: "",
  });
  const [dark, setDark] = useThemeMode(false),
    [tab, setTab] = useState("Condition"),
    [scenario, setScenario] = useState("ready"),
    [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const detailHeading = useRef<HTMLHeadingElement>(null),
    [focusDetail, setFocusDetail] = useState(0);
  const selected = state.documents.find((d) => d.id === state.selectedId),
    undo = () => dispatch({ type: "undo" });
  useEffect(() => {
    if (focusDetail) detailHeading.current?.focus();
  }, [focusDetail]);
  const decision = selected ? reviewed[selected.id] : false;
  const linkProps = {
    documents: state.documents,
    selectedId: state.selectedId,
    onSelect: (id: string) => dispatch({ type: "select", id }),
    onUnlink: (id: string) => dispatch({ type: "unlink", id }),
    onInfo: (id: string) => {
      dispatch({ type: "select", id });
      setTab("Details");
      setFocusDetail((n) => n + 1);
    },
    loading: scenario === "loading",
    error:
      scenario === "error"
        ? "The sample connection was interrupted."
        : undefined,
    onRetry: () => setScenario("ready"),
    footer: (
      <>
        <span>{state.documents.length} linked · Originals kept</span>
        {state.removed.length > 0 && (
          <Button size="sm" type="tertiary" onClick={undo}>
            Undo unlink
          </Button>
        )}
      </>
    ),
  };
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="uld-page">
        <header className="uld-sitebar">
          <a href="/linked-documents">
            <OreoLogo className="w-8 h-5" /> Oreo UI{" "}
            <span>/ Document review</span>
          </a>
          <div>
            <IconButton
              type="tertiary"
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
            <Button
              type="secondary"
              size="sm"
              onClick={() => {
                dispatch({ type: "reset", documents: SAMPLE_DOCUMENTS });
                setScenario("ready");
                setReviewed({});
              }}
            >
              Reset demo
            </Button>
          </div>
        </header>
        <main className="uld-workspace">
          <header className="uld-heading">
            <div>
              <p className="uld-eyebrow">APPLICATION / OR-1026</p>
              <h1>Document review</h1>
              <p>
                Acme Inc. <span>·</span> Jamie Morgan
              </p>
            </div>
            <span className="uld-status">
              <Icon name="circle-dashed" size="sm" /> In review
            </span>
          </header>
          <div className="uld-grid">
            <section className="uld-viewer" aria-label="Document preview">
              <header className="uld-viewer-toolbar">
                <span className="uld-muted">Preview</span>
                <LinkedDocumentsSelector {...linkProps} />
              </header>
              <div className="uld-paper-stage">
                {scenario === "error" ? (
                  <DocumentEmpty
                    title="Preview unavailable"
                    description="Try the sample connection again."
                    actionLabel="Try again"
                    onReset={() => setScenario("ready")}
                  />
                ) : scenario === "loading" ? (
                  <div className="uld-paper" role="status">
                    <p>Loading document…</p>
                    <div className="ldoc-skeleton" />
                    <div className="ldoc-skeleton" />
                    <div className="ldoc-skeleton" />
                  </div>
                ) : selected ? (
                  <article className="uld-paper">
                    <header>
                      <span className="uld-paper-brand">
                        <Icon name="columns" /> NORTHLINE
                      </span>
                      <span>DEMO DOCUMENT</span>
                    </header>
                    <p className="uld-eyebrow">{selected.kind.toUpperCase()}</p>
                    <h2>{selected.kind}</h2>
                    <p className="uld-period">October 01 – October 31, 2026</p>
                    <div className="uld-document-meta">
                      <div>
                        <span>Prepared for</span>
                        <strong>Jamie Morgan</strong>
                        <p>
                          1810 Shoreham Lane
                          <br />
                          San Francisco, CA 94110
                        </p>
                      </div>
                      <div>
                        <span>Reference number</span>
                        <strong>OR-1026</strong>
                        <p>Issued October 18, 2026</p>
                      </div>
                    </div>
                    {selected.id === "statement" ? (
                      <>
                        <div className="uld-balances">
                          {[
                            ["Opening balance", "$28,740.00"],
                            ["Money in", "$14,736.84"],
                            ["Closing balance", "$42,810.22"],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <span>{label}</span>
                              <strong>{value}</strong>
                            </div>
                          ))}
                        </div>
                        <div className="uld-table-scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                [
                                  "Oct 04",
                                  "Acme Inc · Payroll",
                                  "+$3,118.42",
                                  "$31,858.42",
                                ],
                                [
                                  "Oct 08",
                                  "Transfer received",
                                  "+$8,500.00",
                                  "$40,358.42",
                                ],
                                [
                                  "Oct 12",
                                  "Utilities",
                                  "−$184.60",
                                  "$40,173.82",
                                ],
                                [
                                  "Oct 18",
                                  "Acme Inc · Payroll",
                                  "+$3,118.42",
                                  "$43,292.24",
                                ],
                                [
                                  "Oct 22",
                                  "Card payment",
                                  "−$482.02",
                                  "$42,810.22",
                                ],
                              ].map((row) => (
                                <tr key={row[0]}>
                                  {row.map((v) => (
                                    <td key={v}>{v}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="uld-document-body">
                        <h3>
                          {selected.name
                            .replace(/\.pdf$/, "")
                            .replaceAll("_", " ")}
                        </h3>
                        <p>
                          This illustrative {selected.kind.toLowerCase()} is
                          attached to application OR-1026 for document review.
                        </p>
                        <dl>
                          <dt>Account holder</dt>
                          <dd>Jamie Morgan</dd>
                          <dt>Organization</dt>
                          <dd>Acme Inc.</dd>
                          <dt>Document status</dt>
                          <dd>Ready for review</dd>
                        </dl>
                        <p>
                          The original stays in the library when its link to
                          this application is removed.
                        </p>
                      </div>
                    )}
                    <footer>
                      <span>Illustrative data · No financial records</span>
                      <span>1 / 1</span>
                    </footer>
                  </article>
                ) : (
                  <DocumentEmpty
                    title="No document selected"
                    description="All files have been unlinked from this review."
                    actionLabel="Undo last unlink"
                    onReset={state.removed.length ? undo : undefined}
                  />
                )}
              </div>
            </section>
            <aside className="uld-inspector">
              <div
                className="uld-tabs"
                role="tablist"
                aria-label="Review panels"
              >
                {["Condition", "Documents", "Details"].map((name, i) => (
                  <button
                    role="tab"
                    key={name}
                    id={`uld-tab-${name}`}
                    aria-controls="uld-panel"
                    aria-selected={tab === name}
                    tabIndex={tab === name ? 0 : -1}
                    onClick={() => setTab(name)}
                    onKeyDown={(e) => {
                      if (
                        ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                          e.key,
                        )
                      ) {
                        e.preventDefault();
                        const next =
                          e.key === "Home"
                            ? 0
                            : e.key === "End"
                              ? 2
                              : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                        const names = ["Condition", "Documents", "Details"];
                        setTab(names[next]);
                        document
                          .getElementById(`uld-tab-${names[next]}`)
                          ?.focus();
                      }
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <div
                className="uld-panel"
                id="uld-panel"
                role="tabpanel"
                aria-labelledby={`uld-tab-${tab}`}
              >
                {tab === "Documents" ? (
                  <>
                    <h2>Linked documents</h2>
                    <p className="uld-muted">
                      Keep the files relevant to this review.
                    </p>
                    <LinkedDocumentsList {...linkProps} />
                  </>
                ) : tab === "Details" ? (
                  <>
                    <h2 tabIndex={-1} ref={detailHeading}>
                      Document details
                    </h2>
                    {selected ? (
                      <LinkedDocumentDetails document={selected} />
                    ) : (
                      <DocumentEmpty
                        title="No document selected"
                        description="Restore a link to inspect its details."
                        onReset={state.removed.length ? undo : undefined}
                        actionLabel="Undo last unlink"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <h2>Loan application</h2>
                    <p className="uld-muted">Acme Inc. · Jamie Morgan</p>
                    <div className="uld-recommendation">
                      <Icon name="sparkle" size="sm" />
                      <span>Review supporting documents</span>
                    </div>
                    <section className="uld-check-section">
                      <h3>Review notes</h3>
                      <p>
                        Check that the linked documents belong to this
                        application. Unlink anything that is no longer needed.
                      </p>
                      <p className="uld-muted">
                        Unlinking keeps the original file in your library.
                      </p>
                    </section>
                    <section className="uld-check-section">
                      <header>
                        <h3>Document checks</h3>
                        <span>{state.documents.length} linked</span>
                      </header>
                      {selected ? (
                        <div className="uld-check-card">
                          <p title={selected.name}>{selected.name}</p>
                          <span className="uld-muted">
                            <Icon
                              name={decision ? "check" : "circle-dashed"}
                              size="sm"
                            />{" "}
                            {decision
                              ? "Review acknowledged"
                              : "Awaiting review"}
                          </span>
                          <dl>
                            <dt>Application</dt>
                            <dd>OR-1026</dd>
                            <dt>Uploaded by</dt>
                            <dd>{selected.owner}</dd>
                          </dl>
                          <Button
                            size="sm"
                            type="secondary"
                            leadingIcon={
                              <Icon
                                name={decision ? "reset" : "check"}
                                size="sm"
                              />
                            }
                            onClick={() =>
                              selected &&
                              setReviewed((old) => ({
                                ...old,
                                [selected.id]: !old[selected.id],
                              }))
                            }
                          >
                            {decision ? "Reopen review" : "Mark reviewed"}
                          </Button>
                        </div>
                      ) : (
                        <p>No linked documents to review.</p>
                      )}
                    </section>
                    <p className="uld-demo-note">
                      Local sample only. Actions reset on reload.
                    </p>
                  </>
                )}
              </div>
              <footer className="uld-inspector-footer">
                <label>
                  Preview state
                  <select
                    aria-label="Preview state"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                  >
                    <option value="ready">Ready</option>
                    <option value="loading">Loading</option>
                    <option value="error">Connection error</option>
                  </select>
                </label>
              </footer>
            </aside>
          </div>
          <div className="uld-notice">
            <p role="status">
              {state.notice ||
                "Choose a linked document to preview. Unlink without deleting the original."}
            </p>
            {state.removed.length > 0 && (
              <Button type="secondary" size="sm" onClick={undo}>
                Undo unlink
              </Button>
            )}
          </div>
          <footer className="uld-footer">
            <a href="/linked-documents">Components & API →</a>
            <a
              href="https://x.com/kvnkld/status/2111826634902741219"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Kevin (@kvnkld) ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
