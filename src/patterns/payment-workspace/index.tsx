import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { TreeStepper } from "@/components/tree-stepper";
import {
  RecipientSearch,
  RecipientForm,
  PAYMENT_RAILS,
  recipientName,
  recipientDestination,
  recipientCurrency,
  parsePaymentAmount,
  type Recipient,
  type RecipientDraft,
} from "@/components/recipient";
import { SAMPLE_RECIPIENTS, PAYMENT_STEPS } from "./data";
import "./payment-workspace.css";
type SavedPayment = {
  recipient: Recipient;
  amount: string;
  funding: string;
  reference: string;
  note: string;
};
export function PaymentWorkspacePage() {
  const [dark, setDark] = useState(false),
    [recipients, setRecipients] = useState(SAMPLE_RECIPIENTS),
    [selectedId, setSelectedId] = useState<string>(),
    [query, setQuery] = useState(""),
    [editor, setEditor] = useState<{
      name: string;
      recipient?: Recipient;
    } | null>(null);
  const [step, setStep] = useState(0),
    [reached, setReached] = useState(0),
    [funding, setFunding] = useState("Operating account"),
    [amount, setAmount] = useState(""),
    [reference, setReference] = useState(""),
    [note, setNote] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [saved, setSaved] = useState<SavedPayment | null>(null);
  const heading = useRef<HTMLHeadingElement>(null),
    editorHost = useRef<HTMLDivElement>(null),
    searchHost = useRef<HTMLDivElement>(null),
    amountInput = useRef<HTMLInputElement>(null),
    firstMount = useRef(true);
  const selected = recipients.find((r) => r.id === selectedId),
    currency = selected ? recipientCurrency(selected.rail) : "USD";
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    heading.current?.focus();
  }, [step, saved]);
  useEffect(() => {
    if (editor)
      editorHost.current
        ?.querySelector<HTMLInputElement>('input:not([type="radio"])')
        ?.focus();
  }, [editor]);
  const jump = (index: number) => {
    if (index <= reached) {
      setStep(index);
      setError("");
    }
  };
  const invalidate = (index: number) => {
    setReached((r) => Math.min(r, index));
    setError("");
  };
  function choose(r: Recipient) {
    if (r.id !== selectedId) {
      setAmount("");
      setFunding("Operating account");
      setReached(0);
    }
    setSelectedId(r.id);
    setNotice(`${recipientName(r)} selected.`);
    setError("");
  }
  function closeEditor() {
    setEditor(null);
    requestAnimationFrame(() =>
      searchHost.current?.querySelector<HTMLInputElement>("input")?.focus(),
    );
  }
  function saveRecipient(value: RecipientDraft) {
    const r = { ...value, id: editor?.recipient?.id ?? crypto.randomUUID() };
    setRecipients((list) =>
      editor?.recipient
        ? list.map((old) => (old.id === r.id ? r : old))
        : [r, ...list],
    );
    setSelectedId(r.id);
    setReached(0);
    setAmount("");
    setQuery("");
    setNotice(`${recipientName(r)} saved in this demo.`);
    closeEditor();
  }
  function next() {
    setError("");
    if (step === 0 && !selected) {
      setError("Choose a recipient to continue.");
      return;
    }
    if (step === 2 && selected && !parsePaymentAmount(amount, selected.rail)) {
      setError(
        `Enter an amount greater than 0 and up to 1,000,000, with at most ${selected.rail === "usdc" ? 6 : 2} decimal places.`,
      );
      amountInput.current?.focus();
      return;
    }
    setReached((r) => Math.max(r, step + 1));
    setStep((s) => Math.min(4, s + 1));
  }
  function savePayment() {
    if (!selected) return;
    const parsed = parsePaymentAmount(amount, selected.rail);
    if (!parsed) {
      setStep(2);
      setReached(2);
      setError("Check the amount before saving your draft.");
      return;
    }
    setSaved({
      recipient: { ...selected },
      amount: parsed.normalized,
      funding,
      reference: reference.trim(),
      note: note.trim(),
    });
    setNotice("Payment draft saved locally. No money was sent.");
  }
  function startAgain() {
    setSaved(null);
    setStep(0);
    setReached(0);
    setAmount("");
    setReference("");
    setNote("");
    setEditor(null);
    setQuery("");
    setNotice("");
    setError("");
  }
  const recipientCard = selected && (
    <div className="payflow-recipient-card">
      <span className="recipient-monogram">
        {recipientName(selected).slice(0, 2).toUpperCase()}
      </span>
      <div>
        <strong>{recipientName(selected)}</strong>
        <p>{recipientDestination(selected)}</p>
      </div>
      <Tag>{currency}</Tag>
    </div>
  );
  return (
    <div className={`payment-workspace ${dark ? "theme-dark" : "theme-light"}`}>
      <aside className="payflow-sidebar">
        <a href="/recipient-search" className="payflow-brand">
          <Icon name="arrow-up-right" />
          Pay <span>by Oreo</span>
        </a>
        <TreeStepper
          label="Payment steps"
          nodes={PAYMENT_STEPS.map((s, i) => ({
            ...s,
            disabled: i > reached || !!saved || !!editor,
          }))}
          value={PAYMENT_STEPS[step].id}
          completed={PAYMENT_STEPS.filter((_, i) => i < reached || !!saved).map(
            (s) => s.id,
          )}
          onValueChange={(id) =>
            jump(PAYMENT_STEPS.findIndex((s) => s.id === id))
          }
        />
        <div className="payflow-sidebar-bottom">
          <p>A little care at every step.</p>
          <span>
            Save a payment draft using sample details. Nothing leaves this
            preview.
          </span>
          <a href="/recipient-form">
            View the components <Icon name="arrow-up-right" size="sm" />
          </a>
        </div>
      </aside>
      <div className="payflow-main">
        <header className="payflow-topbar">
          <a href="/recipient-search">
            Oreo UI <span>/ Payment workspace</span>
          </a>
          <div>
            <Tag>Local demo</Tag>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
          </div>
        </header>
        <main>
          <div className="payflow-mobile-step">
            Step {step + 1} of 5 · {PAYMENT_STEPS[step].label}
          </div>
          <header className="payflow-heading">
            <p>PAYMENT DRAFT</p>
            <h1 ref={heading} tabIndex={-1}>
              {saved ? "Your draft is ready." : PAYMENT_STEPS[step].label}
            </h1>
            <span>
              {saved
                ? "Saved in this preview. No money was sent."
                : step === 0
                  ? "Who would you like to pay?"
                  : step === 1
                    ? "Choose the account this draft will use."
                    : step === 2
                      ? "How much would you like to send?"
                      : step === 3
                        ? "Keep the context with your payment."
                        : "Take a moment to check the details."}
            </span>
          </header>
          <p className="payflow-notice" role="status">
            {notice}
          </p>
          {saved ? (
            <section className="payflow-saved">
              <span className="payflow-success">
                <Icon name="check" />
              </span>
              <h2>
                {saved.amount} {recipientCurrency(saved.recipient.rail)}
              </h2>
              <p>To {recipientName(saved.recipient)}</p>
              <dl>
                <div>
                  <dt>Destination</dt>
                  <dd>{recipientDestination(saved.recipient)}</dd>
                </div>
                <div>
                  <dt>Reference</dt>
                  <dd>{saved.reference || "No reference"}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <Tag color="mint">Draft saved</Tag>
                  </dd>
                </div>
              </dl>
              <Button tapScale={1} onClick={startAgain}>
                Create another draft
              </Button>
            </section>
          ) : (
            <>
              {step === 0 && (
                <div ref={searchHost}>
                  <RecipientSearch
                    creating={!!editor}
                    recipients={editor ? [] : recipients}
                    query={query}
                    onQueryChange={(q) => {
                      setQuery(q);
                      if (editor) setEditor(null);
                    }}
                    selectedId={selectedId}
                    onSelect={choose}
                    onCreate={
                      editor
                        ? undefined
                        : (name) => {
                            setEditor({ name });
                            setNotice("");
                            setError("");
                          }
                    }
                  />
                  {editor && (
                    <div ref={editorHost} className="payflow-editor">
                      <RecipientForm
                        key={editor.recipient?.id ?? "new"}
                        initialName={editor.name}
                        initialValue={editor.recipient}
                        onSave={saveRecipient}
                        onCancel={closeEditor}
                      />
                    </div>
                  )}
                  {selected && !editor && (
                    <div className="payflow-selected">
                      <span>
                        <Icon name="check" size="sm" />
                        {recipientName(selected)} is ready for this draft.
                      </span>
                      <Button
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        onClick={() => {
                          setQuery(recipientName(selected));
                          setEditor({
                            name: recipientName(selected),
                            recipient: selected,
                          });
                        }}
                      >
                        Edit recipient
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {step === 1 && (
                <>
                  <div className="payflow-section-heading">
                    <h2>Recipient account</h2>
                    <Button
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      onClick={() => jump(0)}
                    >
                      Change
                    </Button>
                  </div>
                  {recipientCard}
                  <div className="payflow-method-label">
                    <Icon name="globe" size="sm" />
                    {selected &&
                      PAYMENT_RAILS.find((r) => r.id === selected.rail)?.label}
                    {selected?.rail === "usdc" ? ` · ${selected.network}` : ""}
                  </div>
                  <fieldset className="payflow-funding">
                    <legend>Funding source</legend>
                    {["Operating account", "Reserve account"].map((f) => (
                      <label key={f} data-selected={funding === f || undefined}>
                        <input
                          type="radio"
                          name="funding"
                          checked={funding === f}
                          onChange={() => {
                            setFunding(f);
                            invalidate(1);
                          }}
                        />
                        <span>
                          <strong>{f}</strong>
                          <small>Sample {currency} balance</small>
                        </span>
                        <Tag>{currency}</Tag>
                      </label>
                    ))}
                  </fieldset>
                  <p className="payflow-help">
                    This draft does not check balances, estimate fees or
                    initiate a transfer.
                  </p>
                </>
              )}
              {step === 2 && (
                <>
                  {recipientCard}
                  <label className="payflow-amount-label">
                    Amount
                    <div>
                      <input
                        ref={amountInput}
                        aria-label="Payment amount"
                        inputMode="decimal"
                        value={amount}
                        placeholder="0.00"
                        maxLength={24}
                        aria-invalid={!!error || undefined}
                        aria-describedby="payment-amount-help"
                        onChange={(e) => {
                          setAmount(e.target.value);
                          invalidate(2);
                        }}
                      />
                      <span>{currency}</span>
                    </div>
                  </label>
                  <p id="payment-amount-help" className="payflow-help">
                    Up to {selected?.rail === "usdc" ? "6" : "2"} decimal places
                    · Demo limit: 1,000,000 {currency}.
                  </p>
                </>
              )}
              {step === 3 && (
                <div className="payflow-details">
                  <label>
                    Payment reference <span>Optional</span>
                    <input
                      value={reference}
                      maxLength={70}
                      placeholder="e.g. October design work"
                      onChange={(e) => {
                        setReference(e.target.value);
                        invalidate(3);
                      }}
                    />
                  </label>
                  <label>
                    Internal note <span>Optional</span>
                    <textarea
                      rows={4}
                      value={note}
                      maxLength={240}
                      placeholder="Add context for your team"
                      onChange={(e) => {
                        setNote(e.target.value);
                        invalidate(3);
                      }}
                    />
                  </label>
                  <p className="payflow-help">
                    These details stay in this local draft. No notification is
                    sent.
                  </p>
                </div>
              )}
              {step === 4 && selected && (
                <section className="payflow-review">
                  <div className="payflow-review-total">
                    <span>Payment amount</span>
                    <strong>
                      {parsePaymentAmount(amount, selected.rail)?.normalized}{" "}
                      <small>{currency}</small>
                    </strong>
                    <Tag>Draft</Tag>
                  </div>
                  <dl>
                    {[
                      {
                        label: "Recipient",
                        value: recipientName(selected),
                        step: 0,
                      },
                      { label: "Email", value: selected.email, step: 0 },
                      {
                        label: "Destination",
                        value: recipientDestination(selected),
                        step: 0,
                      },
                      { label: "Funding source", value: funding, step: 1 },
                      {
                        label: "Reference",
                        value: reference.trim() || "No reference",
                        step: 3,
                      },
                      {
                        label: "Internal note",
                        value: note.trim() || "No note",
                        step: 3,
                      },
                    ].map((row) => (
                      <div key={row.label}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                        <Button
                          type="tertiary"
                          size="sm"
                          tapScale={1}
                          aria-label={`Edit ${row.label.toLowerCase()}`}
                          onClick={() => jump(row.step)}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </dl>
                  <p className="payflow-help">
                    Saving records a draft only. Account ownership, payment
                    eligibility, exchange rates and fees have not been checked.
                  </p>
                </section>
              )}
              {error && (
                <p className="payflow-error" role="alert">
                  {error}
                </p>
              )}
              <footer className="payflow-actions">
                {step > 0 ? (
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => jump(step - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <span>Changes reset on reload.</span>
                )}
                {step === 4 ? (
                  <Button tapScale={1} onClick={savePayment}>
                    Save payment draft
                  </Button>
                ) : (
                  <Button
                    tapScale={1}
                    disabled={!!editor || (step === 0 && !selected)}
                    trailingIcon={<Icon name="arrow-up-right" size="sm" />}
                    onClick={next}
                  >
                    Continue
                  </Button>
                )}
              </footer>
            </>
          )}
          <footer className="payflow-credit">
            <a
              href="https://x.com/tikhbana/status/2110486416086159469"
              target="_blank"
              rel="noreferrer"
            >
              Recipient flow inspired by Atikh Bana ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
